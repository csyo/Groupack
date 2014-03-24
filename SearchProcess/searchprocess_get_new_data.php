<?php	
	/*
	searchprocess.php(由get_searchprocess_data()函式ajax呼叫)
	   目的: 抓取所有搜尋歷程(依時間順序)
	   方法: 取得"group_member"內G_ID為目前選擇群組的FB_NAME,FB_ID
			 將結果存入$member陣列
			 依序取得群組內成員所有關鍵字與關鍵字搜索次數並依時間排序
			 輸出成json物件
	   語法: SELECT FB_NAME, FB_ID FROM group_member where G_ID='$groupid'
			 SELECT COUNT('SEARCH_KEYWORD') , SEARCH_KEYWORD , FB_ID FROM  `search_session` WHERE FB_ID = ".$member[$h]['id']." AND SEARCH_KEYWORD !=  '' AND G_ID='$groupid' GROUP BY SEARCH_KEYWORD  order by SEARCH_TIMESTAMP
       新的資料庫方法: 
			 取得"belongsto"內GroupID為目前選擇群組的所有UserID
			 將結果存入$member陣列
			 利用"sessionlog"
			 根據UserID與GroupID依序取得群組內成員所有關鍵字與關鍵字搜索次數並依時間排序
			 輸出成json物件
	   新語法: 
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
	
	$old_data = json_decode($_POST['sentOldData']); //定義為已看過的關鍵字群
	
	// 資料庫參數  
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'groupack';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 
	
	/****	1st_part 取得所有group下所有的userID  ****/
	
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
	
	/****	 2nd_part 取得userID底下新搜尋關鍵字  ****/
	
	$mem = count($member); //群組人數
	$new_data = array(); //定義為新搜尋的關鍵字群
	
	/***   分為已登錄:未登錄   ***/
	
	/**  未登錄過, 故沒有舊的搜尋資料  **/	
	if($_POST['sentOldData'] == '[]'){		
		for($h=0 ; $h<$mem ; ++$h){
			/*   從資料庫取得所有關鍵字   */
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
	/**  已登錄過, 故有舊的搜尋資料  **/
	else{  						
		for($h=0 ; $h<$mem ; ++$h){
		
			/*   計算要取得的新關鍵字數量   */
			$result_num=mysql_query("SELECT COUNT('QueryKeyword') , QueryKeyword , UserID 
									 FROM  `sessionlog` WHERE UserID = ".$member[$h]['id']." AND QueryKeyword !=  '' AND GroupID='$groupid' 
									 GROUP BY QueryKeyword  
									 order by StartTimestamp");
			$all_num= mysql_num_rows($result_num); //所有關鍵字的數量(未看過+已看過)
			//如果先前看過的關鍵字群為0, 則取全部.
			if($old_data[$h][0]->SEARCH_KEYWORD == 'no_more_searching_process_data')
				$new_data_num_to_get = $all_num;
			//如果看過的關鍵字數量等於所有關鍵字, 則取0.
			else if( ($all_num - count($old_data[$h]) )==0 )
				$new_data_num_to_get = 0;
			//其餘都要執行相減取得未看過的關鍵字數量
			else 
				$new_data_num_to_get = $all_num - count($old_data[$h]) +1;	

			/*   從資料庫取得關鍵字   */	
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