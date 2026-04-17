const fs = require("fs");
const Log = require("./models/Log");

async function exportLogs() {
  try {
    const logs = await Log.find();

    fs.writeFileSync("logs.json", JSON.stringify(logs, null, 2));

    console.log("✅ logs.json updated");
  } catch (err) {
    console.log("❌ Export Error:", err);
  }
}

module.exports = exportLogs;