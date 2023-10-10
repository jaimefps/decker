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

rfidReader.on("data", (data) => {
  const hexString = data.toString("hex")
  console.log("Data:", hexString)
})

rfidReader.on("error", (err) => {
  console.error("Error:", err)
})
