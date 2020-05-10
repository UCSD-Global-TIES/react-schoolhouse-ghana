const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const formSchema = new Schema({
  form: {
    questions: [String],
    response: [String]
  },
  questions: {
    prompt: String,
    choices: [String],
    type: String
  },
  response: {
    userID: String,
    data: [any]
  }

}, { timestamps: true });

const Forms = mongoose.model("Account", accountSchema);

// Auto assign password  
// https: //www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
// https: //stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
// https://stackoverflow.com/questions/14559200/how-to-exclude-one-particular-field-from-a-collection-in-mongoose

module.exports = Account;