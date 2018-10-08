<?php
class DominoAdminFooterController extends DCBaseController {

    function indexAction($data) {
        $util = new DCUtil();
        $translate = new DCLibModulesDominoTranslate();

        global $config;

        //$versionLog = $util->dominoSql("select version FROM " . $config['db'] . ".DCDominoVersionLog ORDER BY CAST(id AS UNSIGNED) DESC LIMIT 1;", 'fetch_one');

        $ret = array(
            'license' => 'https://www.dominocms.com/legal/open-source-license',
            'translate' => $translate->showTranslate(array("terms_of_use", "privacy_policy", "cookies_policy", "created_by")),
            'text' => "DominoCMS",
            'year' => $this->numberToRoman('2007'). '–' . $this->numberToRoman(date('y')),
            'ver' => '0.9.138 alpha' //$versionLog['version']
        );
        return $ret;
    }
    function numberToRoman($num){
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

}
