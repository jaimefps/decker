/*
Product ID:	0x0035
Vendor ID:	0xffff
*/ const HID = require("node-hid")
const devices = HID.devices()

// Log all connected HID devices to find your RFID reader
console.log(devices)

// Use the decimal values for vendorId and productId
const deviceInfo = devices.find(
  (device) => device.vendorId === 65535 && device.productId === 53
)

if (!deviceInfo) {
  console.log("RFID reader not found")
  process.exit(1)
}

const rfidReader = new HID.HID(deviceInfo.path)

rfidReader.on("data", (data) => {
  console.log("Data:", data)
})

rfidReader.on("error", (err) => {
  console.error("Error:", err)
})
