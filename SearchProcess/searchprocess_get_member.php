<?php	
    /*
	searchprocess_get_member.php(��get_member()�禡ajax�I�s)
	   �ت�: ����s�դ��Ҧ�����
	   ��k: ���o"group_member"��G_ID���ثe��ܸs�ժ�FB_NAME,FB_ID
			 ��X��json����
	   �y�k: SELECT FB_NAME, FB_ID FROM group_member where G_ID='$groupid'
	   �s����Ʈw�覡: ���o"BelongsTo"��GroupID���ثe�s�ժ�UserID 
	                   �HUserID�����d��UserInfo��key,�d�ߨϥΪ̪�FullName
	   �s���y�k: SELECT UserID FROM belongsto where GroupID='$groupid'
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