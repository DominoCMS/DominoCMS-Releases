
CREATE TABLE IF NOT EXISTS `DCDominoLibModulesCols` (
  `developer` varchar(255) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  `elementDeveloper` varchar(255) NOT NULL,
  `element` varchar(255) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `colType` varchar(255) NOT NULL,
  `colLength` varchar(255) NOT NULL,
  `colNull` varchar(255) NOT NULL,
  `validation` varchar(255) NOT NULL,
  `defaultVal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `DCDominoLibModulesCols` (`developer`, `module`, `elementDeveloper`, `element`, `order`, `colType`, `colLength`, `colNull`, `validation`, `defaultVal`) VALUES
('Domino', 'Content', 'Domino', 'name', 2, '', '', '', '', ''),
('Domino', 'Content', 'Domino', 'subtitle', 3, '', '', '', '', ''),
('Domino', 'Content', 'Domino', 'content', 4, '', '', '', '', ''),
('Domino', 'SiteTitle', 'Domino', 'name', 1, '', '', '', '', ''),
('Domino', 'SiteTitle', 'Domino', 'description', 2, '', '', '', '', ''),
('Domino', 'Content', 'Domino', 'content2', 5, '', '', '', '', ''),
('Domino', 'LibModulesColsTypes', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'LibModulesStructureTypes', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'Languages', 'Domino', 'lang', 1, '', '', '', '', ''),
('Domino', 'Languages', 'Domino', 'iso31662', 2, '', '', '', '', ''),
('Domino', 'Languages', 'Domino', 'name', 3, '', '', '', '', ''),
('Domino', 'Languages', 'Domino', 'iso6392', 4, '', '', '', '', ''),
('Domino', 'Menu', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'Menu', 'Domino', 'name', 2, '', '', '', '', ''),
('Domino', 'Translations', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'Translations', 'Domino', 'name', 2, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'email', 2, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'username', 3, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'password', 4, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'firstname', 5, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'surname', 6, '', '', '', '', ''),
('Domino', 'LibModulesElements', 'Domino', 'element', 1, '', '', '', '', ''),
('Domino', 'LibModulesElements', 'Domino', 'developer', 2, '', '', '', '', ''),
('Domino', 'LibModulesElements', 'Domino', 'colName', 3, '', '', '', '', ''),
('Domino', 'LibModulesElements', 'Domino', 'colType', 4, '', '', '', '', ''),
('Domino', 'LibModulesElements', 'Domino', 'colLength', 5, '', '', '', '', ''),
('Domino', 'LibModulesElements', 'Domino', 'colNull', 6, '', '', '', '', ''),
('Domino', 'LibModulesElements', 'Domino', 'icon', 7, '', '', '', '', ''),
('Domino', 'LibModulesElements', 'Domino', 'structureType', 8, '', '', '', '', ''),
('Domino', 'LibModulesElements', 'Domino', 'validate', 9, '', '', '', '', ''),
('Domino', 'LibModulesElementsNames', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'LibModulesElementsNames', 'Domino', 'element', 2, '', '', '', '', ''),
('Domino', 'LibModulesElementsNames', 'Domino', 'name', 3, '', '', '', '', ''),
('Domino', 'Timestamps', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'Timestamps', 'Domino', 'module', 2, '', '', '', '', ''),
('Domino', 'Timestamps', 'Domino', 'id', 3, '', '', '', '', ''),
('Domino', 'Timestamps', 'Domino', 'dateCreated', 4, '', '', '', '', ''),
('Domino', 'Timestamps', 'Domino', 'userId', 5, '', '', '', '', ''),
('Domino', 'UsersLoginLog', 'Domino', 'dateCreated', 1, '', '', '', '', ''),
('Domino', 'UsersLoginLog', 'Domino', 'userId', 2, '', '', '', '', ''),
('Domino', 'UsersLoginLog', 'Domino', 'dateEnd', 3, '', '', '', '', ''),
('Domino', 'Keywords', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'Keywords', 'Domino', 'keyword', 2, '', '', '', '', ''),
('Domino', 'Keywords', 'Domino', 'content', 3, '', '', '', '', ''),
('Domino', 'Content', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'name', 2, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'subtitle', 3, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'content', 4, '', '', '', '', ''),
('Domino', 'Pictures', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'Pictures', 'Domino', 'name', 2, '', '', '', '', ''),
('Domino', 'Pictures', 'Domino', 'filename', 3, '', '', '', '', ''),
('Domino', 'Pictures', 'Domino', 'photographer', 4, '', '', '', '', ''),
('Domino', 'Pictures', 'Domino', 'description', 5, '', '', '', '', ''),
('Domino', 'Pictures', 'Domino', 'fileExt', 6, '', '', '', '', ''),
('Domino', 'Pictures', 'Domino', 'originalName', 7, '', '', '', '', ''),
('Domino', 'Pictures', 'Domino', 'bgPosX', 8, '', '', '', '', ''),
('Domino', 'Pictures', 'Domino', 'bgPosY', 9, '', '', '', '', ''),
('Domino', 'Files', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'Files', 'Domino', 'name', 2, '', '', '', '', ''),
('Domino', 'Files', 'Domino', 'filename', 3, '', '', '', '', ''),
('Domino', 'Files', 'Domino', 'content', 4, '', '', '', '', ''),
('Domino', 'Files', 'Domino', 'fileExt', 5, '', '', '', '', ''),
('Domino', 'Files', 'Domino', 'originalName', 6, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'developer', 2, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'module', 3, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'id', 4, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'developerRel', 6, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'moduleRel', 7, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'idRel', 8, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'ordem', 9, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'developer', 2, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'module', 3, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'id', 4, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'entry', 1, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'entry', 1, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'entryRel', 5, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'entryRel', 5, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'developerRel', 6, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'moduleRel', 7, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'idRel', 8, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'ordem', 9, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'picProfile', 10, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'picCover', 11, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'status', 10, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'status', 12, '', '', '', '', ''),
('Domino', 'SiteTitle', 'Domino', 'author', 3, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'type', 5, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'theme', 6, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'component', 7, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'class', 8, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'subtype', 9, '', '', '', '', ''),
('Domino', 'Slideshow', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'Slideshow', 'Domino', 'name', 2, '', '', '', '', ''),
('Domino', 'Slideshow', 'Domino', 'dateStart', 3, '', '', '', '', ''),
('Domino', 'Slideshow', 'Domino', 'dateEnd', 4, '', '', '', '', ''),
('Domino', 'Slideshow', 'Domino', 'content', 5, '', '', '', '', ''),
('Domino', 'SlideshowSlides', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'SlideshowSlides', 'Domino', 'name', 2, '', '', '', '', ''),
('Domino', 'SlideshowSlides', 'Domino', 'dateStart', 3, '', '', '', '', ''),
('Domino', 'SlideshowSlides', 'Domino', 'dateEnd', 4, '', '', '', '', ''),
('Domino', 'SlideshowSlides', 'Domino', 'content', 5, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'componentData', 10, '', '', '', '', ''),
('Domino', 'ViewsStructure', 'Domino', 'viewDeveloper', 1, '', '', '', '', ''),
('Domino', 'ViewsStructure', 'Domino', 'developer', 2, '', '', '', '', ''),
('Domino', 'ViewsStructure', 'Domino', 'status', 4, '', '', '', '', ''),
('Domino', 'ViewsStructure', 'Domino', 'order', 5, '', '', '', '', ''),
('Domino', 'ViewsStructure', 'Domino', 'parent', 6, '', '', '', '', ''),
('Domino', 'Themes', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'Themes', 'Domino', 'theme', 2, '', '', '', '', ''),
('Domino', 'Themes', 'Domino', 'status', 4, '', '', '', '', ''),
('Domino', 'Content', 'Domino', 'metaTitle', 6, '', '', '', '', ''),
('Domino', 'Content', 'Domino', 'metaDescription', 7, '', '', '', '', ''),
('Domino', 'Content', 'Domino', 'metaKeywords', 8, '', '', '', '', ''),
('Domino', 'HeaderContact', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'HeaderContact', 'Domino', 'ordem', 2, '', '', '', '', ''),
('Domino', 'HeaderContact', 'Domino', 'name', 3, '', '', '', '', ''),
('Domino', 'HeaderContact', 'Domino', 'icon', 4, '', '', '', '', ''),
('Domino', 'HeaderContact', 'Domino', 'hide', 5, '', '', '', '', ''),
('Domino', 'HeaderContact', 'Domino', 'type', 6, '', '', '', '', ''),
('Domino', 'HeaderContact', 'Domino', 'url', 7, '', '', '', '', ''),
('Domino', 'HeaderContact', 'Domino', 'class', 8, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'componentParams', 11, '', '', '', '', ''),
('Domino', 'SiteTitle', 'Domino', 'id', 4, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'container', 12, '', '', '', '', ''),
('Domino', 'ContentBlocks', 'Domino', 'containerCol', 13, '', '', '', '', ''),
('Domino', 'HeaderContact', 'Domino', 'target', 9, '', '', '', '', ''),
('Domino', 'Pictures', 'Domino', 'status', 10, '', '', '', '', ''),
('Domino', 'Items', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'Items', 'Domino', 'item', 2, '', '', '', '', ''),
('Domino', 'Items', 'Domino', 'status', 3, '', '', '', '', ''),
('Domino', 'Items', 'Domino', 'order', 4, '', '', '', '', ''),
('Domino', 'ItemsSubitems', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'ItemsSubitems', 'Domino', 'item', 2, '', '', '', '', ''),
('Domino', 'ItemsSubitems', 'Domino', 'subitem', 3, '', '', '', '', ''),
('Domino', 'ItemsSubitems', 'Domino', 'status', 4, '', '', '', '', ''),
('Domino', 'ItemsSubitems', 'Domino', 'type', 5, '', '', '', '', ''),
('Domino', 'ItemsComponents', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'ItemsComponents', 'Domino', 'item', 2, '', '', '', '', ''),
('Domino', 'ItemsComponents', 'Domino', 'component', 3, '', '', '', '', ''),
('Domino', 'ItemsComponents', 'Domino', 'type', 4, '', '', '', '', ''),
('Domino', 'ItemsComponents', 'Domino', 'status', 5, '', '', '', '', ''),
('Domino', 'ItemsComponents', 'Domino', 'order', 6, '', '', '', '', ''),
('Domino', 'Views', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'Views', 'Domino', 'view', 2, '', '', '', '', ''),
('Domino', 'Views', 'Domino', 'status', 3, '', '', '', '', ''),
('Domino', 'ViewsStructure', 'Domino', 'view', 1, '', '', '', '', ''),
('Domino', 'ViewsStructure', 'Domino', 'component', 7, '', '', '', '', ''),
('Domino', 'LibThemes', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'LibThemes', 'Domino', 'id', 2, '', '', '', '', ''),
('Domino', 'LibThemes', 'Domino', 'status', 3, '', '', '', '', ''),
('Domino', 'Content', 'Domino', 'url', 9, '', '', '', '', ''),
('Domino', 'Files', 'Domino', 'author', 7, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'dateCreated', 11, '', '', '', '', ''),
('Domino', 'SiteCross', 'Domino', 'userId', 12, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'dateCreated', 13, '', '', '', '', ''),
('Domino', 'SiteCrossPictures', 'Domino', 'userId', 14, '', '', '', '', ''),
('Domino', 'LibItemsSubitems', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'LibItemsSubitems', 'Domino', 'item', 2, '', '', '', '', ''),
('Domino', 'LibItemsSubitems', 'Domino', 'subitem', 3, '', '', '', '', ''),
('Domino', 'LibItemsSubitems', 'Domino', 'type', 4, '', '', '', '', ''),
('Domino', 'LibItemsSubitems', 'Domino', 'status', 5, '', '', '', '', ''),
('Domino', 'LibItems', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'LibItems', 'Domino', 'item', 2, '', '', '', '', ''),
('Domino', 'LibItems', 'Domino', 'status', 3, '', '', '', '', ''),
('Domino', 'ViewsStructure', 'Domino', 'componentParams', 8, '', '', '', '', ''),
('Domino', 'ViewsStructure', 'Domino', 'componentData', 9, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'hash', 7, '', '', '', '', ''),
('Domino', 'Modules', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'Modules', 'Domino', 'module', 2, '', '', '', '', ''),
('Domino', 'Modules', 'Domino', 'status', 3, '', '', '', '', ''),
('Domino', 'Modules', 'Domino', 'parent', 1, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'name', 2, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'db', 3, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'username', 4, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'theme', 5, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'googleAnalytics', 6, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'open', 7, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'robots', 8, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'version', 9, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'enableSeo', 10, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'langMain', 11, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'frontPageEntry', 12, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'languages', 13, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'themeColor1', 14, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'themeColor2', 15, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'techApp', 16, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'techTemplate', 17, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'techModel', 18, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'emailContact', 19, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'emailAdmin', 20, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'emailOrder', 21, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'emailStats', 22, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'emailSender', 23, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'emailUsername', 24, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'emailPassword', 25, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'emailSmtp', 26, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'verJs', 27, '', '', '', '', ''),
('Domino', 'Identity', 'Domino', 'verCss', 28, '', '', '', '', ''),
('Domino', 'ModulesCrossed', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'ModulesCrossed', 'Domino', 'module', 3, '', '', '', '', ''),
('Domino', 'ModulesCrossed', 'Domino', 'developer', 2, '', '', '', '', ''),
('Domino', 'ModulesCrossed', 'Domino', 'developerRel', 4, '', '', '', '', ''),
('Domino', 'ModulesCrossed', 'Domino', 'moduleRel', 5, '', '', '', '', ''),
('Domino', 'ModulesCrossed', 'Domino', 'status', 6, '', '', '', '', ''),
('Domino', 'HeaderContact', 'Domino', 'status', 10, '', '', '', '', ''),
('Domino', 'Developers', 'Domino', 'id', 1, '', '', '', '', ''),
('Domino', 'Developers', 'Domino', 'name', 2, '', '', '', '', ''),
('Domino', 'Developers', 'Domino', 'username', 3, '', '', '', '', ''),
('Domino', 'Developers', 'Domino', 'content', 4, '', '', '', '', ''),
('Domino', 'Developers', 'Domino', 'email', 5, '', '', '', '', ''),
('Domino', 'Developers', 'Domino', 'status', 6, '', '', '', '', ''),
('Domino', 'Developers', 'Domino', 'url', 7, '', '', '', '', ''),
('Domino', 'UsersLoginFail', 'Domino', 'username', 1, '', '', '', '', ''),
('Domino', 'UsersLoginFail', 'Domino', 'userId', 2, '', '', '', '', ''),
('Domino', 'UsersLoginFail', 'Domino', 'dateCreated', 3, '', '', '', '', ''),
('Domino', 'UsersLoginFail', 'Domino', 'status', 4, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'address', 8, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'zip', 9, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'city', 10, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'country', 11, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'tel', 12, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'lang', 13, '', '', '', '', ''),
('Domino', 'Users', 'Domino', 'status', 14, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'indexId', 1, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'status', 2, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'order', 3, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'entry', 4, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'developer', 5, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'module', 6, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'id', 7, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'parent', 8, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'parentDeveloper', 9, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'parentModule', 10, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'parentId', 11, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'privacy', 12, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'views', 13, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'ghost', 14, '', '', '', '', ''),
('Domino', 'SiteIndex', 'Domino', 'icon', 15, '', '', '', '', ''),
('Domino', 'SiteSlugs', 'Domino', 'entry', 1, '', '', '', '', ''),
('Domino', 'SiteSlugs', 'Domino', 'developer', 2, '', '', '', '', ''),
('Domino', 'SiteSlugs', 'Domino', 'module', 3, '', '', '', '', ''),
('Domino', 'SiteSlugs', 'Domino', 'id', 4, '', '', '', '', ''),
('Domino', 'SiteSlugs', 'Domino', 'indexId', 5, '', '', '', '', ''),
('Domino', 'SiteSlugs', 'Domino', 'lang', 6, '', '', '', '', ''),
('Domino', 'SiteSlugs', 'Domino', 'urlname', 7, '', '', '', '', ''),
('Domino', 'SiteSlugs', 'Domino', 'name', 8, '', '', '', '', ''),
('Domino', 'SiteSlugs', 'Domino', 'urlpath', 9, '', '', '', '', ''),
('Domino', 'IdentityLanguages', 'Domino', 'lang', 1, '', '', '', '', ''),
('Domino', 'IdentityLanguages', 'Domino', 'ordem', 2, '', '', '', '', ''),
('Domino', 'IdentityDomains', 'Domino', 'domain', 1, '', '', '', '', ''),
('Domino', 'IdentityDomains', 'Domino', 'languages', 2, '', '', '', '', ''),
('Domino', 'IdentityDomains', 'Domino', 'lang', 3, '', '', '', '', ''),
('Domino', 'IdentityDomains', 'Domino', 'langMain', 4, '', '', '', '', ''),
('Domino', 'IdentityDomains', 'Domino', 'urlType', 5, '', '', '', '', ''),
('Domino', 'IdentityDomains', 'Domino', 'urlLangStandard', 6, '', '', '', '', ''),
('Domino', 'IdentityDomains', 'Domino', 'protocol', 7, '', '', '', '', ''),
('Domino', 'LibItemsComponents', 'Domino', 'developer', 1, '', '', '', '', ''),
('Domino', 'LibItemsComponents', 'Domino', 'item', 2, '', '', '', '', ''),
('Domino', 'LibItemsComponents', 'Domino', 'component', 3, '', '', '', '', ''),
('Domino', 'LibItemsComponents', 'Domino', 'type', 4, '', '', '', '', ''),
('Domino', 'LibItemsComponents', 'Domino', 'order', 5, '', '', '', '', ''),
('Domino', 'LibItemsComponents', 'Domino', 'included', 6, '', '', '', '', ''),
('Domino', 'LibItemsComponents', 'Domino', 'status', 7, '', '', '', '', '');