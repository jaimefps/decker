// const { Board, Led } = require("johnny-five")
// const board = new Board()

// board.on("ready", () => {
//   const led = new Led(13)
//   led.blink(500)
// })

const five = require("johnny-five")
const font = require("oled-font-5x7")
const Oled = require("oled-js")

const board = new five.Board()

board.on("ready", () => {
  console.log("Connected to Arduino, ready.")

  const opts = {
    width: 128,
    height: 32,
    address: 0x3c,
  }

  const oled = new Oled(board, five, opts)
  oled.setCursor(1, 1)
  oled.writeString(
    font,
    1,
    "Cats and dogs are really cool animals, you know.",
    1,
    true,
    2
  )
  oled.update()
})
