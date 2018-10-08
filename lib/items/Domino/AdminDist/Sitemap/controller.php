<?php
require_once ($config['libRoot'] . 'items/Domino/Entry/DJS1-SF6-D1/List/controller.php');
class DominoAdminSitemapController extends DCBaseController {

    function indexAction($data) {

        global $site;

        $entryListClass = new DominoAdminEntryListController();

        return $entryListClass->listAction(
            array(
                'actions' => array(),
                'subactions' => array(),
                'list' => array(
                    'options' => array(
                        'status' => 1,
                        'developer' => 'Domino',
                        'module' => 'Content',
                        'siteIndex' => true
                    )
                )
            )
        );

    }

}