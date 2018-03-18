

CREATE TABLE IF NOT EXISTS `DCDominoViewsStructure` (
  `viewDeveloper` varchar(255) NOT NULL,
  `view` varchar(255) NOT NULL,
  `developer` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `parent` varchar(255) NOT NULL,
  `component` varchar(255) NOT NULL,
  `componentParams` text NOT NULL,
  `componentData` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `DCDominoViewsStructure` (`viewDeveloper`, `view`, `developer`, `component`, `status`, `order`, `parent`, `componentParams`, `componentData`) VALUES
('Domino', 'Default', 'Domino', 'Cookies', 1, 1, 0, '', ''),
('Domino', 'Default', 'Domino', 'Header', 1, 2, 0, '', ''),
('Domino', 'Default', 'Domino', 'Slidez', 1, 3, 0, '', ''),
('Domino', 'Default', 'Domino', 'inner', 1, 4, 0, '', ''),
('Domino', 'Default', 'Domino', 'Footer', 1, 5, 0, '', '');