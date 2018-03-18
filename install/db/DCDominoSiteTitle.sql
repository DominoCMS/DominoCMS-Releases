
CREATE TABLE IF NOT EXISTS `DCDominoSiteTitle` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `author` varchar(255) NOT NULL,
  `lang` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `DCDominoSiteTitle` (`id`, `name`, `description`, `author`, `lang`) VALUES
(1, 'DominoCMS', 'Open Source CMS. Dominate life.', '', 'en');
