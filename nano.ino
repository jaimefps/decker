class Messenger
{
public:
  void listen()
  {
    if (Serial.available() > 0)
    {
      String message = Serial.readString();
      Serial.println("status:200");
      // oled print screen
    }
  }
  void get(String id)
  {
    Serial.println("get:request:" + id);
  }
};

class Timer
{
private:
  unsigned long current = millis();

public:
  bool interval(int delay)
  {
    if (millis() >= current + delay)
    {
      current = millis();
      return true;
    }
    return false;
  }
};

const Messenger messenger;
const Timer timer;

void setup()
{
  Serial.begin(9600);
  Serial.println("satus:0");
}

void loop()
{
  messenger.listen();

  if (timer.interval(3000))
  {
    messenger.get("uuid-here");
  }
}