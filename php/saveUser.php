<?php 

$fbid = isset( $_POST['fbid'] ) ? $_POST['fbid'] : null;
$fbname = isset( $_POST['fbname'] ) ? $_POST['fbname'] : null;

if ( $fbid && $fbname == null )
	die("POST 參數資料有誤 -- \$fbid:".$fbid.", \$fbname:".$fbname);

// 資料庫參數
$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
$dbname = 'collaborative_search';
$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
mysql_query("SET NAMES 'utf8'");	mysql_select_db($dbname, $connect);  

// 使用者名稱與ID存入USER資料表
$check = sprintf("SELECT FB_ID FROM user WHERE FB_ID='%s'", mysql_real_escape_string($fbid));
$result = mysql_query($check) or die('Invalid query#1: '.mysql_error());

if( mysql_num_rows($result) == 0 ) {
    $query = sprintf("INSERT INTO user (FB_ID,FB_NAME) VALUES ('%s','%s')", mysql_real_escape_string($fbid), mysql_real_escape_string($fbname));
    $result = mysql_query($query) or die('Invalid query#2: '.mysql_error());
}

echo "User: ".$fbname." (".$fbid.") saved";

?>