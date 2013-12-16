<?php
    /********************************************
    
              	   移除或完成該項目
        
    ********************************************/
    
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
    mysql_select_db($dbname, $connect);  
    mysql_query("SET NAMES 'utf8'");
    
    $tdid = isset( $_POST['tdid'] ) ? $_POST['tdid'] : '';
    $fbid = isset( $_POST['fbid'] ) ? $_POST['fbid'] : '';
    $mode = isset( $_POST['mode'] ) ? $_POST['mode'] : '';
    
    if ( $tdid == '' || $fbid == '' || $mode == '' ) {
    	die("Error: POST data bug!");
    }
    
    if ( $mode == 'delete' ) {
	    $query = sprintf( "DELETE FROM todo WHERE ITEM_ID ='%s'", mysql_real_escape_string($tdid) );
	    $result = mysql_query($query) or die ('Invalid query1: ' . mysql_error());
	    echo $tdid." is deleted.";
    } else {
    	$query = sprintf( "DELETE FROM todo WHERE ITEM_ID ='%s' AND EXECUTOR ='%s'", mysql_real_escape_string($tdid), mysql_real_escape_string($fbid) );
    	$result = mysql_query($query) or die ('Invalid query2: ' . mysql_error());
	    echo $fbid." is dropped from ".$tdid;
	}
?>