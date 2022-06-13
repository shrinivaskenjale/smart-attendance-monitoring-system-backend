const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const divisionSchema = new Schema({
  divisionName: {
    type: String,
    required: true,
  },
  subjects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Division", divisionSchema);
