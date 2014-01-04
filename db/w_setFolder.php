<?php
    /********************************************
    
                更新 [ workspace -> folder ]
        
    ********************************************/
    
    require "connect.php";
    
    // POST 資料
    $fid = $_POST['fid'];
    $fname = $_POST['fname'];
    $wid = $_POST['wid'];
    $comment = $_POST['comment'];
    
    if ( isset($_POST['fbid']) ) {
        // 新增
        $query = sprintf( "INSERT INTO folderinfo (WorkspaceID,FolderID,FolderName,FolderComment,CreatorID)
            VALUES ('%s','%s','%s','%s','%s')",
            mysql_real_escape_string($wid),  mysql_real_escape_string($fid),
            mysql_real_escape_string($fname), mysql_real_escape_string($comment),
            mysql_real_escape_string($_POST['fbid']));
        mysql_query($query) or die('Invalid query 1: ' . mysql_error());
    
        echo "New Folder: ".$fname." (".$fid.") of Workspace: ".$wid." created by ".$fbid.".";
    } else {
        // 更新
        $query = sprintf( "UPDATE folderinfo SET FolderName = '%s', FolderComment = '%s'
            WHERE FOLDER_ID = '%s' AND W_ID = '%s'",
            mysql_real_escape_string($fname), mysql_real_escape_string($comment),
            mysql_real_escape_string($fid), mysql_real_escape_string($wid));
        mysql_query($query) or die('Invalid query 2: ' . mysql_error());

        echo "Updating Folder: ".$fname." (".$fid.") of Workspace: ".$wid;
    }
    
?>