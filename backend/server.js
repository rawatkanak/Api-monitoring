const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");
require("dotenv").config();

const Api = require("./models/Api");
const Log = require("./models/Log");

const app = express();

/* =========================
   🔧 MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   🌐 ROUTES
========================= */
app.use("/api", require("./routes/apiRoutes"));


   //MONGODB CONNECTION

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));


   // API MONITORING (every 10 sec)

cron.schedule("*/10 * * * * *", async () => {
  console.log(" Checking APIs...");

  const apis = await Api.find();

  for (let api of apis) {
    const start = Date.now();

    try {
      await axios.get(api.url);
      const end = Date.now();

      await Log.create({
        url: api.url,
        status: "UP",
        responseTime: end - start
      });

    } catch (err) {
      await Log.create({
        url: api.url,
        status: "DOWN",
        responseTime: 0
      });
    }
  }
});


    //EXPORT LOGS (every 30 sec)

cron.schedule("*/30 * * * * *", async () => {
  console.log("📦 Exporting logs...");

  try {
    const logs = await Log.find();

    fs.writeFileSync("logs.json", JSON.stringify(logs, null, 2));

    console.log("✅ logs.json updated");

  } catch (err) {
    console.log("❌ Export Error:", err);
  }
});

/* =========================
   🚀 SERVER START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});