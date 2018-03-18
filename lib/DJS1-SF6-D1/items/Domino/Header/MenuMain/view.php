<?php

class DominoHeaderMenuMainView extends DCBaseView {

    function indexAction( $data ) {

        return '<div class="menumain">
		<button href="#">
			<span class="icon-list"></span>
		</button>
		<ul class="hidden">' . $this->menuStructure ( $data ) . '</ul>
	</div>';

    }
    function menuStructure ( $data ) {

        $ret = '';
        $entries = isset ( $data['entries']['Domino.Menu.main'] ) ? $data['entries']['Domino.Menu.main'] : $data;
        if ( count( $entries ) )
            for ( $i = 0; $i < count( $entries ); $i++ ) {
                $entry = $entries[$i];
                $active = ( $entry['active'] == 1 ) ? 'active' : '';

                $ret .= '<li data-entry="'. $entry['entry'] . '" class="'. $active . '">
						<a href="'. $entry['link'] . '">'. $entry['name'] . '</a>';

                if ( count( $entry['children'] ) ) {

                    $ret .= '<span name="domino-menumain-arrows" class="arrow icon-arrow_right"></span>';
                    $ret .= '<ul class="dropdown hidden">';
                    $ret .= $this->menuStructure( $entry['children'] );
                    $ret .= '</ul>';
                }

                $ret .= '</li>';


            }

        return $ret;
    }

}