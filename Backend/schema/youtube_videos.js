const mongoose = require('mongoose');

const YouTubeVideoSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  sub_topic: { type: String, required: true },
  url: { type: String, required: true },
});
const YouTubeVideo = mongoose.model('YouTubeVideo', YouTubeVideoSchema);

module.exports = YouTubeVideo;