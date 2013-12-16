<?php
    /****************************************************
    
      取得使用者所選群組之 to do list , 使用 JSON 格式回傳
        
    ****************************************************/
    
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    $gid = isset( $_POST['gid'] ) ? $_POST['gid'] : '';
    $fbid = isset( $_POST['fbid'] ) ? $_POST['fbid'] : '';
    
    if ( $gid == '' || $fbid == '' ) {
    	die("Error: POST data bug!");
    }
    
    // 先處理擔任負責人之項目
    $query = sprintf( "SELECT  `ITEM_ID` ,  `CONTENT` ,  `ASSIGNER` ,  `CREATE_TIMESTAMP` FROM  `todo` WHERE  `G_ID` =  '%s' AND ASSIGNER = '%s' GROUP BY  `ITEM_ID` ORDER BY  `CREATE_TIMESTAMP` ASC", mysql_real_escape_string($gid), mysql_real_escape_string($fbid) );
    $todolist = mysql_query($query) or die('MySQL failed #1: '.mysql_error());
    
    $data = array();
    while ( $item = mysql_fetch_assoc( $todolist ) ) {
		
		$tdid = $item['ITEM_ID'];
		$content = $item['CONTENT'];
		$assigner = $item['ASSIGNER'];
		
		$query = sprintf( "SELECT EXECUTOR FROM todo WHERE ITEM_ID = '%s'" , mysql_real_escape_string($tdid) );
		$result = mysql_query($query) or die('MySQL failed #2: '.mysql_error());
		
		$list = array();
		while( $assignee = mysql_fetch_assoc($result) ) {
			$list[] = $assignee['EXECUTOR'];
		}
		
        $data[] =  array( 'tdid' => $tdid , 'content' => $content , 'assigner' => $assigner , 'executor' => $list );

    }
    
    // 後處理擔任執行者
    $query = sprintf( "SELECT  `ITEM_ID` ,  `CONTENT` ,  `ASSIGNER` ,  `CREATE_TIMESTAMP` FROM  `todo` WHERE  `G_ID` =  '%s' AND EXECUTOR = '%s' AND  `ASSIGNER` !=  `EXECUTOR` GROUP BY  `ITEM_ID` ORDER BY  `CREATE_TIMESTAMP` ASC", mysql_real_escape_string($gid), mysql_real_escape_string($fbid) );
    $todolist = mysql_query($query) or die('MySQL failed #1: '.mysql_error());
 
    while ( $item = mysql_fetch_assoc( $todolist ) ) {
    		
		$tdid = $item['ITEM_ID'];
		$content = $item['CONTENT'];
		$assigner = $item['ASSIGNER'];
		
		$query = sprintf( "SELECT EXECUTOR FROM todo WHERE ITEM_ID = '%s'" , mysql_real_escape_string($tdid) );
		$result = mysql_query($query) or die('MySQL failed #2: '.mysql_error());
		
		$list = array();
		while( $assignee = mysql_fetch_assoc($result) ) {
			$list[] = $assignee['EXECUTOR'];
		}
		
        $data[] =  array( 'tdid' => $tdid , 'content' => $content , 'assigner' => $assigner , 'executor' => $list );
    
    }
    
    echo json_encode($data);
?>