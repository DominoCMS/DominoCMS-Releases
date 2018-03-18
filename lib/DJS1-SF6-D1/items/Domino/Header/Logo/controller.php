<?php
/**
 * filename: LogoController.php
 * developer: Domino
 * item: Header
 * version: v1.0.0
 * date: 14. 8. 17
 */
class DominoHeaderLogoController {

	function indexAction ( $data ) {

		global $site;
		global $params;

		$util = new DCUtil();

		$ret = array(
			'class' => 'logo-primary',
			'link' => $site['urlLang'] ? $site['urlLang'] : '/'
		);

		return $ret;
	}
}