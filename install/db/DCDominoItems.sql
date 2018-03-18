
CREATE TABLE IF NOT EXISTS `DCDominoItems` (
  `developer` varchar(255) NOT NULL,
  `item` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `DCDominoItems` (`developer`, `item`, `status`, `order`) VALUES
('Domino', 'App', 1, 0),
('Domino', 'Base', 1, 0),
('Domino', 'Cookies', 1, 0),
('Domino', 'Header', 1, 0),
('Domino', 'Slidez', 1, 0),
('Domino', 'ContentBlocks', 1, 0),
('Domino', 'Design', 1, 0),
('Domino', 'Footer', 1, 0),
('Domino', 'Error', 1, 0),
('Domino', 'Validation', 1, 0);