<?php

class DominoViewsInnerView extends DCBaseView {

    function indexAction( $data ) {

        return $this->component( 'Domino.ContentBlocks', $data['blocks'] );
    }

}