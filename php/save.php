<?php
	// POST �Ѽ�
	$fbid = isset( $_POST['fbid'] ) ? $_POST['fbid'] : null;
	$fbname = isset( $_POST['fbname'] ) ? $_POST['fbname'] : null;
	$url = isset( $_POST['url'] ) ? $_POST['url'] : null;
	$title = isset( $_POST['title'] ) ? $_POST['title'] : null;
	$content = isset( $_POST['content'] ) ? $_POST['content'] : null;
	$keyword = isset( $_POST['keyword'] ) ? $_POST['keyword'] : null;
	$gid = isset( $_POST['gid'] ) ? $_POST['gid'] : null;
	
	if ($fbid && $fbname && $url && $title && $keyword && $gid == null) {
		die("POST �ѼƸ�Ʀ��~");
	}
	
	// ��Ʈw�Ѽ�
	$dbhost = '127.0.0.1';
 	$dbuser = 'cosearch';
 	$dbpass = '1234567';
	$dbname = 'collaborative_search';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_query("SET NAMES 'utf8'");	mysql_select_db($dbname, $connect);  
	
	/**
	 * �ϥΪ�ID�B�I�����}�B�I�����Ʀs�J BROWSING_LOG ��ƪ�
	**/
	$query = sprintf("select NO_READ from browsing_log where FB_ID='%s' and URL='%s' and G_ID='%s'", mysql_real_escape_string($fbid), mysql_real_escape_string($url), mysql_real_escape_string($gid));
	$checkLog = mysql_query($query) or die("Invalid query#1:".mysql_error());	
	// �����w�s�b
	if( mysql_num_rows($checkLog) > 0 ){
		// NO_READ ���[�@
	    $checkLog = mysql_fetch_object($checkLog);
	    $checkLog->NO_READ += 1;
	    $query = sprintf("update browsing_log set NO_READ ='%s' where FB_ID='%s' and URL='%s' and G_ID='%s'", mysql_real_escape_string($checkLog->NO_READ), mysql_real_escape_string($fbid), mysql_real_escape_string($url), mysql_real_escape_string($gid));
	    mysql_query($query) or die("Invalid query#2:".mysql_error());
	}
	// �������s�b
    else{
    	// �s�W�@����BROWSING_LOG��ƪ�
    	$query = sprintf("insert into browsing_log (G_ID,FB_ID,URL,NO_READ,SEARCH_KEYWORD) values ('%s','%s','%s','1','%s')", mysql_real_escape_string($gid), mysql_real_escape_string($fbid), mysql_real_escape_string($url), mysql_real_escape_string($keyword));
	    mysql_query($query) or die("Invalid query#3:".mysql_error());
		
		$query = sprintf("select * from search_result where URL='%s'", mysql_real_escape_string($url));
		$checkUrl = mysql_query($query) or die("Invalid query#4:".mysql_error());
		if( mysql_num_rows($checkUrl) == 0 ) {
			// �W�[�@����ƨ� SEACH_RESULT
			$query = sprintf("insert into search_result (URL,TITLE,SUMMARY) values ('$url','$title','$content')", mysql_real_escape_string($url), mysql_real_escape_string($title), mysql_real_escape_string($content));
	    	mysql_query($query) or die("Invalid query#5:".mysql_error());		
		}	
    }
?>