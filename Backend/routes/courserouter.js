// routes/courseRoutes.js
const Course = require('../schema/courses');
const { generate_ai, generate_maintopics, generate_subtopic } = require('../controllers/generate_courses');
const { authMiddleware } = require("../middleware/authvalidator");
const router = require('express').Router();
const { google } = require("googleapis");
const YouTubeVideo = require("../schema/youtube_videos"); // import your schema

// Initialize YouTube API client
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY, // put your API key in .env
});


// ----------------------
// Get all courses by user
// ----------------------
router.get('/getcourse/all/',authMiddleware, async (req, res) => {
  try {
    const user_id = req.userId;

    const courses = await Course.find({ user_id: user_id })
      .select('title'); 

    const courselist = {
      titles: [...new Set(courses.map(course => course.title))],
    };

    res.status(200).json(courselist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
});


// ----------------------
// Get a course by main_topic
// ----------------------
router.post('/getcourse/',authMiddleware, async (req, res) => {
  try {
    const course = await Course.find({ title: req.body.title }).select ('main_topic sub_topics');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const courseres = {
      main_topics: course.map(course => course.main_topic),
      sub_topics: course.map(course => course.sub_topics.map(st => st.name))
    };

    res.status(200).json(courseres);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course', error: err.message });
  }
});

// ----------------------
// Get (or generate) AI result for a subtopic
// ----------------------
router.post('/getcourse/airesult/', authMiddleware, async (req, res) => {
  try {
    const { main_topic, sub_topic } = req.body;

    // Find course that has this main_topic and sub_topic
    const course = await Course.findOne({
      main_topic: main_topic,
      "sub_topics.name": sub_topic
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the sub_topic object inside the course
    let sub = course.sub_topics.find(st => st.name === sub_topic);

    if (!sub) {
      // if subtopic does not exist, create one
      const ai_res = await generate_ai(sub_topic);
      sub = { name: sub_topic, ai_result: ai_res };
      course.sub_topics.push(sub);
      await course.save();
    } else if (!sub.ai_result) {
      // generate if ai_result missing
      sub.ai_result = await generate_ai(sub_topic);
      await course.save();
    }

    // Find stored videos for this course + sub_topic
    let videos = await YouTubeVideo.find({ course_id: course._id, sub_topic });

    if (videos.length === 0) {
      // Fetch from YouTube API
      const ytRes = await youtube.search.list({
        part: "snippet",
        q: `${sub_topic} tutorial`,
        maxResults: 5,
        type: "video",
      });

      videos = ytRes.data.items.map(item => ({
        course_id: course._id,
        sub_topic,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));

      await YouTubeVideo.insertMany(videos);
    }

    res.status(200).json({
      ai_result: sub.ai_result,
      youtube_videos: videos.map(v => v.url),
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching ai_result', error: err.message });
  }
});


// ----------------------
// Generate a full course using AI
// ----------------------
router.post('/generatecourse/',authMiddleware, async (req, res) => {
  try {
    const user_id = req.userId;
    const { title } = req.body;
    const existingCourse = await Course.findOne({ user_id, title });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this title already exists' });
    }
    const main_topics = await generate_maintopics(title);
    const courses = [];

    for (const mt of main_topics) {
      const sub_topics = await generate_subtopic(mt); 

      const sub_topics_with_ai = [];
      for (const st of sub_topics) {
        const ai_res = "";
        sub_topics_with_ai.push({ name: st, ai_result: ai_res });
      }
      const newCourse = new Course({
        user_id,
        title,
        main_topic: mt,
        sub_topics: sub_topics_with_ai
      });

      await newCourse.save();
      courses.push(newCourse);
    }
    const courseres={
      main_topics: courses.map(course => course.main_topic),
      sub_topics: courses.map(course => course.sub_topics.map(st => st.name))
    }
    res.status(201).json({
      message: 'Courses generated successfully',
      courseres
    });

  } catch (err) {
    res.status(500).json({ message: 'Error generating course', error: err.message });
  }
});

// ----------------------
// Delete course by title
// ----------------------
router.delete('/delete',authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    const deletedCourse = await Course.deleteMany({ title });
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
});

module.exports = router;
