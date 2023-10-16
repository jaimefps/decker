const axios = require("axios")
const SerialPort = require("serialport")

async function getInfoById(id) {
  console.log("fetching:", id)
  const map = {
    // todo: readfilesync
    // for cheap persistance:
    "19.23.193.247": "da82977e-89d8-4232-8d45-8ccddca61095",
    "35.168.196.253": "75e1eef1-0ce1-4046-96b3-4d681d53f674",
  }
  if (!map[id]) {
    return "unknown rfid"
  }
  return await axios
    .get("https://decksofkeyforge.com/api/decks/with-synergies/" + map[id])
    .then((response) => {
      const deck = response.data.deck
      return `${deck.name}: ${deck.sasRating}SAS`
    })
    .catch((err) => {
      return "axios-error:", err
    })
}

const Reader = SerialPort.parsers.Readline
const parser = new Reader({ delimiter: "\r\n" })

const usb = {
  mac: {
    uno: "/dev/cu.usbmodem1101",
    nano: "/dev/cu.usbserial-110",
  },
  pi: {
    arduino: "/dev/ttyUSB0",
  },
}

const port = new SerialPort(usb.mac.nano, {
  flowControl: false,
  baudRate: 115200,
  parity: "none",
  dataBits: 8,
  stopBits: 1,
})

port.on("open", () => {
  console.log("node:ready")
  port.pipe(parser)
})

parser.on("data", async (data) => {
  // arduino request:
  if (data.startsWith("get:")) {
    console.log("request:", data)
    const id = data.split("get:").pop()
    const info = await getInfoById(id)
    console.log("found:", info)
    port.write(info, (err) => {
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
    console.log("ping:", status)
  }
})
