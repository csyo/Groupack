<?php
    /********************************************
    
                    更新工作群組資料
        
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
    $gid = $_POST['gid'];
    $wid = $_POST['wid'];
    $wname = $_POST['wname'];
    $comment = $_POST['comment'];
    $fbid=$_POST['fbid'];
    
    // 檢查是否有同組資料
    $check = "SELECT * FROM workspace WHERE G_ID = '$gid' AND W_ID = '$wid'";
    $result = mysql_query($check) or die ('Invalid query1: ' . mysql_error());
    
    if ( mysql_num_rows($result) == 0 ) {
        // 沒有同組資料；新增
        $query = sprintf( "INSERT INTO workspace (W_ID,G_ID,W_NAME,COMMENT,W_CREATOR) VALUES ('%s','%s','%s','%s','%s')",
                           mysql_real_escape_string($wid), mysql_real_escape_string($gid), mysql_real_escape_string($wname), mysql_real_escape_string($comment), mysql_real_escape_string($fbid));
        $result = mysql_query($query);
        if (!$result) {
            $message  = 'Invalid query2: ' . mysql_error() . "\n";
            $message .= 'Whole query: ' . $query;
            die($message);
        }
    } else {
        // 有；更新
        $query = sprintf( "UPDATE workspace SET W_NAME = '%s',COMMENT = '%s' WHERE W_ID = '%s' AND G_ID = '%s'",
                           mysql_real_escape_string($wname), mysql_real_escape_string($comment), mysql_real_escape_string($wid), mysql_real_escape_string($gid));
        $result = mysql_query($query);
        if (!$result) {
            $message  = 'Invalid query3: ' . mysql_error() . "\n";
            $message .= 'Whole query: ' . $query;
            die($message);
        }
    }
    
    echo "Updating ".$wname." (".$wid.") of Group ".$gid." .";
?>