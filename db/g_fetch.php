<?php
    /********************************************
    
        取得資料庫內的群組 , 使用 JSON 格式回傳資料
        
    ********************************************/
    
    require_once('connect.php');
    
    $userid = isset( $_POST['userid'] ) ? $_POST['userid'] : die("no data transmiteed.");

    $responseMsg = '';
    function responseMsg($msg){
        $GLOBALS['responseMsg'] = $GLOBALS['responseMsg'] . $msg;
    }

    $data = array();

    $sql = sprintf("SELECT GroupID FROM belongsto WHERE UserID = '%s'"
        , mysql_real_escape_string($userid) );
    $result = mysql_query($sql) or responseMsg('Invalid query #1: '.mysql_error());
    responseMsg(( $result ? $sql."\n" : '' ));    
    while ($row = mysql_fetch_assoc($result)) {
        $groupID = $row['GroupID'];

        // 取得所選群組資料
        $sql = sprintf("SELECT GroupName, CreatedTimestamp FROM groupinfo WHERE GroupID = '%s'"
            , mysql_real_escape_string($groupID));
        $groups = mysql_query($sql) or responseMsg('Invalid query #2: '.mysql_error());
        responseMsg(( $groups ? $sql."\n" : '' ));
        while ($row = mysql_fetch_assoc($groups)) {
            if (substr_compare($groupID, "g", 0, 1) == 0) {
                $data[$groupID] = array( 
                    'g_id' => $groupID,
                    'g_name' => $row['GroupName'],
                    'createdTime' => $row['CreatedTimestamp'] );
            }
        }

        // 取 workspaceinfo 資料
        $sql = sprintf("SELECT * FROM workspaceinfo WHERE GroupID = '%s'",
                mysql_real_escape_string($groupID));
        $workspaceinfo = mysql_query($sql) or responseMsg('Invalid query #3: '.mysql_error());
        responseMsg(( $workspaceinfo ? $sql."\n" : '' ));
        while ($row = mysql_fetch_assoc($workspaceinfo)) {
            $groupID = $row['GroupID'];
            $workspaceID = $row['WorkspaceID'];
            
            // 取 folderinfo 資料
            $folders = array();
            $sql = sprintf("SELECT * FROM folderinfo WHERE WorkspaceID = '%s'",
                    mysql_real_escape_string($workspaceID));
            $folderinfo = mysql_query($sql) or responseMsg('Invalid query #4: '.mysql_error());
            while ($item = mysql_fetch_assoc($folderinfo)) {
                $folders[] = array(
                    'f_id' => $item['FolderID'],
                    'f_name' => $item['FolderName'],
                    'f_comment' => $item['FolderComment'],
                    'creatorID' => $item['CreatorID'],
                    'createdTime' => $item['CreatedTimestamp']
                );
            }

            if (empty($folders)) {
                $data[$groupID]['workspaces'][] = array(
                    'w_id' => $workspaceID,
                    'w_name' => $row['WorkspaceName'],
                    'w_comment' => $row['WorkspaceComment'],
                    'creatorID' => $row['CreatorID'],
                    'createdTime' => $row['CreatedTimestamp']
                );    
            } else {
                $data[$groupID]['workspaces'][] = array(
                    'w_id' => $workspaceID,
                    'w_name' => $row['WorkspaceName'],
                    'w_comment' => $row['WorkspaceComment'],
                    'creatorID' => $row['CreatorID'],
                    'createdTime' => $row['CreatedTimestamp'],
                    'folders' => $folders
                );  
            }

        }
    }

    echo json_encode($data);
?>