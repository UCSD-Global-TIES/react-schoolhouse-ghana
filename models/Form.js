const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const formSchema = new Schema({
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  title: {
    type: String,
    required: true
  },
  annonymous: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

const Form = mongoose.model("Form", formSchema);

// Auto assign password  
// https: //www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
// https: //stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
// https://stackoverflow.com/questions/14559200/how-to-exclude-one-particular-field-from-a-collection-in-mongoose

module.exports = Form;