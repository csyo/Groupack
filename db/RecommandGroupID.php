<?php
	$gid = $_POST['sentgroupid'];
	$id = $_POST['sentid'];
	
	// 資料庫參數  
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'groupack';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 

	//excute the computing of recommendation
	$query="SELECT A.GroupID, A.GroupName
			FROM groupinfo A, belongsto B
			WHERE A.GroupID = B.GroupID
			AND A.GroupID != '".$gid."'
			AND A.GroupName != ''
			AND B.UserID != '".$id."'
			ORDER BY RAND()
			LIMIT 1";
	$result=mysql_query($query);
	while ( $row = mysql_fetch_assoc($result) ){
		$RecomandGroup = array( 'gid' => $row['GroupID'], 'gname' => $row['GroupName'] );
	}

	echo json_encode($RecomandGroup);;
?>