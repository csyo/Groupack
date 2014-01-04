<?php
	
	require "connect.php";

	if ( isset( $_POST['logid'] )  ) {
		// 記錄 EndTimestamp
		$timestamp = date('Y-m-d G:i:s');
		$sql = sprintf("UPDATE sessionlog SET EndTimestamp = '%s' WHERE SID = %u",
				$timestamp, intval($_POST['logid']));
		mysql_query($sql) or die('#1: ' . mysql_error());
		echo $sql;
	} else {
		// 新增一筆資料
		$sql = sprintf("INSERT INTO sessionlog (GroupID,UserID,QueryKeyword) VALUES ('%s','%s','%s')",
				mysql_real_escape_string($_POST['gid']),
				mysql_real_escape_string($_POST['id']),
				mysql_real_escape_string($_POST['keyword']));
		mysql_query($sql) or die('#2: ' . mysql_error());
		echo mysql_insert_id();
	}
?>