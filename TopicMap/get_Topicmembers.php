<?php
    /*
	   取得group成員(Topic map) 因為還在修改其常常會抓不倒成員 所以暫時需要存在
    */
	  
	// 資料庫參數
	require_once('../db/connect.php');
		
	$Group_ID = $_POST['sendgroup_ID'];
	$userID = $_POST['sendmy_id'];	
    
	$queryID=" SELECT UserID
			   FROM `belongsto` 
			   WHERE GroupID =  '$Group_ID' AND UserID !=  '$userID' ";   
	$resultID=mysql_query($queryID);
	while ( $row = mysql_fetch_assoc($resultID) ){
		//echo $row[UserID];
		$queryNAME=" SELECT FullName 
					 FROM `userinfo` 
					 where UserID= '$row[UserID]' ";
		$resultName=mysql_query($queryNAME);
		$name=mysql_fetch_assoc($resultName);
		$member[]= array( 'name' => $name['FullName'] , 'id' => $row['UserID'] );
	}
	//print_r($member);
	echo json_encode($member);   	   
?>