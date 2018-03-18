<?php

class DominoHeaderView extends DCBaseView {

    function indexAction( $data ) {


        if ( $data['container'] )
            return '<header class="domino-header">
			    <div class="grid-container">
			        <div class="cell">
                        ' . $this->component( 'Domino.Header.Logo' ) . '
                        ' . $this->component( 'Domino.Header.MenuMain' ) . '
                        ' . $this->component( 'Domino.Header.MenuService' ) . '
                        ' . $this->component( 'Domino.Header.HeaderContact' ) . '
                    </div>
			    </div>
		    </header>';
        else
            return '<header class="domino-header">
                ' . $this->component( 'Domino.Header.Logo' ) . '
                ' . $this->component( 'Domino.Header.MenuMain' ) . '
                ' . $this->component( 'Domino.Header.MenuService' ) . '
                ' . $this->component( 'Domino.Header.HeaderContact' ) . '
        </header>';

    }

}