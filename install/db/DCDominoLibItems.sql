

CREATE TABLE IF NOT EXISTS `DCDominoLibItems` (
  `item` varchar(255) DEFAULT NULL,
  `developer` varchar(255) DEFAULT NULL,
  `description` text,
  `status` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `module_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `DCDominoLibItems` (`item`, `developer`, `description`, `status`, `category_id`, `module_id`) VALUES
('Header', 'Domino', NULL, 1, 0, NULL),
('Cookies', 'Domino', NULL, 1, 0, NULL),
('Foundation6', 'Zurb', NULL, 1, 0, NULL),
('Scssphp', 'Leafo', NULL, 1, 0, NULL),
('App', 'Domino', NULL, 1, 0, NULL),
('Validation', 'Domino', NULL, 1, 0, NULL),
('DominoFont', 'Domino', NULL, 1, 0, NULL),
('Footer', 'Domino', NULL, 1, 0, NULL),
('momentjs', 'moment', NULL, 1, 0, NULL),
('pikaday', 'dbushell', NULL, 1, 0, NULL),
('Base', 'Domino', NULL, 1, 0, NULL),
('MenuSide', 'Domino', NULL, 1, 0, NULL),
('ButtonsGrid', 'Domino', NULL, 1, 0, NULL),
('FooterMenu', 'Domino', NULL, 1, 0, NULL),
('Module', 'Domino', NULL, 1, 0, NULL),
('ContentBlocks', 'Domino', NULL, 1, 0, NULL),
('Contact', 'Domino', NULL, 1, 0, NULL),
('BreadCrumbs1', 'Domino', NULL, 1, 0, NULL),
('Pictures', 'Domino', NULL, 1, 0, NULL),
('Pic', 'Domino', NULL, 1, 0, NULL),
('LightBox', 'Domino', NULL, 1, 0, NULL),
('Views', 'Domino', NULL, 1, 0, NULL),
('CodeMirror', 'CodeMirror', NULL, 1, 0, NULL),
('pell', 'jaredreich', NULL, 1, 0, NULL);