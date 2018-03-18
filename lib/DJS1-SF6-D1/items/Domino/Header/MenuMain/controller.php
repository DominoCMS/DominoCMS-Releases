<?php
/**
 * filename: MenuMainController.php
 * developer: Domino
 * item: MenuMain
 * version: v1.0.0
 * date: 14. 8. 17
 */
class DominoHeaderMenuMainController {

	function indexAction ( $data ) {

		global $site;
		global $params;
		$util = new DCUtil();

		$menus = array('Domino.Menu.main','Domino.Menu.service');

		$ret = array(
			'entries' => array()
		);

		foreach ( $menus AS $menu )
			$ret['entries'][$menu] = $this->menuStructure( $menu );

		return $ret;
	}
	function menuStructure ( $parent ) {

		global $site;
		global $params;
		$util = new DCUtil();

		$entries = array();
        //if ( $site['db'] == 'tecajzacoln')
          //  print "select si.*,mt.name AS Name,ut.urlname AS Urlname,ut.urlpath AS Urlpath FROM ".$site['db'].".DCDominoSiteIndex si JOIN ".$site['db'].".DCDominoContent mt ON ( si.id = mt.id ) LEFT JOIN ".$site['db'].".DCDominoSiteSlugs ut ON ( si.entry = ut.entry )  WHERE si.parent='".$parent."' AND si.module NOT IN ('ContentBlocks') AND si.status=1 AND si.privacy=0 AND mt.lang='".$site['lang']."' ORDER BY si.`order` ASC;";


		$sql = $util->dominoSql("select si.*,mt.name AS Name,ut.urlname AS Urlname,ut.urlpath AS Urlpath FROM ".$site['db'].".DCDominoSiteIndex si LEFT JOIN ".$site['db'].".DCDominoContent mt ON ( si.id = mt.id ) LEFT JOIN ".$site['db'].".DCDominoSiteSlugs ut ON ( si.entry = ut.entry )  WHERE si.parent='".$parent."' AND si.module IN ('Content') AND si.status=1 AND si.privacy=0 AND mt.lang='".$site['lang']."' AND ut.lang='".$site['lang']."' ORDER BY si.`order` ASC;",'fetch_array');
		if ( $sql )
			foreach ( $sql AS $row ) {


				if ( $site['page']['idFront'] == $row["id"] && ( $row["developer"] == 'Domino' ) && ( $row["module"] == 'Content' )  )
					$link = '';
				else {
					if ( $row["ghost"] == 1 )
						$link = $site['urlLang'].$row["Urlpath"]."#".$row["Urlname"];
					else
						$link = $site['urlLang'].$row["Urlpath"]."/".$row["Urlname"];
				}

				$entries[] = array(
					'entry' => $row["entry"],
					'name' => $row["Name"],
					'active' => ( $row["entry"] == $site['page']['entry'] ) ? 1 : 0,
					//'icon' => $icon2 ? $icon2["name"] : '',
					'link' => $link,
					'children' => $this->menuStructure( $row["developer"].'.'.$row["module"].'.'.$row["id"] )
				);
			}

		return $entries;
	}
	public function refreshAction ( $data ) {

		global $params;

		if ( isset ( $params['levels'][ $params['contentRootLevel'] ]['entry'] ) )
			return $params['levels'][ $params['contentRootLevel'] ]['entry'];

	}
}