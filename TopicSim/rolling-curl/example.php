<?php
/*
authored by Josh Fraser (www.joshfraser.com)
released under Apache License 2.0

Maintained by Alexander Makarov, http://rmcreative.ru/

$Id$
*/

// a little example that fetches a bunch of sites in parallel and echos the page title and response info for each request

function request_callback($response, $info) {
	// parse the page title out of the returned HTML
	if (preg_match("~<title>(.*?)</title>~i", $response, $out)) {
		$title = $out[1];
	}
	echo "<b>$title</b><br />";
	print_r($info);
	echo "<hr>";
}

require("RollingCurl.php");

// single curl request
//$rc = new RollingCurl("request_callback");
//$rc->request("http://www.msn.com");
//$rc->execute();
//
// another single curl request
//$rc = new RollingCurl("request_callback");
//$rc->request("http://www.google.com");
//$rc->execute();

echo "<hr>";

// some urls sites
$urls = array("http://zh.globalvoicesonline.org/hant/2013/05/23/15189/",
              "http://news.chinatimes.com/",
              "https://zh.wikipedia.org/zh-tw/%E7%B9%81%E4%BD%93%E4%B8%AD%E6%96%87",
              "http://zh.wikipedia.org/zh-tw/%E6%B1%89%E8%AF%AD",
              "http://api.jquery.com/keydown/");

$rc = new RollingCurl("request_callback");
$rc->window_size = 20;
foreach ($urls as $url) {
    $request = new RollingCurlRequest($url);
    $rc->add($request);
}
$rc->execute();