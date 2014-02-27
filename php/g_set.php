<?php
    /********************************************
    
                    新增/更新群組成員資料
        
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
    $fbid = isset( $_POST['fbid'] ) ? $_POST['fbid'] : '';
    $fbname = isset( $_POST['fbname'] ) ? $_POST['fbname'] : '';
    $gname = isset( $_POST['gname'] ) ? $_POST['gname'] : '';
    $gid = isset( $_POST['gid'] ) ? $_POST['gid'] : '';
    $role = isset( $_POST['role'] ) ? $_POST['role'] : '';
    
    if ( $fbid == '' || $fbname == '' || $gid == '' || $gname == '' || $role == '' ) {
    	die($fbid."_".$fbname."_".$gid."_".$gname."_".$role);
    }
        
    // 檢查成員是否存在
    $check = sprintf( "SELECT * FROM group_member WHERE fb_id = '%s' AND g_id = '%s'", mysql_real_escape_string($fbid), mysql_real_escape_string($gid) );
    $select = mysql_query($check) or die ('Invalid query1: ' . mysql_error());
    if ( mysql_num_rows($select) == 0 ) {
        // 新增群組成員資料
        $query = sprintf( "INSERT INTO group_member (ROLE,FB_ID,FB_NAME,G_NAME,G_ID) VALUES ('%s','%s','%s','%s','%s')", mysql_real_escape_string($role), mysql_real_escape_string($fbid), mysql_real_escape_string($fbname), mysql_real_escape_string($gname), mysql_real_escape_string($gid));
        $result = mysql_query($query);
        if (!$result) {
            $message  = 'Invalid query2: ' . mysql_error() . "\n";
            $message .= 'Whole query: ' . $query;
            die($message);
        }
    } else {
        // 更新群組成員資料
        $query = sprintf( "UPDATE group_member SET ROLE = 'ADMIN' WHERE fb_id = '$fbid' AND g_id = '$gid'", mysql_real_escape_string($fbid), mysql_real_escape_string($gid));
        $result = mysql_query($query);
        if (!$result) {
            $message  = 'Invalid query3: ' . mysql_error() . "\n";
            $message .= 'Whole query: ' . $query;
            die($message);
        }
    }
    
    echo "Updating ".$fbid.": ".$fbname." (".$role.") in ".$gname." (".$gid.")";
?>