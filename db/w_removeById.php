<?php
    // 資料庫參數
    require "connect.php";
    
    // POST 參數
    $id = isset($_POST['xid']) ? $_POST['xid'] : die("no data transmitted");
    
    switch ( $id[0] ) {
        case "c": // remove card
            $query = sprintf( "DELETE FROM cardinfo WHERE CardID = '%s'" , mysql_real_escape_string($id));
            mysql_query($query) or die('Invalid query #1: ' . mysql_error());
            break;
        case "f": // remove folder
            $query = sprintf( "DELETE FROM folderinfo WHERE FolderID = '%s'" , mysql_real_escape_string($id));
            mysql_query($query) or die('Invalid query #2: ' . mysql_error());
            break;
        case "w": // remove workspace
            $query = sprintf( "DELETE FROM workspaceinfo WHERE WorkspaceID = '%s'" , mysql_real_escape_string($id));
            mysql_query($query) or die('Invalid query #3: ' . mysql_error());    
            break;
        case "t": // remove tag
            $query = sprintf( "DELETE FROM taginfo WHERE TagID = '%s' AND CardID = '%s'", mysql_real_escape_string($id), mysql_real_escape_string($_POST['cid']));
            mysql_query($query) or die('Invalid query #4: ' . mysql_error()); 
            break;   
        default:
            die("something goes wrong!");
            break;
    }
    echo $query;
?>