const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
  {
    faculty: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    present: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
