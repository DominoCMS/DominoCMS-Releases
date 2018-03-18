<?php

class DCLibModulesDominoFiles extends DCBaseController {

    function entryListAction( $data ) {

    }
    function entryEditAction( $data ) {

    }
    function beforeCreateAction ( $data ) {

        global $site;
        global $config;


        return $data;

    }
    function afterCreateAction ( $data ) {

        return $data;
    }
    function beforeUpdateAction ( $data ) {

        return $data;
    }
    function afterUpdateAction ( $data ) {

        global $site;
        global $config;


        return $data;

    }

    function createDesignModuleAction ( $data ) {

        global $config;
        $util = new DCUtil();

        $util->makeDir( $config['identityRoot'] . 'modules/Domino' );
        $util->makeDir( $config['identityRoot'] . 'modules/Domino/Files' );

    }
    public function displayFile ( $arr ) {

        global $config;
        global $site;
        $util = new DCUtil();


        if ( isset( $arr["id"] ) ) {

            $path = isset( $arr["path"] ) ? $arr["path"] : '';
            $absPath = isset( $arr["path"] ) ? $arr["path"] : '';

            if ( isset( $arr["domain"] ) ) {
                $siteDomain = $arr["domain"];
            }
            else {
                $siteDomain = $site['domain'];
            }
            if ( isset( $arr["db"] ) ) {
                $siteDb = $arr["db"];
                $siteRoot = $site['root'];
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
                $module = 'Files';
            }

            $row = $util->dominoSql("select * FROM ".$siteDb.".DCDominoSiteIndex si JOIN ".$siteDb.".DC".$developer.$module." mt ON ( si.id = mt.id ) WHERE si.developer='".$developer."' AND si.module='".$module."' AND mt.id='".$arr['id']."' AND mt.lang='".$lang."';",'fetch_one');
            if ( $row ) {

                $originalFile = $siteRoot."modules/".$developer."/".$module."/".$arr["id"].".".$row["fileExt"];

                $folderPath = $siteDomain."/modules/".$developer."/".$module."/";
                $rootFilename = $config['domainsRoot'].$folderPath.$row["filename"].".".$row["fileExt"];
                $folderPathOut = 'domains/'.$siteDomain."/modules/".$developer."/".$module."/";


                if ( file_exists ( $originalFile ) ) {

                    if ( !file_exists( $rootFilename ) )
                        link($originalFile, $rootFilename);

                    $filename = "/".$folderPathOut.$row["filename"].".".$row["fileExt"];

                    return array (
                        "id" => $row["id"],
                        "filename" => $filename,
                        "fileExt" => $row["fileExt"],
                        "content" => $row["content"],
                        "filenameOrig" =>  $row["filename"],
                        "name" => $row["name"],
                    );
                }
            }
        }
        else
            return array (
                "id" => 0,
                "filename" => '',
                "fileExt" => '',
                "content" => '',
                "filenameOrig" =>  '',
                "name" => ''
            );

    }
}