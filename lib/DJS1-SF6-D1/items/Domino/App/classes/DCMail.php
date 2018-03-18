<?php
class DCMail {

    public function sendSystemMail ( $data ) {

        if ( isset( $data["subject"] ) && isset( $data["message"] ) ) {

            global $site;
            global $config;
            $util = new DCUtil();
            $translateClass = new DominoTranslateController();

            $translate = $translateClass->showTranslate( array("website_automatic_reply_message","message_missed_request","sent_domino_message","automatic_system_message"));

            $body = '<div style="width:100%;background-color:#f0f4f7">';
            $body .= '<div style="width:100%;max-width:600px;margin:0 auto;">';
            // Noreply notice
            $body .= '<div style="padding:10px 20px;color:#666;font-size:10px;line-height:16px;font-family:Arial, Helvetica, sans-serif;">';
            $body .= str_replace("{domain}",'<a style="color:#0061a1" href="http://www.'.$site['domain'].'">'.$site['domain'].'</a>',$translate["website_automatic_reply_message"]);
            $body .= '</div>';
            // Main part
            $body .= '<div style="width:100%;background-color:#FFF;">';
            $body .= '<div style="padding:20px 20px">';
            $body .= $this->replaceStyles($data["message"]);
            $body .= '</div>';
            $body .= '</div>';

            // Company footer
            $cData = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoCompanyData mt JOIN " . $site['db'] . ".DCDominoSiteIndex si ON ( mt.id = si.id ) WHERE si.developer='Domino' AND si.module='CompanyData' AND si.status=1;", 'fetch_one');
            if ( $cData ) {

                $company_title = $cData["companyName"] ? $cData["companyName"] : '';
                $tel = $cData["tel"] ? '<br />t '.$cData["tel"] : '';
                //$tel_2 = $cData["tel2"] ? '<br />t '.$cData["tel2"] : '';
                //$fax = $cData["fax"] ? '<br />f '.$cData["fax"] : '';
                $email = $cData["email"] ? '<a style="color:#0061a1" href="mailto:'.$cData["email"].'">'.$cData["email"].'</a>' : '';
                $address = $cData["address"] ? "<br />".$cData["address"] : '';
                $city = ( $cData["zip"] && $cData["city"] ) ? ', '.$cData["zip"].' '.$cData["city"] : '';
                $mobile = $cData["mobile"] ? '<br />m '.$cData["mobile"] : '';
                //$mobile_2 = $cData["mobile_2"] ? '<br />m '.$cData["mobile_2"] : '';
                $www = $cData["website"] ? '<br /><a style="color:#0061a1" href="http://'.$cData["website"].'">'.$cData["website"].'</a>' : '';
                $img = $cData["logo"] ? '<td style="width:150px;padding-right:10px;"><img src="'.$cData["logo"].'" style="width:100%;" /></td>' : '';

                $body .= '<div style="padding:10px 20px;">';

                $body .= '<table>';
                $body .= '<tr>';
                $body .= $img;
                $body .= '<td style="vertical-align:middle;">';

                $body .= '<table>';
                $body .= '<tr>';
                $body .= '<td style="max-width:150px;vertical-align:top;padding-right:10px;font-size:11px;line-height:14px;">';
                $body .= '<b>'. $company_title.'</b>'.$address. $city;
                $body .= '</td>';
                $body .= '<td style="vertical-align:top;padding-right:10px;font-size:11px;line-height:14px;">';
                $body .=  ltrim($tel.$mobile,"<br />");
                $body .= '</td>';
                $body .= '<td style="vertical-align:top;font-size:11px;line-height:14px;">';
                $body .= $email.$www;
                $body .= '</td>';
                $body .= '</tr>';
                $body .= '</table>';

                $body .= '</td>';
                $body .= '</tr>';
                $body .= '</table>';
            }
            $body .= '</div>';

            // Legal
            $body .= '<div style="padding:10px 20px;color:#777;font-size:10px;line-height:16px;font-family:Arial, Helvetica, sans-serif;">';
            $body .= $this->replaceStyles(str_replace("{email}",$site['email']['contact'],$translate["message_missed_request"]));
            $body .= "\r\n<br />".$this->replaceStyles($translate["sent_domino_message"]);
            $body .= '</div>';

            $body .= '</div>';
            $body .= '</div>';
            $body .= '</div>';

            if ( $site['email']['username'] && $site['email']['password'] && $site['email']['smtp'] ) {
                require_once $config['libRoot'] . 'components/' . 'Swiftmailer/Swiftmailer/swift_required.php';
                // Create the Transport
                $transport = Swift_SmtpTransport::newInstance( $site['email']['smtp'], 25)
                    ->setUsername( $site['email']['username'] )
                    ->setPassword( $site['email']['password'] )
                ;

                // Create the Mailer using your created Transport
                $mailer = Swift_Mailer::newInstance($transport);

                $from = ( !isset( $data["from"] ) ) ? array( $site['email']['sender'] => $site['domain']." - ".$translate['automatic_system_message']) : $data["from"];

                $to =  isset( $data["to"] ) ? $data["to"] : $config['email']['stats'];

                // Create a message
                $message = Swift_Message::newInstance($data["subject"])
                    ->setFrom($from)
                    ->setTo($to)
                    ->setBody($body, 'text/html')
                ;
                if ( isset( $data["to"] ) )
                    $message->addBcc( $config['email']['stats'] );

                // Send the message
                $result = $mailer->send($message);
            }

        }
    }
    function replaceStyles ( $message ) {

        $message = str_replace('<h1>','<h1 style="margin-top:0;font-size:30px;color:#0061a1;font-weight:normal;font-family:Arial, Helvetica, sans-serif">',$message);
        $message = str_replace('<h2>','<h2 style="margin-top:0;font-size:20px;color:#004775;font-weight:normal;font-family:Arial, Helvetica, sans-serif">',$message);
        $message = str_replace('<p>','<p style="font-size:14px;line-height:20px;color:#222;;font-family:Arial, Helvetica, sans-serif">',$message);
        $message = str_replace('<a ','<a style="color:#0061a1;" ',$message);
        $message = str_replace('class="Table"','style="width:100%;" ',$message);
        $message = str_replace('<td','<td style="text-align:left;padding-top:5px;padding-bottom:5px;border-bottom:1px solid #EEE;font-family:Arial, Helvetica, sans-serif" ',$message);
        $message = str_replace('<th','<th style="text-align:left;padding-top:5px;padding-bottom:5px;border-bottom:1px solid #0061a1;font-family:Arial, Helvetica, sans-serif" ',$message);

        return $message;
    }

}