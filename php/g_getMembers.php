<?php
    /********************************************
    
    取得特定群組之成員 , 使用 JSON 格式回傳資料
        
    ********************************************/
    
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    // POST 資料
    $gid = isset( $_POST['sendgid'] ) ? $_POST['sendgid'] : '';
    
    // 取出群組成員資料
    $select = sprintf( "SELECT FB_ID,FB_NAME FROM group_member WHERE G_ID = '%s' AND ROLE = 'MEMBER'", mysql_real_escape_string($gid) );
    $result = mysql_query($select) or die('MySQL failed: '.mysql_error());
    $data = array();
    while ($row = mysql_fetch_assoc($result)) {
        $data[] =  array( 'fbid' => $row['FB_ID'] , 'fbname' => $row['FB_NAME'] );
    }
    echo json_encode($data);
    
?>