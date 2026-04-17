const mongoose = require("mongoose");

const ApiSchema = new mongoose.Schema({
  url: { type: String, required: true }
});

module.exports = mongoose.model("Api", ApiSchema);