#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <SoftwareSerial.h>
#include <PN532_SWHSU.h>
#include <PN532.h>

/************************
 * Screen settings
 ************************/

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
// The pins for I2C are defined by the Wire-library.
// On an arduino UNO:       A4(SDA), A5(SCL)
#define OLED_RESET -1        // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C  ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
#define SCREEN_WIDTH 128     // OLED display width, in pixels
#define SCREEN_HEIGHT 32     // OLED display height, in pixels
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

/************************
 * RFID reader settings
 ************************/

SoftwareSerial SWSerial(3, 2);
PN532_SWHSU pn532swhsu(SWSerial);
PN532 nfc(pn532swhsu);
String tagId = "None", dispTag = "None";
byte nuidPICC[4];

/************************
 * Business logic
 ************************/

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

class Screen {
public:
  void begin() {
    // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
    if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
      Serial.println(F("SSD1306 allocation failed"));
      while (true) {};  // halt
    }
    display.setTextSize(1);               // Normal 1:1 pixel scale
    display.setTextColor(SSD1306_WHITE);  // Draw white text
    display.cp437(true);                  // Use full 256 char 'Code Page 437' font
    write("loading");
  }

  void write(String text) {
    display.clearDisplay();   // reset monitor
    display.setCursor(1, 1);  // start at top-left corner
    display.print(text);      // "print" for text (instead of "write" for pixels specific stuff)
    display.display();
  }
};
const Screen screen;

class Messenger {
public:
  void listen() {
    if (Serial.available() > 0) {
      String message = Serial.readString();
      Serial.println("status:recevied:" + message);
      screen.write(message);
    }
  }
  void get(String id) {
    Serial.println("get:request:" + id);
  }
};
const Messenger messenger;

class Reader {
public:
  // throttle read frequency:
  const Timer timer;

  void begin() {
    nfc.begin();
    uint32_t versiondata = nfc.getFirmwareVersion();
    // board missing
    if (!versiondata) {
      Serial.println("status:cannot find rfid board");
      while (true) {};  // halt
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
    if (!timer.interval(2000)) {
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
      screen.write("awaiting deck");
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

/************************
 * Arduino setup
 ************************/

void setup() {
  Serial.begin(115200);
  screen.begin();
  reader.begin();
}

void loop() {
  reader.listen();
  messenger.listen();
}