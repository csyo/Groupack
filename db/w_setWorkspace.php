<?php
    /********************************************
    
                    更新工作群組資料
        
    ********************************************/
    
    // 資料庫參數
    require "connect.php";
    
    // POST 資料
    $gid = $_POST['gid'];
    $wid = $_POST['wid'];
    $wname = $_POST['wname'];
    $comment = $_POST['comment'];
    
    if ( isset($_POST['fbid']) ) {
        // 有 CreatorID；新增
        $query = sprintf( "INSERT INTO workspaceinfo (WorkspaceID,GroupID,WorkspaceName,WorkspaceComment,CreatorID) VALUES ('%s','%s','%s','%s','%s')",
                           mysql_real_escape_string($wid), mysql_real_escape_string($gid),
                           mysql_real_escape_string($wname), mysql_real_escape_string($comment),
                           mysql_real_escape_string($_POST['fbid']));
        $result = mysql_query($query) or die('Invalid query2: ' . mysql_error() . "\n");
    } else {
        // 沒有；更新
        $query = sprintf( "UPDATE workspaceinfo SET WorkspaceName = '%s',WorkspaceComment = '%s' WHERE WorkspaceID = '%s'",
                           mysql_real_escape_string($wname), mysql_real_escape_string($comment), mysql_real_escape_string($wid));
        $result = mysql_query($query) or die('Invalid query3: ' . mysql_error() . "\n");
    }
    
    echo "Updating ".$wname." (".$wid.") of Group ".$gid." .";
?>