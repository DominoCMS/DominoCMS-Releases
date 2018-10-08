<?php

class DCText {

    // source: http://px.sklar.com/code.html/id=518
    function getLeadingSentences( $data, $max ) {
        //given string $data, will return the first $max sentences in that string

        //in: $data = the string to parse, $max = maximum # of sentences to return
        //returns: string containing the first $max sentences
        //(If the # of sentences in the string is less than $max,
        //then entire string will be returned.)

        //a sentence is any charactors except ., !, and ?
        //any number of times,  plus one or more .s, ?s, or !s
        //and any leading or trailing whitespace:
        $re = "^s*[^.?!]+[.?!]+s*";
        $out = "";
        for ($i = 0; $i < $max; $i++) {
            if (preg_match($re, $data, $match)) {
                //if a sentence is found, take it out of $data and add it to $out
                $out .= $match[0];
                $data = preg_replace($re, "", $data);
            } else {
                $i = $max;
            }
        }
        return $out;
    }

    function getFirstPar( $string ) {

        if ( $string )
            return substr($string,0, strpos($string, "</p>")+4);
    }

    function numberToRoman( $num ) {

        // Make sure that we only use the integer portion of the value
        $n = intval($num);
        $result = '';

        // Declare a lookup array that we will use to traverse the number:
        $lookup = array('M' => 1000, 'CM' => 900, 'D' => 500, 'CD' => 400,
            'C' => 100, 'XC' => 90, 'L' => 50, 'XL' => 40,
            'X' => 10, 'IX' => 9, 'V' => 5, 'IV' => 4, 'I' => 1);

        foreach ($lookup as $roman => $value)
        {
            // Determine the number of matches
            $matches = intval($n / $value);

            // Store that many characters
            $result .= str_repeat($roman, $matches);

            // Substract that from the number
            $n = $n % $value;
        }

        // The Roman numeral should be built, return it
        return $result;
    }

    function numLoc( $number ) {

        return number_format( $number,2, ',', ' ' );
    }

    function numLocIns( $number ) {

        $number = str_replace(",",".", $number );
        $number = str_replace(" ","", $number );
        return $number;
    }

    // source: https://snipplr.com/view/3598/checkemailaddress-email-validator/
    function check_email_address( $email ) {
        // First, we check that there's one @ symbol, and that the lengths are right.
        if (!ereg("^[^@]{1,64}@[^@]{1,255}$", $email)) {
            // Email invalid because wrong number of characters
            // in one section or wrong number of @ symbols.
            return false;
        }
        // Split it into sections to make life easier
        $email_array = explode("@", $email);
        $local_array = explode(".", $email_array[0]);
        for ($i = 0; $i < sizeof($local_array); $i++) {
            if
            (!ereg("^(([A-Za-z0-9!#$%&'*+/=?^_`{|}~-][A-Za-z0-9!#$%&
↪'*+/=?^_`{|}~\.-]{0,63})|(\"[^(\\|\")]{0,62}\"))$",
                $local_array[$i])) {
                return false;
            }
        }
        // Check if domain is IP. If not,
        // it should be valid domain name
        if (!ereg("^\[?[0-9\.]+\]?$", $email_array[1])) {
            $domain_array = explode(".", $email_array[1]);
            if (sizeof($domain_array) < 2) {
                return false; // Not enough parts to domain
            }
            for ($i = 0; $i < sizeof($domain_array); $i++) {
                if
                (!ereg("^(([A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9])|
↪([A-Za-z0-9]+))$",
                    $domain_array[$i])) {
                    return false;
                }
            }
        }
        return true;
    }

}