<?php
    /********************************************
    
     取得資料庫內 workspace , 使用 JSON 格式回傳資料
        
    ********************************************/
    
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    $gid = $_POST['gid'];
    
    $query = sprintf( "SELECT * FROM workspace WHERE G_ID = '%s'" , mysql_real_escape_string($gid) );  
    $result = mysql_query($query) or die('MySQL failde: '.mysql_error());
    
    $data = array();
    while ($row = mysql_fetch_assoc($result)) {
        $data[] =
        array(
        	'id' => $row['W_ID'] ,
        	'name' => $row['W_NAME'] ,
        	'text' => $row['COMMENT'] ,
        	'time' => $row['W_TIMESTAMP'] ,
        	'creator' => $row['W_CREATOR']
    	);
    }
    echo json_encode($data);
?>