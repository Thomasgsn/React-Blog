-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 22 mai 2024 à 02:51
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `blog`
--

-- --------------------------------------------------------

--
-- Structure de la table `blog`
--

CREATE TABLE `blog` (
  `id` int(11) NOT NULL,
  `title` varchar(23) NOT NULL,
  `text` text NOT NULL,
  `idUser` int(11) UNSIGNED NOT NULL,
  `tag` varchar(255) NOT NULL COMMENT 'séparé par des ''; ''',
  `releaseDate` datetime DEFAULT NULL,
  `idCategory` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

--
-- Déchargement des données de la table `blog`
--

INSERT INTO `blog` (`id`, `title`, `text`, `idUser`, `tag`, `releaseDate`, `idCategory`) VALUES
(1, 'a new tree', 'See this new tree', 7, 'tree; natural;', '2024-04-03 23:21:00', 4),
(2, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, 'Maes; Boom Bap; Kick; Old School;', '2022-07-26 00:00:00', 3),
(3, 'New record sport', 'New world record in sport', 10, '500m; record;', '2022-07-29 00:00:00', 1),
(4, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 11, 'Khali; Josman; New Wave; Trap;', '2022-08-03 00:00:00', 1),
(5, 'Animal', 'See this animal', 7, 'animal; nature;', '2022-08-25 00:00:00', 4),
(6, 'NATURE', 'natural blog', 10, 'tree; apple; leaf;', '2022-08-19 00:00:00', 4),
(7, 'SEE PANORAMA', 'See a beautiful panorama', 10, 'panorama; nature;', '2022-08-26 00:00:00', 4),
(8, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, 'Khali; Kosei; New Wave; Trap;', '2022-08-26 00:00:00', 1),
(9, 'NEW TECH HERE', 'NEW TECHNOLOGY ', 10, 'new tech;', '2022-08-31 00:00:00', 3),
(10, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, '8ruki; thaHomey; khali; Plug; Pluggnb;', '2022-09-15 00:00:00', 5),
(11, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, 'Luv Resval; So La Lune; Joysad; Trap; Piano;', '2022-10-01 00:00:00', 1),
(12, 'New software', 'New software for pciture', 7, 'photo; software; edit; picture;', '2022-10-14 00:00:00', 3),
(13, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, 'Menace Santana; Ziak; Gazo; Piano;', '2022-10-29 00:00:00', 2),
(14, 'This is a NEWS', 'Newwws', 10, 'actu;', '2022-10-31 00:00:00', 5),
(15, 'new news', 'This news is a banger', 7, 'News; chocked;', '2022-08-25 00:00:00', 5),
(16, 'Blog of music', 'A music blog \n\nTest edit', 10, 'hip hop; classic;', '2022-11-20 00:00:00', 2),
(17, '17 edit', '17 deitertdsf', 10, 'usain; bolt;', '2022-10-26 00:00:00', 1),
(18, '\'ffffsqdgeg', 'ret, consectetur adipiscing elit.regdfgdfgdfg', 11, 'sport;', '2022-12-01 00:00:00', 1),
(35, 'Title of this blog', 'Sport blog', 10, 'sport;', '2024-05-22 01:11:25', 2),
(36, 'New Blog Of Nature', 'See this beautiful nature', 12, 'nature; tree;', '2024-05-22 01:26:05', 4),
(19, 'NEW GEN', 'New gen of musician', 7, 'Khali; La Fève; Luther; NeS; Rounhaa; New Wave;', '2023-01-05 00:00:00', 2),
(20, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, 'Khali; Kosei; New Wave;', '2023-01-17 00:00:00', 1),
(21, 'fgsdfggrger', 'New music blog', 11, '1;', '2023-02-06 00:00:00', 2),
(22, 'French clash Rap', 'New Clash between 404Billy & Benjamin Epps', 7, '404Billy; Benjamin Epps; Boom Bap; Clash;', '2023-02-10 00:00:00', 2),
(23, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, '404Billy; Benjamin Epps; Boom Bap; Dark;', '2023-02-16 00:00:00', 4),
(24, 'SPOOORT THEM', 'SPORT STUDY', 7, 'football; basketball; handball;', '2023-02-20 00:00:00', 1),
(25, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 11, 'AAMO; Leo SVR; New Wave;', '2023-07-16 00:00:00', 6),
(26, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 11, 'AAMO; Leo SVR; New Wave;', '2023-10-31 00:00:00', 6),
(27, 'photo of nature', 'zrhfghdfvbnsrtzuzrufgjdj', 11, 'photo;', '2023-11-09 00:00:00', 4),
(28, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 10, 'AAMO; Leo SVR; New Wave;', '2023-11-26 00:00:00', 6),
(29, 'WWWWWWWWWWWWWWWWWWWWWWW', 'TEEST OVERFLOW\n\n\nsdddddddddddddddddddddddddddddddfqseeeggggggggggggggggggggggggggggggggggggggggggggggg', 11, 'test;', '2023-12-09 00:00:00', 3),
(30, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, 'AAMO; Leo SVR; New Wave;', '2023-12-21 00:00:00', 6),
(31, 'This is a TITLE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.\r\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, 'Khali; Kosei; New Wave;', '2024-03-22 09:08:00', 1),
(32, 'New picture', 'New picture of nature', 7, 'picture; photo; natural;', '2024-04-17 14:29:10', 4),
(34, 'Nouveau blog', 'Voici un nouveau blog\n\n8a643f51-253e-c407-9b21-fb9423575c9f-images.jfif\n', 7, 'blog;', '2024-05-20 13:09:32', 1);

-- --------------------------------------------------------

--
-- Structure de la table `blogimg`
--

CREATE TABLE `blogimg` (
  `id` int(11) UNSIGNED NOT NULL,
  `idBlog` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `blogimg`
--

INSERT INTO `blogimg` (`id`, `idBlog`, `name`) VALUES
(1, 1, 'téléchargement (1).jfif'),
(2, 1, 'téléchargement (2).jfif'),
(3, 1, 'imageGeneratorFeatureIntro1-AQU1zYPO.webp'),
(4, 32, 'téléchargement (4).jfif'),
(5, 1, 'file-6113d5f8845dc.jpeg'),
(6, 1, 'sunset-1373171_1280.jpg'),
(7, 28, 'imageGeneratorFeatureIntro1-AQU1zYPO.webp'),
(8, 2, 'téléchargement.jfif'),
(9, 3, 'sunset-1373171_1280.jpg'),
(10, 4, 'imageGeneratorFeatureIntro1-AQU1zYPO.webp'),
(11, 5, 'téléchargement.jfif'),
(12, 6, 'téléchargement (2).jfif'),
(13, 7, 'sunset-1373171_1280.jpg'),
(14, 8, 'file-6113d5f8845dc.jpeg'),
(15, 9, 'carré.avif'),
(16, 10, 'imageGeneratorFeatureIntro1-AQU1zYPO.webp'),
(17, 10, 'téléchargement.jfif'),
(18, 11, 'carré.avif'),
(19, 12, 'téléchargement (2).jfif'),
(20, 27, 'téléchargement (4).jfif'),
(21, 28, 'carré.avif'),
(22, 31, 'téléchargement (1).jfif'),
(23, 31, 'photo.avif'),
(24, 31, 'téléchargement (2).jfif'),
(34, 5, 'téléchargement (4).jfif'),
(35, 27, 'carré.avif'),
(36, 35, '42ae3c59-406c-02cc-e53d-091399ef5d94-images.jfif'),
(37, 36, 'dbad0b08-c299-a4a4-22d3-4b2af3ce54ae-imagesdfsesegsd.jpg'),
(38, 36, '2a070850-aa66-6363-872e-147127b6c4da-imagesdfsesegsd.jpg'),
(39, 36, '19381ed9-0e39-1543-0c95-8c63bf19456a-imagesdfsesegsd.jpg'),
(40, 36, '176fee5a-853f-4428-b8d3-3b85d3d8eecb-imagesdfsesegsd.jpg'),
(41, 36, 'ea560319-168b-2411-5cfe-8f9d85d970a7-imagesdfsesegsd.jpg'),
(46, 34, '91e7db11-1acd-307f-74ec-f719aca29832-images.jfif');

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Sport'),
(2, 'Music'),
(3, 'Science & Technology'),
(4, 'Nature'),
(5, 'News');

-- --------------------------------------------------------

--
-- Structure de la table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idBlog` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `comment`
--

INSERT INTO `comment` (`id`, `text`, `idUser`, `idBlog`) VALUES
(1, 'Last blog', 11, 33),
(2, 'comment', 1, 33),
(3, 'griselda', 1, 27),
(4, 'first', 11, 1),
(5, 'max size 150char aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 11, 1),
(6, 'mpc', 11, 6),
(11, '\"é\'é\"(éééé-\"-_è_ç_èç)àçà)=', 1, 21),
(10, '\'(\'-\'(-rz', 7, 21),
(12, 'CLIPPPPPPPPER', 1, 26),
(13, 'la', 1, 28),
(16, 'iguhiuhihàj', 1, 21),
(15, '•♫ÇÄÕ♫☻☺♥♣', 1, 13),
(19, 'comment', 10, 31),
(18, 'test comment', 10, 31),
(20, '<script>alert(\'Ceci est une attaque XSS!\');</script>', 11, 31),
(21, 'Why nobody comment ?', 12, 36);

-- --------------------------------------------------------

--
-- Structure de la table `follow`
--

CREATE TABLE `follow` (
  `id` int(11) UNSIGNED NOT NULL,
  `idFollower` int(11) NOT NULL,
  `idFollowed` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `follow`
--

INSERT INTO `follow` (`id`, `idFollower`, `idFollowed`) VALUES
(1, 10, 7),
(2, 7, 10),
(498, 10, 11),
(500, 11, 10),
(501, 12, 1),
(502, 12, 7),
(503, 12, 11),
(504, 12, 10);

-- --------------------------------------------------------

--
-- Structure de la table `liked`
--

CREATE TABLE `liked` (
  `id` int(10) UNSIGNED NOT NULL,
  `idUser` int(11) NOT NULL,
  `idBlog` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `liked`
--

INSERT INTO `liked` (`id`, `idUser`, `idBlog`) VALUES
(4, 11, 1),
(7, 10, 19),
(8, 10, 24),
(9, 10, 18),
(10, 10, 7),
(11, 12, 32),
(12, 12, 24),
(14, 12, 13),
(15, 12, 6),
(16, 12, 23),
(17, 12, 19),
(19, 12, 2),
(21, 10, 1),
(23, 10, 36);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `username` varchar(11) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(11) NOT NULL COMMENT 'admin / user'
) ENGINE=MyISAM DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `firstname`, `lastname`, `username`, `avatar`, `password`, `detail`, `email`, `role`) VALUES
(1, 'firstname', 'lastname', 'username', '81e539d7-94cc-70b7-9274-d687373cface-img-worlds-of-adventure.jpg', '249ba36000029bbe97499c03db5a9001f6b734ec', 'Web developper', 'thomas@mail.com', 'admin'),
(7, 'firstname', 'lastname', 'test', 'test.avif', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'test des accounts user', 'test@email.com', 'user'),
(10, 'admin', 'lastname', 'admin', 'admin.webp', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'to test admin\r\n\r\nAnd description', 'admin@mail.com', 'admin'),
(11, 'Thomas', 'Gassmann', 'thomas', 'thomassimg.webp', '5f50a84c1fa3bcff146405017f36aec1a10a9e38', 'Mon compte !', 'thomas', 'user'),
(12, 'Firstname', 'Lastname', 'doggy', '04eee5cf-bc55-ba9a-babe-e7c01b8deb48-images.jfif', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'My avatar is my dog', 'mail@mail.com', 'user');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `blogimg`
--
ALTER TABLE `blogimg`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `liked`
--
ALTER TABLE `liked`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `blog`
--
ALTER TABLE `blog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `blogimg`
--
ALTER TABLE `blogimg`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `follow`
--
ALTER TABLE `follow`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=505;

--
-- AUTO_INCREMENT pour la table `liked`
--
ALTER TABLE `liked`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
