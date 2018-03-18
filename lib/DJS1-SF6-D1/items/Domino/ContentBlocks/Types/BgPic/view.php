<?php

class DominoContentBlocksTypesBgPicView extends DCBaseView {

    function indexAction( $data ) {


		$cls = $data['class'] ? $data['class'] : '';
		$theme = $data['theme'] ? 'domino-contentblocks ' . $data['theme'] . ' ' . $cls : 'domino-contentblocks white' . ' ' . $cls;

		$styl = isset ( $data['picsCover'] ) ? 'background-image:url(' . $data['picsCover'][0]['filename'] . ');' : '';

		return '<div class="' . $theme . '" style="' . $styl . '">
		<div class="grid-x align-center">
				<div class="small-12 medium-12 large-8 large-centered cell text-center">
				</div>
		</div>
	</div>';

    }
}