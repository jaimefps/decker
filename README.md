## Keyforge Decker

Prototype for a realtime deck data display kit. Show off your favorite decks with any kind of realtime information about them. Scale out to have a full wall of all your favorite decks. No need to keep them organized, the dock will tell you which deck is which.

### Setup

First load and run the `nano.io` code on your Arduino UNO/Nano board.

| OLED (128x32) | Arduino |
| ------------- | ------- |
| GRND          | GRND    |
| VCC           | 3.3V    |
| SDA           | A4      |
| SLC           | A5      |

PN532 should be set to HSU mode, if available.

| PN532 | Arduino |
| ----- | ------- |
| GRND  | GRND    |
| VCC   | 5V      |
| SDA   | D3      |
| SLC   | D2      |

Once the Arduino is all setup and running, you can move onto starting your NodeJS server, which is responsible for fetching and communicating realtime data about your deck.

I find it best to use NodeJS v12 when dealing with Arduino. Make sure to switch to that version before installing dependencies, otherwise you might need to `rm -rf node_modules` and `rm package-lock.json` and reinstall dependencies with NodeJS v12.

```
$ npm install
```

```
$ sudo node app.js
```
