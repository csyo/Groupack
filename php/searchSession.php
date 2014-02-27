<?php	
	$interval = isset( $_POST['time_interval'] ) ? $_POST['time_interval'] : null;	$keyword = isset( $_POST['keyword'] ) ? $_POST['keyword'] : null;
	$gid = isset( $_POST['gid'] ) ? $_POST['gid'] : null;
	$fbid = isset( $_POST['fbid'] ) ? $_POST['fbid'] : null;
	$fbname = isset( $_POST['fbname'] ) ? $_POST['fbname'] : '';
	
//	if ( $interval && $keyword && $gid && $fbid == null )
//		die("POST data undefined!");	$dbhost = '127.0.0.1';	$dbuser = 'cosearch';	$dbpass = '1234567';	$dbname = 'collaborative_search';	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');	mysql_select_db($dbname, $connect); 	mysql_query("SET NAMES 'utf8'"); 	
	$query = sprintf( "INSERT INTO search_session (FB_ID,FB_NAME,SEARCH_KEYWORD,G_ID,TIME_INTERVAL) VALUES ('%s','%s','%s','%s','%s')", mysql_real_escape_string($fbid), mysql_real_escape_string($fbname), mysql_real_escape_string($keyword), mysql_real_escape_string($gid),mysql_real_escape_string($interval));
	$result = mysql_query($query) or die('Invalid query #1: '.mysql_error());
	
	$query = sprintf( "SELECT SEARCH_TIMESTAMP,G_ID,TIME_INTERVAL FROM search_session WHERE FB_ID ='%s' AND SEARCH_KEYWORD = '%s' AND G_ID ='%s' ORDER BY SEARCH_TIMESTAMP DESC LIMIT 0,1", mysql_real_escape_string($fbid), mysql_real_escape_string($keyword), mysql_real_escape_string($gid) );
	$result = mysql_query($query) or die('Invalid query #2: '.mysql_error());
	
	while ($row = mysql_fetch_assoc($result))
		echo "Search session: ".$row['SEARCH_TIMESTAMP']." for ".$row['TIME_INTERVAL']." sec(s) at Group: ".$row['G_ID'];

?>