<?php

class DominoSlidezView extends DCBaseView
{

    function indexAction ( $data ) {

        //print_r($data['slides']);
        $bg = '';
        if ( isset ( $data['slides'][0]['pic']['filename'] ) )
            $bg = $data['slides'][0]['pic']['filename'];
        
        $ret = '<div class="domino-slidez ' . $data['options']['height'] . '">
                    <div class="slides">
                        <article style="display: block;">
                            <div class="bg-image" style="background-image:url(' . $bg . ')">
                                <div class="container domino-theme">';


        if ( isset( $data['slides'][0]['content']) )
            $ret .= $data['slides'][0]['content'];

        $ret .= '</div>
                            </div>
                        </article>
                    </div>
                    <div class="overlay"></div>
                    <div class="domino-spinner">
                        <div class="spinner-container container3">
                            <div class="circle1"></div>
                                <div class="circle2"></div>
                                <div class="circle3"></div>
                                <div class="circle4"></div>
                            </div>
                        </div>
                    </div>
                </div>';

        return $ret;
    }

}