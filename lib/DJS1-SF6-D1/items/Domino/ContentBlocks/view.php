<?php
class DominoContentBlocksView extends DCBaseView {

    function indexAction( $data ) {

		$ret = '';
		if ( count( $data ) )
			for ( $i = 0; $i < count( $data ); $i++ ) {
				$block = $data[$i];

				if ( $block['component'] ) {


                    $theme = $block['theme'] ? 'domino-contentblocks ' . $block['theme'] : '';

					if ( $block['theme'] )
                        $ret .= '<div class="' . $theme . '">';

                    if ( $block['class'] )
                        $ret .= '<div class="' . $block['class'] . '">';

                    $container = $block['container'] ? $block['container'] : 'grid-container grid-x grid-padding-x';
                    $containerCell = $block['containerCol'] ? $block['containerCol'] : 'small-12 cell';

                    if ( $block['container'] || $block['containerCol'] )
                        $ret .= '<div class="' . $container . '">
										<div class="' . $containerCell . '">';

                    if ( $block['name'] )
                        $ret .= '<h2>' . $block['name'] . '</h2>';
                    if ( $block['subtitle'] )
                        $ret .= '<h3>' . $block['subtitle'] . '</h3>';

                    $ret .= $this->component( $block['component'], $block['componentData'] );

                    if ( $block['container'] || $block['containerCol'] )
                        $ret .= '</div>
                            </div>';

                    if ( $block['class'] )
                        $ret .= '</div>';

                    if ( $block['theme'] )
                        $ret .= '</div>';


				}

				if ( $block['type'] )
					$ret .= $this->component( 'Domino.ContentBlocks.Types.' . $block['type'], $block );

			}
        return $ret;
    }

}