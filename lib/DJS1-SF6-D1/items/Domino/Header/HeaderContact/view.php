<?php

class DominoHeaderHeaderContactView extends DCBaseView {

    function indexAction( $data ) {


        return '<div class="headercontact">
                    <div class="grid-container">
                        ' . $this->buttons( $data )  . ' 
                    </div>
			    </div>';

    }
    function buttons ( $data ) {

        $ret = '';
        if ( $data['entries'] )
            for ( $i = 0; $i < count( $data['entries'] ); $i++ ) {
                $button = $data['entries'][$i];

                if ( $button['type'] == 'button' ) {
                    $ret .= '<button href="' . $button['url'] . '" class="btn ' . $button['class'] . '">
							<span class="icon icon-' . $button['icon'] . '"></span>';
                    if ( $button['name'] )
                        $ret .= ' <span class="' . $button['hide'] . '">' . $button['name'] . '</span>';
                    $ret .= '</button>';
                }
                else if ( $button['type'] == 'a' ) {
                    $ret .= '<a href="' . $button['url'] . '" class="btn ' . $button['class'] . '" target="' . $button['target'] . '">
							<span class="icon icon-' . $button['icon'] . '"></span>';
                    if ( $button['name'] )
                        $ret .= ' <span class="' . $button['hide'] . '">' . $button['name'] . '</span>';
                    $ret .= '</a>';
                }
                else if ( $button['type'] == 'langs' ) {
                    $ret .= '<div class="langs">';
                    for ( $j = 0; $j < count($button['langs']); $j++ ) {
                        $lang = $button['langs'][$j];
                        $active = ( $lang['domain'] == $button['domain'] ) ? 'lang active' : 'lang';

                        $ret .= '<a href="#" class="' . $active . '" target="_self">' . $lang['lang'] . '</a>';

                    }
                    $ret .= '</div>';
                }



            }

            return $ret;

    }

}