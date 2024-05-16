const express = require("express");
const db = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

const secret = "anything_secret";

// uploading picture to server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/upload");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), function (req, res) {
  res.json(req.file);
});

//  ============================   auth api's  ======================

// register api
app.post("/register", (req, res) => {
  const q = "select * from users where username = ? or email = ?";
  db.query(q, [req.body.username, req.body.email], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.json({ message: "User already exits" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const Q = "insert into users (username,email,password) values(?,?,?)";
    db.query(Q, [req.body.username, req.body.email, hash], (err, response) => {
      if (err) return res.json(err);
      return res.json({ message: "User has been created" });
    });
  });
});

// login api
app.post("/login", (req, res) => {
  const q = "select * from users where username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.log(err);
    } else if (data.length > 0) {
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );
      if (!isPasswordCorrect) {
        res.json({ message: "Wrong username or password" });
      } else {
        const { password, ...other } = data[0];
        const token = jwt.sign({ id: data[0].id }, secret, { expiresIn: "1d" });

        res.cookie("token", token).json(other);
      }
    } else {
      res.send({ message: "No user found" });
    }
  });
});

// logout api
app.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      sameSite: "none",
      secure: true,
    })
    .json({ message: "User has been logout" });
});

// ========================  post api

// all post api
app.get("/posts", (req, res) => {
  const q = req.query.cat
    ? "select p.id,p.title,p.description,p.img,p.date,p.user_id, c.cat from posts as p join category as c on p.cat_id = c.id where c.cat = ?"
    : "select p.id,p.title,p.description,p.img,p.date,p.user_id, c.cat from posts as p join category as c on p.cat_id = c.id";
  db.query(q, [req.query.cat], (err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json(data);
    }
  });
});

// single post api
app.get("/post/:id", (req, res) => {
  const q =
    "select p.id,username,title,description,c.cat,date,p.img as postImg,u.img as userImg from users as u join posts as p on u.id = p.user_id join category as c on p.cat_id = c.id where p.id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json(data[0]);
    }
  });
});

// delete post api
app.delete("/deletePost/:id", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, secret, (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const postId = req.params.id;
    const userId = userInfo.id;

    const q = "DELETE FROM posts WHERE id = ? AND user_id = ?";
    db.query(q, [postId, userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(403).json({
          message: "This post doesn't belong to you or does not exist",
        });
      }
      return res.json({ message: "Post deleted successfully", token });
    });
  });
});

// add post api
app.post("/add-post", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, secret, (err, userInfo) => {
    if (err) {
      return res.status(403).json({ message: "token is not valid" });
    } else {
      const q =
        "insert into posts (`title`, `description`,`img`,`date`,`user_id`,`cat_id`) values(?)";
      const values = [
        req.body.title,
        req.body.description,
        req.body.img,
        req.body.date,
        userInfo.id,
        req.body.cat_id,
      ];
      db.query(q, [values], (err, data) => {
        if (err) {
          res.json(err);
        } else {
          res.json({ message: "post has been created" });
        }
      });
    }
  });
});

// update post api
app.put("/update-post/:id", (req, res) => {
  const q = `update posts set title=? ,description=? , cat_id=? where id=${req.params.id}`;
  const values = [req.body.title, req.body.description, req.body.cat_id];
  db.query(q, values, (err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json({ message: "Post has been updated" });
    }
  });
});

// search post api
app.get("/search/:key", (req, res) => {
  const searchTerm = req.params.key;
  const query = `
  select p.id,p.title,p.description,p.img,p.date,p.user_id, c.cat from posts as p join category as c on p.cat_id = c.id
        WHERE p.title LIKE '%${searchTerm}%' OR c.cat LIKE '%${searchTerm}%'
    `;

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(data);
    }
  });
});

app.listen(3000, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server running");
  }
});
