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

}, { timestamps: true });

const Account = mongoose.model("Account", accountSchema);

// Auto assign password  
// https: //www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
// https: //stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
// https://stackoverflow.com/questions/14559200/how-to-exclude-one-particular-field-from-a-collection-in-mongoose

module.exports = Account;