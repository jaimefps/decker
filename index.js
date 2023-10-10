/*
Product ID:	0x0035
Vendor ID:	0xffff
*/
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
  const scancode = data[2]

  // Check for Enter key press (scancode 0x28)
  if (scancode === 0x28) {
    console.log("Tag ID:", tagId)
    tagId = "" // Reset tagId for the next read
  } else if (scancode !== 0x00) {
    // Convert scancode to ASCII character and append to tagId
    tagId += String.fromCharCode(scancode - 0x04 + "a".charCodeAt(0))
  }
})

rfidReader.on("error", (err) => {
  console.error("Error:", err)
})
