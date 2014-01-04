<?php	
    /*
	searchprocess_get_member.php(由get_member()函式ajax呼叫)
	   目的: 抓取群組內所有成員
	   方法: 取得"group_member"內G_ID為目前選擇群組的FB_NAME,FB_ID
			 輸出成json物件
	   語法: SELECT FB_NAME, FB_ID FROM group_member where G_ID='$groupid'
	   新的資料庫方式: 取得"BelongsTo"內GroupID為目前群組的UserID 
	                   以UserID做為查詢UserInfo的key,查詢使用者的FullName
	   新的語法: SELECT UserID FROM belongsto where GroupID='$groupid'
				 SELECT FullName FROM userinfo where UserID= '$row['UserID']'
    */	

	if($_POST['sentgroupid']){	
		$groupid=$_POST['sentgroupid'];
	}
	else{
		$groupid=1;
	}
	
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'groupack';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 
	
	$queryID=" SELECT UserID 
			   FROM `belongsto` 
			   where GroupID='$groupid' ";
	$resultID=mysql_query($queryID);
	while ( $row = mysql_fetch_assoc($resultID)){
		$queryNAME=" SELECT FullName 
					 FROM `userinfo` 
					 where UserID= '$row[UserID]' ";
		$resultName=mysql_query($queryNAME);
		$name_arr=mysql_fetch_assoc($resultName);
		$member[]= array( 'name' => $name_arr['FullName'] , 'id' => $row['UserID'] );
	}
	//print_r($member);
	echo json_encode($member);   		
?>	