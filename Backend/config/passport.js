const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../schema/users");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://course-generator-ai-cuc7.onrender.com/api/users/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // check if user exists
    let user = await User.findOne({ providerId: profile.id, provider: "google" });

    if (!user) {
      user = new User({
        email: profile.emails[0].value,
        provider: "google",
        providerId: profile.id,
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
