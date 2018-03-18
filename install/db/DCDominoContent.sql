

CREATE TABLE IF NOT EXISTS `DCDominoContent` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subtitle` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `content2` text NOT NULL,
  `metaTitle` varchar(255) NOT NULL,
  `metaDescription` varchar(255) NOT NULL,
  `metaKeywords` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `lang` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `DCDominoContent` (`id`, `name`, `subtitle`, `content`, `content2`, `lang`, `metaTitle`, `metaDescription`, `metaKeywords`, `url`) VALUES
(1, 'Domov', '', '', '', 'en', '', '', '', ''),
(2, 'About me', '', '', '', 'en', '', '', '', '');