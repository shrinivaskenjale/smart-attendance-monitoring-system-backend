const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const divisionSchema = new Schema(
    {
        division: {
            type: String,
            required: true
        },
        subjects: [
            {
                type: String,
                required: true,
            },
        ],
    },

);

module.exports = mongoose.model("Division", divisionSchema);
