
CREATE TABLE IF NOT EXISTS `DCDominoLibItemsSubitems` (
  `developer` varchar(255) DEFAULT NULL,
  `item` varchar(255) DEFAULT NULL,
  `subitem` varchar(255) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `DCDominoLibItemsSubitems` (`developer`, `item`, `subitem`, `type`, `status`) VALUES
('Domino', 'ContentBlocks', 'Types/Text', '1', 1),
('Domino', 'ContentBlocks', 'Types/Columns', '1', 1),
('Domino', 'Contact', 'Module', '1', 1),
('Domino', 'CompanyData', 'Page', '1', 1),
('Domino', 'Contact', 'Form', '0', 1),
('Domino', 'Page', 'Content', '1', 1),
('Domino', 'ContentBlocks', 'Types/Title', '1', 1),
('Domino', 'ContentBlocks', 'Types/PicText', '1', 1),
('Domino', 'ContentBlocks', 'Types/BgPic', '1', 1),
('Domino', 'ContentBlocks', 'Types/Container', '1', 1),
('Domino', 'Views', 'Inner', '1', 1),
('Domino', 'Slidez', 'Slide', '1', 1),
('Domino', 'Header', 'HeaderContact', '1', 1),
('Domino', 'Header', 'Logo', '1', 1),
('Domino', 'Header', 'MenuMain', '1', 1),
('Domino', 'Header', 'MenuService', '1', 1),
('Domino', 'CompanyData', 'Module', '1', 1),
('Domino', 'Base', 'Global', '1', 1),
('Domino', 'Base', 'Utility', '1', 1),
('Domino', 'Base', 'Padding', '1', 1),
('Domino', 'Base', 'Forms', '1', 1);