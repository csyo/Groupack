<?php
    /*���q`gropup member`���oG_ID���U��FB_ID 
	  �ӫ�q`browsing log`���U��url(where FB_ID & SEARCHKEYWORD)
	  �M��A�q`search result`���ourl��summary */
	  
	// ��Ʈw�Ѽ�
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
	
	/* �ھ�client�ݶǨӪ�$Topic�L�o����r�s */
	function filter($data_arr,$Topic_key_arr){
		$output_arr = array();
		$length = count($data_arr);
		for($i=0; $i<$length;$i++){
			if(array_key_exists($data_arr[$i]['topic'],$Topic_key_arr))
				array_push($output_arr,$data_arr[$i]);
		}
		return $output_arr;		
	}
	/* ��$data�ھ�client�ݶǨӪ�$Topic�i��Ƨ� */
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