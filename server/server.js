const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
var sha1 = require("js-sha1");
var uuid = require("react-uuid");
const fs = require("fs");

const port = "8081";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 10000 * 60 * 60 * 24,
    },
  })
);

const currentDay = new Date().getDate();
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

app.listen(port, () => {
  console.log(
    `Server running on port ${port} - ${currentDay}/${currentMonth}/${currentYear}`
  );
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "blog",
});

//TODO: Repository

// User avatar
const avatarDir = path.join(__dirname, "../client/public/avatars");
const storageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuid()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});
const uploadAvatar = multer({
  storage: storageAvatar,
});

// Blogs images
const blogDir = path.join(__dirname, "../client/public/blogs");
const storageBlog = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, blogDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuid()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});
const uploadBlog = multer({
  storage: storageBlog,
  dest: storageBlog,
});

// TODO: API

// REGISTER
app.post("/register", uploadAvatar.single("file"), (req, res) => {
  const u = JSON.parse(req.body.user);
  const file = req.file.filename;

  const checkUsernameSQL = "SELECT id FROM `user` WHERE username = ?";

  db.query(checkUsernameSQL, [u.username], (err, results) => {
    if (err) {
      fs.unlink(path.join(avatarDir, file), (unlinkErr) => {
        if (unlinkErr) console.log(unlinkErr);
        return res.send(err);
      });
    } else if (results.length > 0) {
      fs.unlink(path.join(avatarDir, file), (unlinkErr) => {
        if (unlinkErr) console.log(unlinkErr);
        console.log("Username already exists");
        return res.status(400).json({ error: "Username already exists" });
      });
    } else {
      const message = "User successfully created: " + u.username;

      const SQL =
        "INSERT INTO `user` (firstname, lastname, username, avatar, email, password, role) VALUES (?,?,?,?,?,?, 'user')";
      const Values = [
        u.firstname,
        u.lastname,
        u.username,
        file,
        u.email,
        sha1(u.password),
      ];

      console.log(Values);

      db.query(SQL, Values, (err, results) => {
        if (err) return res.send(err);
        console.log(message);
        return res.json({ message: message });
      });
    }
  });
});
// END REGISTER

