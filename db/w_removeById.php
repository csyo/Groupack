<?php
    // 資料庫參數
    require "connect.php";
    
    // POST 參數
    $id = isset($_POST['xid']) ? $_POST['xid'] : die("no data transmitted");
    
    switch ( $id[0] ) {
        case "c": // remove card
            $query = sprintf( "DELETE FROM cardinfo WHERE CardID = '%s'" , mysql_real_escape_string($id));
            mysql_query($query) or die('Invalid query #1: ' . mysql_error());
            echo $id." (card) is deleted.";
            break;
        case "f": // remove folder
            $query = sprintf( "DELETE FROM folderinfo WHERE FolderID = '%s'" , mysql_real_escape_string($id));
            mysql_query($query) or die('Invalid query #2: ' . mysql_error());
            echo $id." (folder) is deleted.";
            break;
        case "w": // remove workspace
            $query = sprintf( "DELETE FROM workspaceinfo WHERE WorkspaceID = '%s'" , mysql_real_escape_string($id));
            mysql_query($query) or die('Invalid query #2: ' . mysql_error());    
            echo $id." (workspace) is deleted.";
            break;
        default:
            die("something goes wrong!");
            break;
    }
?>