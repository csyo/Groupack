<?php 
	
	require "connect.php";
	
	// POST 資料
	$tid = isset( $_POST['tid'] ) ?  $_POST['tid'] : '';
	$name = isset( $_POST['name'] ) ?  $_POST['name'] : '';
	$color = isset( $_POST['color'] ) ?  $_POST['color'] : '';
	$fbid= isset( $_POST['fbid'] ) ?  $_POST['fbid'] : '';
	
	// 檢查是否有同組資料
	$check = sprintf ( "SELECT * FROM usertag WHERE TagID = '%s' AND UserID = '%s'",
		mysql_real_escape_string($tid), mysql_real_escape_string($fbid) );
	$result = mysql_query($check) or die ('Invalid query #1: ' . mysql_error());
	
	$status = 'Editing';
	
	if ( mysql_num_rows($result) == 0 ) {
	    // 新增
	    $query = sprintf( "INSERT INTO usertag (UserID,TagID,TagName,Color)
	    	VALUES ('%s','%s','%s','%s')",
	    	mysql_real_escape_string($fbid), mysql_real_escape_string($tid),
	    	mysql_real_escape_string($name), mysql_real_escape_string($color));
	    $result = mysql_query($query) or die('Invalid query #2: ' . mysql_error());
	    $status = 'Adding';
	    
	} else {
	    // 更新
	    $query = sprintf( "UPDATE usertag SET TagName = '%s',Color = '%s'
	    	WHERE TagID = '%s' AND UserID = '%s'",
	    	mysql_real_escape_string($name), mysql_real_escape_string($color),
	    	mysql_real_escape_string($tid), mysql_real_escape_string($fbid));
	    $result = mysql_query($query) or die ('Invalid query #3: ' . mysql_error());
	    $status = 'Updating';
	}
	
	echo $status." Tag: ".$name." (".$tid.") of color ".$color." by ".$fbid." .";
	
?>                                        