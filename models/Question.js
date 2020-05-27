const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  prompt: {
    type: String,
    required: true
  },
  choices: [{
    type: String
  }],
  ratingStart: {
    type: Number
  },
  ratingEnd: {
    type: Number
  },
  isFreeResponse: {
    type: Boolean
  },
  response: [{
    type: Schema.Types.ObjectId,
    ref: "Response"
  }]
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);

// Auto assign password  
// https: //www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
// https: //stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
// https://stackoverflow.com/questions/14559200/how-to-exclude-one-particular-field-from-a-collection-in-mongoose

module.exports = Question;