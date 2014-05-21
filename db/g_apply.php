<?php
require_once('connect.php');

$sql = sprintf("INSERT INTO belongsto VALUES ('%s','%s','MEMBER')", $_POST['fbid'], $_POST['gid']);
mysql_query($sql) or die('Invalid query: '.mysql_error());

echo($sql);
?>
