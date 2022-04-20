const express = require("express");
const session = require("express-session");
const passport = require("passport");
const Local = require("passport-local").Strategy;
const Google = require("passport-google-oauth2").Strategy;
const bcryptjs = require("bcryptjs");
const { findUserByUserName, createUser } = require("./db");

const app = express();

app.use(
  session({
    resave: false,
    secret: "asdasd",
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const hash = (password) => {
  return bcryptjs.hash(password, 10);
};

const compare = (password, hashed) => {
  return bcryptjs.compare(password, hashed);
};

const db = {};

passport.serializeUser((user, done) => {
  done(null, user.userName);
});
passport.deserializeUser(async (userName, done) => {
  done(null, await findUserByUserName(userName));
});

passport.use(
  new Google(
    {
      clientID:
        "18706264611-ufbkqiqegpkobesn1pa6j445842mdlj0.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/google/callback",
    },
    async (req, actoken, reftoken, profile, done) => {
      const userName = profile.email;
      const user = { userName, password: "", provider: "google" };
      if (!(await findUserByUserName(userName))) {
        await createUser(user);
      }
      done(null, user);
    }
  )
);

passport.use(
  new Local(
    {
      passwordField: "password",
      usernameField: "userName",
    },
    async (userName, password, done) => {
      if (!userName || !password) {
        return done(null, false, { message: "Wrong creds" });
      }

      const userInDb = await findUserByUserName(userName);
      if (!userInDb) {
        return done(null, false, { message: "Wrong creds" });
      }
      const result = await compare(password, userInDb.password);
      if (result === true) {
        return done(null, userInDb);
      }
      done(null, false, { message: "Wrong creds" });
    }
  )
);

const logout = async (req, res, next) => {
  if (req.isUnauthenticated()) {
    console.log(req.isUnauthenticated);
    res.status(401);
    res.json({ message: "Unauthorized" });
  } else {
    req.logout();
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      }
    });
    res.json({ message: "Logout success" });
  }
};

app.post("/register", async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "Missing creds" });
  }

  if (await findUserByUserName(userName)) {
    return res.status(400).json({
      message: "Username already exists, please choose another one!",
    });
  }

  const hashed = await hash(password);
  await createUser({ userName, password: hashed });
  res.json({ ok: true });
});

app.post("/login", passport.authenticate("local"), async (req, res, next) => {
  // const { userName, password } = req.body;
  // const user = await findUserByUserName(userName);
  // if (user.userName !== userName || user.password !== password) {
  //   return res.status(400).json({ message: "Wrong username or password!" });
  // }

  res.json({ userName: req.body.userName });
});

app.get("/google", passport.authenticate("google", { scope: ["email"] }));
app.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.json(req.user);
});

app.get("/health", (req, res) => {
  //memory usage
  res.json({ ok: true, ...process.memoryUsage() });
});

app.get("/logout", (req, res, next) => {
  logout(req, res, next);
});

// const verify = (req, res, next) => {
//     if (!req.user) {
//         return res.status(403).end();
//     }
//     next();
// };

// app.get("/profile", verify, (req, res, next) => {
//   res.json(req.user);
// });

module.exports = app;
