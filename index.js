// const { Board, Led } = require("johnny-five")
// const board = new Board()

// board.on("ready", () => {
//   const led = new Led(13)
//   led.blink(500)
// })

// const five = require("johnny-five")
// const font = require("oled-font-5x7")
// const Oled = require("oled-js")

// const board = new five.Board()

// board.on("ready", () => {
//   console.log("Connected to Arduino, ready.")

//   const opts = {
//     width: 128,
//     height: 32,
//     address: 0x3c,
//   }

//   const oled = new Oled(board, five, opts)
//   oled.setCursor(1, 1)
//   oled.writeString(
//     font,
//     1,
//     "Cats and dogs are really cool animals, you know.",
//     1,
//     true,
//     2
//   )
//   oled.update()
// })

// const net = require("net")
// const reader = new net.Socket()

// const ANSWER_MODE = Buffer.from(
//   [0x0a, 0x00, 0x35, 0x00, 0x02, 0x01, 0x00, 0x01, 0x00, 0x2a, 0x9f],
//   "hex"
// )
// const INVENTORY = Buffer.from([0x04, 0x00, 0x01, 0xdb, 0x4b], "hex")

// const READER_PORT = 6000 // this is default port of the reader
// const READER_IP = "192.168.1.190" // the default IP

// // Used to track the interval for inventory command
// let interval

// reader.setEncoding("ascii")
// reader.setKeepAlive(true, 60000)

// reader.connect(READER_PORT, READER_IP, () => {
//   console.log("connecting...")
// })
// reader.on("connect", () => {
//   console.log("connected")
//   // Successfully connected!
//   // We are ready to issue commands and receive data here

//   // Switch the reader to the ANSWER_MODE
//   reader.write(ANSWER_MODE)

//   // Ask for tag values in the visibility radius
//   interval = setInterval(() => {
//     console.log("asking...")
//     reader.write(INVENTORY)
//   }, 100)

//   // We start receiving data here
//   reader.on("data", (data) => {
//     console.log("on data")
//     const buf = Buffer.from(data, "ascii")
//     const response = buf.toString("hex", 0, buf.length)
//     console.log("RESPONSE", response)
//   })
// })

/*
DESCRIPTION
-----------
Use NodeJS to read RFID ids through the USB serial stream. Code derived from this forum:
http://groups.google.com/group/nodejs/browse_thread/thread/e2b071b6a70a6eb1/086ec7fcb5036699
CODE REPOSITORY
---------------
https://gist.github.com/806605
CHANGE LOG
----------
02/02/2011 - Refactored code and acknowledged contributors. Listening for other helpful stream Events.
02/01/2011 - Created initial code.
AUTHOR
------
Chris Basham
@chrisbasham
http://bash.am
https://github.com/basham
CONTRIBUTORS
------------
Elliott Cable
https://github.com/elliottcable
SOFTWARE
--------
NodeJS, version 0.2.6
http://nodejs.org
HARDWARE
--------
Sparkfun RFID USB Reader
http://www.sparkfun.com/products/8852
RFID Reader ID-20
http://www.sparkfun.com/products/8628
EM4102 125 kHz RFID Tags
http://www.trossenrobotics.com/store/p/3620-Blue-Key-Fob.aspx
EXAMPLE RFID IDs
----------------
2800F7D85D5A
3D00215B3671
31007E05450F
31007E195503
2800F77C5BF8
*/

// NodeJS includes
// var sys = require("sys")
var fs = require("fs")

// Stores the RFID id as it reconstructs from the stream.
var id = ""
// List of all RFID ids read
var ids = []

// ARGUMENT 1:
// Stream path, unique to your hardware.
// List your available USB serial streams via terminal and choose one:
//   ls /dev | grep usb
// Had trouble with TTY, so used CU.

// ARGUMENT 2:
// Simplifies restruction of stream if one bit comes at a time.
// However, I don't know if or how it affects performance with this setting.
fs.createReadStream("/dev/fd", { bufferSize: 1 })

  .on("open", function (fd) {
    console.log("Begin scanning RFID tags.")
  })

  .on("end", function () {
    console.log("End of data stream.")
  })

  .on("close", function () {
    console.log("Closing stream.")
  })

  .on("error", function (error) {
    console.error(error)
  })

  .on("data", function (chunk) {
    chunk = chunk.toString("ascii").match(/\w*/)[0] // Only keep hex chars
    if (chunk.length == 0) {
      // Found non-hex char
      if (id.length > 0) {
        // The ID isn't blank
        ids.push(id) // Store the completely reconstructed ID
        console.log({ id })
      }
      id = "" // Prepare for the next ID read
      return
    }
    id += chunk // Concat hex chars to the forming ID
  })
