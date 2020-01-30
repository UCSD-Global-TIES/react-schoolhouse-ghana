const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  profile: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  type: {
    type: String,
    required: true,
    enum: ['Student', 'Teacher', 'Admin']
  }

});

const Account = mongoose.model("Account", accountSchema);

// Auto assign password  

module.exports = Account;