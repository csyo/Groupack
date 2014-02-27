<?php

    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    $fbid = isset( $_POST['sendid'] ) ? $_POST['sendid'] : '';
    $gid = isset( $_POST['sendgid'] ) ? $_POST['sendgid'] : '';
    
    $query = sprintf( "SELECT role FROM group_member WHERE fb_id = '%s' AND g_id = '%s'", mysql_real_escape_string($fbid), mysql_real_escape_string($gid) );
    $result = mysql_query($query) or die('MySQL failed: '.mysql_error());
    
    $data = array();
    $row = mysql_fetch_assoc($result);
    $data = $data['role'][] = array( 'role' => $row['role'] );
    
    echo json_encode($data);
?>