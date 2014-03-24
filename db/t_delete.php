<?php 
	
	require "connect.php";
	
	$tid = isset( $_POST['tid'] ) ? $_POST['tid'] : '';
	
	if ( isset( $_POST['cid'] ) ) {
	
		// 刪除 Card 的 Tag
		$cid = isset( $_POST['cid'] ) ? $_POST['cid'] : '';
		$query = sprintf ( "DELETE FROM taginfo WHERE TagID = '%s' AND CardID = '%s'",
			mysql_real_escape_string($tid), mysql_real_escape_string($cid) );
		$result = mysql_query($query) or die('Invalid query #1: ' . mysql_error());
		
		echo "Deleting Card: ".$cid." of Tag: ".$tid." ...";

	} else {
		
		$query = sprintf( "DELETE FROM usertag WHERE TagID = '%s'", mysql_real_escape_string($tid) );
		$result = mysql_query($query) or die('Invalid query #2: ' . mysql_error());
		    
		echo "Deleting Tag: ".$tid." ...";
		
	}
	
	
?>