#include <SoftwareSerial.h>
#include <PN532_SWHSU.h>
#include <PN532.h>

SoftwareSerial SWSerial(3, 2);
PN532_SWHSU pn532swhsu(SWSerial);
PN532 nfc(pn532swhsu);
String tagId = "None", dispTag = "None";
byte nuidPICC[4];

class Timer {
public:
  unsigned long current = millis();
  bool interval(int delay) {
    if (millis() >= current + delay) {
      current = millis();
      return true;
    }
    return false;
  }
};

class Messenger {
public:
  void listen() {
    if (Serial.available() > 0) {
      String message = Serial.readString();
      Serial.println("status:recevied:" + message);
      // oled print screen
    }
  }
  void get(String id) {
    Serial.println("get:request:" + id);
  }
};
const Messenger messenger;

class Reader {
public:
  // throttle read frequency
  const Timer listenTimer;

  void prepare() {
    nfc.begin();
    uint32_t versiondata = nfc.getFirmwareVersion();
    // board missing
    if (!versiondata) {
      Serial.println("status:cannot find rfid board");
      return;
    }
    // board found
    Serial.print("status:found rfid board");
    Serial.println((versiondata >> 24) & 0xFF, HEX);
    // board version
    Serial.print("status:firmware ver:");
    Serial.print((versiondata >> 16) & 0xFF, DEC);
    Serial.print('.');
    Serial.println((versiondata >> 8) & 0xFF, DEC);
    // rfid read setup
    nfc.SAMConfig();
  }

  void listen() {
    if (!listenTimer.interval(2000)) {
      return;
    }
    uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
    uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)
    bool success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength);
    if (success) {
      // rfid type
      Serial.print("status:uid-type:");
      Serial.print(uidLength, DEC);
      Serial.println(" bytes");
      // rfid value
      for (uint8_t i = 0; i < uidLength; i++) {
        nuidPICC[i] = uid[i];
      }
      tagId = toString(nuidPICC);
      dispTag = tagId;
      Serial.print(F("get:"));
      Serial.println(tagId);
    } else {
      Serial.println("status:vacant");
    }
  }

  String toString(byte id[4]) {
    String tagId = "";
    for (byte i = 0; i < 4; i++) {
      if (i < 3) tagId += String(id[i]) + ".";
      else tagId += String(id[i]);
    }
    return tagId;
  }
};
const Reader reader;

void setup() {
  Serial.begin(115200);
  reader.prepare();
}

void loop() {
  reader.listen();
  messenger.listen();
}