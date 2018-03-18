<?php
require_once ($config['root']."items/Domino/Modules/DJS1-SF6-D1/controller.php");
class DominoAdminEntryListFieldPicturesController extends DCBaseController {

    function indexAction( $data ) {

        global $config;
        $util = new DCUtil();

        return array(
            'auth' => $config['auth']
        );

    }
    function uploadAction ( $data ) {


        global $config;
        global $identity;
        $util = new DCUtil();

        $file = $data['files']; //$_FILES

        // Set the allowed file extensions
        $fileTypes = array('jpg', 'jpeg', 'gif', 'png'); // Allowed file extensions
        $uploadDir = $identity['root'].'modules/Domino/Pictures/';

        $mainDeveloper = $data['mainDeveloper'];
        $mainModule = $data['mainModule'];
        $mainId = $data['mainId'];

        $entryDeveloper = 'Domino';
        $entryModule = 'Pictures';

        $modulesClass = new DCLibModulesDominoModules();
        $libModule = $modulesClass->moduleVars( $entryDeveloper, $entryModule );
        $colsMain = $modulesClass->getColsMain( $libModule['developer'], $libModule['module'] );

        if ( !empty( $file ) ) {

            $fileTmp = $file['Filedata']['tmp_name'];
            $fileName = $file['Filedata']['name'];


            $targetFile = $uploadDir . $_FILES['Filedata']['name'];

            // Validate the filetype
            $fileParts = pathinfo($fileName);
            $fileExt = strtolower($fileParts['extension']);

            $name = rtrim($fileName,".".$fileExt);

            // If extension is allowed
            if ( in_array( $fileExt, $fileTypes ) ) {

                #################################
                ### Insert to Module table and SiteIndex
                #################################

                // Get NewInsertId
                $colMain = $colsMain[0]['element'];
                $lastEntry = $util->dominoSql("select ".$colMain." FROM " . $identity['db'] . "." . $entryDeveloper. $entryModule . " ORDER BY CAST(".$colMain." AS UNSIGNED) DESC LIMIT 1;", 'fetch_one');
                $entryId = $lastEntry['id'] + 1;

                // Get the dimensions
                $dimSql = $modulesClass->getDimensions( $mainDeveloper, $mainModule );

                /*foreach ( $dimSql AS $dimension ) {

                    $dimensionModule = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModules WHERE developer='".$dimension['dimensionDeveloper']."' AND module='".$dimension['dimensionModule']."';", 'fetch_one');
                    $dimensionInstances = $util->dominoSql("select * FROM " . $identity['db'] . ".DC".$dimension['dimensionDeveloper'].$dimension['dimensionModule']." ORDER BY ".$dimensionModule["queryOrderBy"]." ".$dimensionModule["querySort"].";", 'fetch_array');

                    $dimensionColsMain = $modulesClass->getColsMain($dimension['dimensionDeveloper'], $dimension['dimensionModule']);

                    foreach ( $dimensionInstances AS $instance ) {

                        $colMain = $dimensionColsMain[0]['element'];

                        // Add dimension
                        $fields .= "`".$dimension['element'] . "`,";
                        $values .= "'" . $instance[$colMain] . "',";

                        // INSERT 2 MODULE table
                        if ( $entryEmpty !== NULL )
                            $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".".$entryDeveloper.$entryModule." (id,name,filename,fileExt) VALUES (" . rtrim($values, ',') . ");", 'insert');

                    }

                }

                // Insert in SiteIndex
                $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoSiteIndex (status,`order`,developer,`module`,id,parent,parentDeveloper,parentModule,parentId,privacy) VALUES ('1','0','".$entryDeveloper."','".$entryModule."','" . $entryId . "','','','','',0);", 'insert');

                // Insert Timestamp
                global $user;
                $date = new DCDate();
                $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoTimestamps (developer,module,id,userId,dateCreated) VALUES ('".$entryDeveloper."','".$entryModule."','".$entryId."','".$user['id']."','".$date->dateNowInt()."');", 'insert');

                // Save the file
                move_uploaded_file( $fileTmp, $uploadDir.$entryId.".".$fileExt );

                #################################
                ### Cross with entry
                #################################

                // Get next order value
                $entries = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteCrossPictures WHERE status=1;",'fetch_array');
                $next = count( $entries ) + 1;

                // Check if profile pic
                $picProfile = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteCrossPictures WHERE status=1 AND picProfile=1;",'fetch_one');
                $PicProfile  = $picProfile ? 1 : 0;

                // Create cross
                $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoSiteCrossPictures (theme,developer,item,filename,type,`order`) VALUES ('".$data['theme']."','".$data['developer']."','".$data['item']."','".$data['filename']."','".$data['type']."','".$data['order']."');", 'insert');

*/
                #################################
                ### Return to Frontend
                #################################
/*
                return array(
                    'success' => true,
                    "id" => $cross_id,
                    "name" => $name,
                    "picProfile" => $PicProfile,
                    "filename" => $urlname,
                    "edit" => $edit["link"]."/".$cross_id,
                    "thumb" => DominoPic( array( "id" => $NewId, "ModuleId" => $Module, "width"=>250, "file_ext"=>$file_ext, "IdentityRoot" => $IdentityRoot ) ),
                );*/

            }
            else
                return array(
                    'success' => false
                );
        }

    }
    public function structureData ( $data ) {

        global $site;
        global $config;


        $ret = array(
            array(
                'name' => "test"
            )
        );



        return $ret;

    }
    public function listStructureData ( $data ) {

        global $site;
        global $config;


        $ret = array(
            array(
                'name' => "test"
            )
        );



        return $ret;

    }
}