


CREATE TABLE IF NOT EXISTS `DCDominoModules` (
  `developer` varchar(255) DEFAULT NULL,
  `module` varchar(255) NOT NULL,
   `parent` varchar(255) NOT NULL,
  `status` int(11) DEFAULT NULL,
  UNIQUE KEY `id` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `DCDominoModules` (`developer`, `module`, `status`, `parent`) VALUES
('Domino', 'Menu', 1, 'Domino.Content'),
('Domino', 'Content', 1, ''),
('Domino', 'SiteTitle', 1, ''),
('Domino', 'Slideshow', 1, ''),
('Domino', 'SlideshowSlides', 1, 'Domino.Slideshow'),
('Domino', 'SocialSites', 1, ''),
('Domino', 'Translations', 1, ''),
('Domino', 'Users', 1, '');
