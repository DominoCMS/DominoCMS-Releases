<?php

class DominoContentBlocksTypesColumnsView extends DCBaseView {

    function indexAction( $data ) { 

		$cls = $data['class'] ? $data['class'] : '';
		$theme = $data['theme'] ? 'domino-contentblocks ' . $data['theme'] . ' ' . $cls : 'domino-contentblocks white' . ' ' . $cls;

		$cols = function ( $data ) {

			$ret = '';

			if ( $data['children'] ) {

				if ( count( $data['children'] ) == 4 )
					$componentClass = 'small-12 medium-6 large-3 cell';
				else if ( count( $data['children'] ) == 3 )
					$componentClass = 'small-12 medium-4 large-4 cell';
				else if ( count( $data['children'] ) == 2 )
					$componentClass = 'small-12 medium-6 large-6 cell';
				else if ( count( $data['children'] ) == 1 )
					$componentClass = 'small-12 medium-12 large-12 cell';

				for ( $i = 0; $i < count( $data['children'] ); $i++ ) {
					$block = $data['children'][$i];

					if ( $block['class'] )
						$componentClass = $block['class'];

					if ( $block['component'] ) {
						$ret .= '<div class="' . $componentClass . '">';
                        $ret .= $this->component( $block['component'], $block['componentData'] );
                        $ret .= '</div>';
                    }
                    else
						$ret .= '<div class="' . $componentClass . '">
                                       ' . ( $block['name'] ? '<h3>' . $block['name'] . '</h3>' : '' ) . '
                                       ' . ( $block['subtitle'] ? '<h4>' . $block['subtitle'] . '</h4>' : '' ) . '
                                    ' . $block['content'] . '

                                </div>';
				}
			}

			return  $ret;
		};

		return '<div class="' . $theme . '">
		<div class="grid-container">
		' . ( $data['name'] ? '<h2>' . $data['name'] . '</h2>' : '' ) . '
		' . ( $data['subtitle'] ? '<h3>' . $data['subtitle'] . '</h3>' : '' ) . '

			<div class="grid-x grid-padding-x">
' . $cols( $data ) . '
			</div>
		</div>
	</div>';

    }
}