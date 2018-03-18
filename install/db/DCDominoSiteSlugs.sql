
CREATE TABLE IF NOT EXISTS `DCDominoSiteSlugs` (
  `entry` varchar(255) NOT NULL,
  `developer` varchar(255) NOT NULL,
  `module` varchar(255) NOT NULL,
  `id` varchar(255) NOT NULL,
  `indexId` int(11) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `urlname` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `urlpath` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `DCDominoSiteSlugs` (`entry`, `developer`, `module`, `id`, `indexId`, `lang`, `urlname`, `name`, `urlpath`) VALUES
('Domino.Content.1', 'Domino', 'Content', '1', 1, 'en', '', 'Home', ''),
('Domino.Content.2', 'Domino', 'Content', '2', 2, 'en', 'about-me', 'about-me', '');

