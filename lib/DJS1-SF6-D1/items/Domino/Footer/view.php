<?php

class DominoFooterView extends DCBaseView {

    function indexAction( $data ) {

        return '<footer class="domino-footer">
		<div class="grid-x grid-padding-x">
			<div class="cell">
			<a href="' . $data['terms'] . '" class="footer-link">' . $data['translate']['terms_of_use'] . '</a> | <a href="' . $data['privacy'] . '" class="footer-link">' . $data['translate']['privacy_policy'] . '</a> | <a href="' . $data['cookies'] . '" class="footer-link">' . $data['translate']['cookies_policy'] . '</a> | © ' . $data['year'] . ' <a class="footer-link" href="http://www.dominocms.com">' . $data['text'] . '</a>.<br />
						' . $data['translate']['created_by'] . ': <a class="footer-link" href="http://www.domdesign.si">domDesign.</a>
</div>
		</div>
	</footer>';
    }

}