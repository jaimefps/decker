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
