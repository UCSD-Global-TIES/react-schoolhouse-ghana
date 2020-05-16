const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionsSchema = new Schema({
  questions: {
    prompt: String,
    choices: [String],
    rating: (Int, Int),
    isFreeResponse: Boolean,
    response: [Responses]
  }

}, { timestamps: true });

const Questions = mongoose.model("Question", questionSchema);

// Auto assign password  
// https: //www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
// https: //stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
// https://stackoverflow.com/questions/14559200/how-to-exclude-one-particular-field-from-a-collection-in-mongoose

module.exports = Questions;