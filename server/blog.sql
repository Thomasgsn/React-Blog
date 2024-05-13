-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 13 mai 2024 à 21:23
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
  `name` varchar(255) NOT NULL,
  `idUser` int(11) UNSIGNED NOT NULL,
  `tag` varchar(255) NOT NULL COMMENT 'séparé par des ''; ''',
  `releaseDate` date DEFAULT NULL,
  `idCategorie` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

--
-- Déchargement des données de la table `blog`
--

INSERT INTO `blog` (`id`, `name`, `idUser`, `tag`, `releaseDate`, `idCategorie`) VALUES
(1, 'ZZz', 0, 'J9ueve; Favé; Plug; Pluggnb;', '2022-07-25', 5),
(2, 'GOVA', 0, 'Maes; Boom Bap; Kick; Old School;', '2022-07-26', 3),
(3, 'SILENT', 0, 'Trap; Freeze Corleone; KPRI;', '2022-07-29', 1),
(4, 'WHAT ELSE', 0, 'Khali; Josman; New Wave; Trap;', '2022-08-03', 1),
(5, 'WANTED', 0, 'La Fève; Khali; Kosei; New Wave; Trap;', '2022-08-25', 1),
(6, 'MPC', 0, 'Luv Resval; Boom Bap;', '2022-08-19', 3),
(7, 'Dior', 0, 'La Fève; Khali; Kosei; New Wave; Trap;', '2022-08-26', 1),
(8, 'Come On', 0, 'Khali; Kosei; New Wave; Trap;', '2022-08-26', 1),
(9, 'DÉNI', 0, 'Luv Resval; So La Lune; New Wave; Trap; Piano;', '2022-08-31', 1),
(10, '888', 0, '8ruki; thaHomey; khali; Plug; Pluggnb;', '2022-09-15', 5),
(11, 'WALL', 0, 'Luv Resval; So La Lune; Joysad; Trap; Piano;', '2022-10-01', 1),
(12, 'J4D', 0, '8ruki; thaHomey; khali; Favé; Kosei; Plug; Pluggnb;', '2022-10-14', 5),
(13, 'ZEME', 0, 'Menace Santana; Ziak; Gazo; Piano;', '2022-10-29', 2),
(14, 'PIQUANT', 0, 'Menace Santana; Ziak; Halloween; Guitar;', '2022-10-31', 2),
(15, 'SP!DER', 0, 'La Fève; Khali; Kosei; New Wave; Trap;', '2022-08-25', 1),
(16, 'MER', 0, 'So La Lune; Joysad; Trap; Piano;', '2022-11-20', 1),
(17, 'CARNAGE', 0, 'Kerchak; Ziak; Halloween; Jersey;', '2022-10-26', 2),
(18, 'FAUT PROMETTRE', 0, 'Khali; Kosei; New Wave; Trap;', '2022-12-01', 1),
(19, 'FRÉNÉSIE', 0, 'Khali; La Fève; Luther; NeS; Rounhaa; New Wave;', '2023-01-05', 1),
(20, 'PAS TANT BESOIN DE TOI', 0, 'Khali; Kosei; New Wave;', '2023-01-17', 1),
(21, 'RYUK', 0, 'Ziak; Halloween; Lewnwv;', '2023-02-06', 2),
(22, 'ERRXR', 0, '404Billy; Benjamin Epps; Boom Bap; Dark;', '2023-02-10', 4),
(23, 'STOPPED LINE', 0, '404Billy; Benjamin Epps; Boom Bap; Dark;', '2023-02-16', 4),
(24, 'PASSIONNÉ', 0, 'Sneazzy; Lefa; New Wave; Lead;', '2023-02-20', 1),
(25, 'STOP LUV', 0, 'AAMO; Leo SVR; New Wave;', '2023-07-16', 6),
(26, 'CLIPPER', 0, 'AAMO; Leo SVR; New Wave;', '2023-10-31', 6),
(27, 'mr. Business', 0, 'Benjamin Epps; 404Billy; Boom Bap; Dark;', '2023-11-09', 4),
(28, 'LA LUNA', 0, 'AAMO; Leo SVR; New Wave;', '2023-11-26', 6),
(29, 'ZEEN', 0, 'Jolagreen23; Khali; Kosei; New Wave;', '2023-12-09', 1),
(30, 'RORY', 0, 'AAMO; Leo SVR; New Wave;', '2023-12-21', 6),
(31, 'LE TEMPS PASSE', 0, 'Khali; Kosei; New Wave;', '2023-12-28', 1),
(32, 'CONCEPT', 0, 'gapman; trap; guitar; dark;', '2024-04-17', 1);

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `id` int(11) NOT NULL,
  `name` varchar(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`id`, `name`) VALUES
(1, 'Trap'),
(2, 'Drill'),
(3, 'Boom Bap'),
(4, 'Griselda'),
(5, 'Plug'),
(6, 'Detroit');

-- --------------------------------------------------------

--
-- Structure de la table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idProd` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `comment`
--

INSERT INTO `comment` (`id`, `text`, `idUser`, `idProd`) VALUES
(1, 'Dernière prod sortie à ce jour', 11, 33),
(2, 'commentaire', 1, 33),
(3, 'griselda', 1, 27),
(4, 'first', 11, 1),
(5, 'max size 150char aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 11, 1),
(6, 'mpc', 11, 6),
(11, '\"é\'é\"(éééé-\"-_è_ç_èç)àçà)=', 1, 21),
(10, '\'(\'-\'(-rz', 7, 21),
(12, 'CLIPPPPPPPPER', 1, 26),
(13, 'la luna la luna', 1, 28),
(16, 'iguhiuhihàj', 1, 21),
(15, '•♫ÇÄÕ♫☻☺♥♣', 1, 13);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `color` varchar(13) NOT NULL COMMENT '#000000 default',
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(11) NOT NULL COMMENT 'admin / user'
) ENGINE=MyISAM DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `detail`, `color`, `email`, `role`) VALUES
(1, 'oftyn', '00d70c561892a94980befd12a400e26aeb4b8599', 'Web developper', '#FFFFFF', 'thomas@mail.com', 'admin'),
(7, 'test', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'test des accounts user', '#00ff04', 'test@email.com', 'user'),
(10, 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'to test admin', '#000000', 'admin@mail.com', 'admin'),
(11, 'thomas', '5f50a84c1fa3bcff146405017f36aec1a10a9e38', 'Mon compte !', '#0008ff', 'thomas', 'user');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `comment`
--
ALTER TABLE `comment`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
