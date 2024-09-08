const express = require("express");
const db = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

const secret = "anything_secret";
const adminSecret = "admin_secret";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../frontend/public/upload"));
  },
  filename: function (req, file, cb) {
    const uniqueName =
      file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    req.uploadedFileName = uniqueName; // Save the filename to the request object
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const copyFileToSecondLocation = (req, res, next) => {
  const srcPath = path.join(
    __dirname,
    "../frontend/public/upload",
    req.uploadedFileName
  );
  //C:/Users/hp/OneDrive/Desktop/blog_web/AdminFrontend/public/upload/
  const destPath =
    "C:/Projects/React_Projects/AdminFrontend/public/upload/" +
    req.uploadedFileName;

  // Ensure the destination directory exists
  fs.mkdir(path.dirname(destPath), { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
      return res.status(500).json({ error: "Error creating directory" });
    }

    // Copy the file
    fs.copyFile(srcPath, destPath, (err) => {
      if (err) {
        console.error("Error copying file:", err);
        console.log(err);
        return res.status(500).json({ error: "Error copying file" });
      }
      next();
    });
  });
};

app.post(
  "/upload",
  upload.single("image"),
  copyFileToSecondLocation,
  (req, res) => {
    res.json(req.file);
  }
);
//  ============================   auth api's  ======================

// register api
app.post("/register", (req, res) => {
  const q = "select * from users where username = ? or email = ?";
  db.query(q, [req.body.username, req.body.email], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.json({ message: "User already exits" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const Q =
      "insert into users (username,email,password,gender,age,secretMessage,role_id,isActive) values(?,?,?,?,?,?,2,1)";
    db.query(
      Q,
      [
        req.body.username,
        req.body.email,
        hash,
        req.body.gender,
        req.body.age,
        req.body.secretMessage,
      ],
      (err, response) => {
        if (err) return res.json(err);
        return res.json({ message: "User has been created" });
      }
    );
  });
});
app.post("/adminregister", (req, res) => {
  const q = "select * from users where username = ? or email = ?";
  db.query(q, [req.body.username, req.body.email], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.json({ message: "User already exits" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const Q =
      "insert into users (username,email,password,gender,age,role_id,isActive) values(?,?,?,?,?,1,1)";
    db.query(
      Q,
      [req.body.username, req.body.email, hash, req.body.gender, req.body.age],
      (err, response) => {
        if (err) return res.json(err);
        return res.json({ message: "User has been created" });
      }
    );
  });
});

// login api
app.post("/login", (req, res) => {
  const q =
    "select * from users where username = ? and isActive = 1 and role_id = 2";
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
        const { rejectPostCount } = data[0];
        if (rejectPostCount === 3) {
          res.send({ message: "You have banned from this website" });
        } else {
          const { password, email, ...other } = data[0];
          const token = jwt.sign({ id: data[0].id }, secret, {
            expiresIn: "1d",
          });

          res.cookie("token", token).json(other);
        }
      }
    } else {
      res.send({ message: "No user found" });
    }
  });
});

app.post("/Adminlogin", (req, res) => {
  const q = "select * from users where username = ? and role_id = 1";
  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.log(err);
    } else if (data.length > 0) {
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );
      if (!isPasswordCorrect) {
        res.json({ message: "Wrong Admin username or password" });
      } else {
        const { password, ...other } = data[0];
        const token = jwt.sign({ id: data[0].id }, adminSecret, {
          expiresIn: "1d",
        });

        res.cookie("adminToken", token).json(other);
      }
    } else {
      res.send({ message: "No Admin found with this username" });
    }
  });
});

