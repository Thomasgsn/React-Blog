const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
var sha1 = require("js-sha1");

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
  database: "oftynprod",
});

// TODO: Connection
app.post("/register", (req, res) => {
  const sendEmail = req.body.Mail;
  const sendUsername = req.body.Username;
  const sendPassword = sha1(req.body.Password);

  const SQL = "INSERT INTO `user` (email, username, password) VALUES (?,?,?)";
  const Values = [sendEmail, sendUsername, sendPassword];

  db.query(SQL, Values, (err, results) => {
    if (err) return res.send(err);
    return res.send({ Message: "User added!" });
  });
});

app.post("/login", (req, res) => {
  const sentLoginUsername = req.body.LoginUsername;
  const sentLoginPassword = sha1(req.body.LoginPassword);

  const SQL = "SELECT * FROM `user` WHERE username = ? and password = ?";
  const Values = [sentLoginUsername, sentLoginPassword];

  db.query(SQL, Values, (err, result) => {
    if (err) return res.json({ Message: err });
    if (result.length > 0) {
      res.cookie("connectId", result[0].username, {
        maxAge: 10000 * 60 * 60 * 24,
        httpOnly: false,
      });
      return res.json({ Login: true, username: req.cookies.connectId });
    } else {
      return res.json({ Login: false });
    }
  });
});

app.get("/user", (req, res) => {
  if (req.cookies.connectId) {
    const sql = `SELECT id FROM user WHERE username = '${req.cookies.connectId}'`;
    db.query(sql, (err, result) => {
      return res.json({
        valid: true,
        id: result[0].id !== null ? result[0].id : "",
      });
    });
  } else {
    return res.json({ valid: false });
  }
});

