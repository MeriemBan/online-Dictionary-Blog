let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");

// database MongoDB
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let dbo = undefined;
let url =
  "mongodb+srv://dico:dico@cluster0-qsqfa.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("dico");
});

// hash passwords using sha1
let sha1 = require("sha1");

// multer
let multer = require("multer");
let upload = multer({ dest: __dirname + "/uploads/" });

//cookie
let cookieParser = require("cookie-parser");
app.use(cookieParser());

// sessions = {sessionId: username}
let sessions = {};

reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

app.use("/uploads", express.static("uploads")); // Needed for local assets
app.use("/images", express.static("images"));

// Your endpoints go after this line

// GET endpoints
// GET dictionary content
// ...

// GET blog posts
app.get("/all-posts", (req, res) => {
  dbo
    .collection("blog")
    .find({})
    .toArray((err, blog) => {
      if (err) {
        console.log("error", err);
        res.send("fail");
        return;
      }
      res.send(JSON.stringify(blog));
    });
});

// POST endpoints
// signup, login, logout, like, search-item, new-post, add-review, new-word

// signup
app.post("/signup", upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint");
  console.log("this is the body", req.body);

  let username = req.body.username;
  let password = req.body.password;

  dbo
    .collection("users")
    .findOne({ username: username }, (err, expectedUsername) => {

      if (err) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      if (expectedUsername === undefined || expectedUsername === null) {
        dbo.collection("users").insertOne({
          username: username,
          password: sha1(password),
          role: "standard"
        });
        res.send(JSON.stringify({ success: true }));
        return;
      }
      if (expectedUsername !== undefined) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      res.send(JSON.stringify({ success: false }));
    });
});

// generate a cookie
let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

// login
app.post("/login", upload.none(), (req, res) => {
  console.log("**** I'm in the login endpoint");
  console.log("this is the parsed body", req.body);

  let username = req.body.username;
  let enteredPassword = req.body.password;

  dbo.collection("users").findOne({ username: username }, (err, user) => {
    console.log("username", username);
    console.log("enteredPassword", req.body.password);
    console.log("users");
    if (err) {
      console.log("error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null || user === undefined) {
      console.log("user === null");
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user.password === sha1(enteredPassword)) {
      console.log("correct password");
      let sessionId = generateId();
      console.log("generated id", sessionId);
      res.cookie("sid", sessionId);

      sessions[sessionId] = user.username;
      console.log("sessions", sessions);
      res.send(
        JSON.stringify({
          success: true
        })
      );
      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
});

// logout
app.post("/logout", upload.none(), (req, res) => {
  console.log("logout");
  console.log("sessions", sessions);
  let sessionId = req.cookies.sid;
  console.log("sessionId", sessionId);

  // delete cookie
  delete sessions[sessionId];
  console.log("sessions", sessions);
});

// search-word ???
app.post("/search-word", upload.none(), (req, res) => {
  console.log("word", req.body.word);
  dbo.collection("contents").findOne({ name: req.body.word }, (err, word) => {
    if (err) {
      console.log("error", err);
      res.send("fail");
      return;
    }
    console.log("word", word);
    res.send(JSON.stringify(word));
  });
});

// new-word
app.post("/new-word", upload.none(), (req, res) => {
  console.log("req.body", req.body);

  dbo.collection("contents").insertOne({
    letter: req.body.letter,
    english_word: req.body.englishWord,
    french_word: req.body.frenchWord,
    arabic_word: req.body.arabicWord,
    arabic_definition: req.body.arabicDefinition
  });
  res.send(
    JSON.stringify({
      success: true
    })
  );
});

// new-post
app.post("/new-post", upload.single("postImage"), (req, res) => {
  console.log("request to /new-post body", req.body);
  let time = new Date();
  let formattedTime = time.toLocaleString(undefined, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  });
  console.log(req.file);
  let filePath;

  if (req.file !== undefined) {
    filePath = "/uploads/" + req.file.filename;
  }

  dbo.collection("blog").insertOne({
    title: req.body.title,
    author: req.body.username,
    date: formattedTime,
    image: filePath,
    post: req.body.post,
    // tags is an array
    tags: req.body.tags,
    likes: req.body.likes,
    reviews: []
  });
  res.send(
    JSON.stringify({
      success: true
    })
  );
});

// like
app.post("/like", upload.none(), (req, res) => {
  console.log("req.body", req.body);

  let numberOfLikes = parseInt(req.body.like);

  dbo.collection("blog").updateOne(
    { _id: ObjectID(req.body.blogPostId) },
    {
      $inc: {
        likes: numberOfLikes
      }
    },
    (err, result) => {
      if (err) {
        console.log("error", err);
        res.send("fail");
        return;
      }
      res.send(JSON.stringify({ success: true }));
      return;
    }
  );
});

// add-review
app.post("/add-review", upload.none(), (req, res) => {
  console.log("our review: ", req.body.review);
  let review = req.body.review;
  let sessionId = req.cookies.sid;
  let currentUser = sessions[sessionId];
  let time = new Date();
  let formattedTime = time.toLocaleString(undefined, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  });

  dbo.collection("blog").updateOne(
    { _id: ObjectID(req.body.blogPostId) },
    {
      $push: {
        review: {
          username: currentUser,
          date: formattedTime,
          review_message: review
        }
      }
    }
  );
  res.send(
    JSON.stringify({
      success: true
    })
  );
  return;
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
