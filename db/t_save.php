<?php 
	
	require "connect.php";
	
	// POST 資料
	$tid = isset( $_POST['tid'] ) ? $_POST['tid'] : '';
	$cid = isset( $_POST['cid'] ) ? $_POST['cid'] : '';
	$title = isset( $_POST['title'] ) ? $_POST['title'] : '';
	$content = isset( $_POST['content'] ) ? $_POST['content'] : '';
	$url = isset( $_POST['url'] ) ? $_POST['url'] : '';
	
	// 檢查是否有同組資料
	$check = sprintf ( "SELECT * FROM taginfo WHERE TagID = '%s' AND CardID = '%s'",
		mysql_real_escape_string($tid), mysql_real_escape_string($cid) );
	$result = mysql_query($check) or die ('Invalid query #1: ' . mysql_error());
	
	$status = 'Selecting';
	
	if ( mysql_num_rows($result) == 0 ) {
		
		// 檢查是否為相同 tag card
		$check = sprintf ( "SELECT * FROM taginfo WHERE URL = '%s'", mysql_real_escape_string($url) );
		$result = mysql_query($check) or die ('Invalid query #2.1: ' . mysql_error());
		
		if ( mysql_num_rows($result) > 0 ) {
			
			// 更新相同 tag card 之 CardID
			$query = sprintf( "UPDATE taginfo SET CardID = '%s' WHERE URL = '%s'",
			                   mysql_real_escape_string($cid), mysql_real_escape_string($url) );
			$result = mysql_query($query) or die ('Invalid query #2.1.1: ' . mysql_error());	
			
		}
		
	    // 新增 tag card
	    $query = sprintf( "INSERT INTO taginfo (TagID,CardID,CardName,CardComment,URL)
	    	VALUES ('%s','%s','%s','%s','%s')",
	    	mysql_real_escape_string($tid), mysql_real_escape_string($cid),
	    	mysql_real_escape_string($title), mysql_real_escape_string($content),
	    	mysql_real_escape_string($url));
	    $result = mysql_query($query) or die('Invalid query #2.2: ' . mysql_error());
	    
	    $status = 'Adding';
	    
	} else {
	
	    // 更新 tag card
	    $query = sprintf( "UPDATE taginfo SET CardName = '%s', CardComment = '%s', URL = '%s'
	    	WHERE TagID = '%s' AND CardID = '%s'",
	    	mysql_real_escape_string($title), mysql_real_escape_string($content),
	    	mysql_real_escape_string($url), mysql_real_escape_string($tid), mysql_real_escape_string($cid));
	    $result = mysql_query($query) or die ('Invalid query #3: ' . mysql_error());
	    
	    $status = 'Updating';
	}
	
	echo $status." Card ".$title." (".$cid.") , url: ".$url." under Tag ".$tid." .";
	
?>                                                         