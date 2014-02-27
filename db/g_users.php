<?php

require "connect.php";

$userID = isset($_GET['ID']) ? $_GET['ID'] : die("no data transmitted");

$sql = sprintf("SELECT * FROM belongsto WHERE UserID = '%s'",
					mysql_real_escape_string($userID));
$result = mysql_query($sql) or die("Invalid query : " . mysql_error());

$data = array();
while ($row = mysql_fetch_assoc($result)) {
	$groupID = $row['GroupID'];
	$data[$groupID] = array(
					'g_id' => $groupID,
					'fb_id' => $row['UserID'],
					'role' => $row['Role']
				);
}

// print("<pre>".print_r($data,true));
echo json_encode($data);

?>