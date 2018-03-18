<?php

class DCBaseController {

    function validationAction () {

        $validated = true;

        if ( $validated === true )
            return true;
        else
            $error = $this->setStatusCode(
                array(
                    'code' => 403,
                    'title' => 'Nimate privilegijev',
                    'message' => 'You suck.'
                )
            );

    }

}