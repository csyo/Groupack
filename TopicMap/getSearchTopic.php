<?php
	// 資料庫參數
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'collaborative_search';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 
	
	//取得groupID
	$Group_ID = $_POST['sendgroup_ID'];
	
	
	//取得group裏所有成員的ID
	$str="SELECT FB_ID FROM `group_member` WHERE G_ID = '$Group_ID'";
    $result=mysql_query($str);
	
	$num = mysql_num_rows(mysql_query ($str));
	//echo $num.",";
	
	
	while( list($users) = mysql_fetch_row($result) ){
      $query = mysql_query("SELECT FB_ID,SEARCH_KEYWORD FROM `search_session` WHERE FB_ID='$users' and G_ID='$Group_ID'");
	while ($row = mysql_fetch_assoc($query)) {
	  $m_topic[]= array('FB_id' => $row['FB_ID'],'keyword'=>$row['SEARCH_KEYWORD']); //一維陣列 陣列裡存的是物件
		}
	}
   
	echo json_encode($m_topic);
	
	//取得所有成員下的topic	
?>