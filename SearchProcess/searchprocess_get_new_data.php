<?php	
	if($_POST['sentgroupid']){	
		$groupid=$_POST['sentgroupid'];
	}
	else{
		$groupid=1;
	}
	
	$old_data = json_decode($_POST['sentOldData']);
	/*	$old_data的資料格式
		Array
		(
		[0] => Array
			(
				[0] => stdClass Object
					(
						[COUNT] => 1
						[SEARCH_KEYWORD] => 台南美食
						[FB_ID] => 100001446709549
					)
			)
		)
	*/
	// 資料庫參數  抓取使用者所輸入過的關鍵字來做比較
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'collaborative_search';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 
	
	if($groupid==1){
		$arygroupFBID[0]=$id;
	}
	else{
		$u_word=" SELECT FB_NAME, FB_ID FROM group_member where G_ID='$groupid'";
		$GROUP_query=mysql_query($u_word);
		while ( $row = mysql_fetch_assoc($GROUP_query)){
			$member[]= array( 'name' => $row['FB_NAME'] , 'id' => $row['FB_ID'] );
		}
	}
	
	/*   $member的資料格式
		Array
		(
			[0] => Array
				(
					[name] => 楊子寬
					[id] => 100001446709549
				)
	
			[1] => Array
				(
					[name] => Chen ShangYo
					[id] => 100000211046486
				)   
		)
	*/
	
	$links = array(); 
	
	if($_POST['sentOldData'] == '[]'){ 								//localstorage 沒有 data	
		for($h=0;$h<count($member);$h++){			
			$links[$h][0]=array('COUNT'=> '0' , 'SEARCH_KEYWORD' => 'no_more_searching_process_data', 'FB_ID' => $member[$h]['id'] );
		
			$result=mysql_query("SELECT COUNT('SEARCH_KEYWORD') , SEARCH_KEYWORD , FB_ID FROM  `search_session` WHERE FB_ID = ".$member[$h]['id']." AND SEARCH_KEYWORD !=  '' AND G_ID='$groupid' GROUP BY SEARCH_KEYWORD  order by SEARCH_TIMESTAMP");
			$a=0;		
		
			while ( $row = mysql_fetch_assoc($result) ){		
				$links[$h][$a]=array('COUNT'=> $row["COUNT('SEARCH_KEYWORD')"] , 'SEARCH_KEYWORD' => $row['SEARCH_KEYWORD'], 'FB_ID' => $row['FB_ID'] );
				$a=$a+1;
			}			
		}	
	//echo 'php進入沒有資料的迴圈';
	}	
	else{  															//localstorage 有 data	
		for($h=0;$h<count($member);$h++){		
			$result_num=mysql_query("SELECT COUNT('SEARCH_KEYWORD') , SEARCH_KEYWORD , FB_ID FROM  `search_session` WHERE FB_ID = ".$member[$h]['id']." AND SEARCH_KEYWORD !=  '' AND G_ID='$groupid' GROUP BY SEARCH_KEYWORD  order by SEARCH_TIMESTAMP");
			$all_num= mysql_num_rows($result_num);
		
			if($old_data[$h][0]->SEARCH_KEYWORD == 'no_more_searching_process_data')
				$link_num_to_get = $all_num;
			else if( ($all_num - count($old_data[$h]) )==0 )
				$link_num_to_get = 0;
			else 
				$link_num_to_get = $all_num - count($old_data[$h]) +1;
				
			//echo $link_num_to_get;
		
			$links[$h][0]=array('COUNT'=> '0' , 'SEARCH_KEYWORD' => 'no_more_searching_process_data', 'FB_ID' => $member[$h]['id'] );
		
			$result=mysql_query("SELECT COUNT('SEARCH_KEYWORD') , SEARCH_KEYWORD , FB_ID FROM  `search_session` WHERE FB_ID = ".$member[$h]['id']." AND SEARCH_KEYWORD !=  '' AND G_ID='$groupid' GROUP BY SEARCH_KEYWORD  order by SEARCH_TIMESTAMP desc limit ".$link_num_to_get);
			$a=0;		
		
			while ( $row = mysql_fetch_assoc($result) ){		
				$links[$h][$a]=array('COUNT'=> $row["COUNT('SEARCH_KEYWORD')"] , 'SEARCH_KEYWORD' => $row['SEARCH_KEYWORD'], 'FB_ID' => $row['FB_ID'] );
				$a=$a+1;
			}			
			$links[$h]=array_reverse($links[$h]);
			
		}	
	//echo 'php進入有資料的迴圈';
    }
	
	echo json_encode($links);
	
?>