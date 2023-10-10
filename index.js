/*
Product ID:	0x0035
Vendor ID:	0xffff
*/

// const map = {
//   "1e21231e27211f21": "da82977e-89d8-4232-8d45-8ccddca61095",
// }

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
  oled.writeString(font, 1, "jaime testing new stuff", 1, true, 2)
  oled.update()
})

const HID = require("node-hid")
const devices = HID.devices()

const deviceInfo = devices.find(
  (device) => device.vendorId === 65535 && device.productId === 53
)

if (!deviceInfo) {
  console.log("RFID reader not found")
  process.exit(1)
}

const rfidReader = new HID.HID(deviceInfo.path)

let tagId = ""

rfidReader.on("data", (data) => {
  const scancode = data[2].toString(16).padStart(2, "0") // Convert to 2-digit hexadecimal

  // Check for Enter key press (scancode 0x28)
  if (scancode === "28") {
    console.log("Tag ID:", tagId)
    tagId = "" // Reset tagId for the next read
  } else if (scancode !== "00") {
    tagId += scancode // Append scancode to tagId
  }
})

rfidReader.on("error", (err) => {
  console.error("Error:", err)
})

function closeResources() {
  rfidReader.close()
  process.exit()
}

process.on("SIGINT", () => {
  console.log("Caught interrupt signal, cleaning up...")
  closeResources()
})
