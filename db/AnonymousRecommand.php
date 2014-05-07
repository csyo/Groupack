<?php
	$r_gid = $_POST['sentgroupid'];
  	// 資料庫參數  
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'groupack';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 

	//excute the computing of recommendation
	$query="SELECT B.URL, C.Title, C.Summary
			FROM sessionlog A, browsinglog B, searchresult C
			WHERE A.SID = B.SID 
			AND B.URL = C.URL
			AND A.GroupID = '".$r_gid."'
			ORDER BY RAND()
			LIMIT 0 , 3 ";
	$result=mysql_query($query);
	while ( $row = mysql_fetch_assoc($result) ){
		$RecomandData[]= array( 'url' => $row['URL'], 'title' => $row['Title'], 'summary' => $row['Summary'] );
	}
	echo json_encode($RecomandData);
?>