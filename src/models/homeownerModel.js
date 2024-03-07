const mongoose = require("mongoose");

const homeownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  geocoordinates: {
    // Assuming geocoordinates are stored as an array [latitude, longitude]
    type: [Number],
    required: true,
  },
});

const Homeowner = mongoose.model("Homeowner", homeownerSchema);

module.exports = Homeowner;
