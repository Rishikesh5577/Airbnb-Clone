const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const registerSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    dob: {
        type: Date
    }
});

// Create Collection (model) "Credential"
const Credential = mongoose.model("credentials", registerSchema);

// Export model
module.exports = Credential;