// LOGIN
app.get("/api/user/:id", (req, res) => {
  const sql = `SELECT id, firstname, lastname, username, avatar, detail, email, role FROM user WHERE id = ?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur:",
        err
      );
      return;
    }
    if (result.length === 0) {
      console.log("Aucun utilisateur trouvé !");
      return;
    }

    res.json({ result });
  });
});
app.get("/user", (req, res) => {
  if (req.cookies.connectId) {
    const sql = `SELECT id FROM user WHERE username = '${req.cookies.connectId}'`;
    db.query(sql, (err, result) => {
      return res.json({
        valid: true,
        id: result[0].id,
      });
    });
  } else {
    return res.json({ valid: false });
  }
});
app.post("/login", (req, res) => {
  const u = req.body;

  const SQL =
    "SELECT username FROM `user` WHERE (username = ? OR email = ?) AND password = ?";
  const Values = [u.username_email, u.username_email, sha1(u.password)];

  db.query(SQL, Values, (err, result) => {
    if (err) return res.json({ Message: err });
    if (result.length > 0) {
      res.cookie("connectId", result[0].username, {
        maxAge: 10000 * 60 * 60 * 24,
        httpOnly: false,
      });
      console.log("User successfully logged in: " + result[0].username);
      return res.json({ Login: true, username: req.cookies.connectId });
    } else {
      console.log("Wrong username or password");
      return res.json({ Login: false });
    }
  });
});
// END LOGIN

// REQ
app.get("/reqcateg", (req, res) => {
  const SQL = `SELECT * FROM category`;

  db.query(SQL, (errCateg, categs) => {
    if (errCateg) return res.json(errCateg);

    return res.json(categs);
  });
});
app.get("/reqblog/:user", (req, res) => {
  const user = req.params.user;
  const searchBy = req.query.search;
  const sortBy = req.query.sortBy;

  let SQL =
    "SELECT b.*, u.username, u.id as idUser, u.avatar, c.name as category FROM blog b JOIN user u ON u.id = b.idUser JOIN category c ON c.id = b.idCategory WHERE b.idUser = ?";
  if (searchBy && searchBy != "") {
    SQL += `AND b.title LIKE "%${searchBy}%" OR b.tag LIKE "%${searchBy}%" OR b.title LIKE "${searchBy}%" OR b.tag LIKE "${searchBy}%" OR b.title LIKE "%${searchBy}" OR b.tag LIKE "%${searchBy} "`;
  }

  switch (sortBy) {
    case "date":
      SQL += "ORDER BY releaseDate DESC";
      break;
    case "dateinv":
      SQL += "ORDER BY releaseDate ASC";
      break;

    case "categ":
      SQL += "ORDER BY b.idCategory DESC";
      break;
    case "categinv":
      SQL += "ORDER BY b.idCategory ASC";
      break;

    default:
      SQL += "ORDER BY releaseDate DESC";
      break;
  }

  const SQLimg = `SELECT idBlog, name FROM blogimg bi JOIN blog b ON b.id = bi.idBlog`;

  db.query(SQL, [user], (errBlogs, blogs) => {
    db.query(SQLimg, (errImage, blogsImages) => {
      if (errBlogs) return res.json(errBlogs);
      if (errImage) return res.json(errImage);

      const result = {
        blogs: blogs,
        blogsImages: blogsImages,
      };
      return res.json(result);
    });
  });
});
app.get("/reqlike/:user", (req, res) => {
  const user = req.params.user;
  const SQL = `SELECT idUser, idBlog FROM liked WHERE idUser = ?`;

  db.query(SQL, [user], (errLike, likes) => {
    if (errLike) return res.json(errLike);

    return res.json(likes);
  });
});
app.get("/reqfollow/:user", (req, res) => {
  const user = req.params.user;
  const SQL = `SELECT idFollower, idFollowed FROM follow WHERE idFollower = ?`;
  const SQLnbIF = `SELECT COUNT(*) as nbIF FROM follow WHERE idFollower = ? `;
  const SQLnbFM = `SELECT COUNT(*) as nbFM FROM follow WHERE idFollowed = ? `;

  db.query(SQL, [user], (errFollow, follow) => {
    db.query(SQLnbIF, [user], (errIF, IF) => {
      db.query(SQLnbFM, [user], (errFM, FM) => {
        if (errFollow) return res.json(errFollow);
        if (errIF) return res.send(errIF);
        if (errFM) return res.send(errFM);

        const result = {
          follow: follow,
          IF: IF[0].nbIF,
          FM: FM[0].nbFM,
        };
        return res.json(result);
      });
    });
  });
});
app.get("/reqimg/:blog", (req, res) => {
  const blogId = req.params.blog;
  const SQL = "SELECT name FROM blogimg WHERE idBlog = ?";
  db.query(SQL, [blogId], (err, result) => {
    if (err) return res.json(errBlogs);
    return res.json(result);
  });
});
// REQ

// HOME
app.get("/home", (req, res) => {
  const searchBy = req.query.search;
  const sortBy = req.query.sortBy;

  let SQL =
    "SELECT b.*, u.username, u.id as idUser, u.avatar, c.name as category FROM blog b JOIN user u ON u.id = b.idUser JOIN category c ON c.id = b.idCategory ";
  if (searchBy && searchBy != "") {
    SQL += `WHERE b.title LIKE "%${searchBy}%" OR b.tag LIKE "%${searchBy}%" OR b.title LIKE "${searchBy}%" OR b.tag LIKE "${searchBy}%" OR b.title LIKE "%${searchBy}" OR b.tag LIKE "%${searchBy} "`;
  }

  switch (sortBy) {
    case "date":
      SQL += "ORDER BY releaseDate DESC";
      break;
    case "dateinv":
      SQL += "ORDER BY releaseDate ASC";
      break;

    case "categ":
      SQL += "ORDER BY b.idCategory DESC";
      break;
    case "categinv":
      SQL += "ORDER BY b.idCategory ASC";
      break;

    default:
      SQL += "ORDER BY releaseDate DESC";
      break;
  }

  const SQLimg = `SELECT idBlog, name FROM blogimg bi JOIN blog b ON b.id = bi.idBlog`;

  db.query(SQL, (errBlogs, blogs) => {
    db.query(SQLimg, (errImage, blogsImages) => {
      if (errBlogs) return res.json(errBlogs);
      if (errImage) return res.json(errImage);

      const result = {
        blogs: blogs,
        blogsImages: blogsImages,
      };
      return res.json(result);
    });
  });
});
app.get("/follow", (req, res) => {
  const user = req.query.currentuser;
  const searchBy = req.query.search;
  const sortBy = req.query.sortBy;

  let SQL = `SELECT b.*, u.username, u.id as idUser, u.avatar, c.name as category FROM blog b JOIN user u ON u.id = b.idUser JOIN category c ON c.id = b.idCategory JOIN follow f ON b.idUser = f.idFollowed WHERE f.idFollower = ${user} `;
  if (searchBy && searchBy != "") {
    SQL += `AND b.title LIKE "%${searchBy}%" OR b.tag LIKE "%${searchBy}%" OR b.title LIKE "${searchBy}%" OR b.tag LIKE "${searchBy}%" OR b.title LIKE "%${searchBy}" OR b.tag LIKE "%${searchBy} "`;
  }

  switch (sortBy) {
    case "date":
      SQL += "ORDER BY releaseDate DESC";
      break;
    case "dateinv":
      SQL += "ORDER BY releaseDate ASC";
      break;

    case "categ":
      SQL += "ORDER BY b.idCategory DESC";
      break;
    case "categinv":
      SQL += "ORDER BY b.idCategory ASC";
      break;

    default:
      SQL += "ORDER BY releaseDate DESC";
      break;
  }

  const SQLimg = `SELECT idBlog, name FROM blogimg bi JOIN blog b ON b.id = bi.idBlog`;

  db.query(SQL, (errBlogs, blogs) => {
    db.query(SQLimg, (errImage, blogsImages) => {
      if (errBlogs) return res.json(errBlogs);
      if (errImage) return res.json(errImage);

      const result = {
        blogs: blogs,
        blogsImages: blogsImages,
      };
      return res.json(result);
    });
  });
});
// END HOME

// BLOG PAGE
app.get("/blog/:id", (req, res) => {
  const id = req.params.id;
  const SQL = `SELECT b.*, u.username, u.id as idUser, u.avatar, c.name as category from blog b JOIN category C ON C.id = b.idCategory JOIN user u ON u.id = b.idUser WHERE b.id = ${id}`;
  const SQLimg = `SELECT * FROM blogimg WHERE idBlog = ${id}`;
  const SQLcomment = `SELECT C.*, U.username from blog b
  INNER JOIN comment C on C.idBlog = b.id
  INNER JOIN user U on U.id = C.idUser
  WHERE b.id = ${id}`;

  db.query(SQL, (errProd, blogDetail) => {
    db.query(SQLimg, (errImage, blogImage) => {
      db.query(SQLcomment, (errComment, blogComment) => {
        if (errProd) return res.json(errProd);
        if (errImage) return res.json(errImage);
        if (errComment) return res.json(errComment);

        const result = {
          blogDetail: blogDetail,
          blogImage: blogImage,
          blogComment: blogComment,
        };
        return res.json(result);
      });
    });
  });
});
app.post("/like/:user/:blog", (req, res) => {
  const Values = [req.params.user, req.params.blog];
  const SQLverif = `SELECT * FROM liked WHERE idUser = ? AND idblog = ?`;

  let SQL;
  let message = "Like successfully ";

  db.query(SQLverif, Values, (err, results) => {
    if (err) return res.send(err);

    if (results.length > 0) {
      SQL = "DELETE FROM `liked` WHERE idUser = ? AND idblog = ?";
      message += "removed !";
    } else {
      SQL =
        "INSERT INTO `liked` (`id`, `idUser`, `idblog`) VALUES (NULL, ?, ?)";
      message += "added !";
    }

    db.query(SQL, Values, (err, result) => {
      if (err) return res.send(err);

      console.log(message);
      return res.json(message);
    });
  });
});
app.post("/newcomment", (req, res) => {
  const comment = req.body;

  const SQL =
    "INSERT INTO `comment` (`id`, `text`, `idUser`, `idblog`) VALUES (NULL, ?, ?, ?)";
  const Values = [comment.text, comment.idUser, comment.idBlog];
  const message = "Comment successfully added !";

  db.query(SQL, Values, (err, results) => {
    if (err) return res.send(err);
    console.log(message);
    return res.json(message);
  });
});
app.delete("/comment/:id", (req, res) => {
  const id = req.params.id;

  const SQL = "DELETE FROM `comment` WHERE id = ?";
  const message = "Comment successfully removed !";

  db.query(SQL, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }

    if (results.affectedRows === 0) {
      console.log("No comment found with the provided ID.");
      return res
        .status(404)
        .json({ error: "No comment found with the provided ID." });
    }

    console.log(message);
    return res.json({ message });
  });
});
// END BLOG PAGE

// CATEGORY PAGE
app.get("/category/:categoryName", (req, res) => {
  const categoryName = req.params.categoryName;
  const searchBy = req.query.search;
  const sortBy = req.query.sortBy;

  let SQL = `SELECT b.*, u.username, u.id as idUser, u.avatar, c.name as category  FROM blog b JOIN category c ON c.id = b.idCategory JOIN user u ON u.id = b.idUser WHERE c.name = '${categoryName}' `;
  if (searchBy && searchBy != "") {
    SQL += `AND (b.title LIKE "%${searchBy}%" OR b.tag LIKE "%${searchBy}%" OR b.title LIKE "${searchBy}%" OR b.tag LIKE "${searchBy}%" OR b.title LIKE "%${searchBy}" OR b.tag LIKE "%${searchBy} ")`;
  }

  switch (sortBy) {
    case "date":
      SQL += "ORDER BY releaseDate DESC";
      break;
    case "dateinv":
      SQL += "ORDER BY releaseDate ASC";
      break;

    case "categ":
      SQL += "ORDER BY b.idCategory DESC";
      break;
    case "categinv":
      SQL += "ORDER BY b.idCategory ASC";
      break;

    default:
      SQL += "ORDER BY releaseDate DESC";
      break;
  }

  const SQLimg = `SELECT idBlog, name FROM blogimg bi JOIN blog b ON b.id = bi.idBlog`;

  db.query(SQL, (errBlogs, blogs) => {
    db.query(SQLimg, (errImage, blogsImages) => {
      if (errBlogs) return res.json(errBlogs);
      if (errImage) return res.json(errImage);

      const result = {
        blogs: blogs,
        blogsImages: blogsImages,
      };
      return res.json(result);
    });
  });
});
// END CATEGORY PAGE

// FOLLOWERS PAGE
app.get("/followers", (req, res) => {
  const user = req.query.currentuser;

  const SQLiFollow = `SELECT u.id, u.username, u.avatar FROM user u JOIN follow f ON f.idFollowed = u.id WHERE f.idFollower = ?`;
  const SQLfollowMe = `SELECT u.id, u.username, u.avatar FROM user u JOIN follow f ON f.idFollower = u.id WHERE f.idFollowed = ?`;

  db.query(SQLiFollow, [user], (errIF, IF) => {
    db.query(SQLfollowMe, [user], (errFM, FM) => {
      if (errIF) return res.json(errIF);
      if (errFM) return res.json(errFM);

      const result = {
        IF: IF,
        FM: FM,
      };
      return res.json(result);
    });
  });
});
// END FOLLOWERS PAGE

// LIKE PAGE
app.get("/like", (req, res) => {
  const user = req.query.currentuser;
  const searchBy = req.query.search;
  const sortBy = req.query.sortBy;

  let SQL = `SELECT b.*, u.username, u.id as idUser, u.avatar, c.name as category FROM blog b JOIN user u ON u.id = b.idUser JOIN category c ON c.id = b.idCategory JOIN liked l ON b.id = l.idBlog WHERE l.idUser = ${user} `;
  if (searchBy && searchBy != "") {
    SQL += `AND (b.title LIKE "%${searchBy}%" OR b.tag LIKE "%${searchBy}%" OR b.title LIKE "${searchBy}%" OR b.tag LIKE "${searchBy}%" OR b.title LIKE "%${searchBy}" OR b.tag LIKE "%${searchBy} ")`;
  }

  switch (sortBy) {
    case "date":
      SQL += "ORDER BY releaseDate DESC";
      break;
    case "dateinv":
      SQL += "ORDER BY releaseDate ASC";
      break;

    case "categ":
      SQL += "ORDER BY b.idCategory DESC";
      break;
    case "categinv":
      SQL += "ORDER BY b.idCategory ASC";
      break;

    default:
      SQL += "ORDER BY releaseDate DESC";
      break;
  }

  const SQLimg = `SELECT idBlog, name FROM blogimg bi JOIN blog b ON b.id = bi.idBlog`;

  db.query(SQL, (errBlogs, blogs) => {
    db.query(SQLimg, (errImage, blogsImages) => {
      if (errBlogs) return res.json(errBlogs);
      if (errImage) return res.json(errImage);

      const result = {
        blogs: blogs,
        blogsImages: blogsImages,
      };
      return res.json(result);
    });
  });
});
// END LIKE PAGE

// ADD BLOG
app.post("/addblog", uploadBlog.array("image", 5), (req, res) => {
  const b = JSON.parse(req.body.newBlog);
  const date = req.body.date;
  const files = req.files;

  const SQLBlogs =
    "INSERT INTO `blog` (`id`, `title`, `text`, `idUser`, `tag`, `releaseDate`, `idCategory`) VALUES (NULL, ?, ?, ?, ?, ?, ?)";
  const ValuesBlog = [b.title, b.text, b.idUser, b.tag, date, b.idCategory];

  db.query(SQLBlogs, ValuesBlog, (err, results) => {
    if (err) {
      console.error("Error creating blog:", err);
      return res.status(500).send("An error occurred while creating the blog.");
    }

    const blogId = results.insertId;

    const SQLImage = "INSERT INTO `blogimg` (`id`, `idBlog`, `name`) VALUES ?";
    let ValuesImage = [];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        ValuesImage.push([null, blogId, files[i].filename]);
      }

      db.query(SQLImage, [ValuesImage], (err, results) => {
        if (err) {
          console.error("Error inserting images:", err);
          return res
            .status(500)
            .send("An error occurred while inserting images.");
        }
        console.log("Blog successfully created with images!");
        return res.status(200).send("Blog successfully created with images!");
      });
    } else {
      console.log("No files uploaded.");
      return res.status(400).send("No files uploaded.");
    }
  });
});

// END ADD BLOG

// EDIT
app.get("/edit/:user", (req, res) => {
  const user = req.params.user;
  const SQL = `SELECT b.*, u.username, u.id as idUser, u.avatar, c.name as category FROM blog b JOIN user u ON u.id = b.idUser JOIN category c ON c.id = b.idCategory WHERE b.idUser = ? ORDER BY b.id DESC`;
  const SQLimg = `SELECT idBlog, name FROM blogimg bi JOIN blog b ON b.id = bi.idBlog JOIN user u ON u.id = b.idUser WHERE b.idUser = ?`;

  db.query(SQL, [user], (errBlogs, myblogs) => {
    db.query(SQLimg, [user], (errImage, myblogsImages) => {
      if (errBlogs) return res.json(errBlogs);
      if (errImage) return res.json(errImage);

      const result = {
        myblogs: myblogs,
        myblogsImages: myblogsImages,
      };
      return res.json(result);
    });
  });
});
app.delete("/blog/:id", (req, res) => {
  const id = req.params.id;

  const SQL = "DELETE FROM `blog` WHERE id = ?";
  const message = "Prod successfully removed !";

  db.query(SQL, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }

    if (results.affectedRows === 0) {
      console.log("No blog found with the provided ID.");
      return res
        .status(404)
        .json({ error: "No blog found with the provided ID." });
    }

    console.log(message);
    return res.json({ message });
  });
});
app.get("/editblog", (req, res) => {
  const blog = req.query.blog;
  const SQL = `SELECT b.*, u.username, u.id as idUser, u.avatar, c.name as category FROM blog b JOIN user u ON u.id = b.idUser JOIN category c ON c.id = b.idCategory WHERE b.id = ?`;

  db.query(SQL, [blog], (errBlogs, myblog) => {
    if (errBlogs) return res.json(errBlogs);

    const result = {
      myblogs: myblog,
    };
    return res.json(result);
  });
});
// EDIT BLOG
app.post("/updateblog/:id", uploadBlog.array("image", 5), async (req, res) => {
  const id = req.params.id;
  const b = JSON.parse(req.body.newBlog);
  const imgDel = req.body.imgDel ? JSON.parse(req.body.imgDel) : null;
  const files = req.files ? req.files : null;

  if (b) {
    const SQLBlogs =
      "UPDATE blog SET title = ?, text = ?, tag = ?, idCategory = ? WHERE blog.id = ?";
    const ValuesBlog = [b.title, b.text, b.tag, b.idCategory, id];

    db.query(SQLBlogs, ValuesBlog, (err, results) => {
      if (err) console.error(err);
      console.log(`Blog ${id} is updated`);
    });
  } else {
    console.log("Error in updating blog");
  }

  const sqlAdd = (e) => {
    const SQL =
      "INSERT INTO `blogimg` (`id`, `idBlog`, `name`) VALUES (null, ?, ?)";
    const Values = [id, e];
    db.query(SQL, Values, (err, results) => {
      if (err) console.error(err);
      console.log(`Image ${e} of blog ${id} is added`);
    });
  };

  const sqlDelete = (e) => {
    const SQL = "DELETE FROM `blogimg` WHERE idBlog = ? AND name= ?";
    const Values = [id, e];
    db.query(SQL, Values, (err, results) => {
      if (err) console.error(err);
      fs.unlink(path.join(blogDir, e), (unlinkErr) => {
        if (unlinkErr) console.log(unlinkErr);
      });
      console.log(`Image ${e} of blog ${id} is deleted`);
    });
  };

  if (files[0]) {
    sqlAdd(files[0].filename);

    if (imgDel[0]) {
      sqlDelete(imgDel[0]);
    }
  }

  if (files[1]) {
    sqlAdd(files[1].filename);

    if (imgDel[1]) {
      sqlDelete(imgDel[1]);
    }
  }

  if (files[2]) {
    sqlAdd(files[2].filename);

    if (imgDel[2]) {
      sqlDelete(imgDel[2]);
    }
  }

  if (files[3]) {
    sqlAdd(files[3].filename);

    if (imgDel[3]) {
      sqlDelete(imgDel[3]);
    }
  }

  if (files[4]) {
    sqlAdd(files[4].filename);

    if (imgDel[4]) {
      sqlDelete(imgDel[4]);
    }
  }
});
// END EDIT BLOG
// END EDIT

// U PAGE
app.get("/u/:id", (req, res) => {
  const user = req.params.id;

  const SQL = `SELECT id, firstname, lastname, username, email, detail, role, avatar FROM user WHERE id = ?`;
  const SQLnbBlog = `SELECT COUNT(*) as nb FROM blog WHERE idUser = ?`;

  db.query(SQL, [user], (errVisit, userVisit) => {
    db.query(SQLnbBlog, [user], (errNbBlogVisit, nbBlogVisit) => {
      if (errVisit) return res.json(errVisit);
      if (errNbBlogVisit) return res.json(errNbBlogVisit);

      const results = {
        userVisit: userVisit[0],
        nbBlogVisit: nbBlogVisit[0].nb,
      };

      if (userVisit.length != 1)
        return res.json({
          userVisit: {
            id: 0,
          },
        });

      return res.json(results);
    });
  });
});
app.post("/follow/:user/:followed", (req, res) => {
  const Values = [req.params.user, req.params.followed];
  const SQLverif = `SELECT * FROM follow WHERE idFollower = ? AND idFollowed = ?`;

  let SQL;
  let message = "Follow successfully ";

  db.query(SQLverif, Values, (err, results) => {
    if (err) return res.send(err);

    if (results.length > 0) {
      SQL = "DELETE FROM `follow` WHERE idFollower = ? AND idFollowed = ?";
      message += "removed !";
    } else {
      SQL =
        "INSERT INTO `follow` (`id`, `idFollower`, `idFollowed`) VALUES (NULL, ?, ?)";
      message += "added !";
    }

    db.query(SQL, Values, (err, result) => {
      if (err) return res.send(err);

      console.log(message);
      return res.json(message);
    });
  });
});
app.post("/updateuser", uploadAvatar.single("file"), (req, res) => {
  const u = JSON.parse(req.body.newUser);
  const file = req.file ? req.file.filename : null;

  const checkUsernameSQL = "SELECT id, avatar FROM `user` WHERE username = ?";

  db.query(checkUsernameSQL, [u.username], (err, results) => {
    if (err) {
      if (file) {
        fs.unlink(path.join(avatarDir, file), (unlinkErr) => {
          if (unlinkErr) console.log(unlinkErr);
        });
      }
      return res.send(err);
    } else if (results.length > 1 && results[0].id != u.id) {
      if (file) {
        fs.unlink(path.join(avatarDir, file), (unlinkErr) => {
          if (unlinkErr) console.log(unlinkErr);
        });
      }
      console.log("Username already exists");
      return res.status(400).json({ error: "Username already exists" });
    } else {
      const oldAvatar = results.length > 0 ? results[0].avatar : null;
      const message = "User successfully updated: " + u.username;

      let SQL =
        "UPDATE `user` SET `firstname` = ?, `lastname` = ?, `username` = ?, `detail` = ?, `email` = ?";
      let Values = [u.firstname, u.lastname, u.username, u.detail, u.email];

      if (file) {
        SQL += ", `avatar` = ?";
        Values.push(file);
      }

      SQL += " WHERE `user`.`id` = ?";
      Values.push(u.id);

      db.query(SQL, Values, (err, results) => {
        if (err) {
          if (file) {
            fs.unlink(path.join(avatarDir, file), (unlinkErr) => {
              if (unlinkErr) console.log(unlinkErr);
            });
          }
          return res.send(err);
        }

        if (oldAvatar && file) {
          fs.unlink(path.join(avatarDir, oldAvatar), (unlinkErr) => {
            if (unlinkErr) console.log(unlinkErr);
          });
        }

        console.log(message);
        return res.json({ message: message });
      });
    }
  });
});

// END U PAGE
