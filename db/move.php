<?php
require_once('connect.php');

$query = sprintf('SELECT workspaceinfo.GroupID, FolderID FROM workspaceinfo, folderinfo WHERE workspaceinfo.WorkspaceID = folderinfo.WorkspaceID');
$result = mysql_query($query) or die('Error:' . mysql_error());
while ($row = mysql_fetch_assoc($result)) {
	$query = sprintf('UPDATE folderinfo SET GroupID = (\'%s\') WHERE FolderID = \'%s\'', $row['GroupID'], $row['FolderID'] );
	mysql_query($query) or die('$query='.$query.'\nError:' . mysql_error());
	echo $query . "\n";
}

?>