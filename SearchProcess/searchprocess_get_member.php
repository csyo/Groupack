<?php	
	if($_POST['sentgroupid']){	
		$groupid=$_POST['sentgroupid'];
	}
	else{
		$groupid=1;
	}
	
	// 資料庫參數  抓取使用者所輸入過的關鍵字來做比較
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'collaborative_search';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 
	

	$u_word=" SELECT FB_NAME, FB_ID FROM group_member where G_ID= '$groupid'";
	$GROUP_query=mysql_query($u_word);
	while ( $row = mysql_fetch_assoc($GROUP_query)){
		$member[]= array( 'name' => $row['FB_NAME'] , 'id' => $row['FB_ID'] );
	}

	 echo json_encode($member);   
		
?>	