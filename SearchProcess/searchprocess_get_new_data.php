<?php	
	/*
	searchprocess.php(��get_searchprocess_data()�禡ajax�I�s)
	   �ت�: ����Ҧ��j�M���{(�̮ɶ�����)
	   ��k: ���o"group_member"��G_ID���ثe��ܸs�ժ�FB_NAME,FB_ID
			 �N���G�s�J$member�}�C
			 �̧Ǩ��o�s�դ������Ҧ�����r�P����r�j�����ƨè̮ɶ��Ƨ�
			 ��X��json����
	   �y�k: SELECT FB_NAME, FB_ID FROM group_member where G_ID='$groupid'
			 SELECT COUNT('SEARCH_KEYWORD') , SEARCH_KEYWORD , FB_ID FROM  `search_session` WHERE FB_ID = ".$member[$h]['id']." AND SEARCH_KEYWORD !=  '' AND G_ID='$groupid' GROUP BY SEARCH_KEYWORD  order by SEARCH_TIMESTAMP
       �s����Ʈw��k: 
			 ���o"belongsto"��GroupID���ثe��ܸs�ժ��Ҧ�UserID
			 �N���G�s�J$member�}�C
			 �Q��"sessionlog"
			 �ھ�UserID�PGroupID�̧Ǩ��o�s�դ������Ҧ�����r�P����r�j�����ƨè̮ɶ��Ƨ�
			 ��X��json����
	   �s�y�k: 
			 SELECT QueryKeyword , UserID 
			 FROM `sessionlog` 
			 WHERE UserID = ".$member[$h]['id']." AND QueryKeyword != '' AND GroupID='$groupid' 
			 GROUP BY QueryKeyword 
			 order by StartTimestamp;
			 
			 SELECT QueryKeyword , UserID 
			 FROM  `sessionlog` 
			 WHERE UserID = ".$member[$h]['id']." AND QueryKeyword !=  '' AND GroupID='$groupid' 
			 GROUP BY QueryKeyword  
			 order by StartTimestamp desc 
			 limit ".$new_data_num_to_get;
	*/

	if($_POST['sentgroupid']){	
		$groupid=$_POST['sentgroupid'];
	}
	else{
		$groupid=1;
	}
	
	$old_data = json_decode($_POST['sentOldData']); //�w�q���w�ݹL������r�s
	
	// ��Ʈw�Ѽ�  
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'groupack';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 
	
	/****	1st_part ���o�Ҧ�group�U�Ҧ���userID  ****/
	
	if($groupid==1){
		$arygroupFBID[0]=$id;
	}
	else{
		$queryID=" SELECT UserID FROM `belongsto` where GroupID='$groupid' ";
		$resultID=mysql_query($queryID);
		while ( $row = mysql_fetch_assoc($resultID) ){
			$member[]= array( 'id' => $row['UserID'] );
		}
	}
	
	/****	 2nd_part ���ouserID���U�s�j�M����r  ****/
	
	$mem = count($member); //�s�դH��
	$new_data = array(); //�w�q���s�j�M������r�s
	
	/***   �����w�n��:���n��   ***/
	
	/**  ���n���L, �G�S���ª��j�M���  **/	
	if($_POST['sentOldData'] == '[]'){		
		for($h=0 ; $h<$mem ; ++$h){
			/*   �q��Ʈw���o�Ҧ�����r   */
			$new_data[$h][0]=array('SEARCH_KEYWORD' => 'no_more_searching_process_data', 'FB_ID' => $member[$h]['id'] );		
			$result=mysql_query("SELECT QueryKeyword , UserID 
								 FROM `sessionlog` 
								 WHERE UserID = ".$member[$h]['id']." AND QueryKeyword != '' AND GroupID='$groupid' 
								 GROUP BY QueryKeyword 
								 order by StartTimestamp");
			$a=0;				
			while ( $row = mysql_fetch_assoc($result) ){		
				$new_data[$h][$a]=array('SEARCH_KEYWORD' => $row['QueryKeyword'], 'FB_ID' => $row['UserID'] );
				++$a;
			}			
		}	
	}	
	/**  �w�n���L, �G���ª��j�M���  **/
	else{  						
		for($h=0 ; $h<$mem ; ++$h){
		
			/*   �p��n���o���s����r�ƶq   */
			$result_num=mysql_query("SELECT COUNT('QueryKeyword') , QueryKeyword , UserID 
									 FROM  `sessionlog` WHERE UserID = ".$member[$h]['id']." AND QueryKeyword !=  '' AND GroupID='$groupid' 
									 GROUP BY QueryKeyword  
									 order by StartTimestamp");
			$all_num= mysql_num_rows($result_num); //�Ҧ�����r���ƶq(���ݹL+�w�ݹL)
			//�p�G���e�ݹL������r�s��0, �h������.
			if($old_data[$h][0]->SEARCH_KEYWORD == 'no_more_searching_process_data')
				$new_data_num_to_get = $all_num;
			//�p�G�ݹL������r�ƶq����Ҧ�����r, �h��0.
			else if( ($all_num - count($old_data[$h]) )==0 )
				$new_data_num_to_get = 0;
			//��l���n����۴���o���ݹL������r�ƶq
			else 
				$new_data_num_to_get = $all_num - count($old_data[$h]) +1;	

			/*   �q��Ʈw���o����r   */	
			$new_data[$h][0]=array('SEARCH_KEYWORD' => 'no_more_searching_process_data', 'FB_ID' => $member[$h]['id'] );		
			$result=mysql_query("SELECT QueryKeyword , UserID 
								 FROM  `sessionlog` 
								 WHERE UserID = ".$member[$h]['id']." AND QueryKeyword !=  '' AND GroupID='$groupid' 
								 GROUP BY QueryKeyword  
								 order by StartTimestamp desc 
								 limit ".$new_data_num_to_get);
			$a=0;			
			while ( $row = mysql_fetch_assoc($result) ){		
				$new_data[$h][$a]=array('SEARCH_KEYWORD' => $row['QueryKeyword'], 'FB_ID' => $row['UserID'] );
				$a=$a+1;
			}			
			$new_data[$h]=array_reverse($new_data[$h]);			
		}	
    }	
	echo json_encode($new_data);
?>	