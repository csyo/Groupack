<?php
	if ( $_SERVER[HTTP_HOST] === 'localhost') {
		$dbhost = '140.116.39.180';
		$dbuser = 'theadmin';
		$dbpass = 'groupack';
	} else {
		$dbhost = '127.0.0.1';
		$dbuser = 'cosearch';
		$dbpass = '1234567';
	}
	$dbname = 'groupack';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
	mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
	mysql_set_charset('utf8') or die('Failed to set utf-8');
?>