<?php
    /*
	   ���ogroup����(Topic map) �]���٦b�ק��`�`�|�줣�˦��� �ҥH�Ȯɻݭn�s�b
    */
	  
	// ��Ʈw�Ѽ�
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'collaborative_search';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 
	
	
	$Group_ID = $_POST['sendgroup_ID'];
	$userID = $_POST['sendmy_id'];
	
	
	$str00="SELECT FB_ID,FB_NAME FROM `group_member` WHERE G_ID = '$Group_ID' AND FB_ID != '$userID'";
    $result00=mysql_query($str00);
	
	while ($row = mysql_fetch_assoc($result00)) {
	    $g_member[]= array('FB_id' => $row['FB_ID'],'FB_name'=>$row['FB_NAME']); //�@���}�C �}�C�̦s���O����
		}
   
	echo json_encode($g_member);
    
?>