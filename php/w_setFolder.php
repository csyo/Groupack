<?php
    /********************************************
    
                更新 [ workspace -> folder ]
        
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
    $fid = $_POST['fid'];
    $fname = $_POST['fname'];
    $wid = $_POST['wid'];
    $comment = $_POST['comment'];
    $fbid = $_POST['fbid'];
    
    // 檢查是否有同組資料
    $check = sprintf("SELECT * FROM workspace_folder WHERE FOLDER_ID = '%s' AND W_ID = '%s'",
                         mysql_real_escape_string($fid), mysql_real_escape_string($wid));
    $result = mysql_query($check);
    if (!$result) {
        $message  = 'Invalid query1: ' . mysql_error() . "\n";
        $message .= 'Whole query: ' . $check;
        die($message);
    }
    
    if ( mysql_num_rows($result) == 0 ) {
        // 沒有同組資料；新增
        $query = sprintf( "INSERT INTO workspace_folder (W_ID,FOLDER_ID,FOLDER_NAME,COMMENT,FOLDER_CREATOR) VALUES ('%s','%s','%s','%s','%s')",
         mysql_real_escape_string($wid),  mysql_real_escape_string($fid), mysql_real_escape_string($fname), mysql_real_escape_string($comment), mysql_real_escape_string($fbid));
        $result = mysql_query($query);
        if (!$result) {
            $message  = 'Invalid query2: ' . mysql_error() . "\n";
            $message .= 'Whole query: ' . $query;
            die($message);
        }
    } else {
        // 更新
        $query = sprintf( "UPDATE workspace_folder SET FOLDER_NAME = '%s',COMMENT = '%s' WHERE FOLDER_ID = '%s' AND W_ID = '%s'", mysql_real_escape_string($fname), mysql_real_escape_string($comment), mysql_real_escape_string($fid), mysql_real_escape_string($wid));
        $result = mysql_query($query);
        if (!$result) {
            $message  = 'Invalid query3: ' . mysql_error() . "\n";
            $message .= 'Whole query: ' . $query;
            die($message);
        }
    }
    
    echo "Updating Folder: ".$fname." (".$fid.") of Workspace: ".$wid." by ".$fbid.".";
?>