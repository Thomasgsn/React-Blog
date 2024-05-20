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

// TODO: Connection

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

app.get("/shop", (req, res) => {
  const SQLPlaylist =
    "SELECT tb.id AS id, tb.name AS name, p.id AS prod_id, p.name AS prod_name, p.cover FROM typebeat tb JOIN prod p ON tb.id = p.idTb JOIN (SELECT idTb, MAX(releaseDate) AS maxReleaseDate FROM prod WHERE releaseDate IS NOT NULL GROUP BY idTb) latest_prod ON p.idTb = latest_prod.idTb AND p.releaseDate = latest_prod.maxReleaseDate WHERE p.releaseDate IS NOT NULL;";
  const SQLprod = `SELECT p.*, tb.name as typebeat FROM prod p INNER JOIN typebeat tb ON p.idTb = tb.id ORDER BY id DESC`;
  const SQLnbProd = `SELECT COUNT(*) as nb FROM PROD`;
  const SQLnbPlaylist = `SELECT COUNT(*) as nb FROM typebeat`;

  db.query(SQLPlaylist, (errPlaylist, dataPlaylist) => {
    db.query(SQLprod, (errPlaylistProd, dataPlaylistProd) => {
      db.query(SQLnbProd, (errnbProd, datanbProd) => {
        db.query(SQLnbPlaylist, (errnbPlaylist, datanbPlaylist) => {
          if (errPlaylist) return res.json(errPlaylist);
          if (errPlaylistProd) return res.json(errPlaylistProd);
          if (errnbProd) return res.json(errnbProd);
          if (errnbPlaylist) return res.json(errnbPlaylist);

          const data = {
            playlist: dataPlaylist,
            playlistProd: dataPlaylistProd,
            nbProd: datanbProd,
            nbPlaylist: datanbPlaylist,
          };
          return res.json(data);
        });
      });
    });
  });
});

app.get("/prods", (req, res) => {
  const filterBy = req.query.filterBy;
  const searchBy = req.query.searchBy;
  const priceRange = req.query.priceRange;
  let price = priceRange.split("-");

  let SQLprods = `SELECT * FROM prod WHERE price BETWEEN ${price[0]} AND ${price[1]}`;

  if (searchBy && searchBy != "") {
    SQLprods += ` AND (name LIKE "%${searchBy}%" OR tag LIKE "%${searchBy}%" OR name LIKE "${searchBy}%" OR tag LIKE "${searchBy}%" OR name LIKE "%${searchBy}" OR tag LIKE "%${searchBy}")`;
  }

  switch (filterBy) {
    case "price":
      SQLprods += " ORDER BY price ASC";
      break;

    case "priceinv":
      SQLprods += " ORDER BY price DESC";
      break;

    case "date":
      SQLprods += " ORDER BY releaseDate DESC";
      break;

    case "dateinv":
      SQLprods += " ORDER BY releaseDate ASC";
      break;

    case "type":
      SQLprods += " ORDER BY idTB ASC";
      break;

    case "typeinv":
      SQLprods += " ORDER BY idTB DESC";
      break;

    default:
      break;
  }

  db.query(SQLprods, (errProds, dataProds) => {
    if (errProds) {
      console.error("Erreur lors de la récupération des produits :", errProds);
      return res.status(500).json({
        error: "Une erreur est survenue lors de la récupération des produits.",
      });
    }

    res.json(dataProds);
  });
});

