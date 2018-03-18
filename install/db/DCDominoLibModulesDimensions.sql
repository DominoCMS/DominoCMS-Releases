
CREATE TABLE IF NOT EXISTS `DCDominoLibModulesDimensions` (
  `developer` varchar(255) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  `dimensionIdentity` varchar(255) NOT NULL,
  `dimensionDeveloper` varchar(255) DEFAULT NULL,
  `dimensionModule` varchar(255) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `elementDeveloper` varchar(255) NOT NULL,
  `element` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `DCDominoLibModulesDimensions` (`developer`, `module`, `dimensionIdentity`, `dimensionDeveloper`, `dimensionModule`, `level`, `elementDeveloper`, `element`) VALUES
('Domino', 'SiteTitle', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'Content', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'Menu', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'Translations', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'LibModulesElementsNames', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'Keywords', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'ContentBlocks', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'Files', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'Pictures', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'Slideshow', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'SlideshowSlides', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang'),
('Domino', 'HeaderContact', '', 'Domino', 'IdentityLanguages', 1, 'Domino', 'lang');