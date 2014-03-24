<?php
	
	require "connect.php";

	$msg = '';
    function logMsg($msg){
        $GLOBALS['msg'] = $GLOBALS['msg'] . $msg . "\n";
    }
    $gid = isset($_POST['gid']) ? $_POST['gid'] : null;

	// personal seesion
	if ( !$gid ) {
		$sql = sprintf("INSERT INTO userinfo VALUES ('%s', '%s')",
			mysql_real_escape_string($_POST['id']),
			mysql_real_escape_string($_POST['name']));
		mysql_query($sql) or logMsg('Invalid for `userinfo`: ' . mysql_error());
		$sql = sprintf("INSERT INTO groupinfo (GroupID,GroupName) VALUES ('%s','%s')",
			mysql_real_escape_string($_POST['id']),
			mysql_real_escape_string($_POST['name']));
		mysql_query($sql) or logMsg('Invalid for `groupinfo`: ' . mysql_error());
		$sql = sprintf("INSERT INTO belongsto VALUES ('%s', '%s', '%s')",
			mysql_real_escape_string($_POST['id']),
			mysql_real_escape_string($_POST['id']),
			mysql_real_escape_string('ADMIN'));
		mysql_query($sql) or logMsg('Invalid for `belongsto`: ' . mysql_error());
		$gid = $_POST['id'];
		echo($msg);
	}

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
				mysql_real_escape_string($gid),
				mysql_real_escape_string($_POST['id']),
				mysql_real_escape_string($_POST['keyword']));
		mysql_query($sql) or die('#2: ' . mysql_error());
		echo mysql_insert_id();
	}
?>