app.get("/recommendations", (req, res) => {
  const filterBy = req.query.filterBy;
  const searchBy = req.query.searchBy;

  let SQLartistReco =
    "SELECT ra.*, COUNT(r.idArtist) AS nb_r FROM recommendation r JOIN recommendation_artist ra ON r.idArtist = ra.id ";

  if (searchBy && searchBy != "") {
    SQLartistReco += ` WHERE (ra.name LIKE "%${searchBy}%" OR ra.name LIKE "${searchBy}%" OR ra.name LIKE "%${searchBy}")`;
  }

  SQLartistReco += " GROUP BY ra.name";

  switch (filterBy) {
    case "nbReco":
      SQLartistReco += " ORDER BY nb_r DESC";
      break;

    case "nbRecoinv":
      SQLartistReco += " ORDER BY nb_r ASC";
      break;

    case "date":
      SQLartistReco += " ORDER BY r.id DESC";
      break;

    case "dateinv":
      SQLartistReco += " ORDER BY r.id ASC";
      break;

    case "name":
      SQLartistReco += " ORDER BY ra.name ASC";
      break;

    case "nameinv":
      SQLartistReco += " ORDER BY ra.name DESC";
      break;

    case "ida":
      SQLartistReco += " ORDER BY ra.id ASC";
      break;

    default:
      SQLartistReco += " ORDER BY r.id ASC";
      break;
  }

  db.query(SQLartistReco, (errArtistReco, dataArtistReco) => {
    if (errArtistReco) return res.json(errArtistReco);

    return res.json(dataArtistReco);
  });
});

app.get("/r/:id", (req, res) => {
  const id = req.params.id;

  const SQL = `SELECT song, genre, beatmaker, ytLink, spotifyLink FROM recommendation_artist ra INNER JOIN recommendation r ON r.idArtist = ra.id WHERE r.idArtist = ${id} order by r.id DESC`;
  const SQLname = `SELECT name FROM recommendation_artist ra WHERE ra.id = ${id}`;

  db.query(SQLname, (errRecoName, recoName) => {
    db.query(SQL, (errReco, recom) => {
      if (errRecoName) return res.json(errRecoName);
      if (errReco) return res.json(errReco);

      const result = {
        recoName: recoName,
        recom: recom,
      };

      res.json(result);
    });
  });
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;

  const SQL = `SELECT id, username, email, detail, role FROM user WHERE id = ${id}`;

  db.query(SQL, (errVisit, userVisit) => {
    if (errVisit) return res.json(errVisit);

    res.json(userVisit);
  });
});

// assets
app.get("/recovignette", (req, res) => {
  const SQLartistReco =
    "SELECT DISTINCT recommendation_artist.* FROM recommendation JOIN recommendation_artist ON recommendation.idArtist = recommendation_artist.id ORDER BY recommendation.id DESC LIMIT 5;";
  const SQLnbReco = "SELECT COUNT(*) as nb FROM `recommendation`";
  const SQLnbArtist =
    "SELECT COUNT(*) AS nbArtist FROM `recommendation_artist`";

  db.query(SQLartistReco, (errArtistReco, dataArtistReco) => {
    db.query(SQLnbReco, (errNbReco, dataNbReco) => {
      db.query(SQLnbArtist, (errNbArtist, dataNbArtist) => {
        if (errArtistReco) return res.json(errArtistReco);
        if (errNbReco) return res.json(errNbReco);
        if (errNbArtist) return res.json(errNbArtist);

        const result = {
          artistReco: dataArtistReco,
          nbReco: dataNbReco,
          nbArtist: dataNbArtist,
        };
        return res.json(result);
      });
    });
  });
});

app.get("/statsprod", (req, res) => {
  const SQLprodMonth = `SELECT COUNT(*) as nbProdMounth from prod WHERE MONTH(releaseDate) = ${currentMonth}`;
  const SQLprodTotal = "SELECT COUNT(*) as nbProd from `prod`";

  db.query(SQLprodMonth, (errProdMonth, dataProdMonth) => {
    db.query(SQLprodTotal, (errProdTotal, dataProdTotal) => {
      if (errProdMonth) return res.json(errProdMonth);
      if (errProdTotal) return res.json(errProdTotal);

      const result = {
        prodTotal: dataProdTotal,
        prodMonth: dataProdMonth,
      };
      return res.json(result);
    });
  });
});

app.get("/activities", (req, res) => {
  const SQL = `SELECT * FROM activity ORDER BY id DESC LIMIT 7`;

  db.query(SQL, (errSQL, data) => {
    if (errSQL) return res.json(errSQL);

    return res.json(data);
  });
});

