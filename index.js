const HID = require("node-hid")
const device = new HID.HID("/dev/hidraw2")

device.on("data", (data) => {
  console.log("Data:", data)
})

device.on("error", (err) => {
  console.error("Error:", err)
})
