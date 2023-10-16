const SerialPort = require("serialport")

const Reader = SerialPort.parsers.Readline
const parser = new Reader({ delimiter: "\r\n" })

const usb = {
  mac: {
    uno: "/dev/cu.usbmodem1101",
    nano: "/dev/cu.usbserial-110",
  },
  pi: {
    uno: "",
    nano: "",
  },
}

const port = new SerialPort(usb.mac.nano, {
  flowControl: false,
  baudRate: 9600,
  parity: "none",
  dataBits: 8,
  stopBits: 1,
})

port.on("open", () => {
  console.log("node:ready")
  port.pipe(parser)
})

parser.on("data", (data) => {
  // arduino request:
  if (data.startsWith("get:")) {
    // axios get data:
    const result = "response\n"
    port.write(result, (err) => {
      if (err) {
        console.log("node:failure:", err.message)
        return
      }
      console.log("node:success")
    })
  }

  // arduino reports
  // back after response:
  if (data.startsWith("status:")) {
    const status = data.split("status:").pop()
    switch (status) {
      case "200":
        console.log("arduino:success")
        break
      case "500":
        console.log("arduino:failure")
        break
    }
  }
})
