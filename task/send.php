<?php 
	
// 資料庫參數
$dbhost = '127.0.0.1';
$dbuser = 'cosearch';
$dbpass = '1234567';
$dbname = 'collaborative_search';
$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
mysql_set_charset('utf8') or die('Failed to set utf-8');

// POST 資料
$tdid = isset( $_POST['tdid'] ) ? $_POST['tdid'] : '';
$content = isset( $_POST['content'] ) ? $_POST['content'] : '';
$assigner = isset( $_POST['assigner'] ) ? $_POST['assigner'] : '';
$executorList = isset( $_POST['executor'] ) ? $_POST['executor'] : '';
$gid = isset( $_POST['gid'] ) ? $_POST['gid'] : '';

if ( $tdid == '' || $content == '' || $assigner == '' || $executorList == ''|| $gid == '' ) {
	echo "tdid:".$tdid.", content:".$content.", assigner:".$assigner.", executorList:".$executorList.", gid:".$gid;
	die('--- ERROR: POST data bug');
}

$query = sprintf( "SELECT * FROM todo WHERE ITEM_ID = '%s'", mysql_real_escape_string($tdid) );
$result = mysql_query($query) or die('Invalid query #1: ' . mysql_error());

if ( mysql_num_rows($result) == 0 ) {
	
	// 處理JSON
	$executor = JSON_decode($executorList);
	
	echo "New item created: ".$content." (".$tdid.") by ".$assigner.", assigned to ";
	
	for ($i = 0; $i < count($executor); $i++) {
	    
	    // 新增
	    $query = sprintf( "INSERT INTO todo (ITEM_ID,CONTENT,ASSIGNER,EXECUTOR,G_ID) VALUES ('%s','%s','%s','%s','%s')", mysql_real_escape_string($tdid), mysql_real_escape_string($content), mysql_real_escape_string($assigner), mysql_real_escape_string($executor[$i]), mysql_real_escape_string($gid) );
	    $result = mysql_query($query) or die('Invalid query #2: ' . mysql_error());
		
		echo $executor[$i];
		if( count($executor)-$i > 1 )
			echo ", ";
	}
	
} else {
	
	// 更新
	$query = sprintf( "UPDATE todo SET CONTENT = '%s' WHERE ITEM_ID = '%s'", mysql_real_escape_string($content), mysql_real_escape_string($tdid) );
	$result = mysql_query($query) or die('Invalid query #3: ' . mysql_error());
	
	echo "Item updated: ".$content." (".$tdid.") by ".$assigner;
	
}
?>