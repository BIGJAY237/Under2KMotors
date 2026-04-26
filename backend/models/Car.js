const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    description: { type: String, default: "" },
    specs: { type: String, default: "" },
    features: { type: [String], default: [] },
    year: { type: Number, default: new Date().getFullYear() },
    mileage: { type: String, default: "" },
    transmission: { type: String, default: "" },
    fuelType: { type: String, default: "" },
    color: { type: String, default: "" },
    horsepower: { type: String, default: "" },
    topSpeed: { type: String, default: "" },
    acceleration: { type: String, default: "" },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    video: { type: String, default: "" },
    brand: { type: String, default: "" },
    type: { type: String, default: "" }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

module.exports = mongoose.model("Car", carSchema);
