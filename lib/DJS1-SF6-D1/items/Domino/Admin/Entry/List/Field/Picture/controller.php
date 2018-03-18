<?php

class DominoAdminEntryListFieldPictureController extends DCBaseController {

    function indexAction( $data ) {


    }
    function listStructureData( $col, $data ) {

        global $config;
        global $identity;
        $util = new DCUtil();

        $filename = $this->makeDominoThumb( $data['id'], $data['fileExt'], $data['developer'], $data['module'], 250 );
        return array(
            'filename' => $filename
        );

    }
    function makeDominoThumb ( $id, $fileExt, $developer, $module, $width ) {

        global $identity;

        global $config;
        global $site;

        $originalFile = $identity['root']."modules/".$developer."/".$module."/".$id.".".$fileExt;
        $filename = '';

        if ( file_exists ( $originalFile ) ) {

            $height = "";
            list( $width_orig, $height_orig ) = getimagesize($originalFile);

            $filename = $identity['username'] . '/modules/Domino/Pictures/w' . $width . '/' . $id . "." . $fileExt;

            if ( !file_exists( $config['identitiesPublicRoot'].$identity['username']  ) ) {

                mkdir($config['identitiesPublicRoot'].$identity['username'] . '/');
                mkdir($config['identitiesPublicRoot'].$identity['username'] . '/modules/');
                mkdir($config['identitiesPublicRoot'].$identity['username'] . '/modules/Domino/');
                mkdir($config['identitiesPublicRoot'].$identity['username'] . '/modules/Domino/Pictures/');
                mkdir($config['identitiesPublicRoot'].$identity['username'] . '/modules/Domino/Pictures/w'.$width);
            }


            //$filename2 = $identity['username'] . '/modules/Domino/Pictures/' . $id . "." . $fileExt;
            $filenameThumb = $config['identitiesPublicRoot'].$filename;

            if ( !file_exists( $filenameThumb ) ) {

                ##################################################################
                ### Create resized picture or cut a thumb
                ##################################################################

                if ( $height && $width ) {

                    $ratio_w = $width_orig / $width;
                    $ratio_h = $height_orig / $height;

                    if ($ratio_h < $ratio_w) {
                        $ResHeight = ($width / $width_orig) * $height_orig;
                        $ResWidth = $width;
                    } else if ($ratio_h == $ratio_w) {
                        if ($height_orig >= $width_orig) {
                            $ResHeight = ($width / $width_orig) * $height_orig;
                            $ResWidth = $width;
                        } else {
                            $ResWidth = ($height / $height_orig) * $width_orig;
                            $ResHeight = $height;
                        }
                    } else {
                        $ResWidth = ($height / $height_orig) * $width_orig;
                        $ResHeight = $height;
                    }
                    $PosX = -(($ResWidth - $width) / 2);
                    $PosY = -(($ResHeight - $height) / 2);

                } else {

                    if ($width) {
                        $ResHeight = ($width / $width_orig) * $height_orig;
                        $ResWidth = $width;
                    } else {
                        $ResWidth = ($height / $height_orig) * $width_orig;
                        $ResHeight = $height;
                    }
                    $PosX = 0;
                    $PosY = 0;
                }
                $PicNew = imagecreatetruecolor($ResWidth, $ResHeight);

                if ($fileExt == "png") {
                    imagealphablending($PicNew, false);
                    imagesavealpha($PicNew, true);
                    $transparent = imagecolorallocatealpha($PicNew, 255, 255, 255, 127);
                    imagefilledrectangle($PicNew, 0, 0, $ResWidth, $ResHeight, $transparent);
                    $PicOrig = imagecreatefrompng($originalFile);

                } else if ($fileExt == "jpg")
                    $PicOrig = imagecreatefromjpeg($originalFile);
                else if ($fileExt == "jpeg")
                    $PicOrig = imagecreatefromjpeg($originalFile);
                else if ($fileExt == "gif")
                    $PicOrig = imagecreatefromgif($originalFile);

                imagecopyresampled($PicNew, $PicOrig, $PosX, $PosY, 0, 0, $ResWidth, $ResHeight, $width_orig, $height_orig);

                if ($fileExt == "png")
                    ImagePng($PicNew, $filenameThumb, 8);
                else if ($fileExt == "jpg")
                    ImageJpeg($PicNew, $filenameThumb, 90);
                else if ($fileExt == "jpeg")
                    ImageJpeg($PicNew, $filenameThumb, 90);
                else if ($fileExt == "gif")
                    ImageGif($PicNew, $filenameThumb, 90);

                ImageDestroy($PicOrig);
                ImageDestroy($PicNew);

            }
        }
        return '/identities/'.$filename;

    }
}