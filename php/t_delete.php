<?php 
	
	// 資料庫參數
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'collaborative_search';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
	mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
	mysql_set_charset('utf8') or die('Failed to set utf-8');
	
	$tid = isset( $_POST['tid'] ) ? $_POST['tid'] : '';
	
	if ( isset( $_POST['cid'] ) ) {
	
		// 刪除 Card 的 Tag
		$cid = isset( $_POST['cid'] ) ? $_POST['cid'] : '';
		$query = sprintf ( "DELETE FROM tag_card WHERE TAG_ID = '%s' AND CARD_ID = '%s'", mysql_real_escape_string($tid), mysql_real_escape_string($cid) );
		$result = mysql_query($query) or die('Invalid query #1: ' . mysql_error());
		
		echo "Deleting Card: ".$cid." of Tag: ".$tid." ...";

	} else {
		
		// 刪除 Tag
		$query = sprintf ( "DELETE FROM tag_card WHERE TAG_ID = '%s'", mysql_real_escape_string($tid) );
		$result = mysql_query($query) or die('Invalid query #1: ' . mysql_error());
		
		$query = sprintf( "DELETE FROM tag WHERE TAG_ID = '%s'", mysql_real_escape_string($tid) );
		$result = mysql_query($query) or die('Invalid query #2: ' . mysql_error());
		    
		echo "Deleting Tag: ".$tid." ...";
		
	}
	
	
?>