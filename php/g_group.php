<?php
    /********************************************
    
                     群組
        
    ********************************************/
    
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    // POST 資料
    $fbid = isset( $_POST['fbid'] ) ? $_POST['fbid'] : '';
    $gname = isset( $_POST['gname'] ) ?  $_POST['gname'] : '';
    $gid = isset( $_POST['gid'] ) ? $_POST['gid'] : '';
    
    if ( $fbid == '' || $gid == '' || $gname == '' ) {
    	die("****** ERROR POST-ing Data! *******");
    }
    
    $check = sprintf( "SELECT * FROM group_data WHERE G_ID = '%s'", mysql_real_escape_string($gid) );
    $select = mysql_query($check) or die ('Invalid query #1: ' . mysql_error());
    if ( mysql_num_rows($select) == 0 ) {
	    // 新增群組
	    $query = sprintf( "INSERT INTO group_data (G_CREATOR,G_NAME,G_ID) VALUES ('%s','%s','%s')", mysql_real_escape_string($fbid), mysql_real_escape_string($gname), mysql_real_escape_string($gid));
	    $result = mysql_query($query);
	    if (!$result) {
	        $message  = 'Invalid query #2: ' . mysql_error() . "\n";
	        $message .= 'Whole query: ' . $query;
	        die($message);
	    }
	    echo "Creating ".$gname." (".$gid.") by ".$fbid;
	} else {
		// 更新
		$query = sprintf( "UPDATE group_data SET G_NAME = '%s' WHERE G_ID = '%s'", mysql_real_escape_string($gname), mysql_real_escape_string($gid));
		$result = mysql_query($query);
		if (!$result) {
		    $message  = 'Invalid query #3: ' . mysql_error() . "\n";
		    $message .= 'Whole query: ' . $query;
		    die($message);
		}
		echo "Updateing ".$gname." (".$gid.") by ".$fbid;
	}
    
?>