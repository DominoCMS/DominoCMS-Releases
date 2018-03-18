<?php
/**
 * Created by PhpStorm.
 * User: korisnik
 * Date: 4. 08. 16
 * Time: 12:11
 */
class DCDate
{
    public function DateTimeIns($datum)
    {
        $d = explode(" ", $datum);

        $dat = explode(".", $d[0]);
        $tim = explode(":", $d[1]);
        return $dat[2] . "-" . $dat[1] . "-" . $dat[0] . " " . $tim[0] . ":" . $tim[1] . ":" . $tim[2];
    }

    function dateNowInt(){
        return strtotime(date("Y-m-d H:i:s"));
    }
    public function Tstamp($Arr)
    {
        $d = explode(" ", $Arr["value"]);
        return izpis_datum($d[0]) . ", " . $d[1] . "";
    }

    public function TstampShort($value)
    {
        $d = explode(" ", $value);
        $datum_a = explode("-", $d[0]);
        return ltrim($datum_a[2], "0") . ". " . ltrim($datum_a[1], "0") . ". " . $datum_a[0] . ", " . $d[1] . "";
    }

    public function getmicrotime()
    {
        list($usec, $sec) = explode(" ", microtime());
        return ((float)$usec + (float)$sec);
    }

    public function DayWeek( $dw ) {

        $dan[1] = "ponedeljek";
        $dan[2] = "torek";
        $dan[3] = "sreda";
        $dan[4] = "četrtek";
        $dan[5] = "petek";
        $dan[6] = "sobota";
        $dan[7] = "nedelja";
        $dan[0] = "nedelja";

        return $dan[$dw];
    }
    public function get_year($datum){
        $d = explode("-",$datum);
        return $d[0];
    }
    public function DateFormat1($datum){
        global $site;
        if ( $site['lang'] == 'sl' ){
            $mesec[1] = "januar";
            $mesec[2] = "februar";
            $mesec[3] = "marec";
            $mesec[4] = "april";
            $mesec[5] = "maj";
            $mesec[6] = "junij";
            $mesec[7] = "julij";
            $mesec[8] = "avgust";
            $mesec[9] = "september";
            $mesec[10] = "oktober";
            $mesec[11] = "november";
            $mesec[12] = "december";
        } else {
            $mesec[1] = "January";
            $mesec[2] = "February";
            $mesec[3] = "March";
            $mesec[4] = "April";
            $mesec[5] = "May";
            $mesec[6] = "June";
            $mesec[7] = "July";
            $mesec[8] = "August";
            $mesec[9] = "September";
            $mesec[10] = "October";
            $mesec[11] = "November";
            $mesec[12] = "December";
        }

        $datum_a = explode ("-",$datum);

        if ($datum_a[1] < 10){
            $datum_a[1] = $datum_a[1]{1};
        }
        return ltrim($datum_a[2],"0").". ".$mesec[$datum_a[1]]." ".$datum_a[0];
    }
    public function DateFormat2( $datum ){
        if (isset($datum)) {
            $datum_a = explode ("-",$datum);
            if ( isset( $datum_a[2] ) )
                return ltrim($datum_a[2],"0").". ".ltrim($datum_a[1],"0").". ".ltrim($datum_a[0],"0");
            else
                return $datum;
        }
    }

    public function GetMonth($datum){

        $util = new DCUtil();
        $translate = new DCLibModulesDominoTranslate();

        $mesec = array();
        $mesec[1] = "january";
        $mesec[2] = "february";
        $mesec[3] = "march";
        $mesec[4] = "april";
        $mesec[5] = "may";
        $mesec[6] = "june";
        $mesec[7] = "july";
        $mesec[8] = "august";
        $mesec[9] = "september";
        $mesec[10] = "october";
        $mesec[11] = "november";
        $mesec[12] = "december";

        $datum_a = explode ("-",$datum);

        if ($datum_a[1] < 10){
            $datum_a[1] = $datum_a[1]{1};
        }
        $month_name = $mesec[$datum_a[1]];

        $trans = $translate->showTranslate(array($month_name));

        return $trans[$month_name]." ".$datum_a[0];
    }
    public function microtime_float(){
        list($usec, $sec) = explode(" ", microtime());
        return ((float)$usec + (float)$sec);
    }
    public function DatePost($datum){
        $datum_a = explode (".",$datum);
        return $datum_a[2]."-".$datum_a[1]."-".$datum_a[0];
    }
    public function DateGet($datum){
        $datum_a = explode ("-",$datum);
        return $datum_a[2].".".$datum_a[1].".".$datum_a[0];
    }
    public function TimeFormat1($cas){
        $cas_a = explode (":",$cas);
        return $cas_a[0].":".$cas_a[1];
    }

    public function DateAge($birthdate){
        // assumes $birthdate is in YYYY-MM-DD format
        list($dob_year, $dob_month, $dob_day) = explode('-', $birthdate);
        // determine current year, month, and day
        $cur_year  = date('Y');
        $cur_month = date('m');
        $cur_day  = date('d');
        // either past or on the birthday
        if($cur_month >= $dob_month && $cur_day >= $dob_day) {
            $age = $cur_year - $dob_year;
        }
        // before the birthday
        else {
            $age = $cur_year - $dob_year - 1;
        }
        // and your done
        return $age;
    }

}