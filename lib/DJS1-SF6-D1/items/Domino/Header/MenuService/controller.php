<?php
/**
 * filename: MenuServiceController.php
 * developer: Domino
 * item: MenuService
 * version: v1.0.0
 * date: 14. 8. 17
 */
class DominoHeaderMenuServiceController {

	function indexAction ( $data ) {

		global $site;
		global $params;
		$util = new DCUtil();
		$menu = 'Domino.Menu.service';

		$ret = array(
			'entries' => array()
		);
		$sql = $util->dominoSql("select si.*,ut.name AS Name,ut.urlname AS Urlname,ut.urlpath AS Urlpath FROM ".$site['db'].".DCDominoSiteIndex si JOIN ".$site['db'].".DCDominoSiteSlugs ut ON ( si.entry = ut.entry ) WHERE si.parent='".$menu."' AND si.status=1 AND si.privacy=0 AND si.ghost=0 AND ut.lang='".$site['lang']."' ORDER BY si.`order` ASC;",'fetch_array');
		if ( $sql )
			foreach ( $sql AS $row ) {

				$ret['entries'][] = array(
					'entry' => $row["entry"],
					'name' => $row["Name"],
					'active' => ( $site['page']['id'] == $row["id"] ) ? 1 : 0,
					'link' => ( $site['page']['idFront'] == $row["id"] ) ? '/' : $site['urlLang'].$row["Urlpath"]."/".$row["Urlname"]
				);
			}

		return $ret;
	}
	public function refreshAction ( $data ) {

        global $params;

        if ( isset ( $params['levels'][ $params['contentRootLevel'] ]['entry'] ) )
            return $params['levels'][ $params['contentRootLevel'] ]['entry'];

	}
}