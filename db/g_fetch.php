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

    // 取得使用者所在群組
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
            $data[$groupID] = array( 'g_id' => $groupID, 'g_name' => $row['GroupName'], 'createdTime' => $row['CreatedTimestamp'] );
        }

        // TODO:
        // 取 workspaceinfo 資料
        $sql = sprintf("SELECT * FROM workspaceinfo WHERE GroupID = '%s'",
                mysql_real_escape_string($groupID));
        $workspaces = mysql_query($sql) or responseMsg('Invalid query #3: '.mysql_error());
        responseMsg(( $workspaces ? $sql."\n" : '' ));
        while ($row = mysql_fetch_assoc($workspaces)) {
            $groupID = $row['GroupID'];
            $workspaceID = $row['WorkspaceID'];
            $data[$groupID]['workspaces'] = array( 'w_id' => $workspaceID,
                                        'w_name' => $row['WorkspaceName'],
                                        'w_comment' => $row['WorkspaceComment'],
                                        'creatorID' => $row['CreatorID'],
                                        'createdTime' => $row['CreatedTimestamp']
                                    );

            // 取 folderinfo 資料
            $sql = sprintf("SELECT * FROM folderinfo WHERE WorkspaceID = '%s'",
                    mysql_real_escape_string($workspaceID));
            $folders = mysql_query($sql) or responseMsg('Invalid query #4: '.mysql_error());
            while ($row = mysql_fetch_assoc($folders)) {
                $workspaceID = $row['WorkspaceID'];
                $folderID = $row['FolderID'];
                $data[$groupID]['workspaces']['folders'] = array(
                                            'f_id' => $folderID,
                                            'f_name' => $row['FolderName'],
                                            'f_comment' => $row['FolderComment'],
                                            'creatorID' => $row['CreatorID'],
                                            'createdTime' => $row['CreatedTimestamp']
                                        );
            }

        }

    }

    // echo "<pre>" . $responseMsg;
    // print("<pre>".print_r($data,true));

    echo json_encode($data);
?>