app.put("/resetPassword", (req, res) => {
  const email = req.body.email;
  const secretMessage = req.body.secretMessage;
  const newPassword = req.body.password;
  const q = `select * from users where email = ? and secretMessage = ?`;
  db.query(q, [req.body.email, req.body.secretMessage], (err, result) => {
    if (err) {
      return err;
    } else {
      if (result.length > 0) {
        const queryy = `update users set password=? where email=? and secretMessage=?`;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        db.query(queryy, [hash, email, secretMessage], (err, data) => {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: "Password changed successfully" });
          }
        });
      } else {
        res.json({ message: "Invalid email or secret message" });
      }
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

// ======================== userinfo api

app.get("/userinfo/:id", (req, res) => {
  const q = `select * from users where id = ${req.params.id}`;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      const { password, ...other } = data[0];
      res.send(other);
    }
  });
});

app.put("/update-user/:id", (req, res) => {
  const q = `update users set username=? ,gender=? , age=?,email=?,secretMessage=?, img=? where id=${req.params.id}`;
  const values = [
    req.body.username,
    req.body.gender,
    req.body.age,
    req.body.email,
    req.body.secretMessage,
    req.body.img,
  ];
  db.query(q, values, (err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json({ message: "user info has been updated" });
    }
  });
});

// ========================  post api

// all post api
app.get("/posts", (req, res) => {
  const q = req.query.cat
    ? "select p.id,p.title,p.description,p.img,p.date,p.user_id,p.isActive, c.cat from posts as p join category as c on p.cat_id = c.id join users as u on u.id = p.user_id where c.cat = ? and u.isActive =1 and p.isActive = 1 and p.isPending = 0 and isRejected = 0"
    : "select p.id,p.title,p.description,p.img,p.date,p.user_id,p.isActive, c.cat from posts as p join category as c on p.cat_id = c.id join users as u on u.id = p.user_id where u.isActive = 1 and p.isActive = 1 and p.isPending = 0 and isRejected = 0";
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
    "select p.id,username,title,description,c.cat,p.cat_id,date,p.isRejected,p.img as postImg,p.isActive,u.img as userImg from users as u join posts as p on u.id = p.user_id join category as c on p.cat_id = c.id where p.id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json(data[0]);
    }
  });
});

// delete post api
app.post("/deletePost/:id", (req, res) => {
  const postId = req.params.id;
  const q = "DELETE FROM posts WHERE id = ?";
  db.query(q, [postId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ message: "Post deleted successfully" });
  });
});

// add post api
app.post("/add-post", (req, res) => {
  const q =
    "insert into posts (`title`, `description`,`img`,`date`,`user_id`,`cat_id`,`isActive`,`isPending`,`isRejected`) values(?,0,1,0)";
  const values = [
    req.body.title,
    req.body.description,
    req.body.img,
    req.body.date,
    req.body.user_id,
    req.body.cat_id,
  ];
  db.query(q, [values], (err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json({
        message:
          "Your post is in the pending stage. Once the admin approves your post, it will be on the website.",
      });
    }
  });
});

