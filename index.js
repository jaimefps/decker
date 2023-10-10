const Oled = require("oled-js")
const font = require("oled-font-5x7")
const five = require("johnny-five")
const HID = require("node-hid")

/*
  Product ID:	0x0035
  Vendor ID:	0xffff
  Version:	1.00
  Serial Number:	08FF20150112
  Speed:	Up to 1.5 Mb/s
  Manufacturer:	Sycreader
  Location ID:	0x00100000 / 1
  Current Available (mA):	500
  Current Required (mA):	100
  Extra Operating Current (mA):	0
*/
const READER_VENDOR_ID = 65535 // 0x0035
const READER_PRODUCT_ID = 53 // 0xffff

function log(...msgs) {
  console.log("[decker]", ...msgs)
}

function getReader() {
  const readerInfo = HID.devices().find(
    (device) =>
      device.vendorId === READER_VENDOR_ID &&
      device.productId === READER_PRODUCT_ID
  )
  if (!readerInfo) {
    log("reader not found")
    process.exit(1)
  }
  return new HID.HID(readerInfo.path)
}

const reader = getReader()
const arduino = new five.Board()

let oled
arduino.on("ready", () => {
  log("arduino connected")
  oled = new Oled(arduino, five, {
    address: 0x3c,
    width: 128,
    height: 32,
  })
})

let tagId = ""

reader.on("data", (data) => {
  // Convert to 2-digit hexadecimal:
  const scancode = data[2].toString(16).padStart(2, "0")

  // Check for Enter key press (scancode 0x28)
  if (scancode === "28") {
    log("tagId:", tagId)
    getData(tagId, (data) => {
      oled.setCursor(1, 1)
      oled.writeString(font, 1, getData(data), 1, true, 2)
      oled.update()
    })
    tagId = "" // Reset tagId for the next read
  } else if (scancode !== "00") {
    tagId += scancode // Append scancode to tagId
  }
})

reader.on("error", (err) => {
  log(err)
})

function getData(id, callback) {
  const map = {
    "1e21231e27211f21": "CARLOS",
    "1e21231e27232622": "JAIME",
  }
  callback(map[id])
}

process.on("SIGINT", function () {
  log("shutting down")
  reader.close()
  process.exit(0)
})
