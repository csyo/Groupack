<?php

	/**********************
	 * 儲存使用者瀏覽過的網頁
	 ***********************/

	require "connect.php";
	
	$msg = '';
	function msg($text){
		$GLOBALS['msg'] = $GLOBALS['msg'] . $text . "\n";
	}

	if( isset($_POST['sid']) ){
		// Session log 存在, 新增一筆 browsing log
		// UserID, GroupID, QueryKeyword 等資訊經由 SID 與 sessionlog 關聯
		$query = sprintf("INSERT INTO browsinglog (SID,URL) VALUES ('%s','%s')",
			mysql_real_escape_string($_POST['sid']),
			mysql_real_escape_string($_POST['url']));
		$result = mysql_query($query);
		$result ? msg($query) : msg('Invalid browsinglog query:' . mysql_error());

		// 新增 search result
		// 重複的 URL 不會被 insert
		if( strlen($_POST['url']) < 200 )
			$query = sprintf("INSERT INTO searchresult (URL,Title,Summary) VALUES ('%s','%s','%s')",
				mysql_real_escape_string($_POST['url']),
				mysql_real_escape_string($_POST['title']),
				mysql_real_escape_string($_POST['content']));
		else
			$query = sprintf("INSERT INTO searchresult (URL,LongURL,Title,Summary) VALUES ('%s','%s','%s','%s')",
				mysql_real_escape_string($_POST['url']),
				mysql_real_escape_string($_POST['url']),
				mysql_real_escape_string($_POST['title']),
				mysql_real_escape_string($_POST['content']));
		$result = mysql_query($query);
		$result ? msg($query) : msg('Invalid searchresult query:' . mysql_error()) ;
		
		echo $msg;
	} else {
		die("no data transmitted");
	}
?>