<?php

	require "connect.php";

	$gid = $_POST['sentgroupid'];
	$id = $_POST['sentid'];

	//excute the computing of recommendation
	$query="SELECT A.GroupID, A.GroupName
			FROM groupinfo A, belongsto B
			WHERE A.GroupID = B.GroupID
			AND A.GroupID != '".$gid."'
			AND A.GroupName != ''
			AND B.UserID != '".$id."'
			AND A.IsOpen != 0
			ORDER BY RAND()
			LIMIT 1";
	$result=mysql_query($query);
	while ( $row = mysql_fetch_assoc($result) ){
		$RecomandGroup = array( 'gid' => $row['GroupID'], 'gname' => $row['GroupName'] );
	}

	echo json_encode($RecomandGroup);;
?>