

CREATE TABLE IF NOT EXISTS `DCDominoSiteIndex` (
  `indexId` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `entry` varchar(255) NOT NULL,
  `developer` varchar(255) NOT NULL,
  `module` varchar(255) NOT NULL,
  `id` varchar(255) NOT NULL,
  `parent` varchar(255) NOT NULL,
  `parentDeveloper` varchar(255) NOT NULL,
  `parentModule` varchar(255) NOT NULL,
  `parentId` varchar(255) NOT NULL,
  `privacy` int(11) NOT NULL,
  `views` varchar(255) NOT NULL,
  `ghost` int(11) NOT NULL,
  `icon` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `DCDominoSiteIndex` (`indexId`, `status`, `order`, `entry`, `developer`, `module`, `id`, `parent`, `parentDeveloper`, `parentModule`, `parentId`, `privacy`, `views`, `icon`, `ghost`) VALUES
(1, 1, 0, 'Domino.SiteTitle.1', 'Domino', 'SiteTitle', '1', '', '', '', '', 0, '', '', 0),
(2, 1, 0, 'Domino.Menu.main', 'Domino', 'Menu', 'main', '', '', '', '', 0, '', '', 0),
(3, 1, 0, 'Domino.Menu.service', 'Domino', 'Menu', 'service', '', '', '', '', 0, '', '', 0),
(4, 1, 0, 'Domino.Content.1', 'Domino', 'Content', '1', 'Domino.Menu.main', 'Domino', 'Menu', 'main', 0, 'Domino.Views,Domino.Views.Inner', '', 0),
(5, 1, 0, 'Domino.Content.2', 'Domino', 'Content', '2', 'Domino.Menu.service', 'Domino', 'Menu', 'service', 0, 'Domino.Views,Domino.Views.Inner', '', 0),
(6, 1, 0, 'Domino.ContentBlocks.1', 'Domino', 'ContentBlocks', '2', 'Domino.Content.1', 'Domino', 'Content', '1', 0, '', '', 0);