app.get("/api/user/:id", (req, res) => {
  const sql = `SELECT id, username, detail, color, role FROM user WHERE id = ?`;
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

// page
app.get("/home", (req, res) => {
  const SQLPlaylist =
    "SELECT tb.id AS id, tb.name AS name, p.id AS prod_id, p.name AS prod_name, p.cover FROM typebeat tb JOIN prod p ON tb.id = p.idTb JOIN (SELECT idTb, MAX(releaseDate) AS maxReleaseDate FROM prod WHERE releaseDate IS NOT NULL GROUP BY idTb) latest_prod ON p.idTb = latest_prod.idTb AND p.releaseDate = latest_prod.maxReleaseDate WHERE p.releaseDate IS NOT NULL;";

  db.query(SQLPlaylist, (errPlaylist, dataPlaylist) => {
    if (errPlaylist) return res.json(errPlaylist);

    return res.json(dataPlaylist);
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

app.get("/prod/:id", (req, res) => {
  const id = req.params.id;
  const SQL = `SELECT p.name, p.key, p.BPM, p.price, p.releaseDate, p.id, p.cover, p.instrurapLink, T.name AS typebeat from prod p INNER JOIN typebeat T on T.id = p.idTB WHERE p.id = ${id}`;
  const SQLcomment = `SELECT C.*, U.username from prod p
  INNER JOIN comment C on C.idProd = p.id
  INNER JOIN user U on U.id = C.idUser
  WHERE p.id = ${id}`;

  db.query(SQL, (errProd, prodDetail) => {
    db.query(SQLcomment, (errComment, prodComment) => {
      if (errProd) return res.json(errProd);
      if (errComment) return res.json(errComment);

      const result = {
        prodDetail: prodDetail,
        prodComment: prodComment,
      };
      return res.json(result);
    });
  });
});

app.post("/newcomment", (req, res) => {
  const comment = req.body;

  const SQL =
    "INSERT INTO `comment` (`id`, `text`, `idUser`, `idProd`) VALUES (NULL, ?, ?, ?)";
  const Values = [comment.text, comment.idUser, comment.idProd];
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

app.get("/playlists", (req, res) => {
  const searchBy = req.query.searchBy;
  const SQLprod = `SELECT p.* FROM prod p WHERE p.idTB IN (SELECT tb.id FROM typebeat tb) AND p.id IN (SELECT id FROM (SELECT id, idTB, ROW_NUMBER() OVER(PARTITION BY idTB ORDER BY id DESC) AS row_num FROM prod) AS ranked WHERE row_num <= 8) ORDER BY p.idTB, p.id DESC;`;
  const SQLplaylist = `SELECT * FROM typebeat WHERE (name LIKE "%${searchBy}%" OR name LIKE "${searchBy}%" OR name LIKE "%${searchBy}")`;

  db.query(SQLplaylist, (errPlaylist, dataPlaylist) => {
    db.query(SQLprod, (errProd, dataPlaylistProd) => {
      if (errPlaylist) return res.json(errPlaylist);
      if (errProd) return res.json(errProd);

      const result = {
        playlist: dataPlaylist,
        playlistProd: dataPlaylistProd,
      };
      return res.json(result);
    });
  });
});

app.get("/playlist/:playlistName", (req, res) => {
  const playlistName = req.params.playlistName;
  const filterBy = req.query.filterBy;
  const searchBy = req.query.searchBy;
  const priceRange = req.query.priceRange;
  let price = priceRange.split("-");

  let SQL = `SELECT p.* FROM prod p JOIN typebeat ON p.idTB = typebeat.id WHERE typebeat.name = '${playlistName}' AND p.price BETWEEN ${price[0]} AND ${price[1]}`;

  if (searchBy && searchBy != "") {
    SQL += ` AND (p.name LIKE "%${searchBy}%" OR p.tag LIKE "%${searchBy}%" OR p.name LIKE "${searchBy}%" OR p.tag LIKE "${searchBy}%" OR p.name LIKE "%${searchBy}" OR p.tag LIKE "%${searchBy}")`;
  }

  switch (filterBy) {
    case "price":
      SQL += " ORDER BY p.price ASC";
      break;

    case "priceinv":
      SQL += " ORDER BY p.price DESC";
      break;

    case "date":
      SQL += " ORDER BY p.releaseDate DESC";
      break;

    case "dateinv":
      SQL += " ORDER BY p.releaseDate ASC";
      break;

    case "type":
      SQL += " ORDER BY p.idTB ASC";
      break;

    case "typeinv":
      SQL += " ORDER BY p.idTB DESC";
      break;

    default:
      break;
  }

  db.query(SQL, (errPlaylist, playlistProd) => {
    if (errPlaylist) return res.json(errPlaylist);

    res.json(playlistProd);
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

  const SQL = `SELECT id, username, email, detail, color, role FROM user WHERE id = ${id}`;

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
  const newColor = req.body.Color;
  const id = req.body.Id;

  const SQL =
    "UPDATE `user` SET `username` = ?, `detail` = ?, `color` = ? WHERE `user`.`id` = ?";
  const Values = [newUsername, newDetail, newColor, id];

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

app.post(
  "/crudprodtest",
  // uploadhh.fields([
  uploadNewProd.fields([
    {
      name: "cover",
      maxCount: 1,
    },
    {
      name: "audio",
      maxCount: 1,
      dest: "/audio",
    },
  ]),
  (req, res) => {
    const prod = JSON.parse(req.body.newProd);
    const files = req.files;

    let message = "Prod successfully ";
    let SQL;
    let Values;
    if (prod.id === 0) {
      SQL =
        "INSERT INTO `prod` (`id`, `name`, `tag`, `cover`, `prodFile`, `instrurapLink`, `BPM`, `key`, `price`, `releaseDate`, `idTB`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      Values = [
        prod.name,
        prod.tag,
        req.files.cover,
        req.files.audio,
        prod.instrurapLink,
        prod.BPM,
        prod.key,
        prod.price,
        prod.releaseDate,
        prod.idTB,
      ];
      message += "added !";
    } else {
      SQL =
        "UPDATE `prod` SET `name` = ?, `tag` = ?, `instrurapLink` = ?, `BPM` = ?, `key` = ?, `price` = ?, `releaseDate` = ?, `idTB` = ?";
      Values = [
        prod.name,
        prod.tag,
        prod.instrurapLink,
        prod.BPM,
        prod.key,
        prod.price,
        prod.releaseDate,
        prod.idTB,
      ];

      if (files.cover) {
        SQL += ", `cover` = ?";
        Values.push(files.cover[0].originalname);
      }

      if (files.audio) {
        SQL += ", `prodFile` = ?";
        Values.push(files.audio[0].filename);
      }

      SQL += " WHERE `prod`.`id` = ?";
      Values.push(prod.id);
      message += "updated !";
    }

    db.query(SQL, Values, (err, results) => {
      if (err) return res.send(err);
      console.log(message);
      return res.json(message);
    });
  }
);
app.delete("/prod/:id", (req, res) => {
  const id = req.params.id;

  const SQL = "DELETE FROM `prod` WHERE id = ?";
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

// TODO: Type Beat / Playlist
app.get("/alltypebeat", (req, res) => {
  const id = req.query.id;

  let SQL = "SELECT * FROM typebeat tb ";

  if (id && id != 0) SQL += `WHERE tb.id = ${id} `;

  SQL += "ORDER BY tb.id ASC;";

  db.query(SQL, (err, data) => {
    if (err) return res.json(err);

    return res.json(data);
  });
});
app.post("/crudtypebeat", (req, res) => {
  const typebeat = req.body.newTB;

  let message = "Type Beat successfully ";
  let SQL;
  let Values;

  if (typebeat.id === 0) {
    SQL = "INSERT INTO `typebeat` (`id`, `name`) VALUES (NULL, ?)";
    Values = [typebeat.name];
    message += "added !";
  } else {
    SQL = "UPDATE `typebeat` SET `name` = ? WHERE `typebeat`.`id` = ?";
    Values = [typebeat.name, typebeat.id];
    message += "updated !";
  }

  db.query(SQL, Values, (err, results) => {
    if (err) return res.send(err);
    console.log(message);
    return res.json(message);
  });
});
app.delete("/playlist/:id", (req, res) => {
  const id = req.params.id;

  const SQL = "DELETE FROM `typebeat` WHERE id = ?";
  let message;

  const SQLverif = "SELECT * FROM `prod` WHERE idTB = ?";

  db.query(SQLverif, [id], (err, results) => {
    if (results.length > 0) {
      message = "Some production have this Type Beat !";
      console.log(message);
      return res.json({ message });
    } else {
      db.query(SQL, [id], (err, results) => {
        if (err) {
          console.error(err);
          return res.send(err);
        }

        if (results.affectedRows === 0) {
          console.log("No Type Beat found with the provided ID.");
          return res
            .status(404)
            .json({ error: "No Type Beat found with the provided ID." });
        }
        message = "Type Beat successfully removed !";
        console.log("Recommendation successfully removed !");
        return res.json({ message });
      });
    }
  });
});

// TODO: Song Recommendation
app.get("/allreco", (req, res) => {
  const id = req.query.id;

  let SQL =
    "SELECT r.id, r.idArtist, r.song as songName, ra.name as artistName, r.beatmaker, r.ytLink as youtubeID, r.spotifyLink as spotifyID, ra.id as idArtist FROM recommendation r INNER JOIN recommendation_artist ra on r.idArtist = ra.id ";

  if (id && id != 0) SQL += `WHERE r.id = ${id} `;

  SQL += "ORDER BY r.id ASC;";

  db.query(SQL, (err, data) => {
    if (err) return res.json(err);

    return res.json(data);
  });
});
app.post("/crudSongReco", (req, res) => {
  const song = req.body.song;

  let message = "Song Recommendation successfully ";
  let SQL;
  let Values;

  if (song.id === 0) {
    SQL =
      "INSERT INTO `recommendation` (`id`, `idArtist`, `song`, genre, beatmaker, ytLink, spotifyLink) VALUES (NULL, ?, ?, 'RAP', ?, ?, ? )";
    Values = [
      song.idArtist,
      song.songName,
      song.beatmaker,
      song.youtubeID,
      song.spotifyID,
    ];
    message += "added !";
  } else {
    SQL =
      "UPDATE `recommendation` SET `idArtist` = ?, `song` = ?, `beatmaker` = ?, `ytLink` = ?, `spotifyLink` = ? WHERE `recommendation`.`id` = ?";
    Values = [
      song.idArtist,
      song.songName,
      song.beatmaker,
      song.youtubeID,
      song.spotifyID,
      song.id,
    ];
    message += "updated !";
  }

  db.query(SQL, Values, (err, results) => {
    if (err) return res.send(err);
    console.log(message);
    return res.json(message);
  });
});
app.delete("/reco/:id", (req, res) => {
  const id = req.params.id;

  const SQL = "DELETE FROM `recommendation` WHERE id = ?";
  const message = "Recommendation successfully removed !";

  db.query(SQL, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }

    if (results.affectedRows === 0) {
      console.log("No recommendation found with the provided ID.");
      return res
        .status(404)
        .json({ error: "No recommendation found with the provided ID." });
    }

    console.log(message);
    return res.json({ message });
  });
});

// TODO: Artist Recommendation
app.get("/allartistreco", (req, res) => {
  const id = req.query.id;

  let SQL = "SELECT id, name as artistName, img FROM `recommendation_artist` ";

  if (id && id != 0) SQL += `WHERE id = ${id} `;

  SQL += "ORDER BY id ASC;";

  db.query(SQL, (err, data) => {
    if (err) return res.json(err);

    return res.json(data);
  });
});
app.post("/crudArtistReco", uploadNewReco.single("file"), (req, res) => {
  const artist = JSON.parse(req.body.artist);

  let message = "Artist Recommendation successfully ";
  let SQL;
  let Values;

  if (req.file) {
    if (artist.id === 0) {
      SQL =
        "INSERT INTO `recommendation_artist` (`id`, `name`, `img`) VALUES (NULL, ?, ?)";
      Values = [artist.artistName, req.file.originalname];
      message += "added !";
    } else {
      SQL = `UPDATE recommendation_artist SET name = ?, img = ? WHERE recommendation_artist.id = ?`;
      Values = [artist.artistName, req.file.originalname, artist.id];
      message += "updated !";
    }
  } else {
    SQL = `UPDATE recommendation_artist SET name = ? WHERE recommendation_artist.id = ?`;
    Values = [artist.artistName, artist.id];
    message += "updated !";
  }

  db.query(SQL, Values, (err, results) => {
    if (err) return res.send(err);
    console.log(message);
    return res.json(message);
  });
});
app.delete("/artistreco/:id", (req, res) => {
  const id = req.params.id;

  const SQL = "DELETE FROM `recommendation_artist` WHERE id = ?";
  const message = "Artist Recommendation successfully removed !";

  db.query(SQL, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }

    if (results.affectedRows === 0) {
      console.log("No artist found with the provided ID.");
      return res
        .status(404)
        .json({ error: "No artist found with the provided ID." });
    }

    console.log(message);
    return res.json({ message });
  });
});
