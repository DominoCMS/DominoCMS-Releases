<?php
require_once ($config['libRoot'] . '/DJS1-SF6-D1/items/Domino/Admin/Entry/controller.php');
class DominoAdminEntryEditFieldFilesController extends DCBaseController {

    function indexAction( $data ) {

        global $config;
        $util = new DCUtil();

        return array(
            'auth' => $config['auth']
        );

    }
    function testAction ( $data ) {


        return $data;
    }
    function uploadAction ( $data ) {


        global $config;
        global $identity;
        $util = new DCUtil();

        // Set the allowed file extensions
        $fileTypes = array('jpg', 'jpeg', 'gif', 'png', 'zip', 'doc', 'docx', 'pdf', 'rtf', 'txt', 'ai', 'rar'); // Allowed file extensions
        $uploadDir = $identity['root'].'modules/Domino/Files/';

        $mainDeveloper = $data['mainDeveloper'];
        $mainModule = $data['mainModule'];
        $mainId = $data['mainId'];
        $mainEntry = $data['mainDeveloper'].".".$data['mainModule'].".".$data['mainId'];

        $entryDeveloper = $data['developer'];
        $entryModule = $data['module'];

        $entryEditClass = new DominoAdminEntryEditController();
        $libModule = $entryEditClass->moduleVars( $entryDeveloper, $entryModule );
        $colsMain = $entryEditClass->getColsMain( $libModule['developer'], $libModule['module'] );

        //if ( !empty( $file ) ) {

            $fileTmp = $data['file'];
            $fileName = $data['name'];

            $targetFile = $uploadDir . $data['name'];

            // Validate the filetype
            $fileParts = pathinfo($data['name']);
            $fileExt = strtolower($fileParts['extension']);

            $name = rtrim($data['name'],".".$fileExt);

            // If extension is allowed
            if ( in_array( $fileExt, $fileTypes ) ) {

                #################################
                ### Insert to Module table and SiteIndex
                #################################

                // Get NewInsertId
                $colMain = $colsMain[0]['element'];
                $lastEntry = $util->dominoSql("select ".$colMain." FROM " . $identity['db'] . ".DC" . $entryDeveloper. $entryModule . " ORDER BY CAST(".$colMain." AS UNSIGNED) DESC LIMIT 1;", 'fetch_one');
                $entryId = $lastEntry['id'] + 1;
                $entry = $entryDeveloper.".".$entryModule.".".$entryId;

                // Save the file
                move_uploaded_file( $fileTmp, $uploadDir.$entryId.".".$fileExt );

                // Get the dimensions
                $dimSql = $entryEditClass->getDimensions( $mainDeveloper, $mainModule );

                $retEntry = array();
                foreach ( $dimSql AS $dimension ) {

                    $dimensionModule = $util->dominoSql("select * FROM " . $config['db'] . ".DCDominoLibModules WHERE developer='".$dimension['dimensionDeveloper']."' AND module='".$dimension['dimensionModule']."';", 'fetch_one');
                    $dimensionInstances = $util->dominoSql("select * FROM " . $identity['db'] . ".DC".$dimension['dimensionDeveloper'].$dimension['dimensionModule']." ORDER BY ".$dimensionModule["queryOrderBy"]." ".$dimensionModule["querySort"].";", 'fetch_array');

                    $dimensionColsMain = $entryEditClass->getColsMain($dimension['dimensionDeveloper'], $dimension['dimensionModule']);

                    $fields = "`id`,originalName,fileExt,";
                    $values = "'".$entryId."','".$data['name']."','".$fileExt."',";

                    foreach ( $dimensionInstances AS $instance ) {

                        $colMain = $dimensionColsMain[0]['element'];

                        $isEntry = $util->dominoSql("select * FROM " . $identity['db'] . ".DC" . $mainDeveloper. $mainModule . " WHERE id='".$mainId."' AND lang='".$instance[$colMain]."';", 'fetch_one');

                        if ( $isEntry ) {

                            $name = rtrim($data['name'],'.'.$fileExt);
                            $filename = $util->urlNameGen($name);
                            $filename = $util->uniqueFilename(
                                array (
                                    'db' => $identity["db"],
                                    'lang' => $instance[$colMain],
                                    'filename' => $filename,
                                    'newFilename' => $filename,
                                    'level' => 1,
                                    'developer' => $data['developer'],
                                    'module' => $data['module'],
                                    'id' => $entryId
                                ));

                            // Add dimension
                            $fields .= "`".$dimension['element'] . "`,name,filename";
                            $values .= "'" . $instance[$colMain] . "','".$name."','".$filename."',";

                            // INSERT 2 MODULE table if main  entry in that language exists
                            $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".DC".$entryDeveloper.$entryModule." (".rtrim($fields, ',').") VALUES (" . rtrim($values, ',') . ");", 'insert');

                            $retEntry[$instance[$colMain]] = array(
                                'name' => $name,
                                'filename' => $filename
                            );
                        }

                    }

                }
                // Insert in SiteIndex
                $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoSiteIndex (status,`order`,entry,developer,`module`,id,parent,parentDeveloper,parentModule,parentId,privacy) VALUES ('1','0','".$entry."','".$entryDeveloper."','".$entryModule."','" . $entryId . "','','','','',0);", 'insert');

                // Insert Timestamp
                global $user;
                $date = new DCDate();
                $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoTimestamps (developer,module,id,userId,dateCreated) VALUES ('".$entryDeveloper."','".$entryModule."','".$entryId."','".$user['id']."','".$date->dateNowInt()."');", 'insert');


                #################################
                ### Cross with entry
                #################################

                // Get next order value
                $entries = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteCross WHERE entry='".$mainEntry."';",'fetch_array'); // AND status=1
                $next = count( $entries ) + 1;

                // Create cross
                $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoSiteCross (entry,developer,`module`,id,entryRel,developerRel,moduleRel,idRel,status,`ordem`) VALUES ('".$mainEntry."','".$mainDeveloper."','".$mainModule."','".$mainId."','".$entry."','".$entryDeveloper."','".$entryModule."','".$entryId."','1','".$next."');", 'insert');

                #################################
                ### Return to Frontend
                #################################

                $link = "";
                return array(
                    'success' => true,
                    "id" => $entryId,
                    "entry" => $retEntry,
                    "edit" => $link."/".$entryId,
                    //"thumb" => DominoPic( array( "id" => $NewId, "ModuleId" => $Module, "width"=>250, "file_ext"=>$file_ext, "IdentityRoot" => $IdentityRoot ) ),
                );

            }
            else
                return array(
                    'success' => false
                );
       // }

    }
    public function structureData ( $entry, $data ) {

        global $config;
        global $site;
        $util = new DCUtil();

            if ( isset( $data["moduleData"]["developer"] ) ) {

                $files = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoSiteCross WHERE entry='".$data["moduleData"]["developer"].".".$data["moduleData"]["module"].".".$data["moduleData"]["id"]."' AND status<3;",'fetch_array');

                $ret = array(
                    'entries' => $files,
                    'mainDeveloper' => $data["moduleData"]["developer"],
                    'mainModule' => $data["moduleData"]["module"],
                    'mainId' => $data["moduleData"]["id"],
                    'crossLink' => '/si/moduli?developer=Domino&module=SiteCross&id='.$data["moduleData"]["developer"].'.'.$data["moduleData"]["module"].'.'.$data["moduleData"]["id"].'|',
                    'fileLink' => '/si/moduli?developer=Domino&module=Files&id='
                );


                    return $ret;
            }

    }
    public function prepareInsert ( $data ) {

        global $site;
        global $config;


        $ret = array(
            array(
                'name' => "test"
            )
        );



        return $ret;

    }
    function deleteAction ( $data ) {

        global $identity;
        $util = new DCUtil();

        $update = $util->dominoSql( "DELETE FROM " . $identity['db'] . ".DCDominoSiteCross WHERE entry='".$data['entry']."' AND entryRel='".$data['entryRel']."';", 'update');


        return $data;
    }
    function manualCrossAction ( $data ) {

        global $identity;
        $util = new DCUtil();

        $entry = explode('.',$data['entry']);
        $entryRel = explode('.',$data['newEntry']);

        $entries = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteCross WHERE entry='".$data['entry']."';",'fetch_array');
        $next = count( $entries ) + 1;

        $update = $util->dominoSql( "INSERT INTO " . $identity['db'] . ".DCDominoSiteCross (`entry`, `developer`, `module`, `id`, `entryRel`, `developerRel`, `moduleRel`, `idRel`, `ordem`, `status`) VALUES ('".$data['entry']."','".$entry[0]."','".$entry[1]."','".$entry[2]."','".$data['newEntry']."','".$entryRel[0]."','".$entryRel[1]."','".$entryRel[2]."','".$next."','1');", 'insert');


        return $data;
    }
    public function uploadSingleAction ( $data ) {


        global $config;
        global $identity;
        $util = new DCUtil();

        // Set the allowed file extensions
        $fileTypes = array('jpg', 'jpeg', 'gif', 'png', 'zip', 'doc', 'docx', 'pdf', 'rtf', 'txt', 'ai', 'rar'); // Allowed file extensions
        $uploadDir = $identity['root'].'modules/Domino/Files/';

        $mainDeveloper = $data['mainDeveloper'];
        $mainModule = $data['mainModule'];
        $mainId = $data['mainId'];
        $mainEntry = $data['mainDeveloper'].".".$data['mainModule'].".".$data['mainId'];

        $entryDeveloper = $data['developer'];
        $entryModule = $data['module'];
        $entryId = $data['id'];

        $fileTmp = $data['file'];
        $fileName = $data['name'];

        $targetFile = $uploadDir . $data['name'];

        // Validate the filetype
        $fileParts = pathinfo($data['name']);
        $fileExt = strtolower($fileParts['extension']);

        $name = rtrim($data['name'],".".$fileExt);

        // If extension is allowed
        if ( in_array( $fileExt, $fileTypes ) ) {

            $entry = $entryDeveloper.".".$entryModule.".".$entryId;

            // Save the file
            move_uploaded_file( $fileTmp, $uploadDir.$entryId.".".$fileExt );


            // DEPLOY TO THE DOMAIN
            $domains = $util->DominoSql("select * FROM " . $identity['db'] . ".DCDominoIdentityDomains;", 'fetch_array');

            if ( $domains )
                foreach ( $domains as $domain ) {

                    $pic = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoFiles  WHERE id='".$entryId."' AND lang='".$domain['lang']."';",'fetch_one');

                    $files = $config["domainsRoot"] . $domain["domain"] . "/modules/Domino/Files/" . $pic['filename'];

                    $arr = glob($files . "*");
                    if ( $arr )
                        foreach ( $arr as $filename ) {

                            unlink( $filename );
                        }

                }

            #################################
            ### Return to Frontend
            #################################

            $link = "";
            return array(
                'success' => true,
                "id" => $entryId,
                "edit" => $link."/".$entryId
            );

        }
        else
            return array(
                'success' => false
            );

    }
}