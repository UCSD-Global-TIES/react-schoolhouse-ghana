const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },
  answer: {
    type: Schema.Types.Mixed,
    required: true
  },
  explanation: {
    type: String
  },
  profile: {
    type: Schema.Types.ObjectId,
  }
}, { timestamps: true });

const Response = mongoose.model("Response", responseSchema);

// Auto assign password  
// https: //www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
// https: //stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
// https://stackoverflow.com/questions/14559200/how-to-exclude-one-particular-field-from-a-collection-in-mongoose

module.exports = Response;