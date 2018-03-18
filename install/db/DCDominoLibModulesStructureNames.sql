

CREATE TABLE IF NOT EXISTS `DCDominoLibModulesStructureNames` (
  `developer` varchar(255) DEFAULT NULL,
  `id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `icon` varchar(255) NOT NULL,
  `lang` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `DCDominoLibModulesStructureNames` (`developer`, `id`, `name`, `icon`, `lang`) VALUES
('Domino', 'tabName', 'name', '', 'en'),
('Domino', 'tabSettings', 'Settings', '', 'en'),
('Domino', 'tabContent', 'Content', '', 'en'),
('Domino', 'tabContent2', 'Content 2', '', 'en'),
('Domino', 'tabPictures', 'Pictures', '', 'en'),
('Domino', 'tabDesc', 'Opis', '', 'en'),
('Domino', 'tabParams', 'Params', '', 'en'),
('Domino', 'mainEntry', 'Main entry', '', 'en'),
('Domino', 'relEntry', 'Crossed entry', '', 'en'),
('Domino', 'tabFiles', 'Files', '', 'en'),
('Domino', 'tabContentBlocks', 'Content Blocks', '', 'en'),
('Domino', 'tabCross', 'Cross', '', 'en'),
('Domino', 'tabMeta', 'Meta', '', 'en');