// routes/userRoutes.js
const express = require('express');
const passport=require('passport');
const { registerUser, getUsers, login } = require('../controllers/user_controller');
const jwt = require("jsonwebtoken");

const { validateUser } = require("../middleware/validation");
const { authMiddleware } = require("../middleware/authvalidator");
const router = express.Router();

router.post('/register', validateUser, registerUser); 
router.post('/login', login);

// Google OAuth
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// router.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' ,session:false}),
//   async (req, res) => {
//     const user = req.user;

//     // generate JWT for OAuth user
//     const token = jwt.sign(
//       { userId: user._id.toString(), email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful with Google",
//       token,
//     });
//   }
// );
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    const user = req.user;

    // generate JWT
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.send(`
      <html>
        <body>
          <script>
            // Send token to parent window
            window.opener.postMessage({ token: "${token}" }, "*");
            window.close();
          </script>
        </body>
      </html>
    `);
  }
);



module.exports = router;
