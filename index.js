/*
Product ID:	0x0035
Vendor ID:	0xffff
*/
const HID = require("node-hid")
const devices = HID.devices()
console.log("testing")
// Log all connected HID devices to find your RFID reader
console.log(devices)

// Replace '0x0035' and '0xffff' with the vendorId and productId of your RFID reader
const deviceInfo = devices.find(
  (device) => device.vendorId === 0x0035 && device.productId === 0xffff
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
