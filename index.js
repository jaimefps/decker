const HID = require("node-hid")
// const device = new HID.HID("/dev/hidraw2")

// device.on("data", (data) => {
//   console.log("Data:", data)
// })

// device.on("error", (err) => {
//   console.error("Error:", err)
// })

/*
Product ID:	0x0035
Vendor ID:	0xffff
*/

var devices = HID.devices()
var deviceInfo = devices.find(function (d) {
  var isTeensy = d.vendorId === 0xffff && d.productId === 0x0035
  return isTeensy && d.usagePage === 0xffab && d.usage === 0x200
})
if (deviceInfo) {
  var device = new HID.HID(deviceInfo.path)
  console.log({ device })
  // ... use device
}
