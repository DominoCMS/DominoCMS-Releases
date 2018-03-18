<?php

class DominoHeaderLogoView extends DCBaseView {

    function indexAction( $data ) {

		return '<div class="logo">
		<a class="' . $data['class'] . '" href="' . $data['link'] . '"></a>
	</div>';

    }

}