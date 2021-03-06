
CREATE TABLE IF NOT EXISTS `DCDominoAdminSiteIndex` (
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


INSERT INTO `DCDominoAdminSiteIndex` (`status`, `order`, `entry`, `developer`, `module`, `id`, `parent`, `parentDeveloper`, `parentModule`, `parentId`, `privacy`, `views`, `ghost`, `icon`) VALUES
(1, 0, 'Domino.AdminContent.1', 'Domino', 'AdminContent', '1', 'Domino.Menu.hidden', 'Domino', 'Menu', 'hidden', 0, 'Domino.Admin,Domino.Admin.Front', 0, ''),
(1, 0, 'Domino.AdminContent.2', 'Domino', 'AdminContent', '2', 'Domino.Menu.hidden', 'Domino', 'Menu', 'hidden', 0, 'Domino.Admin.Loading', 0, ''),
(1, 0, 'Domino.AdminContent.3', 'Domino', 'AdminContent', '3', 'Domino.AdminMenu.login', 'Domino', 'AdminMenu', 'login', 0, 'Domino.Admin.Login,Domino.Admin.Login.Form', 0, ''),
(1, 0, 'Domino.AdminContent.4', 'Domino', 'AdminContent', '4', 'Domino.Menu.login', 'Domino', 'Menu', 'login', 0, 'Domino.Admin.Login,Domino.Admin.Login.Forgot', 0, ''),
(1, 0, 'Domino.AdminContent.5', 'Domino', 'AdminContent', '5', 'Domino.Menu.login', 'Domino', 'Menu', 'login', 0, 'Domino.Login,Domino.Login.LoginRegister', 0, ''),
(1, 0, 'Domino.AdminContent.6', 'Domino', 'AdminContent', '6', 'Domino.Menu.login', 'Domino', 'Menu', 'lo', 0, 'Domino.Login,Domino.Login.LoginReset', 0, ''),
(1, 2, 'Domino.AdminContent.7', 'Domino', 'AdminContent', '7', 'Domino.AdminMenu.account', 'Domino', 'AdminMenu', 'account', 0, 'Domino.Admin.Logout', 0, ''),
(1, 1, 'Domino.AdminContent.8', 'Domino', 'AdminContent', '8', 'Domino.AdminMenu.account', 'Domino', 'AdminMenu', 'account', 0, 'Domino.Admin,Domino.Admin.LinkGrid', 0, ''),
(1, 1, 'Domino.AdminContent.9', 'Domino', 'AdminContent', '9', 'Domino.AdminMenu.main', 'Domino', 'AdminMenu', 'main', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.Modules]', 0, ''),
(1, 0, 'Domino.AdminContent.12', 'Domino', 'AdminContent', '12', 'Domino.AdminContent.8', 'Domino', 'AdminContent', '8', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.User]', 0, ''),
(1, 3, 'Domino.AdminContent.11', 'Domino', 'AdminContent', '11', 'Domino.AdminMenu.main', 'Domino', 'AdminMenu', 'main', 0, 'Domino.Admin,Domino.Admin.LinkGrid', 0, ''),
(1, 0, 'Domino.AdminContent.17', 'Domino', 'AdminContent', '17', 'Domino.AdminContent.11', 'Domino', 'AdminContent', '11', 0, 'Domino.Admin,Domino.CCenter.Modules', 0, ''),
(1, 0, 'Domino.AdminContent.25', 'Domino', 'AdminContent', '25', 'Domino.AdminContent.11', 'Domino', 'AdminContent', '11', 0, 'Domino.Admin,Domino.CCenter.Modules', 0, ''),
(1, 0, 'Domino.AdminContent.26', 'Domino', 'AdminContent', '26', 'Domino.Menu.main', 'Domino', 'Menu', 'main', 0, 'Domino.Admin,Domino.Admin.Identities', 0, ''),
(1, 4, 'Domino.AdminContent.27', 'Domino', 'AdminContent', '27', 'Domino.Menu.identity', 'Domino', 'Menu', 'identity', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.Identity]', 0, ''),
(1, 2, 'Domino.AdminContent.10', 'Domino', 'AdminContent', '10', 'Domino.Menu.identity', 'Domino', 'Menu', 'identity', 0, 'Domino.Admin,Domino.Admin.Sitemap', 0, ''),
(1, 0, 'Domino.AdminContent.18', 'Domino', 'AdminContent', '18', 'Domino.AdminContent.11', 'Domino', 'AdminContent', '11', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.LibItems]', 0, ''),
(1, 2, 'Domino.AdminContent.13', 'Domino', 'AdminContent', '13', 'Domino.AdminMenu.main', 'Domino', 'AdminMenu', 'main', 0, 'Domino.Admin,Domino.Admin.LinkGrid', 0, ''),
(1, 0, 'Domino.AdminContent.14', 'Domino', 'AdminContent', '14', 'Domino.AdminContent.13', 'Domino', 'AdminContent', '13', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.Themes]', 0, ''),
(1, 0, 'Domino.AdminContent.19', 'Domino', 'AdminContent', '19', 'Domino.AdminContent.13', 'Domino', 'AdminContent', '13', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.Components]', 0, ''),
(1, 0, 'Domino.AdminContent.20', 'Domino', 'AdminContent', '20', 'Domino.AdminContent.13', 'Domino', 'AdminContent', '13', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.Modules]', 0, ''),
(1, 0, 'Domino.AdminContent.21', 'Domino', 'AdminContent', '21', 'Domino.AdminContent.13', 'Domino', 'AdminContent', '13', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.Items]', 0, ''),
(1, 4, 'Domino.AdminContent.15', 'Domino', 'AdminContent', '15', 'Domino.AdminMenu.main', 'Domino', 'AdminMenu', 'main', 0, 'Domino.Admin,Domino.Admin.LinkGrid', 0, ''),
(1, 0, 'Domino.AdminContent.16', 'Domino', 'AdminContent', '16', 'Domino.AdminContent.15', 'Domino', 'AdminContent', '15', 0, 'Domino.Admin,Domino.Store.ListModules', 0, ''),
(1, 0, 'Domino.AdminContent.22', 'Domino', 'AdminContent', '22', 'Domino.AdminContent.15', 'Domino', 'AdminContent', '15', 0, 'Domino.Admin,Domino.Store.ListComponents', 0, ''),
(1, 0, 'Domino.AdminContent.23', 'Domino', 'AdminContent', '23', 'Domino.AdminContent.15', 'Domino', 'AdminContent', '15', 0, 'Domino.Admin,Domino.Store.ListThemes', 0, ''),
(1, 0, 'Domino.AdminContent.24', 'Domino', 'AdminContent', '24', 'Domino.AdminContent.26', 'Domino', 'AdminContent', '26', 0, 'Domino.Admin,Domino.Identities.New', 0, ''),
(1, 5, 'Domino.AdminContent.28', 'Domino', 'AdminContent', '28', 'Domino.AdminContent.13', 'Domino', 'AdminContent', '13', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.Views]', 0, ''),
(1, 6, 'Domino.AdminContent.29', 'Domino', 'AdminContent', '29', 'Domino.AdminContent.11', 'Domino', 'AdminContent', '11', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.LibThemes]', 0, ''),
(0, 7, 'Domino.AdminContent.30', 'Domino', 'AdminContent', '30', 'Domino.AdminContent.13', 'Domino', 'AdminContent', '13', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.ItemsSubitems]', 0, ''),
(0, 8, 'Domino.AdminContent.31', 'Domino', 'AdminContent', '31', 'Domino.AdminContent.13', 'Domino', 'AdminContent', '13', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.ViewsStructure]', 0, ''),
(0, 9, 'Domino.AdminContent.32', 'Domino', 'AdminContent', '32', 'Domino.AdminContent.11', 'Domino', 'AdminContent', '11', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.LibItemsSubitems]', 0, ''),
(1, 10, 'Domino.AdminContent.33', 'Domino', 'AdminContent', '33', 'Domino.AdminContent.11', 'Domino', 'AdminContent', '11', 0, 'Domino.Admin,Domino.Admin.Modules[Domino.LibTemplates]', 0, '');
