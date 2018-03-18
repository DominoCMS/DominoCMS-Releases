<?php

class DominoErrorView extends DCBaseView {

    function indexAction( $data ) {

        global $params;
        global $site;

            return '<div class="domino-error">
                    <div class="grid-x grid-padding-x grid-container align-center">
                        <div class="small-12 medium-10 large-6 cell">
                         <p>' . $site['domain']. '</p>
                            <h1>'. $data['translate']['error'].' ' . $params['error']['responseCode'] . '</h1>
                            <p>'. $data['translate']['error_'.$params['error']['responseCode']].'</p>
                            <p><a class="button" href="' . $params['rootUrl']. '">'. $data['translate']['tryOnceAgain'].'</a></p>
                            <br />
                            <p>
                                <a href="' . $data['terms'] . '" class="footer-link">' . $data['translate']['terms_of_use'] . '</a> | <a href="' . $data['privacy'] . '" class="footer-link">' . $data['translate']['privacy_policy'] . '</a> | <a href="' . $data['cookies'] . '" class="footer-link">' . $data['translate']['cookies_policy'] . '</a> | © ' . $data['year'] . ' <a class="footer-link" href="http://www.dominocms.eu">' . $data['text'] . '</a>.<br />
                            ' . $data['translate']['created_by'] . ': <a class="footer-link" href="http://www.domdesign.si">domDesign</a>
                            </p>
                        </div>
		        </div>
	        </div>';

    }

}