// FIXME: Audio Player
app.get("/audioplayer/:id", (req, res) => {
  const id = req.params.id;
  const SQLplayer = `SELECT p.name, p.id, p.cover, p.prodFile, p.tag, T.name AS typebeat FROM prod P INNER JOIN typebeat T ON T.id = p.idTB ORDER BY CASE WHEN p.id = ${id} THEN 0 ELSE 1 END, id DESC;`;

  db.query(SQLplayer, (errPlayer, dataPlayer) => {
    if (errPlayer) return res.json(errPlayer);

    return res.json(dataPlayer);
  });
});

// TODO: for prod upload
const prodsDirectory = path.join(__dirname, "../client/public/prods");
const storageProds = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, prodsDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadNewProd = multer({ storage: storageProds });

// TODO: for reco upload
const recoDirectory = path.join(__dirname, "../client/public/recommendations");
const storageReco = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, recoDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadNewReco = multer({ storage: storageReco });

// TODO: Edit User
app.post("/editu", (req, res) => {
  const newUsername = req.body.Username;
  const newDetail = req.body.Detail;
  const id = req.body.Id;

  const SQL =
    "UPDATE `user` SET `username` = ?, `detail` = ?, WHERE `user`.`id` = ?";
  const Values = [newUsername, newDetail, id];

  res.cookie("connectId", newUsername, {
    maxAge: 900000,
    httpOnly: true,
  });

  db.query(SQL, Values, (err, results) => {
    if (err) return res.send(err);
    return res.send({ Message: "User updated!" });
  });
});

// TODO: Prods
app.get("/allprods", (req, res) => {
  const id = req.query.id;

  let SQL =
    "SELECT p.*, t.name as TypeBeatName FROM prod p INNER JOIN typebeat t ON t.id = p.idTB ";

  if (id && id != 0) SQL += `WHERE p.id = ${id} `;

  SQL += "ORDER BY p.id ASC;";

  db.query(SQL, (err, data) => {
    if (err) return res.json(err);

    return res.json(data);
  });
});

const uploadhh = multer({});

//TODO: FINI

// REGISTER
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
        "INSERT INTO `user` (firstname, lastname, username, avatar, email, password) VALUES (?,?,?,?,?,?)";
      const Values = [
        u.firstname,
        u.lastname,
        u.username,
        file,
        u.email,
        u.password,
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
app.get("/reqlike/:user", (req, res) => {
  const user = req.params.user;
  const SQL = `SELECT idUser, idBlog FROM liked WHERE idUser = ?`;

  db.query(SQL, [user], (errLike, likes) => {
    if (errLike) return res.json(errLike);

    return res.json(likes);
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
      console.log("No prod found with the provided ID.");
      return res
        .status(404)
        .json({ error: "No prod found with the provided ID." });
    }

    console.log(message);
    return res.json({ message });
  });
});
app.get("/editblog", (req, res) => {
  const blog = req.query.blog;
  const SQL = `SELECT b.*, u.username, u.id as idUser, u.avatar, c.name as category FROM blog b JOIN user u ON u.id = b.idUser JOIN category c ON c.id = b.idCategory WHERE b.id = ?`;

  db.query(SQL, [blog], (errBlogs, myblog) => {
    // db.query(SQLimg, (errImage, blogsImages) => {
    if (errBlogs) return res.json(errBlogs);
    // if (errImage) return res.json(errImage);

    const result = {
      myblogs: myblog,
      // blogsImages: blogsImages,
    };
    return res.json(result);
    // });
  });
});

// EDIT BLOG
app.post("/updateblog/:id", uploadhh.none(), (req, res) => {
  const b = JSON.parse(req.body.newBlog);
  const id = req.params.id;
  // const files = req.files;

  const SQL = `UPDATE blog SET title = ?, text = ?, tag = ?, idCategory = ? WHERE blog.id = ?`;
  const Values = [b.title, b.text, b.tag, b.idCategory, id];
  const message = "Blog successfully updated !";

  db.query(SQL, Values, (err, results) => {
    if (err) return res.send(err);
    console.log(message);
    return res.json(message);
  });
});
// END EDIT BLOG
// END EDIT

// U PAGE
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
// END U PAGE
