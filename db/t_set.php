<?php 
	
	require "connect.php";
	
	// POST 
	$tid = isset( $_POST['tid'] ) ?  $_POST['tid'] : '';
	$name = isset( $_POST['name'] ) ?  $_POST['name'] : '';
	$fbid= isset( $_POST['fbid'] ) ?  $_POST['fbid'] : '';
	
	$check = sprintf ( "SELECT * FROM usertag WHERE TagID = '%s' AND UserID = '%s'",
		mysql_real_escape_string($tid), mysql_real_escape_string($fbid) );
	$result = mysql_query($check) or die ('Invalid query #1: ' . mysql_error());
	
	$status = 'Editing';
	
	if ( mysql_num_rows($result) == 0 ) {
	    //
	    $query = sprintf( "INSERT INTO usertag (UserID,TagID,TagName)
	    	VALUES ('%s','%s','%s')",
	    	mysql_real_escape_string($fbid), mysql_real_escape_string($tid),
	    	mysql_real_escape_string($name));
	    $result = mysql_query($query) or die('Invalid query #2: ' . mysql_error());
	    $status = 'Adding';
	    
	} else {
	    // 
	    $query = sprintf( "UPDATE usertag SET TagName = '%s'
	    	WHERE TagID = '%s' AND UserID = '%s'",
	    	mysql_real_escape_string($name),
	    	mysql_real_escape_string($tid), mysql_real_escape_string($fbid));
	    $result = mysql_query($query) or die ('Invalid query #3: ' . mysql_error());
	    $status = 'Updating';
	}
	
	echo $status." Tag: ".$name." (".$tid.") by ".$fbid." .";
	
?>                                        