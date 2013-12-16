<?php
    /********************************************
    
                    移除給定群組
        
    ********************************************/
    
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
    mysql_select_db($dbname, $connect);  
    mysql_query("SET NAMES 'utf8'");
    
    $gid = $_POST['sendgid'];
    
    // 移除群組人員
    $query = sprintf( "DELETE FROM group_member WHERE G_ID ='%s'", mysql_real_escape_string($gid) );
    $result = mysql_query($query) or die ('Invalid query#1: ' . mysql_error());
    
    $query = sprintf( "DELETE FROM `browsing_log` WHERE `G_ID` = '%s'", mysql_real_escape_string($gid) );
    $result = mysql_query($query) or die ('Invalid query#2: ' . mysql_error());
    
    $query = sprintf( "DELETE FROM `search_session` WHERE `G_ID` = '%s'", mysql_real_escape_string($gid) );
    $result = mysql_query($query) or die ('Invalid query#3: ' . mysql_error());
    
    echo $gid." is deleted.";
?>