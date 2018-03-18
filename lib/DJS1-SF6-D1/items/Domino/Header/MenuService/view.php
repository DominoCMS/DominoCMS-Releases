<?php

class DominoHeaderMenuServiceView extends DCBaseView {

    function indexAction( $data ) {

        return '<nav class="menuservice">
		<button href="#">
			<span class="icon-list"></span>
		</button>
		<ul class="hidden">' . $this->menuStructure ( $data['entries'] ) . '</ul>
	</nav>';

    }
    function menuStructure ( $entries ) {

        $ret = '';
        if ( count( $entries ) )
            for ( $i = 0; $i < count( $entries ); $i++ ) {
                $entry = $entries[$i];
                $active = ( $entry['active'] == 1 ) ? 'active' : '';

                $ret .= '<li data-entry="'. $entry['entry'] . '" class="'. $active . '">
						<a href="'. $entry['link'] . '">'. $entry['name'] . '</a>';

                $ret .= '</li>';


            }

        return $ret;
    }

}