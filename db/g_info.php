<?php

/**********************
 *	回傳群組管理員與成員名單
 **********************/

require "connect.php";

$groupID = isset($_POST['gID']) ? $_POST['gID'] : die("no data transmitted");
$data = array();

$sql = sprintf("SELECT userinfo.UserID, userinfo.FullName, belongsto.Role
					FROM belongsto, userinfo
					WHERE GroupID = '%s' AND belongsto.UserID = userinfo.UserID",
					mysql_real_escape_string($groupID));
$result = mysql_query($sql) or die("Invalid query: " . mysql_error());
while( $row = mysql_fetch_assoc($result)) {
	$data[] = array(
				'id' => $row['UserID'],
				'name' => $row['FullName'],
				'role' => $row['Role']
		);
}

echo json_encode($data);

?>