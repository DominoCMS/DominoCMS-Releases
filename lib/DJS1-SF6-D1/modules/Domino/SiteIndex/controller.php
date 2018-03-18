<?php

class DCLibModulesDominoSiteIndex extends DCBaseController {

    public function sitemap( ) {

        global $config;
        global $site;

        $util = new DCUtil();
        $test = "";
        // List Domains
        $site = $util->dominoSql("select frontPageEntry FROM " . $site['db'] . ".DCDominoIdentity;",'fetch_one');

        $domains = $util->dominoSql("select * FROM " . $site['db'] . ".DCDominoIdentityDomains;",'fetch_array');
        foreach ( $domains AS $domain ) {

            // start of sitemap document
            $fileContent = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";

            $domain['langs'] = explode(",",$domain["languages"]);
            if ( count($domain['langs']) > 1 )
                $fileContent .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"
              xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n";
            else
                $fileContent .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"
               xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"
               xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">\n";


            $fileContent .= $this->siteIndexEntries( 1, 'Content', $domain, $site );

            $menus = $util->dominoSql("select id FROM " . $site['db'] . ".DCDominoMenu ORDER BY id ASC;",'fetch_array');
            if ( $menus )
                foreach ( $menus AS $menu )
                    $fileContent .= $this->siteIndexEntries( 1, 'Domino.Menu.'.$menu['id'], $domain, $site );

            $fileContent .= "</urlset>\n";

            $filename = "domains/".$domain["domain"]."/sitemap.xml";
            $file = fopen( $filename, "w" );
            fwrite( $file, $fileContent);
            fclose( $file );

        }

        return $fileContent;
    }

    function siteIndexEntries ( $priority, $parent, $domain, $site ) {

        global $site;
        global $user;
        $util = new DCUtil();
        $date = new DCDate();

        $ret = "";
        $i = 0;
        $query = ( $parent == 'Content' )  ? "d2.developer='Domino' AND d2.module='Content' AND d2.parent=''" : "d2.parent='".$parent."'";

        $siteIndex = $util->dominoSql("SELECT *,d2.entry FROM " . $site['db'] . ".DCDominoSiteSlugs d1 JOIN " . $site['db'] . ".DCDominoSiteIndex d2 ON (d1.entry = d2.entry) WHERE " . $query . " AND d1.lang='".$domain['lang']."' AND d2.status=1 AND d2.privacy=0 ORDER BY `order` ASC;",'fetch_array');
        foreach  ( $siteIndex AS $si ) {

            /*$sql_stats = "SELECT COUNT(id) FROM x_".$Arr["id"].".domino_stats WHERE PageId=".$PageId."";
            $result_stats = mysql_query( $sql_stats );
            $line_stats = mysql_fetch_array ( $result_stats, MYSQL_NUM );
            $Views = $line_stats[0];

            $sql_views = "UPDATE x_".$Arr["id"].".domino_module_page SET stats_views=".$Views." WHERE id=".$PageId.";";
            mysql_query($sql_views);
*/
            $url = "";
            if ( $domain['urlType'] == 'lang' || ( $domain['urlType'] == 'nolangLang' && $domain['lang'] != $domain['langMain'] ) )
                $url .= "/".$domain['lang'];

            if ( $site['frontPageEntry'] != $si['entry'] )
                $url .= $si['urlpath']."/".$si['urlname'];

            // Timestamp
            $timestamp = $util->dominoSql("select FROM_UNIXTIME(dateCreated,'%Y-%m-%d') AS dateCreated FROM " . $site['db'] . ".DCDominoTimestamps WHERE developer='".$si['developer']."' AND module='".$si['module']."' AND id='".$si['id']."' ORDER BY dateCreated DESC LIMIT 1;",'fetch_one');

            if ( $timestamp )
                $tstamp = $timestamp["dateCreated"];
            else {
                $tstamp = date("Y-m-d");
                $util->dominoSql( "INSERT INTO " . $site['db'] . ".DCDominoTimestamps (`developer`, `module`, `id`, `dateCreated`, `userId`) VALUES ('".$si['domino']."','".$si['module']."','".$si['id']."','".$date->dateNowInt()."','".$user['id']."');", 'insert');
            }

            $entry = "\t<url>\n";
            $entry .= "\t\t<loc>".$domain['protocol']."://www.".$domain['domain'].rtrim($url,"/")."</loc>\n";

            if ( count($domain['langs']) > 1 ) {
                for ($i = 0; $i < count($domain['langs']); $i++) {

                    $lang = $domain['langs'][$i];

                    $url = "/".$lang;
                    if ( $site['frontPageEntry'] != $si['entry'] )
                        $url .= $si['urlpath']."/".$si['urlname'];

                    $entry .= "\t\t<xhtml:link rel=\"alternate\" hreflang=\"".$lang."\" href=\"".$domain['protocol']."://www.".$domain['domain'].rtrim($url,"/")."\" />\n";
                }
            }

            $priority = $priority - ( "0.00".$i++ );
            $entry .= "\t\t<lastmod>" . $tstamp  ."</lastmod>\n";
            //$entry .= "\t\t<changefreq>".$Freq."</changefreq>\n";
            $entry .= "\t\t<priority>" . $priority . "</priority>\n";
            $entry .= "\t</url>\n";

            $ret .= $entry;


            $children = $this->siteIndexEntries ( $priority , $si['entry'], $domain, $site );
            if ( $children )
                $ret .= $children;


        }

        return $ret;
    }
}