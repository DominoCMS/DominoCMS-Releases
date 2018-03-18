<?php

class DominoContentBlocksTypesTitleView extends DCBaseView {

    function indexAction( $data ) {


		$cls = $data['class'] ? $data['class'] : '';
		$theme = $data['theme'] ? 'domino-contentblocks ' . $data['theme'] . ' ' . $cls : 'domino-contentblocks white' . ' ' . $cls;

		$styl = isset ( $data['picsCover'] ) ? 'background-image:url(' . $data['picsCover'][0]['filename'] . ');' : '';

		return '<div class="' . $theme . '" style="' . $styl . '">
		<div class="overlay"></div>
		<div class="grid-container">
			<div class="grid-x grid-padding-x align-center">
				<div class="small-12 medium-12 large-8 large-centered cell text-center">
				' . ( $data['name'] ? '<h1>' . $data['name'] . '</h1>' : '' ). '
				' . ( $data['subtitle'] ? '<h2>' . $data['subtitle'] . '</h2>' : '' ). '
					' . $data['content'] . '
				</div>
			</div>
		</div>
	</div>';

    }

}