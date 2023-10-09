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
const Socket = require("net").Socket

const ANSWER_MODE = Buffer.from(
  [0x0a, 0x00, 0x35, 0x00, 0x02, 0x01, 0x00, 0x01, 0x00, 0x2a, 0x9f],
  "hex"
)
const INVENTORY = Buffer.from([0x04, 0x00, 0x01, 0xdb, 0x4b], "hex")

const READER_PORT = 6000 // this is default port of the reader
const READER_IP = "192.168.1.190" // the default IP

// Used to track the interval for inventory command
let interval

const reader = new Socket()
reader.setEncoding("ascii")
reader.setKeepAlive(true, 60000)

reader.connect(READER_PORT, READER_IP, () => {})
reader.on("connect", () => {
  // Successfully connected!
  // We are ready to issue commands and receive data here

  // Switch the reader to the ANSWER_MODE
  reader.write(ANSWER_MODE)

  // Ask for tag values in the visibility radius
  interval = setInterval(() => {
    reader.write(INVENTORY)
  }, 100)

  // We start receiving data here
  reader.on("data", (data) => {
    const buf = Buffer.from(data, "ascii")
    const response = buf.toString("hex", 0, buf.length)
    console.log("RESPONSE", response)
  })
})
