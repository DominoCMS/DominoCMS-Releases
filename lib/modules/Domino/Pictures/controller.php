<?php

class DCLibModulesDominoPictures extends DCBaseController {

    function entryListAction( $data ) {

    }
    function entryEditAction( $data ) {

    }
    function beforeCreateAction ( $data ) {

        return $data;

    }
    function afterCreateAction ( $data ) {

        return $data;
    }
    function beforeUpdateAction ( $data ) {

        return $data;
    }
    function afterUpdateAction ( $data ) {

        return $data;

    }
    function createDesignModuleAction ( $data ) {

        global $config;
        $util = new DCUtil();

        $util->makeDir( $config['identityRoot'] . 'modules/Domino');
        $util->makeDir( $config['identityRoot'] . 'modules/Domino/Pictures');


    }
    public function displayPic ( $arr ) {

        global $config;
        global $site;
        $util = new DCUtil();

        if ( isset( $arr["id"] ) ) {

            $path = isset( $arr["path"] ) ? $arr["path"] : '';
            $absPath = isset( $arr["path"] ) ? $arr["path"] : '';
            $widthHeight = "";
            $landscape = "";

            if ( isset( $arr["domain"] ) )
                $siteDomain = $arr["domain"];
            else
                $siteDomain = $site['domain'];

            /*if ( isset( $arr["db"] ) ) {
                $siteDb = $arr["db"];
                $siteRoot = $site['root'];
            }
            else*/
            if ( isset( $arr["db"] ) && isset( $arr["root"] ) ) {
                $siteDb = $arr["db"];
                $siteRoot = $arr["root"];
            }
            else {
                $siteDb = $site['db'];
                $siteRoot = $site['root'];
            }

            $lang = isset( $arr["lang"] ) ? $arr["lang"] : $site['lang'];

            $id = $arr['id'];
            if ( isset( $arr["developer"] ) && isset( $arr["module"] )) {
                $developer = $arr["developer"];
                $module = $arr["module"];
            }
            else {
                $developer = 'Domino';
                $module = 'Pictures';
            }

            $row = $util->dominoSql("select * FROM ".$siteDb.".DCDominoSiteIndex si JOIN ".$siteDb.".DC".$developer.$module." mt ON ( si.id = mt.id ) WHERE si.developer='".$developer."' AND si.module='".$module."' AND mt.id='".$arr['id']."' AND mt.lang='".$lang."';",'fetch_one');
            if ( !$row )
                $row = $util->dominoSql("select * FROM ".$siteDb.".DCDominoSiteIndex si JOIN ".$siteDb.".DC".$developer.$module." mt ON ( si.id = mt.id ) WHERE si.developer='".$developer."' AND si.module='".$module."' AND mt.id='".$arr['id']."' AND mt.lang='sl';",'fetch_one'); //".key($site['frontTitle'])."

            if ( $row ) {

                $originalFile = $siteRoot."modules/".$developer."/".$module."/".$arr["id"].".".$row["fileExt"];

                $folderPath = $siteDomain."/modules/".$developer."/".$module."/";
                $rootFilename = $config['domainsRoot'].$folderPath.$row["filename"].".".$row["fileExt"];
                $folderPathOut = 'domains/'.$siteDomain."/modules/".$developer."/".$module."/";

                /*if ( $line_module["photographer"] != 0 ) {
                    $sql_author = "select name_".$LangId." AS Name,link FROM x_".$NewDb.".m_224 WHERE id=".$line_module["photographer"].";";
                    $result_author = mysql_query($sql_author);
                    $line_author = mysql_fetch_array($result_author, MYSQL_ASSOC);
                    $photographer = array(
                        "name" => $line_author["Name"],
                        "link" => $line_author["link"]
                    );
                }
                else
                    $photographer = "";*/

                if ( file_exists ( $originalFile ) ) {

                    if ( !file_exists( $rootFilename ) )
                        link($originalFile, $rootFilename);

                    /*if ( $line_module["ordem"] == 1 ) {

                        if ( file_exists( $RootFilename ) )
                            unlink ($RootFilename);
                        link($OriginalFile, $RootFilename);

                        foreach (glob($AbsPath.$FolderPath.$PicUrlName."_*") as $filenameDel)
                            unlink($filenameDel);

                        $sql_update = "UPDATE x_".$NewDb.".m_".$ModuleId." SET ordem=0 WHERE id=".$Arr["id"].";";
                        mysql_query($sql_update);
                    }*/

                    if ( isset ( $arr["height"] ) || isset ( $arr["width"] ) ) {

                        $width = isset ( $arr["width"] ) ? $arr["width"] : "";
                        $height = isset ( $arr["height"] ) ? $arr["height"] : "";

                        if ( $height && $width )
                            $widthHeight = "_".$width."x".$height;
                        else {
                            if ( $width )
                                $widthHeight = "_w".$width;
                            else
                                $widthHeight = "_h".$height;
                        }

                        list($width_orig, $height_orig) = getimagesize($originalFile);

                        $landscape = ( $width_orig >= $height_orig ) ? true : false;

                        $filenameThumb = $config['domainsRoot'].$folderPath.$row["filename"].$widthHeight.".".$row["fileExt"];

                        if ( file_exists( $originalFile ) )
                            if ( !file_exists( $filenameThumb ) ) {

                                /*$FileContents = file_get_contents($OriginalFile, true);
                                if (!get_magic_quotes_gpc())
                                        $FileContents = addslashes($FileContents);*/

                                ##################################################################
                                ### Create resized picture or cut a thumb
                                ##################################################################


                                if ( $height && $width ){

                                    $ratio_w = $width_orig / $width;
                                    $ratio_h = $height_orig / $height;


                                    if ( $ratio_h < $ratio_w ) {
                                        $ResHeight = ( $width / $width_orig ) * $height_orig;
                                        $ResWidth = $width;
                                    }
                                    else if ( $ratio_h == $ratio_w ) {
                                        if ( $height_orig >= $width_orig ) {
                                            $ResHeight = ( $width / $width_orig ) * $height_orig;
                                            $ResWidth = $width;
                                        }
                                        else {
                                            $ResWidth = ( $height / $height_orig ) * $width_orig;
                                            $ResHeight = $height;
                                        }
                                    }
                                    else {
                                        $ResWidth = ( $height / $height_orig ) * $width_orig;
                                        $ResHeight = $height;
                                    }
                                    $PosX = - ( ( $ResWidth - $width ) / 2 );
                                    $PosY = - ( ( $ResHeight - $height ) / 2 );

                                } else {

                                    if ( $width ){
                                        $ResHeight = ( $width / $width_orig ) * $height_orig;
                                        $ResWidth = $width;
                                    } else {
                                        $ResWidth = ( $height / $height_orig ) * $width_orig;
                                        $ResHeight = $height;
                                    }
                                    $PosX = 0;
                                    $PosY = 0;
                                }
                                $PicNew = imagecreatetruecolor( $ResWidth, $ResHeight );

                                if ( $row['fileExt'] == "png" ) {
                                    imagealphablending($PicNew, false);
                                    imagesavealpha($PicNew,true);
                                    $transparent = imagecolorallocatealpha($PicNew, 255, 255, 255, 127);
                                    imagefilledrectangle($PicNew, 0, 0, $ResWidth, $ResHeight, $transparent);
                                    $PicOrig = imagecreatefrompng( $originalFile );

                                }
                                else if ( $row['fileExt'] == "jpg" )
                                    $PicOrig = imagecreatefromjpeg($originalFile);
                                else if ( $row['fileExt'] == "jpeg" )
                                    $PicOrig = imagecreatefromjpeg($originalFile);
                                else if ( $row['fileExt'] == "gif" )
                                    $PicOrig = imagecreatefromgif($originalFile);

                                imagecopyresampled($PicNew, $PicOrig, $PosX, $PosY, 0, 0, $ResWidth, $ResHeight, $width_orig, $height_orig);

                                if ( $row['fileExt'] == "png" )
                                    ImagePng ( $PicNew, $filenameThumb , 8 );
                                else if ( $row['fileExt'] == "jpg" )
                                    ImageJpeg ( $PicNew, $filenameThumb , 90 );
                                else if ( $row['fileExt'] == "jpeg" )
                                    ImageJpeg ( $PicNew, $filenameThumb , 90 );
                                else if ( $row['fileExt'] == "gif" )
                                    ImageGif ( $PicNew, $filenameThumb , 90 );

                                ImageDestroy ( $PicOrig );
                                ImageDestroy ( $PicNew );

                            }
                    }

                    $filename = "/".$folderPathOut.$row["filename"].$widthHeight.".".$row["fileExt"];
                    $original = "/".$folderPathOut.$row["filename"].".".$row["fileExt"];

                    return array (
                        "id" => $row["id"],
                        "filename" => $filename,
                        "filenameOrig" =>  $row["filename"],
                        "original" => $original,
                        "alt" => $row["name"]." (".$row["id"].")",
                        "bg_pos_x" => isset ( $row["bgPosX"] ) ? $row["bgPosX"] : '',
                        "bg_pos_y" => isset ( $row["bgPosY"] ) ? $row["bgPosY"] : '',
                        //"photographer" => $photographer,
                        "landscape" => $landscape
                    );
                }
            }
        }
        else
            return array (
                "id" => 0,
                "filename" => '',
                "filenameOrig" =>  '',
                "original" => '',
                "alt" => '',
                "bg_pos_x" => '',
                "bg_pos_y" => '',
                //"photographer" => '',
                "landscape" => ''
            );

    }
}