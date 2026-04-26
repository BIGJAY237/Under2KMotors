const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }
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

module.exports = mongoose.model("Type", typeSchema);