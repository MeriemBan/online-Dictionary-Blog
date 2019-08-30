let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");

// database MongoDB
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let dbo = undefined;
let url =
  "mongodb+srv://dico:dico@cluster0-qsqfa.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(
  url,
  { useUnifiedTopology: true },
  { useNewUrlParser: true },
  (err, db) => {
    dbo = db.db("dico");
  }
);

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

app.use("/images", express.static(__dirname + "/uploads"));

// Your endpoints go after this line

// GET endpoints
// GET dictionary content
// ...

// GET blog posts
app.get("/all-posts", (req, res) => {
  dbo
    .collection("blog")
    .find({})
    .toArray((err, blogs) => {
      if (err) {
        console.log("error", err);
        res.send("fail");
        return;
      }
      res.send(JSON.stringify(blogs));
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

app.post("/delete-dico", (req, res) => {
  dbo.collection("contents").deleteMany({}, (err, result) => {
    if (err) {
      console.log("error", err);
      res.send("fail");
      return;
    }
    res.send(JSON.stringify({ success: true }));
  });
});

// search-word
app.post("/search-word", upload.none(), (req, res) => {
  console.log("searchInput", req.body.searchInput);
  console.log("req.body.language", req.body.language);
  let startWord = parseInt(req.body.page);
  if (req.body.searchInput !== "" && req.body.language === "english") {
    dbo
      .collection("contents")
      .findOne({ english_word: req.body.searchInput }, (err, singleResult) => {
        if (err) {
          console.log("error", err);
          res.send("fail");
          return;
        }
        if (singleResult !== null) {
          res.send(JSON.stringify(singleResult));
          return;
        }
        // console.log("singleResult", singleResult);
        dbo
          .collection("contents")
          .find({ letter: req.body.searchInput.charAt(0) })
          .toArray((err, multipleResults) => {
            if (err) {
              console.log("error", err);
              res.send("fail");
              return;
            }

            let result = multipleResults.filter(elem => {
              if (
                elem.english_word
                  .toLowerCase()
                  .startsWith(req.body.searchInput.toLowerCase())
                // .includes(req.body.searchInput.toLowerCase())
              ) {
                return elem.english_word;
              }
            });
            // console.log('result', result)
            res.send(
              JSON.stringify(result.slice(startWord * 3, startWord * 3 + 3))
            );
          });
      });
    return;
  }
  dbo
    .collection("contents")
    .findOne({ french_word: req.body.searchInput }, (err, singleResult) => {
      if (err) {
        console.log("error", err);
        res.send("fail");
        return;
      }
      if (singleResult !== null) {
        res.send(JSON.stringify(singleResult));
        return;
      }
      // console.log("singleResult", singleResult);
      dbo
        .collection("contents")
        .find({})
        .toArray((err, multipleResults) => {
          if (err) {
            console.log("error", err);
            res.send("fail");
            return;
          }

          let result = multipleResults.filter(elem => {
            if (
              elem.french_word
                .toLowerCase()
                .startsWith(req.body.searchInput.toLowerCase())
              // .includes(req.body.searchInput.toLowerCase())
            ) {
              return elem.french_word;
            }
          });
          // console.log("result", result);
          res.send(
            JSON.stringify(result.slice(startWord * 3, startWord * 3 + 3))
          );
        });
    });
});

// new-word
app.post("/new-word", upload.none(), (req, res) => {
  console.log("req.body", req.body);
  let englishWord = req.body.englishWord;

  dbo.collection("contents").insertOne(
    {
      letter: englishWord.charAt(0).toLowerCase(),
      english_word: req.body.englishWord,
      french_word: req.body.frenchWord,
      arabic_word: req.body.arabicWord,
      arabic_definition: req.body.arabicDefinition
    },
    (err, result) => {
      if (err) {
        console.log("error", err);
        res.send("fail");
        return;
      }
      res.send(JSON.stringify({ success: true }));
    }
  );
});

//upload dictionary
app.post("/upload-dico", upload.none(), (req, res) => {
  console.log("req.body", req.body);

  for (let i = 0; i < req.body.englishWord.length; i++) {
    english_word = req.body.englishWord[i];

    console.log("english_word", english_word);
    dbo.collection("contents").insertOne({
      letter: english_word.charAt(0).toLowerCase(),
      english_word: req.body.englishWord[i],
      french_word: req.body.frenchWord[i],
      arabic_word: req.body.arabicWord[i],
      arabic_definition: req.body.arabicDefinition[i]
    });
  }
});

// new-post
app.post("/new-post", upload.single("file"), (req, res) => {
  console.log("/new-post endpoint");
  console.log("request to /new-post body", req.body);
  
  let time = new Date();
  let formattedTime = time.toLocaleString(undefined, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  });
  console.log("req.body.tags", req.body.tags);

  let filePath;

  if (req.file !== undefined) {
    filePath = "/uploads/" + req.file.filename;
    console.log("filePath", filePath);
  }

  dbo.collection("blog").insertOne(
    {
      title: req.body.title,
      author: req.body.author,
      date: formattedTime,
      image: filePath,
      post: req.body.post,
      // tags is an array
      tags: req.body.tags
    },
    (err, result) => {
      if (err) {
        console.log("error", err);
        res.send("fail");
        return;
      }
      res.send(JSON.stringify({ success: true }));
    }
  );
});

// like
app.post("/likes", upload.none(), (req, res) => {
  console.log("req.body", req.body);

  let numberOfLikes = parseInt(req.body.likes);

  dbo.collection("blog").updateOne(
    { _id: ObjectID(req.body.postId) },
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
  // let sessionId = req.cookies.sid;
  // let currentUser = sessions[sessionId];
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
        reviews: {
          username: req.body.username,
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
