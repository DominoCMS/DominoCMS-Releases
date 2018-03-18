

CREATE TABLE IF NOT EXISTS `DCDominoViews` (
  `developer` varchar(255) NOT NULL,
  `view` varchar(255) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `DCDominoViews` (`developer`, `view`, `status`) VALUES
('Domino', 'Default', 1);