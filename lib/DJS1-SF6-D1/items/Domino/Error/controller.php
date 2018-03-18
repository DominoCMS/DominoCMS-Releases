<?php
/**
 * filename: FooterController.php
 * developer: Domino
 * item: Footer
 * version: v1.0.0
 * date: 5. 6. 17
 */
class DominoErrorController extends DCBaseController {

    function indexAction( $data )
    {
        $util = new DCUtil();
        $text = new DCText();
        global $config;

        $ret = array(
            'translate' => $util->showTranslate( array('error','error_404','tryOnceAgain','created_by','terms_of_use', 'privacy_policy', 'cookies_policy') ),
            'text' => "DominoCMS",
            'terms' => "http://www.ddsgn.si/pravno/pogoji-uporabe",
            'privacy' => "http://www.ddsgn.si/pravno/izjava-o-zasebnosti",
            'cookies' => "http://www.ddsgn.si/pravno/izjava-o-piskotkih",
            'year' => $text->numberToRoman(date('y'))
        );

        return $ret;
    }
}
