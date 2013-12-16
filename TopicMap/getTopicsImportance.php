<?php
    /*先從`gropup member`取得G_ID底下的FB_ID 
	  而後從`browsing log`底下抓url(where FB_ID & SEARCHKEYWORD)
	  然後再從`search result`取得url的summary */
	  
	// 資料庫參數
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'collaborative_search';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'"); 
	
	$Group_ID = $_POST['sendgroup_ID'];
	$Topic = json_decode($_POST['sendtopic']);
	$Topic_key = array_flip($Topic);
	
	$str="SELECT SEARCH_KEYWORD, sum(TIME_INTERVAL) 
		  FROM `search_session` 
		  WHERE G_ID='$Group_ID' 
		  Group by G_ID , SEARCH_KEYWORD";
	
	$result=mysql_query($str);	
	while ($row = mysql_fetch_assoc($result)) {
	     $data[]= array('topic' => $row['SEARCH_KEYWORD'],
						'importance' => $row['sum(TIME_INTERVAL)']);	
	}
	$data = filter($data,$Topic_key);
	$data = sort_arr($data,$Topic_key);
	
	/* 根據client端傳來的$Topic過濾關鍵字群 */
	function filter($data_arr,$Topic_key_arr){
		$output_arr = array();
		$length = count($data_arr);
		for($i=0; $i<$length;$i++){
			if(array_key_exists($data_arr[$i]['topic'],$Topic_key_arr))
				array_push($output_arr,$data_arr[$i]);
		}
		return $output_arr;		
	}
	/* 讓$data根據client端傳來的$Topic進行排序 */
	function sort_arr($data_arr, $key_arr){
		$output_arr = $data_arr;
		$data_length = count($data_arr);
		for($i=0; $i<$data_length;$i++){
			$key = $key_arr[$data_arr[$i]['topic']];
			$output_arr[$key] = $data_arr[$i];
		}		
		return $output_arr;
	}
	echo json_encode($data);
?>