<?php

class DCDate {

    function dateFormat( $date, $type = 'short' ) {

        if ( is_numeric( $date ) )
            $date = gmdate("Y-m-d H:i:s", $date );

        $dateSpace = explode( ' ', $date);
        $exDate = explode ( '-', $dateSpace[0] );
        $exTime = isset( $dateSpace[1] ) ? explode ( ':', $dateSpace[1] ) : explode ( ':', '00:00:00' );

        // Currently returns EU like dates

        if ( $type == 'short' ) {

            return ltrim( $exDate[2],'0') . '. ' . ltrim( $exDate[1], '0' ) .'. '.$exDate[0];

        }
        else if ( $type == 'full' ) {

            return ltrim($exDate[2],"0").". ". $this->getMonth( $dateSpace[0] ) ." ".$exDate[0];

        }
        else if ( $type == 'tstamp' ) {

            $timeDelimiter = ':';
            return ltrim( $exDate[2],'0') . '. ' . ltrim( $exDate[1], '0' ) .'. '.$exDate[0] . ', ' . $exTime[0]. $timeDelimiter . $exTime[1];

        }
        else if ( $type == 'tstampFull' ) {

            $timeDelimiter = ':';
            return ltrim( $exDate[2],'0') . '. ' . $this->getMonth( $dateSpace[0] ) .' '.$exDate[0] . ', ' . $exTime[0]. $timeDelimiter . $exTime[1];

        }

    }

    function timeFormat( $time, $delimiter = ':' ){

        $timex = explode(":" , $time );

        return $timex[0] . $delimiter . $timex[1];
    }

    function getDay( $date ) {

        // if not unix
        if ( !is_numeric( $date ) )
            $date = strtotime( $date );

        $dayName = date('D', $date );

        // get translation
        $translate = new DCModulesDominoTranslate();
        $trans = $translate->showTranslate( array( 'day' . $dayName ) );

        return $trans['day' . $dayName];

    }

    function getMonth( $date ) {

        // if not unix date
        if ( !is_numeric( $date ) )
            $date = strtotime( $date );

        $monthFormat = date( 'M', $date );
        $translate = new DCModulesDominoTranslate();
        $trans = $translate->showTranslate( array( 'month' . $monthFormat ) );

        return $trans['month' . $monthFormat];
    }

    function getYear( $date ) {

        // if not unix date
        if ( !is_numeric( $date ) )
            $date = strtotime( $date );

        return date( 'Y', $date );
    }

    function getAge( $date ) {

        // if unix date
        if ( is_numeric( $date ) )
            $date = gmdate("Y-m-d", $date);


        list( $dob_year, $dob_month, $dob_day ) = explode('-', $date );
        // determine current year, month, and day
        $cur_year  = date('Y');
        $cur_month = date('m');
        $cur_day  = date('d');

        // either past or on the birthday
        if($cur_month >= $dob_month && $cur_day >= $dob_day)
            $age = $cur_year - $dob_year;
        // before the birthday
        else
            $age = $cur_year - $dob_year - 1;

        // and your done
        return $age;
    }

}