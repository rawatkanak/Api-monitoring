const express = require("express");
const router = express.Router();

const Api = require("../models/Api");
const Log = require("../models/Log");

//  ADD API (from React UI)
router.post("/add-api", async (req, res) => {
  try {
    const api = new Api({ url: req.body.url });
    await api.save();
    res.json({ message: "API added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("delete-api/:id",async(req,res)=>{
  try {
    const id=req.params;
    console.log("id is ",id)
    const deletedApi=await Api.findByIdAndDelete(
     id
    )
    res.status(200).json({
      message:"api deleted successfully"
    })
    
  } catch (error) {
    console.log(error.message)
  }
})

//  GET LOGS (for dashboard)
router.get("/logs", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;