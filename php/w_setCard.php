<?php
    /********************************************
    
                更新 [ folder -> card ]
        
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
    $cid = $_POST['cid'];
    $fid = $_POST['fid'];
    $title = $_POST['title'];
    $content = $_POST['content'];
    $url = $_POST['url'];
    $fbid = $_POST['fbid'];
    // $time = $_POST['time'];
    $status = '';
    
    // 檢查是否有同組資料
    $query = sprintf("SELECT * FROM folder_card WHERE FOLDER_ID = '%s' AND CARD_ID = '%s'", mysql_real_escape_string($fid), mysql_real_escape_string($cid));
    $result = mysql_query($query);
    if (!$result) {
        $message  = 'Invalid query #1: ' . mysql_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
    // 沒有同組資料；新增
    if ( mysql_num_rows($result) == 0 ) {
        $query = sprintf( "INSERT INTO folder_card (CARD_CREATOR,CARD_ID,FOLDER_ID,TITLE,CONTENT,URL) VALUES ('%s','%s','%s','%s','%s','%s')", mysql_real_escape_string($fbid), mysql_real_escape_string($cid), mysql_real_escape_string($fid), mysql_real_escape_string($title), mysql_real_escape_string($content), mysql_real_escape_string($url));
        $result = mysql_query($query);
        if (!$result) {
            $message  = 'Invalid query #2: ' . mysql_error() . "\n";
            $message .= 'Whole query: ' . $query;
            die($message);
        }
        $status = "Adding";
    } else {
        // 更新
        $query = sprintf( "UPDATE folder_card SET TITLE = '%s', CONTENT = '%s' , URL = '%s' WHERE CARD_ID = '%s'", mysql_real_escape_string($title), mysql_real_escape_string($content), mysql_real_escape_string($url), mysql_real_escape_string($cid));
        $result = mysql_query($query);
        if (!$result) {
            $message  = 'Invalid query #3: ' . mysql_error() . "\n";
            $message .= 'Whole query: ' . $query;
            die($message);
        }
        $status = "Updating";
    }
    
    $query = sprintf( "SELECT CARD_TIMESTAMP FROM folder_card WHERE CARD_ID = '%s'", mysql_real_escape_string($cid));
    $result = mysql_query($query);
    if (!$result) {
        $message  = 'Invalid query #4: ' . mysql_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
   $time = mysql_fetch_assoc($result);
   $timestamp = $time['CARD_TIMESTAMP'];
   echo $timestamp." : ".$status." Card (".$cid.") \"".$title."\" , url: ".$url." at Folder ".$fid." by ".$fbid;
?>