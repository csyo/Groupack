<?php
	// 資料庫參數
	require_once('../db/connect.php');
	
	//取得groupID
	$Group_ID = $_POST['sendgroup_ID'];
	
	//取得group裏所有成員的ID
	$queryUser="SELECT UserID 
		  FROM `belongsto` 
		  WHERE GroupID = '$Group_ID'";
    $resultUser=mysql_query($queryUser);
	$num = mysql_num_rows(mysql_query ($queryUser));

	while( list($users) = mysql_fetch_row($resultUser) ){
		$resultKeyword = mysql_query("SELECT UserID,QueryKeyword 
							  FROM `sessionlog` 
							  WHERE UserID='$users' and GroupID='$Group_ID'");
		while ($row = mysql_fetch_assoc($resultKeyword)) {
			$m_topic[]= array('FB_id' => $row['UserID'],
							  'keyword'=>$row['QueryKeyword']); 
		}
	}
   
	echo json_encode($m_topic);	
?>