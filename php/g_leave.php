<?php
    /********************************************
    
                    退出給定群組
        
    ********************************************/
    
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
    mysql_select_db($dbname, $connect);  
    mysql_query("SET NAMES 'utf8'");
    
    $fbid = isset( $_POST['fbid'] ) ? $_POST['fbid'] : '';
    $gid = isset( $_POST['gid'] ) ? $_POST['gid'] : '';
    
    // 移除群組
    $query = sprintf( "DELETE FROM group_member WHERE G_ID ='%s' AND FB_ID = '%s'", mysql_real_escape_string($gid), mysql_real_escape_string($fbid) );
    $result = mysql_query($query) or die('#1: '.mysql_error());
    
    $query = sprintf( "DELETE FROM `browsing_log` WHERE G_ID ='%s' AND FB_ID = '%s'", mysql_real_escape_string($gid), mysql_real_escape_string($fbid) );
    $result = mysql_query($query) or die('#2: '.mysql_error());
    
    $query = sprintf( "DELETE FROM `search_session` WHERE G_ID ='%s' AND FB_ID = '%s'", mysql_real_escape_string($gid), mysql_real_escape_string($fbid) );
    $result = mysql_query($query) or die('#3: '.mysql_error());
    
    
    echo $fbid."( in ".$gid." ) is deleted.";
?>