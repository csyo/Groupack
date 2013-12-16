<?php
    /*
	   取得group成員(Topic map) 因為還在修改其常常會抓不倒成員 所以暫時需要存在
    */
	  
	// 資料庫參數
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'collaborative_search';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 
		
	$Group_ID = $_POST['sendgroup_ID'];
	$userID = $_POST['sendmy_id'];	
   
	$queryID=" SELECT UserID 
			   FROM `belongsto` 
			   where GroupID='$Group_ID' AND FB_ID != '$userID'";
	$resultID=mysql_query($queryID);
	while ( $row = mysql_fetch_assoc($resultID)){
		$queryNAME=" SELECT FullName 
					 FROM `userinfo` 
					 where UserID= '$row['UserID']' ";
		$resultName=mysql_query($queryNAME);
		$name_arr=mysql_fetch_assoc($resultName);
		$member[]= array( 'name' => $name_arr['FullName'] , 'id' => $row['UserID'] );
	}
	//print_r($member);
	echo json_encode($member);   	   
?>