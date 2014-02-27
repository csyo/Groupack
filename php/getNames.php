<?php
	$dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    $query = "SELECT * FROM user WHERE 1";
    $result = mysql_query($query) or die('MySQL failed: '.mysql_error());
    
    $data = array();
    while ($row = mysql_fetch_assoc($result)) {
		$data[] = array( 'id' => $row['FB_ID'] , 'name' => $row['FB_NAME'] );
    }
    echo json_encode($data);
?>