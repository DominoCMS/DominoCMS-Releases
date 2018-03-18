<?php
require_once ($config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Admin/Entry/Edit/controller.php');
require_once ($config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Admin/Entry/List/controller.php');
require_once ($config['libRoot'] . 'DJS1-SF6-D1/items/Domino/Admin/Entry/List/Field/Picture/controller.php');
class DominoAdminEntryEditFieldPicturesController extends DCBaseController {

    function indexAction( $data ) {

        global $config;
        $util = new DCUtil();

        return array(
            'auth' => $config['auth']
        );

    }

    function deleteAction ( $data ) {

        global $identity;
        $util = new DCUtil();

        $update = $util->dominoSql( "DELETE FROM " . $identity['db'] . ".DCDominoSiteCrossPictures WHERE entry='".$data['entry']."' AND entryRel='".$data['entryRel']."';", 'update');
        //$update = $util->dominoSql( "UPDATE " . $identity['db'] . ".DCDominoSiteCrossPictures SET status=3 WHERE entry='".$data['entry']."' AND entryRel='".$data['entryRel']."';", 'update');


        return $data;
    }
    function manualCrossAction ( $data ) {

        global $identity;
        $util = new DCUtil();

        $entry = explode('.',$data['entry']);
        $entryRel = explode('.',$data['newEntry']);
        $data['newProfile'] = ( $data['newProfile'] == 1 ) ? 1 : 0;
        $data['newCover'] = ( $data['newCover'] == 1 ) ? 1 : 0;

        $entries = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteCrossPictures WHERE entry='".$data['entry']."';",'fetch_array'); // AND status=1
        $next = count( $entries ) + 1;

        $update = $util->dominoSql( "INSERT INTO " . $identity['db'] . ".DCDominoSiteCrossPictures (`entry`, `developer`, `module`, `id`, `entryRel`, `developerRel`, `moduleRel`, `idRel`, `ordem`, `picProfile`, `picCover`, `status`) VALUES ('".$data['entry']."','".$entry[0]."','".$entry[1]."','".$entry[2]."','".$data['newEntry']."','".$entryRel[0]."','".$entryRel[1]."','".$entryRel[2]."','".$next."','".$data['newProfile']."','".$data['newCover']."','1');", 'insert');


        return $data;
    }
    function uploadAction ( $data ) {


        global $config;
        global $identity;
        $util = new DCUtil();



        // Set the allowed file extensions
        $fileTypes = array('jpg', 'jpeg', 'gif', 'png'); // Allowed file extensions
        $uploadDir = $identity['root'].'modules/Domino/Pictures/';

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
//print "select ".$colMain." FROM " . $identity['db'] . ".DC" . $entryDeveloper. $entryModule . " ORDER BY CAST(".$colMain." AS UNSIGNED) DESC LIMIT 1;";
            // Save the file
            move_uploaded_file( $fileTmp, $uploadDir.$entryId.".".$fileExt );

            // Get the dimensions
            $dimSql = $entryEditClass->getDimensions( $mainDeveloper, $mainModule );

            $retEntry = array();
            if ( !$dimSql ) {


                $fields = "`id`,originalName,fileExt,";
                $values = "'".$entryId."','".$data['name']."','".$fileExt."',";


                $name = $data['name'];

                $filename = $util->urlNameGen( $name );
                $filename = $util->uniqueFilename(
                    array (
                        'db' => $identity["db"],
                        'lang' => $identity['lang'],
                        'filename' => $filename,
                        'newFilename' => $filename,
                        'level' => 1,
                        'developer' => $data['developer'],
                        'module' => $data['module'],
                        'id' => $entryId
                    ));

                // Add dimension
                $fields .= "lang,name,filename";
                $values .= "'".$identity['lang']."','".$name."','".$filename."',";

                // INSERT 2 MODULE table if main  entry in that language exists
                $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".DC".$entryDeveloper.$entryModule." (".rtrim($fields, ',').") VALUES (" . rtrim($values, ',') . ");", 'insert');

                $retEntry[$identity['lang']] = array(
                    'name' => $name,
                    'filename' => $filename
                );


            }
            else
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

                            if ( $isEntry['name'] )
                                $name = $isEntry['name'];
                            else {
                                $name = $data['name'];
                            }


                            $filename = $util->urlNameGen( $name );
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
            $entries = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteCrossPictures WHERE entry='".$mainEntry."';",'fetch_array'); // AND status=1
            $next = count( $entries ) + 1;

            // Check if profile pic
            $picProfile = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoSiteCrossPictures WHERE entry='".$mainEntry."' AND  status=1 AND picProfile=1;",'fetch_one');
            $picProfile  = $picProfile ? 1 : 0;

            // Create cross
            $insert = $util->dominoSql("INSERT INTO " . $identity['db'] . ".DCDominoSiteCrossPictures (entry,developer,`module`,id,entryRel,developerRel,moduleRel,idRel,picProfile,status,`ordem`) VALUES ('".$mainEntry."','".$mainDeveloper."','".$mainModule."','".$mainId."','".$entry."','".$entryDeveloper."','".$entryModule."','".$entryId."','".$picProfile."','1','".$next."');", 'insert');

            #################################
            ### Return to Frontend
            #################################

            $link = "";
            return array(
                'success' => true,
                "id" => $entryId,
                "picProfile" => $picProfile,
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
    function uploadSingleAction ( $data ) {


        global $config;
        global $site;
        $util = new DCUtil();

        // Set the allowed file extensions
        $fileTypes = array('jpg', 'jpeg', 'gif', 'png'); // Allowed file extensions
        $uploadDir = $identity['root'].'modules/Domino/Pictures/';

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

            unlink( $_SERVER["DOCUMENT_ROOT"] . '/../web/identities/'.$identity['username'] . '/modules/Domino/Pictures/w250/' . $entryId . "." . $fileExt );

            $entryListClass = new DominoAdminEntryListFieldPictureController();
            $filename = $entryListClass->makeDominoThumb( $entryId, $fileExt, $entryDeveloper, $entryModule, 250 );


            // DEPLOY TO THE DOMAIN
            $domains = $util->DominoSql("select * FROM " . $identity['db'] . ".DCDominoIdentityDomains;", 'fetch_array');

            if ( $domains )
                foreach ( $domains as $domain ) {

                    $pic = $util->dominoSql("select * FROM " . $identity['db'] . ".DCDominoPictures  WHERE id='".$entryId."' AND lang='".$domain['lang']."';",'fetch_one');

                    $files = $config["domainsRoot"] . $domain["domain"] . "/modules/Domino/Pictures/" . $pic['filename'];

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
    public function structureData ( $entry, $data ) {

        global $config;
        $util = new DCUtil();

        if ( isset( $data['moduleData']["developer"] ) ) {

            $miniSelector = array(
                'id' => 'addCrossPictures',
                'listData' => array(
                    'actions' => array(),
                    'subactions' => array(),
                    'list' => array(
                        'options' => array (
                            'developer' => 'Domino',
                            'module' => 'Pictures',
                            'parent' => '',
                            'type' => 'noindex',
                            'element' => 'Pictures',
                            //'selectorId' => 'Pictures',
                            'mainColumn' => 'name',
                            'return' => array(
                                'parent' => array ( 'element' =>  'entry',
                                    'name' => 'name'
                                )
                            )
                        )
                    )
                )
            );

            $columns = array(
                array(
                    'name' => 'Ime',
                    'element' => 'name',
                    'width' => '200px',
                    'clickable' => false,
                    'hide' => '',
                    'sortable' => true,
                    'structureType' => 'Picture',
                    'structureItem' => 'Picture'
                ),
                array(
                    'name' => 'Ime',
                    'element' => 'name',
                    'width' => '',
                    'clickable' => false,
                    'hide' => '',
                    'sortable' => true,
                    'structureType' => 'varchar',
                    'structureItem' => 'Varchar'
                ),
                array(
                    'name' => '',
                    'element' => 'status',
                    'width' => '',
                    'clickable' => false,
                    'hide' => '',
                    'sortable' => true,
                    'structureType' => 'bool',
                    'structureItem' => 'Bool'
                ),
                array(
                    'name' => '',
                    'element' => 'picCover',
                    'width' => '',
                    'clickable' => false,
                    'hide' => '',
                    'sortable' => true,
                    'structureType' => 'bool',
                    'structureItem' => 'Bool'
                ),
                array(
                    'name' => '',
                    'element' => '',
                    'width' => '',
                    'clickable' => false,
                    'hide' => '',
                    'sortable' => true,
                    'structureType' => 'delete',
                    'structureItem' => 'Delete'
                ),
                array(
                    'name' => '',
                    'element' => 'id',
                    'width' => '',
                    'clickable' => false,
                    'hide' => '',
                    'sortable' => true,
                    'structureType' => 'edit',
                    'structureItem' => 'Edit'
                ),
                array(
                    'name' => '',
                    'element' => 'ordem',
                    'width' => '',
                    'clickable' => false,
                    'hide' => '',
                    'sortable' => true,
                    'structureType' => 'order',
                    'structureItem' => 'Order'
                )
            );

            $pagination = array(
                'paginate' => true,
                'entriesPerPageOptions' => '10,20,50,100',
                'entriesPerPage' => 20
            );
            $actions = array ();
/*
            $lang = $site['lang'];
            $pics = null;
            if ( isset( $moduleData["id"] ) )
                $pics = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoPictures mt JOIN " . $identity['db'] . ".DCDominoSiteCrossPictures ct ON ( mt.id = ct.idRel ) WHERE ct.entry='".$moduleData["developer"].".".$moduleData["module"].".".$moduleData["id"]."' AND ct.status<3 AND mt.lang='".$lang."';",'fetch_array');

            $moduleData["id"] = isset( $moduleData["id"] ) ? $moduleData["id"] : null;
            $entries = array();

            $entryListClass = new DominoAdminEntryListController();
            if ( $pics )
                foreach ( $pics AS $entry ) {

                    $entry['data'] = $entryListClass->entryData( $columns, $entry );

                    //$entry['id'] = $entrySql['id'];
                    $entry['link'] = '&id=' . $entry['id'];

                    $entries[] = $entry;
                }

            $children = array(
                'children' => array(
                    'options' => array(
                        'link' => ''
                    ),
                    'entries' => $entries,
                    'columns' => $columns,
                    'pagination' => $pagination
                ),

            );
*/

            $children = array();
            $pics = array();

            $ret = array(
                'miniSelector' => $miniSelector,
                'pictures' => $children,
                'entries' => $pics,
                'mainDeveloper' => $data['moduleData']["developer"],
                'mainModule' => $data['moduleData']["module"],
                'mainId' => $data['moduleData']["id"],
                'crossLink' => '/si/moduli?developer=Domino&module=SiteCrossPictures&id='.$data['moduleData']["developer"].'.'.$data['moduleData']["module"].'.'.$data['moduleData']["id"].'|'
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
}