// update post api
app.put("/update-post/:id", (req, res) => {
  const q = `update posts set title=? ,description=? , cat_id=?, img = ? where id=${req.params.id}`;
  const values = [
    req.body.title,
    req.body.description,
    req.body.cat_id,
    req.body.img,
  ];
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
        WHERE (p.title LIKE '%${searchTerm}%' OR c.cat LIKE '%${searchTerm}%') and p.isActive = 1 and p.isPending = 0`;

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(data);
    }
  });
});

// =========================== Comments api

// post comment api
app.post("/addComment", (req, res) => {
  const q =
    "insert into comments (`comment`, `commentedAt`,`post_id`,`user_id`,`edited`) values(?,?,?,?,0)";
  const values = [
    req.body.comment,
    req.body.commentedAt,
    req.body.post_id,
    req.body.user_id,
  ];
  db.query(q, values, (err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json({
        message: "New comment added",
      });
    }
  });
});

// get post comment
app.get("/getComments/:id", (req, res) => {
  const q = `select c.id,c.edited,c.comment,c.commentedAt,u.username,u.img,c.user_id,u.username from comments c join users u on c.user_id = u.id where c.post_id = ${req.params.id}`;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
});

// delete comment
app.delete("/DeleteComment/:id", (req, res) => {
  const q = `delete from comments where id = ${req.params.id}`;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: "Comment has been successfully deleted" });
    }
  });
});

// edit comment
app.put("/editingComment/:id", (req, res) => {
  const q = `update comments set comment =?,edited=1 where id = ${req.params.id}`;
  db.query(q, req.body.comment, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ message: "Comment has been successfully updated" });
    }
  });
});

// add reply comment
app.post("/addReplyComment", (req, res) => {
  const q =
    "insert into replyComments (`reply`, `repliedAt`,`post_id`,`repliedBy_id`,`repliedTo_id`,`comment_id`) values(?,?,?,?,?,?)";
  const values = [
    req.body.reply,
    req.body.repliedAt,
    req.body.post_id,
    req.body.repliedBy_id,
    req.body.repliedTo_id,
    req.body.comment_id,
  ];
  db.query(q, values, (err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json({
        message: "Reply added",
      });
    }
  });
});

// get reply comments
app.get("/getReplyComments/:id", (req, res) => {
  const q = `
  select rc.id,rc.reply,rc.isEdited,rc.comment_id as repliedCommentId,rc.repliedTo_id,rc.repliedBy_id,
  rc.repliedAt,uRepliedBy.username as repliedByUser,uRepliedTo.username as repliedToUser,uRepliedBy.img,rc.post_id
from replycomments rc 
join comments c on c.id = rc.comment_id
join users uRepliedBy on uRepliedBy.id = rc.repliedBy_id
join users uRepliedTo on uRepliedTo.id = rc.repliedTo_id
join posts p on p.id = rc.post_id
where p.id = ${req.params.id}
  `;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
});

app.delete("/DeleteReplyComment/:id", (req, res) => {
  const q = `delete from replyComments where id = ${req.params.id}`;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: "Comment has been successfully deleted" });
    }
  });
});

app.put("/editingReplyComment/:id", (req, res) => {
  const q = `update replyComments set reply =?,isEdited=1 where id = ${req.params.id}`;
  db.query(q, req.body.reply, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ message: "Comment has been successfully updated" });
    }
  });
});

// ========================  admin api

// getting total users
app.get("/userscount", (req, res) => {
  const q = "select count(*) as TotalUsers from users where role_id = 2";
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data[0]);
  });
});
app.get("/activeuserscount", (req, res) => {
  const q =
    "select count(*) as TotalActiveUsers from users where isActive = 1 and role_id = 2";
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data[0]);
  });
});
app.get("/deactivateuserscount", (req, res) => {
  const q =
    "select count(*) as TotalDeActivatedUsers from users where isActive = 0";
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data[0]);
  });
});

// getting all posts counts
app.get("/postscount", (req, res) => {
  const q = "select count(*) as TotalPosts from posts";
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data[0]);
  });
});
app.get("/activepostscount", (req, res) => {
  const q =
    "select count(*) as TotalActivePosts from posts where isPending = 0";
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data[0]);
  });
});
app.get("/rejectedpostscount", (req, res) => {
  const q =
    "select count(*) as TotalDeActivatePosts from posts where isRejected = 1";
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data[0]);
  });
});

// getting post by category
app.get("/AdminGetArtPost", (req, res) => {
  const q = `SELECT p.id AS post_id, p.user_id, p.cat_id, u.role_id, u.username, p.title,p.img AS post_img, p.date, c.cat AS category, u.email, u.img AS userImg, r.role, u.isActive AS UserIsActive, p.isActive AS PostIsActive FROM posts AS p JOIN category AS c ON p.cat_id = c.id JOIN users AS u ON u.id = p.user_id JOIN roles AS r ON r.id = u.role_id where c.cat = 'art' and p.isPending = 0`;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});

app.get("/AdminGetSciencePost", (req, res) => {
  const q = `SELECT p.id AS post_id, p.user_id, p.cat_id, u.role_id, u.username, p.title,p.img AS post_img, p.date, c.cat AS category, u.email, u.img AS userImg, r.role, u.isActive AS UserIsActive, p.isActive AS PostIsActive FROM posts AS p JOIN category AS c ON p.cat_id = c.id JOIN users AS u ON u.id = p.user_id JOIN roles AS r ON r.id = u.role_id where c.cat = 'science' and p.isPending = 0`;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});

app.get("/AdminGetTechnologyPost", (req, res) => {
  const q = `SELECT p.id AS post_id, p.user_id, p.cat_id, u.role_id, u.username, p.title,p.img AS post_img, p.date, c.cat AS category, u.email, u.img AS userImg, r.role, u.isActive AS UserIsActive, p.isActive AS PostIsActive FROM posts AS p JOIN category AS c ON p.cat_id = c.id JOIN users AS u ON u.id = p.user_id JOIN roles AS r ON r.id = u.role_id where c.cat = 'technology' and p.isPending = 0`;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});

app.get("/AdminGetCinemaPost", (req, res) => {
  const q = `SELECT p.id AS post_id, p.user_id, p.cat_id, u.role_id, u.username, p.title,p.img AS post_img, p.date, c.cat AS category, u.email, u.img AS userImg, r.role, u.isActive AS UserIsActive, p.isActive AS PostIsActive FROM posts AS p JOIN category AS c ON p.cat_id = c.id JOIN users AS u ON u.id = p.user_id JOIN roles AS r ON r.id = u.role_id where c.cat = 'cinema' and p.isPending = 0`;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});

app.get("/AdminGetDesignPost", (req, res) => {
  const q = `SELECT p.id AS post_id, p.user_id, p.cat_id, u.role_id, u.username, p.title,p.img AS post_img, p.date, c.cat AS category, u.email, u.img AS userImg, r.role, u.isActive AS UserIsActive, p.isActive AS PostIsActive FROM posts AS p JOIN category AS c ON p.cat_id = c.id JOIN users AS u ON u.id = p.user_id JOIN roles AS r ON r.id = u.role_id where c.cat = 'design' and p.isPending = 0`;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});

app.get("/AdminGetFoodPost", (req, res) => {
  const q = `SELECT p.id AS post_id, p.user_id, p.cat_id, u.role_id, u.username, p.title,p.img AS post_img, p.date, c.cat AS category, u.email, u.img AS userImg, r.role, u.isActive AS UserIsActive, p.isActive AS PostIsActive FROM posts AS p JOIN category AS c ON p.cat_id = c.id JOIN users AS u ON u.id = p.user_id JOIN roles AS r ON r.id = u.role_id where c.cat = 'food' and p.isPending = 0`;
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});

// deactivating and reactivating post
app.put("/DeActivatePost/:id", (req, res) => {
  const postId = req.params.id;
  const q = `update posts set isActive = 0 where id =${postId}`;
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ message: "Post has been deActivated" });
    }
  });
});

app.put("/ReActivatePost/:id", (req, res) => {
  const postId = req.params.id;
  const q = `update posts set isActive = 1 where id =${postId}`;
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ message: "Post has been Activated" });
    }
  });
});

// deactivating and reactivating user

app.put("/DeActivateUser/:id", (req, res) => {
  const userId = req.params.id;
  const q = `update users set isActive = 0 where id =${userId}`;
  const q2 = `update posts set isActive = 0 where user_id =${userId}`;
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
    }
    db.query(q2, (err, data) => {
      if (err) {
        res.send(err);
      }
      res.json({
        message:
          "User and all the posts related to this user has been deactivated",
      });
    });
  });
});

app.put("/ReActivateUser/:id", (req, res) => {
  const userId = req.params.id;
  const q = `update users set isActive = 1 where id =${userId}`;
  const q2 = `update posts set isActive = 1 where user_id =${userId}`;
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
    }
    db.query(q2, (err, data) => {
      if (err) {
        res.send(err);
      }
      res.json({
        message:
          "User and all the posts related to this user has been Activated",
      });
    });
  });
});

// ===== getting users
app.get("/GetAllUsers", (req, res) => {
  // const q =
  //   "select u.id,u.img,u.username,u.email,u.isActive,count(p.id) as total_post from users as u join posts as p on u.id = p.user_id join category as c on c.id = p.user_id where u.role_id = 2 group by u.id,p.user_id";
  const q =
    "select u.id,u.img,u.username,u.email,u.isActive,count(p.id) as total_post from users as u left join posts as p on u.id = p.user_id left join category as c on c.id = p.user_id where u.role_id = 2 group by u.id,p.user_id";
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data);
  });
});

// get pending posts
app.get("/pendingPostCount", (req, res) => {
  const q =
    "select count(isPending) as PendingPost from posts where isPending = 1 and isRejected != 1;";
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data[0]);
  });
});

app.get("/pendingPosts", (req, res) => {
  const q =
    "SELECT p.id AS post_id, p.user_id, u.username, p.title,p.img AS post_img,p.isRejected,p.isPending, p.date, c.cat AS category FROM posts AS p JOIN category AS c ON p.cat_id = c.id JOIN users AS u ON u.id = p.user_id JOIN roles AS r ON r.id = u.role_id where p.isPending = 1 and (p.isRejected = 1 or p.isRejected =0)";
  db.query(q, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data);
  });
});

app.put("/approvePost/:id", (req, res) => {
  const postId = req.params.id;
  const q = `update posts set isPending = 0,isActive=1 where id = ${postId}`;
  db.query(q, (err, results) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: "Post has been approved" });
  });
});

app.put("/rejectPost/:id", (req, res) => {
  const postId = req.params.id;

  const getUserIdQuery = `SELECT user_id FROM posts WHERE id = ?`;
  db.query(getUserIdQuery, [postId], (err, postResults) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching post" });
    }

    if (postResults.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = postResults[0].user_id;

    const getRejectCountQuery = `SELECT rejectPostCount FROM users WHERE id = ?`;
    db.query(getRejectCountQuery, [userId], (err, userResults) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching user data" });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      let rejectCount = userResults[0].rejectPostCount;

      if (rejectCount === 0) {
        const updateRejectCountQuery = `UPDATE users SET rejectPostCount = 1 WHERE id = ?`;

        db.query(updateRejectCountQuery, [userId], (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error updating rejectPostCount" });
          }

          const updatePostQuery = `UPDATE posts SET isRejected = 1, isActive = 0 WHERE id = ?`;

          db.query(updatePostQuery, [postId], (err) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error updating post status" });
            }

            res.json({ message: "Post has been rejected" });
          });
        });
      } else if (rejectCount === 1) {
        const updateRejectCountQuery = `UPDATE users SET rejectPostCount = 2 WHERE id = ?`;

        db.query(updateRejectCountQuery, [userId], (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error updating rejectPostCount" });
          }

          const updatePostQuery = `UPDATE posts SET isRejected = 1, isActive = 0 WHERE id = ?`;

          db.query(updatePostQuery, [postId], (err) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error updating post status" });
            }

            res.json({ message: "Post has been rejected" });
          });
        });
      } else if (rejectCount === 2) {
        const updateRejectCountQuery = `UPDATE users SET rejectPostCount = 3 WHERE id = ?`;

        db.query(updateRejectCountQuery, [userId], (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error updating rejectPostCount" });
          }

          const updatePostQuery = `UPDATE posts SET isRejected = 1, isActive = 0 WHERE id = ?`;

          db.query(updatePostQuery, [postId], (err) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error updating post status" });
            }
            res.json({ message: "Post has been rejected" });
          });
        });
      } else {
        const updateRejectCountQuery = `UPDATE users SET isActive = 0 WHERE id = ?`;

        db.query(updateRejectCountQuery, [userId], (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error updating rejectPostCount" });
          }

          const updatePostQuery = `UPDATE posts SET isRejected = 1, isActive = 0 WHERE id = ?`;

          db.query(updatePostQuery, [postId], (err) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error updating post status" });
            }
            res.json({ message: "Post has been rejected" });
          });
        });
      }
    });
  });
});

// =========  port
app.listen(3000, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server running");
  }
});
