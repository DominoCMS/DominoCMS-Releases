

CREATE TABLE IF NOT EXISTS `DCDominoContentBlocks` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subtitle` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `lang` varchar(2) NOT NULL,
  `type` varchar(255) NOT NULL,
  `theme` varchar(255) NOT NULL,
  `component` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `subtype` varchar(255) NOT NULL,
  `componentData` text NOT NULL,
  `componentParams` text NOT NULL,
  `container` varchar(255) NOT NULL,
  `containerCol` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `DCDominoContentBlocks` (`id`, `name`, `subtitle`, `content`, `lang`, `type`, `theme`, `component`, `class`, `subtype`, `componentData`, `componentParams`, `container`, `containerCol`) VALUES
('1', '', '', '<h5>Hello</h5>\n', 'en', 'Text', 'light', '', 'small-padding-top-2 small-padding-bottom-2 medium-padding-top-10 medium-padding-bottom-10', '', '', '', 'grid-x grid-padding-x grid-container', 'small-12 medium-6 cell');