<?php

// 資料庫參數
$dbhost = '127.0.0.1';
$dbuser = 'cosearch';
$dbpass = '1234567';
$dbname = 'collaborative_search';
$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
mysql_set_charset('utf8') or die('Failed to set utf-8');

// 資料
$fbid = isset( $_POST['fbid'] ) ? $_POST['fbid'] : '';

// 選取 Tag ID
$select = sprintf ( "SELECT * FROM tag WHERE FB_ID = '%s' ORDER BY TAG_TIMESTAMP ASC ", mysql_real_escape_string($fbid) );
$result = mysql_query($select) or die ('Invalid query #1: ' . mysql_error());

$data = array();

// 擷取 Tag 資料
while ( $row = mysql_fetch_assoc($result) ) {
	
	$tid = $row['TAG_ID'];
	
	$query = sprintf( "SELECT * FROM tag_card WHERE TAG_ID ='%s' ORDER BY CARD_TIMESTAMP DESC", mysql_real_escape_string($tid) );
	$cards = mysql_query($query) or die ('Invalid query #2: ' . mysql_error());
	
	$c = array();
	while ( $card = mysql_fetch_assoc($cards) ) {
		$c[] = array( 'cid' => $card['CARD_ID'] , 'title' => $card['CARD_TITLE'] , 'content' => $card['CARD_CONTENT'] , 'url' => $card['CARD_URL'] );
	}
	
	$data[] = array( 'tid' => $tid ,
					'name' => $row['TAG_NAME'] ,
					'color' => $row['COLOR'] ,
					'cards' => $c
	);
	
}

echo json_encode($data);

?>