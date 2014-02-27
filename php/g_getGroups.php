<?php
    /********************************************
    
        取得資料庫內的群組 , 使用 JSON 格式回傳資料
        
    ********************************************/
    
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    $fbid = isset( $_POST['sendid'] ) ? $_POST['sendid'] : '';
    
    $query = sprintf( "SELECT DISTINCT g_id,g_name FROM group_member WHERE fb_id = '%s'", mysql_real_escape_string($fbid) );
    $result = mysql_query($query) or die('MySQL failde: '.mysql_error());

    $data = array();
    while ($row = mysql_fetch_assoc($result)) {
        $data['groups'][] =  array( 'gid' => $row['g_id'] , 'gname' => $row['g_name'] );
    }
    echo json_encode($data);
?>