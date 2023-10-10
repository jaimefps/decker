## Keyforge Decker

### Demo

![alt text](assets/decker-sample.gif)

Prototype for a realtime deck data display kit. Show off your favorite decks with any kind of realtime information about them. Scale out to have a full wall of all your favorite decks. No need to keep them organized, the dock will tell you which deck is which.

### Setup

Use NodeJS ^12. The dependencies will clash if you install them on a different Node version.

This is meant to run on a RaspberryPi. You'll need to get the corresponding data for your RFID reader, the ones hardcoded here are for the reader I'm using.

```
$ npm install
```

```
$ sudo node index.js
```
