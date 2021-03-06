

CREATE TABLE IF NOT EXISTS `DCDominoLibModulesStructure` (
  `developer` varchar(255) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  `ordem` int(11) DEFAULT NULL,
  `parent_id` int(11) NOT NULL,
  `elementDeveloper` varchar(255) NOT NULL,
  `element` varchar(255) DEFAULT NULL,
  `structureType` varchar(255) DEFAULT NULL,
  `structureName` varchar(255) NOT NULL,
  `validation` varchar(10) NOT NULL,
  `defaultVal` varchar(255) NOT NULL,
  `placeholder` varchar(255) NOT NULL,
  `dimensional` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `DCDominoLibModulesStructure` (`developer`, `module`, `id`, `ordem`, `parent_id`, `elementDeveloper`, `element`, `structureType`, `structureName`, `validation`, `defaultVal`, `placeholder`, `dimensional`) VALUES
('Domino', 'Content', 1, 1, 11, 'Domino', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'Content', 2, 1, 1, 'Domino', 'name', 'nameUrlname', '', '', '', '', 1),
('Domino', 'Content', 3, 2, 1, 'Domino', 'subtitle', 'varchar', '', '', '', '', 1),
('Domino', 'Content', 4, 3, 11, 'Domino', '', 'tab', 'tabContent', '', '', '', 0),
('Domino', 'Content', 5, 1, 4, 'Domino', 'content', 'textEditor', '', '', '', '', 1),
('Domino', 'Content', 6, 4, 11, 'Domino', '', 'tab', 'tabContent2', '', '', '', 0),
('Domino', 'Content', 7, 1, 6, 'Domino', 'content2', 'textEditor', '', '', '', '', 1),
('Domino', 'Content', 8, 6, 11, 'Domino', '', 'tab', 'tabPictures', '', '', '', 0),
('Domino', 'Content', 9, 1, 8, 'Domino', '', 'pictures', '', '', '', '', 0),
('Domino', 'Content', 10, 1, 0, 'Domino', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'Content', 11, 2, 0, 'Domino', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Content', 12, 1, 10, 'Domino', 'parent', 'selector', '', '', '', '', 0),
('Domino', 'Content', 13, 2, 10, 'Domino', 'views', 'varchar', '', '', '', '', 0),
('Domino', 'Content', 14, 5, 11, 'Domino', '', 'tab', 'tabContentBlocks', '', '', '', 0),
('Domino', 'ContentBlocks', 1, 1, 10, 'Domino', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'ContentBlocks', 2, 1, 1, 'Domino', 'name', 'varchar', '', '', '', '', 1),
('Domino', 'ContentBlocks', 3, 2, 1, 'Domino', 'subtitle', 'varchar', '', '', '', '', 1),
('Domino', 'ContentBlocks', 4, 2, 10, 'Domino', '', 'tab', 'tabContent', '', '', '', 0),
('Domino', 'ContentBlocks', 5, 1, 4, 'Domino', 'content', 'textEditor', '', '', '', '', 1),
('Domino', 'ContentBlocks', 6, 3, 1, 'Domino', 'type', 'varchar', '', '', '', '', 0),
('Domino', 'ContentBlocks', 7, 5, 1, 'Domino', 'theme', 'varchar', '', '', '', '', 0),
('Domino', 'ContentBlocks', 8, 6, 1, 'Domino', 'component', 'varchar', '', '', '', '', 0),
('Domino', 'ContentBlocks', 9, 7, 1, 'Domino', 'class', 'varchar', '', '', '', '', 0),
('Domino', 'ContentBlocks', 10, 2, 0, 'Domino', '', 'tabSet', '', '', '', '', 0),
('Domino', 'ContentBlocks', 11, 1, 0, 'Domino', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'ContentBlocks', 12, 1, 11, 'Domino', 'parent', 'selector', '', '', '', '', 0),
('Domino', 'ContentBlocks', 13, 2, 11, 'Domino', 'order', 'varchar', '', '', '', '', 0),
('Domino', 'ContentBlocks', 14, 4, 1, 'Domino', 'subtype', 'varchar', '', '', '', '', 0),
('Domino', 'Files', 1, 1, 5, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'Files', 2, 1, 1, 'Domino', 'name', 'varchar', '', '', '', '', 1),
('Domino', 'Files', 3, 2, 5, 'Domino', '', 'tab', 'tabParams', '', '', '', 0),
('Domino', 'Files', 4, 2, 1, 'Domino', 'filename', 'file', '', '', '', '', 0),
('Domino', 'Keywords', 1, 1, 0, 'Domino', 'keyword', 'varchar', '', '', '', '', 1),
('Domino', 'Keywords', 2, 2, 0, 'Domino', 'content', 'text', '', '', '', '', 1),
('Domino', 'Languages', 2, 2, 0, 'Domino', 'name', 'varchar', '', 'required', '', '', 0),
('Domino', 'Languages', 3, 3, 0, 'Domino', 'iso31662', 'varchar', '', 'required', '', '', 0),
('Domino', 'Languages', 4, 4, 0, 'Domino', 'iso6392', 'varchar', '', 'required', '', '', 0),
('Domino', 'Languages', 1, 1, 0, 'Domino', 'lang', 'varchar', '', 'required', '', '', 0),
('Domino', 'LibModulesElements', 1, 3, 0, 'Domino', 'colType', 'varchar', '', '', '', '', 0),
('Domino', 'LibModulesElements', 2, 5, 0, 'Domino', 'colNull', 'varchar', '', '', '', '', 0),
('Domino', 'LibModulesElements', 3, 8, 0, 'Domino', 'icon', 'varchar', '', '', '', '', 0),
('Domino', 'LibModulesElements', 4, 6, 0, 'Domino', 'structureType', 'varchar', '', '', '', '', 0),
('Domino', 'LibModulesElements', 5, 7, 0, 'Domino', 'validation', 'varchar', '', '', '', '', 0),
('Domino', 'LibModulesElements', 6, 4, 0, 'Domino', 'colLength', 'varchar', '', '', '', '', 0),
('Domino', 'LibModulesElements', 1, 1, 0, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'LibModulesElements', 1, 2, 0, 'Domino', 'element', 'varchar', '', '', '', '', 0),
('Domino', 'LibModulesElementsNames', 1, 1, 0, 'Domino', 'name', '', '', '', '', '', 0),
('Domino', 'Menu', 1, 2, 0, 'Domino', 'name', 'varchar', '', 'required', '', '', 1),
('Domino', 'Menu', 1, 1, 0, 'Domino', 'id', 'varchar', '', 'required', '', '', 0),
('Domino', 'News', 1, 1, 6, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'News', 2, 1, 1, '', NULL, 'fieldSet', '', '', '', '', 0),
('Domino', 'News', 3, 1, 2, 'Domino', 'name', 'nameUrlname', '', '', '', '', 1),
('Domino', 'News', 4, 2, 2, 'Domino', 'subtitle', 'varchar', '', '', '', '', 1),
('Domino', 'News', 5, 2, 6, '', '', 'tab', 'tabContent', '', '', '', 0),
('Domino', 'Pictures', 1, 1, 8, 'Domino', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'Pictures', 2, 1, 1, 'Domino', 'name', 'varchar', '', '', '', '', 1),
('Domino', 'Pictures', 3, 2, 8, 'Domino', '', 'tab', 'tabParams', '', '', '', 0),
('Domino', 'Pictures', 4, 2, 1, 'Domino', 'filename', 'file', '', '', '', '', 1),
('Domino', 'Pictures', 5, 3, 3, 'Domino', 'photographer', 'varchar', '', '', '', '', 0),
('Domino', 'Pictures', 6, 4, 3, 'Domino', 'bgPosX', 'varchar', '', '', '', '', 0),
('Domino', 'Pictures', 7, 5, 3, 'Domino', 'bgPosY', 'varchar', '', '', '', '', 0),
('Domino', 'Pictures', 8, 1, 0, 'Domino', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Pictures', 9, 3, 1, 'Domino', 'fileExt', 'varchar', '', '', '', '', 0),
('Domino', 'Pictures', 10, 6, 3, 'Domino', 'originalName', 'varchar', '', '', '', '', 0),
('Domino', 'SiteCross', 1, 1, 0, 'Domino', 'entry', 'varchar', '', '', '', '', 0),
('Domino', 'SiteCross', 5, 5, 0, 'Domino', 'entryRel', 'varchar', '', '', '', '', 0),
('Domino', 'SiteCross', 9, 9, 0, 'Domino', 'ordem', 'varchar', '', '', '', '', 0),
('Domino', 'SiteCrossPictures', 1, 1, 14, 'Domino', 'entry', 'varchar', '', '', '', '', 0),
('Domino', 'SiteCrossPictures', 5, 5, 15, 'Domino', 'entryRel', 'varchar', '', '', '', '', 0),
('Domino', 'SiteCrossPictures', 9, 4, 13, 'Domino', 'ordem', 'varchar', '', '', '', '', 0),
('Domino', 'SiteCrossPictures', 10, 1, 13, 'Domino', 'status', 'bool', '', '', '', '', 0),
('Domino', 'SiteCrossPictures', 11, 2, 13, 'Domino', 'picProfile', 'bool', '', '', '', '', 0),
('Domino', 'SiteCrossPictures', 12, 3, 13, 'Domino', 'picCover', 'bool', '', '', '', '', 0),
('Domino', 'SiteCrossPictures', 13, 1, 0, 'Domino', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'SiteCrossPictures', 14, 2, 0, 'Domino', '', 'fieldSet', 'mainEntry', '', '', '', 0),
('Domino', 'SiteCrossPictures', 15, 3, 0, 'Domino', '', 'fieldSet', 'relEntry', '', '', '', 0),
('Domino', 'SiteTitle', 1, 1, 5, 'Domino', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'SiteTitle', 2, 1, 1, 'Domino', 'name', 'varchar', '', 'text', '', '', 1),
('Domino', 'SiteTitle', 3, 2, 1, 'Domino', 'description', 'text', '', '', '', '', 1),
('Domino', 'SiteTitle', 4, 3, 1, 'Domino', 'author', 'varchar', '', '', '', '', 1),
('Domino', 'SiteTitle', 5, 1, 0, 'Domino', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Translations', 2, 2, 0, 'Domino', 'name', 'text', '', 'required', '', '', 1),
('Domino', 'Translations', 2, 1, 0, 'Domino', 'id', 'varchar', '', 'required', '', '', 0),
('Domino', 'Users', 1, 1, 6, 'Domino', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'Users', 2, 1, 1, 'Domino', 'firstname', 'varchar', '', '', '', '', 0),
('Domino', 'Users', 3, 2, 1, 'Domino', 'surname', 'varchar', '', '', '', '', 0),
('Domino', 'Users', 4, 3, 1, 'Domino', 'email', 'varchar', '', '', '', '', 0),
('Domino', 'Users', 5, 4, 1, 'Domino', 'username', 'varchar', '', 'username', '', '', 0),
('Domino', 'Users', 6, 1, 0, 'Domino', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Users', 7, 5, 1, 'Domino', 'password', 'password', '', '', '', '', 0),
('Domino', 'Slideshow', 1, 1, 0, 'Domino', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'Slideshow', 2, 1, 1, 'Domino', 'dateStart', 'date', '', '', '', '', 0),
('Domino', 'Slideshow', 3, 2, 1, 'Domino', 'dateEnd', 'date', '', '', '', '', 0),
('Domino', 'Slideshow', 4, 2, 0, 'Domino', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Slideshow', 5, 1, 4, 'Domino', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'Slideshow', 6, 2, 5, 'Domino', 'name', 'varchar', '', '', '', '', 1),
('Domino', 'Slideshow', 7, 2, 4, 'Domino', '', 'tab', 'tabContent', '', '', '', 0),
('Domino', 'Slideshow', 8, 1, 7, 'Domino', 'content', 'textEditor', '', '', '', '', 1),
('Domino', 'Slideshow', 9, 3, 4, '', '', 'tab', 'tabPictures', '', '', '', 0),
('Domino', 'Slideshow', 10, 1, 9, 'Domino', '', 'pictures', '', '', '', '', 0),
('Domino', 'SlideshowSlides', 9, 3, 4, '', '', 'tab', 'tabPictures', '', '', '', 0),
('Domino', 'SlideshowSlides', 10, 1, 9, '', '', 'pictures', '', '', '', '', 0),
('Domino', 'SlideshowSlides', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'SlideshowSlides', 2, 1, 1, 'Domino', 'dateStart', 'date', '', '', '', '', 0),
('Domino', 'SlideshowSlides', 3, 2, 1, 'Domino', 'dateEnd', 'date', '', '', '', '', 0),
('Domino', 'SlideshowSlides', 4, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'SlideshowSlides', 5, 1, 4, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'SlideshowSlides', 6, 2, 4, '', '', 'tab', 'tabContent', '', '', '', 0),
('Domino', 'SlideshowSlides', 7, 1, 5, 'Domino', 'name', 'varchar', '', '', '', '', 1),
('Domino', 'SlideshowSlides', 8, 1, 6, 'Domino', 'content', 'textEditor', '', '', '', '', 1),
('Domino', 'SlideshowSlides', 11, 3, 1, 'Domino', 'parent', 'selector', '', '', '', '', 0),
('Domino', 'Slideshow', 11, 1, 5, 'Domino', 'id', 'varchar', '', '', '', '', 0),
('Domino', 'ContentBlocks', 15, 3, 10, '', 'tab', '', 'tabPictures', '', '', '', 0),
('Domino', 'ContentBlocks', 16, 1, 15, '', '', 'pictures', '', '', '', '', 0),
('Domino', 'ContentBlocks', 17, 6, 1, 'Domino', 'componentData', 'text', '', '', '', '', 0),
('Domino', 'Content', 15, 3, 10, 'Domino', 'order', 'varchar', '', '', '', '', 0),
('Domino', 'ViewsStructure', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'ViewsStructure', 2, 1, 1, '', 'parent', 'selector', '', '', '', '', 0),
('Domino', 'ViewsStructure', 3, 2, 1, '', 'order', 'varchar', '', '', '', '', 0),
('Domino', 'ViewsStructure', 4, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'ViewsStructure', 5, 1, 4, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'ViewsStructure', 6, 1, 5, 'Domino', 'viewDeveloper', 'varchar', '', '', '', '', 0),
('Domino', 'ViewsStructure', 7, 2, 5, 'Domino', 'view', 'varchar', '', '', '', '', 0),
('Domino', 'Themes', 1, 1, 0, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'Themes', 2, 2, 0, 'Domino', 'theme', 'varchar', '', '', '', '', 0),
('Domino', 'Content', 16, 7, 11, '', '', 'tab', 'tabFiles', '', '', '', 0),
('Domino', 'Content', 17, 1, 16, '', '', 'files', '', '', '', '', 0),
('Domino', 'Content', 18, 8, 11, '', '', 'tab', 'tabCross', '', '', '', 0),
('Domino', 'Content', 19, 1, 18, '', '', 'cross', '', '', '', '', 0),
('Domino', 'Content', 20, 1, 14, '', '', 'childEntries', '', '', '', '', 0),
('Domino', 'Content', 21, 2, 11, 'Domino', '', 'tab', 'tabMeta', '', '', '', 0),
('Domino', 'Content', 22, 1, 21, 'Domino', 'metaTitle', 'varchar', '', '', '', '', 1),
('Domino', 'Content', 23, 2, 21, 'Domino', 'metaDescription', 'text', '', '', '', '', 1),
('Domino', 'Content', 24, 3, 21, 'Domino', 'metaKeywords', 'varchar', '', '', '', '', 1),
('Domino', 'HeaderContact', 1, 2, 0, 'Domino', 'type', 'varchar', '', '', '', '', 0),
('Domino', 'HeaderContact', 2, 3, 0, 'Domino', 'icon', 'varchar', '', '', '', '', 0),
('Domino', 'HeaderContact', 3, 4, 0, 'Domino', 'hide', 'varchar', '', '', '', '', 0),
('Domino', 'HeaderContact', 4, 5, 0, 'Domino', 'ordem', 'varchar', '', '', '', '', 0),
('Domino', 'HeaderContact', 5, 1, 0, 'Domino', 'name', 'varchar', '', '', '', '', 1),
('Domino', 'HeaderContact', 6, 6, 0, 'Domino', 'url', 'varchar', '', '', '', '', 1),
('Domino', 'HeaderContact', 7, 7, 0, 'Domino', 'class', 'varchar', '', '', '', '', 0),
('Domino', 'ContentBlocks', 18, 9, 1, 'Domino', 'componentParams', 'text', '', '', '', '', 0),
('Domino', 'ContentBlocks', 19, 10, 1, 'Domino', 'container', 'varchar', '', '', '', '', 0),
('Domino', 'ContentBlocks', 20, 11, 1, 'Domino', 'containerCol', 'varchar', '', '', '', '', 0),
('Domino', 'HeaderContact', 8, 8, 0, 'Domino', 'target', 'varchar', '', '', '', '', 0),
('Domino', 'Users', 8, 2, 6, '', '', 'tab', 'tabParams', '', '', '', 0),
('Domino', 'Users', 9, 1, 8, 'Domino', '', 'addEntries', '', '', '', '', 0),
('Domino', 'Items', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'Items', 2, 1, 1, 'Domino', 'status', 'bool', '', '', '', '', 0),
('Domino', 'Items', 3, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Items', 4, 1, 3, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'Items', 5, 1, 4, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'Items', 6, 2, 4, 'Domino', 'item', 'varchar', '', '', '', '', 0),
('Domino', 'Items', 7, 2, 1, 'Domino', 'order', 'varchar', '', '', '', '', 0),
('Domino', 'ItemsSubitems', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'ItemsSubitems', 2, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'ItemsSubitems', 3, 1, 2, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'ItemsSubitems', 4, 1, 3, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'ItemsSubitems', 5, 2, 3, 'Domino', 'item', 'varchar', '', '', '', '', 0),
('Domino', 'ItemsSubitems', 6, 3, 3, 'Domino', 'subitem', 'varchar', '', '', '', '', 0),
('Domino', 'ItemsSubitems', 7, 1, 1, 'Domino', 'status', 'bool', '', '', '', '', 0),
('Domino', 'ItemsSubitems', 8, 2, 1, 'Domino', 'type', 'varchar', '', '', '', '', 0),
('Domino', 'ItemsComponents', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'ItemsComponents', 2, 1, 1, 'Domino', 'order', 'varchar', '', '', '', '', 0),
('Domino', 'ItemsComponents', 3, 2, 1, 'Domino', 'status', 'bool', '', '', '', '', 0),
('Domino', 'ItemsComponents', 4, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'ItemsComponents', 5, 1, 4, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'ItemsComponents', 6, 1, 5, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'ItemsComponents', 7, 2, 5, 'Domino', 'item', 'varchar', '', '', '', '', 0),
('Domino', 'ItemsComponents', 8, 3, 5, 'Domino', 'component', 'varchar', '', '', '', '', 0),
('Domino', 'ItemsComponents', 9, 3, 1, 'Domino', 'type', 'bool', '', '', '', '', 0),
('Domino', 'Views', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'Views', 2, 2, 0, 'Domino', 'status', 'bool', '', '', '', '', 0),
('Domino', 'Views', 3, 3, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Views', 4, 1, 3, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'Views', 5, 1, 4, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'Views', 6, 2, 4, 'Domino', 'view', 'varchar', '', '', '', '', 0),
('Domino', 'ViewsStructure', 8, 3, 5, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'ViewsStructure', 9, 4, 5, 'Domino', 'component', 'varchar', '', '', '', '', 0),
('Domino', 'LibThemes', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'LibThemes', 2, 1, 1, 'Domino', 'status', 'bool', '', '', '', '', 0),
('Domino', 'LibThemes', 3, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'LibThemes', 4, 3, 3, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'LibThemes', 5, 1, 4, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'LibThemes', 6, 2, 4, 'Domino', 'id', 'varchar', '', '', '', '', 0),
('Domino', 'LibItemsSubitems', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'LibItemsSubitems', 2, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'LibItemsSubitems', 3, 1, 2, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'LibItemsSubitems', 4, 1, 3, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'LibItemsSubitems', 5, 2, 3, 'Domino', 'item', 'varchar', '', '', '', '', 0),
('Domino', 'LibItemsSubitems', 6, 3, 3, 'Domino', 'subitem', 'varchar', '', '', '', '', 0),
('Domino', 'LibItemsSubitems', 7, 1, 1, 'Domino', 'type', 'bool', '', '', '', '', 0),
('Domino', 'LibItems', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'LibItems', 2, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'LibItems', 3, 1, 2, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'LibItems', 4, 1, 3, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'LibItems', 5, 2, 3, 'Domino', 'item', 'varchar', '', '', '', '', 0),
('Domino', 'LibItems', 6, 1, 1, 'Domino', 'status', 'bool', '', '', '', '', 0),
('Domino', 'Files', 5, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Files', 6, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'Files', 7, 3, 1, 'Domino', 'fileExt', 'varchar', '', '', '', '', 0),
('Domino', 'Files', 8, 1, 3, 'Domino', 'originalName', 'varchar', '', '', '', '', 0),
('Domino', 'Files', 9, 2, 3, 'Domino', 'author', 'varchar', '', '', '', '', 0),
('Domino', 'Modules', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'Modules', 2, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Modules', 3, 1, 2, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'Modules', 4, 1, 3, 'Domino', 'developer', 'varchar', '', '', '', '', 0),
('Domino', 'Modules', 5, 2, 3, 'Domino', 'module', 'varchar', '', '', '', '', 0),
('Domino', 'Modules', 6, 1, 1, 'Domino', 'status', 'bool', '', '', '', '', 0),
('Domino', 'Identity', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'Identity', 2, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Identity', 3, 1, 2, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'Identity', 4, 2, 2, '', '', 'tab', 'tabParams', '', '', '', 0),
('Domino', 'Identity', 5, 1, 3, '', '', 'FieldSet', '', '', '', '', 0),
('Domino', 'Identity', 6, 2, 5, 'Domino', 'username', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 7, 3, 5, 'Domino', 'name', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 8, 4, 5, 'Domino', 'theme', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 6, 1, 5, 'Domino', 'db', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 10, 2, 3, '', '', 'FieldSet', 'General', '', '', '', 0),
('Domino', 'Identity', 11, 1, 10, 'Domino', 'googleAnalytics', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 12, 2, 10, 'Domino', 'open', 'bool', '', '', '', '', 0),
('Domino', 'Identity', 13, 3, 10, 'Domino', 'robots', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 14, 4, 10, 'Domino', 'version', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 15, 5, 10, 'Domino', 'enableSeo', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 16, 6, 10, 'Domino', 'langMain', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 17, 7, 10, 'Domino', 'frontPageEntry', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 18, 8, 10, 'Domino', 'languages', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 19, 3, 3, '', '', 'FieldSet', 'Themes', '', '', '', 0),
('Domino', 'Identity', 20, 4, 3, '', '', 'FieldSet', 'Technology', '', '', '', 0),
('Domino', 'Identity', 21, 1, 4, '', '', 'FieldSet', 'E-mails', '', '', '', 0),
('Domino', 'Identity', 22, 1, 19, 'Domino', 'themeColor1', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 23, 2, 19, 'Domino', 'themeColor2', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 24, 1, 20, 'Domino', 'techApp', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 25, 2, 20, 'Domino', 'techTemplate', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 26, 3, 20, 'Domino', 'techModel', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 27, 1, 21, 'Domino', 'emailContact', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 28, 2, 21, 'Domino', 'emailAdmin', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 29, 3, 21, 'Domino', 'emailOrder', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 30, 4, 21, 'Domino', 'emailStats', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 31, 6, 4, '', '', 'FieldSet', 'E-mail sending settings', '', '', '', 0),
('Domino', 'Identity', 32, 1, 31, 'Domino', 'emailSender', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 33, 2, 31, 'Domino', 'emailUsername', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 34, 3, 31, 'Domino', 'emailPassword', 'varchar', '', '', '', '', 0),
('Domino', 'Identity', 35, 4, 31, 'Domino', 'emailSmtp', 'varchar', '', '', '', '', 0),
('Domino', 'ModulesCrossed', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'ModulesCrossed', 2, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'ModulesCrossed', 3, 1, 2, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'ModulesCrossed', 4, 1, 3, 'Domino', 'developeer', 'varchar', '', '', '', '', 0),
('Domino', 'ModulesCrossed', 5, 2, 3, 'Domino', 'module', 'varchar', '', '', '', '', 0),
('Domino', 'ModulesCrossed', 6, 3, 3, 'Domino', 'developerRel', 'varchar', '', '', '', '', 0),
('Domino', 'ModulesCrossed', 7, 4, 3, 'Domino', 'moduleRel', 'varchar', '', '', '', '', 0),
('Domino', 'ViewsStructure', 12, 2, 4, '', '', 'tab', 'tabParams', '', '', '', 0),
('Domino', 'ViewsStructure', 13, 1, 12, 'Domino', 'componentParams', 'text', '', '', '', '', 0),
('Domino', 'ViewsStructure', 14, 2, 12, 'Domino', 'componentData', 'text', '', '', '', '', 0),
('Domino', 'User', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'User', 2, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'User', 3, 1, 2, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'User', 4, 1, 3, 'Domino', 'firstname', 'varchar', '', '', '', '', 0),
('Domino', 'User', 5, 2, 3, 'Domino', 'surname', 'varchar', '', '', '', '', 0),
('Domino', 'User', 6, 3, 3, 'Domino', 'email', 'varchar', '', '', '', '', 0),
('Domino', 'User', 7, 4, 3, 'Domino', 'username', 'varchar', '', '', '', '', 0),
('Domino', 'User', 8, 5, 3, 'Domino', 'password', 'password', '', '', '', '', 0),
('Domino', 'Developers', 1, 1, 0, '', '', 'horizontalBar', '', '', '', '', 0),
('Domino', 'Developers', 2, 2, 0, '', '', 'tabSet', '', '', '', '', 0),
('Domino', 'Developers', 3, 1, 2, '', '', 'tab', 'tabName', '', '', '', 0),
('Domino', 'Developers', 4, 1, 3, 'Domino', 'name', 'varchar', '', '', '', '', 0),
('Domino', 'Developers', 5, 2, 3, 'Domino', 'username', 'varchar', '', '', '', '', 0),
('Domino', 'Developers', 6, 3, 3, 'Domino', 'email', 'varchar', '', '', '', '', 0),
('Domino', 'Developers', 7, 1, 1, 'Domino', 'status', 'bool', '', '', '', '', 0),
('Domino', 'Developers', 8, 2, 2, '', '', 'tab', 'tabContent', '', '', '', 0),
('Domino', 'Developers', 9, 1, 8, 'Domino', 'content', 'textEditor', '', '', '', '', 0),
('Domino', 'Developers', 10, 4, 3, 'Domino', 'url', 'varchar', '', '', '', '', 0),
('Domino', 'Developers', 11, 3, 2, '', '', 'tab', 'tabPictures', '', '', '', 0),
('Domino', 'Developers', 12, 1, 11, '', '', 'pictures', '', '', '', '', 0),
('Domino', 'LibItems', 7, 2, 2, '', '', 'tab', 'tabView', '', '', '', 0),
('Domino', 'LibItems', 8, 3, 2, '', '', 'tab', 'tabController', '', '', '', 0),
('Domino', 'LibItems', 9, 4, 2, '', '', 'tab', 'tabModel', '', '', '', 0),
('Domino', 'LibItems', 10, 1, 7, 'Domino', 'view', 'code', '', '', '', '', 0),
('Domino', 'LibItems', 11, 1, 8, 'Domino', 'controller', 'code', '', '', '', '', 0),
('Domino', 'LibItems', 12, 1, 9, 'Domino', 'model', 'code', '', '', '', '', 0),
('Domino', 'LibItems', 13, 5, 2, '', '', 'tab', 'tabTheme', '', '', '', 0),
('Domino', 'LibItems', 14, 1, 13, 'Domino', 'theme', 'code', '', '', '', '', 0),
('Domino', 'LibItems', 15, 6, 2, '', '', 'tab', 'tabViewSsr', '', '', '', 0),
('Domino', 'LibItems', 16, 1, 15, 'Domino', 'viewSsr', 'code', '', '', '', '', 0),
('Domino', 'LibItems', 17, 7, 2, '', '', 'tab', 'tabThemeSettings', '', '', '', 0),
('Domino', 'LibItems', 18, 1, 17, 'Domino', 'themeSettings', 'code', '', '', '', '', 0),
('Domino', 'ContentBlocks', 21, 4, 10, '', '', 'tab', 'tabFiles', '', '', '', 0),
('Domino', 'ContentBlocks', 22, 5, 10, '', '', 'tab', 'tabCross', '', '', '', 0),
('Domino', 'ContentBlocks', 23, 1, 21, '', '', 'files', '', '', '', '', 0),
('Domino', 'ContentBlocks', 24, 1, 22, '', '', 'cross', '', '', '', '', 0);
