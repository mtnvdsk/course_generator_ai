const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  main_topic: { type: String, required: true },
  sub_topics: [
    {
      name: { type: String, required: true },
      ai_result: { type: String }
    }
  ]
}, { timestamps: true,
  collection: 'courses',
 });

const Course= mongoose.model('CourseSchema', CourseSchema);

module.exports = Course;