<?php

require "connect.php";

// 資料
$fbid = isset( $_POST['fbid'] ) ? $_POST['fbid'] : '';

// 選取 Tag ID
$select = sprintf ( "SELECT * FROM usertag WHERE UserID = '%s' ORDER BY CreatedTimestamp ASC ", mysql_real_escape_string($fbid) );
$result = mysql_query($select) or die ('Invalid query #1: ' . mysql_error());

$data = array();

// 擷取 Tag 資料
while ( $row = mysql_fetch_assoc($result) ) {
	
	$tid = $row['TagID'];
	
	$query = sprintf( "SELECT * FROM taginfo WHERE TagID ='%s' ORDER BY CreatedTimestamp DESC", mysql_real_escape_string($tid) );
	$cards = mysql_query($query) or die ('Invalid query #2: ' . mysql_error());
	
	$c = array();
	while ( $card = mysql_fetch_assoc($cards) ) {
		$c[] = array( 'cid' => $card['CardID'] , 'title' => $card['CardName'] ,
			'content' => $card['CardComment'] , 'url' => $card['URL'] );
	}
	
	$data[] = array( 'tid' => $tid ,
					'name' => $row['TagName'] ,
					'color' => $row['Color'] ,
					'cards' => $c
	);
	
}

echo json_encode($data);

?>