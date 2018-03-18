<?php
require_once ($config['libRoot'] . 'items/Domino/Entry/DJS1-SF6-D1/Edit/controller.php');
//require_once ( $config['libRoot'] . 'modules/Domino/Users/controller.php' );
class DominoAdminEntryListFieldDeployController extends DCBaseController {

    function indexAction( $data ) {

    }

    public function listStructureData ( $col, $data ) {


        $value = '';

        return '';

    }
    public function deployAction ( $data ) {

        global $identity;
        global $config;
        $util = new DCUtil();
        $entryEditClass = new DominoAdminEntryEditController();

        $element = $util->sanitize($data['element']);
        $developer = $util->sanitize($data['developer']);
        $module = $util->sanitize($data['module']);
        $id = $util->sanitize( $data['id'] );
        $idExplode = explode ('.',$id);

        $idExploded = explode ('|',$idExplode[2] );
        $moduleDeveloper = $idExploded[0];
        $moduleId = $idExploded[1];


        if ( $module == 'LibItems' ) {


            return $this->updateItemAction ( $moduleDeveloper, $moduleId );

        }
        else if ( $module == 'LibThemes' ) {

            return $this->updateThemeAction ( $moduleDeveloper, $moduleId );

        }


    }
    function updateItemAction ( $developer, $module ) {

        global $config;
        $util = new DCUtil();

        // update item from store

        $technology = 'DJS1-SF6-D1';

        // Get array of all source files
        $files = $util->scanFiles( $_SERVER["DOCUMENT_ROOT"] . '/../private/store/items//'.$developer.'/'.$module.'/' );
        // Identify directories
        $source = $_SERVER["DOCUMENT_ROOT"] . '/../private/store/items/'.$developer.'/'.$module.'/';

        if ( !file_exists ( $_SERVER["DOCUMENT_ROOT"] . '/../private/lib/items/'.$developer.'/'.$module.'/' ) )
            mkdir($_SERVER["DOCUMENT_ROOT"] . '/../private/lib/items/'.$developer.'/'.$module.'/');

        $destination = $_SERVER["DOCUMENT_ROOT"] . '/../private/lib/items/'.$developer.'/'.$module.'/';
        // Cycle through all source files
        $copy = array();

        //print_r($files);


        foreach ( $files as $file ) {
            if (in_array($file, array(".",".."))) continue;
            //print $file;
            // If we copied this successfully, mark it for deletion
            $copy[] = $destination.$file;

            if ( !is_dir( $source.$file ) )
                copy($source.$file, $destination.$file);
            else {
                if (!file_exists($destination . $file))
                    mkdir( $destination . $file );
            }
        }

        return $copy;
    }
    function updateThemeAction ( $developer, $id ) {

        global $site;
        global $config;
        $util = new DCUtil();

        // update item from store

        // Get array of all source files
        $files = $util->scanFiles( $_SERVER["DOCUMENT_ROOT"] . '/../private/store/themes/'.$developer.'/'.$id.'/' );
        // Identify directories
        $source = $_SERVER["DOCUMENT_ROOT"] . '/../private/store/themes/'.$developer.'/'.$id.'/';

        if ( !file_exists ( $_SERVER["DOCUMENT_ROOT"] . '/../private/lib/themes/'.$developer.'/'.$id.'/' ) )
            mkdir($_SERVER["DOCUMENT_ROOT"] . '/../private/lib/themes/'.$developer.'/'.$id.'/');

        $destination = $_SERVER["DOCUMENT_ROOT"] . '/../private/lib/themes/'.$developer.'/'.$id.'/';
        // Cycle through all source files
        $copy = array();


        foreach ( $files as $file ) {
            if (in_array($file, array(".",".."))) continue;
            //print $file;
            // If we copied this successfully, mark it for deletion
            $copy[] = $destination.$file;
            if ( !is_dir( $source.$file ) )
                copy($source.$file, $destination.$file);
            else {
                if (!file_exists($destination . $file))
                    mkdir( $destination . $file );
            }
        }

        return $copy;
    }
}