<?php
require_once('connect.php');

if (isset($_POST['gid'])) {
	$data = array();

	$sql = sprintf("SELECT GroupID, GroupName FROM groupinfo
		WHERE IsOpen = 1 AND NOT EXISTS
		(SELECT GroupID FROM belongsto WHERE groupinfo.GroupID = belongsto.GroupID AND UserID = '%s' AND GroupID != '%s')", $_POST['fbid'], $_POST['gid']);
	$result = mysql_query($sql) or die('Invalid query:'+ mysql_error());
	while ( $row = mysql_fetch_assoc($result)){
		$data[] = array( 'g_id' => $row['GroupID'], 'g_name' => $row['GroupName']);
	}
	// $data['query'] = $sql;
	echo json_encode($data);
} else die('no data is posted');
?>