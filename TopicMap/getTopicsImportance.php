<?php
	// 資料庫參數
	require_once('../db/connect.php');
	
	$Group_ID = $_POST['sendgroup_ID'];
	$Topic = json_decode($_POST['sendtopic']);
	$Topic_key = array_flip($Topic);
	
	$quertTime="SELECT QueryKeyword, sum( UNIX_TIMESTAMP(`EndTimestamp`) - UNIX_TIMESTAMP(`StartTimestamp`)) 
		  FROM `sessionlog` 
		  WHERE GroupID='$Group_ID' 
		  Group by GroupID , QueryKeyword";
	
	$resultTime=mysql_query($quertTime);	
	while ($row = mysql_fetch_row($resultTime)) {
	     $data[]= array('topic' => $row[0],
						'importance' => $row[1]);	
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