const passport = require("passport");
const jwt = require("jsonwebtoken");
var JwtStrategy = require("passport-jwt").Strategy,
  LocalStrategy = require("passport-local").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const dataset = {
  user1: {
    username: "user1",
    fullName: "Lorem Ipsum",
    email: "lorem.ipsum@gmail.com",
    password: "123456",
  },
  user2: {
    username: "user2",
    fullName: "Lorem Dolor",
    email: "lorem.dolor@gmail.com",
    password: "123456",
  },
  user3: {
    username: "user3",
    fullName: "Andy Ipsum",
    email: "andy.Ipsum@gmail.com",
    password: "123456",
  },
};

const createLoginHandler = (secret) => (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    try {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "something went wrong" });
      }
      if (info) {
        return res.status(401).send({ message: info.message });
      }
      if (!user) {
        return res.status(401).send({ message: "invalid credential" });
      }
      req.login(user, { session: false }, (error) => {
        if (error) return next(error);
        const body = {
          fullName: user.fullName,
          email: user.email,
        };
        const token = jwt.sign({ sub: user.username, ...body }, secret);
        return res.json({ accessToken: token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const authMiddleware = (req, res, next) => {
  return passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info) {
      res.status(401).send({ message: info.message });
    } else {
      next();
    }
  })(req, res, next);
};

const createJWTStrategy = (secret) => {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = secret;
  return new JwtStrategy(opts, (payload, done) => {
    setTimeout(() => {
      const user = dataset[payload.sub];
      if (user) {
        done(null, user);
      } else {
        done(new Error("unauthorized.access"), null);
      }
    }, 2000);
  });
};

const createLoginStrategy = () => {
  return new LocalStrategy((username, password, done) => {
    const user = dataset[username];
    if (user == null) {
      return done(null, null, {
        message: "invalid username or password",
      });
    } else {
      if (user.password != password) {
        return done(null, null, {
          message: "invalid username or password",
        });
      }
      return done(null, user);
    }
  });
};

module.exports = (secret) => {
  passport.use("jwt", createJWTStrategy(secret));
  passport.use("login", createLoginStrategy());
  return {
    loginHandler: createLoginHandler(secret),
    authMiddleware: authMiddleware,
  };
};
