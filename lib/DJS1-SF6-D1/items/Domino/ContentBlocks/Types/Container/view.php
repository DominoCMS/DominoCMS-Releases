<?php

class DominoContentBlocksTypesContainerView extends DCBaseView {

    function indexAction( $data ) {

		$cls = $data['class'] ? $data['class'] : '';
		$theme = $data['theme'] ? 'domino-contentblocks ' . $data['theme'] . ' ' . $cls : 'domino-contentblocks white' . ' ' . $cls;

		$styl = isset ( $data['picsCover'] ) ? 'background-image:url(' . $data['picsCover'][0]['filename'] . ');' : '';
        global $isBot;


        if ( $data['container'] )
            return '<div class="' . $theme . '" style="' . $styl . '">
            <div class="' . $data['container'] . '">
                <div class="' . $data['containerCol'] . '">
                    <div class="small-12 medium-12 large-8 large-centered cell text-center">
                    ' . ( $data['name'] ? '<h2>' . $data['name'] . '</h2>' : '' ). '
                    ' . ( $data['subtitle'] ? '<h3>' . $data['subtitle'] . '</h3>' : '' ). '
                        ' . $data['content'] . '
                    </div>
                </div>
            </div>
        </div>';
        else
            return '<div class="' . $theme . '" style="' . $styl . '">
                    ' . ( $data['name'] ? '<h2>' . $data['name'] . '</h2>' : '' ). '
                    ' . ( $data['subtitle'] ? '<h3>' . $data['subtitle'] . '</h3>' : '' ). '
                        ' . $data['content'] . '
        </div>';

    }

}