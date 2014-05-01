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
        $sql = sprintf("SELECT GroupName, CreatedTimestamp, IsOpen FROM groupinfo WHERE GroupID = '%s'"
            , mysql_real_escape_string($groupID));
        $groups = mysql_query($sql) or responseMsg('Invalid query #2: '.mysql_error());
        responseMsg(( $groups ? $sql."\n" : '' ));
        while ($row = mysql_fetch_assoc($groups)) {
            if (substr_compare($groupID, "g", 0, 1) == 0) {
                $data[$groupID] = array( 
                    'g_id' => $groupID,
                    'g_name' => $row['GroupName'],
                    'is_open' => $row['IsOpen'],
                    'createdTime' => $row['CreatedTimestamp'] );
            }
        }

        // 取 folderinfo 資料
        $sql = sprintf("SELECT * FROM folderinfo WHERE GroupID = '%s'",
                mysql_real_escape_string($groupID));
        $folderinfo = mysql_query($sql) or responseMsg('Invalid query #3: '.mysql_error());
        responseMsg(( $folderinfo ? $sql."\n" : '' ));
        while ($row = mysql_fetch_assoc($folderinfo)) {
            $groupID = $row['GroupID'];
            $folderID = $row['FolderID'];
            
            $folders[] = array(
                'f_id' => $row['FolderID'],
                'f_name' => $row['FolderName'],
                'f_comment' => $row['FolderComment'],
                'creatorID' => $row['CreatorID'],
                'createdTime' => $row['CreatedTimestamp']
            );

            if (!empty($folders)) {
                $data[$groupID]['folders'][] = array(
                    'f_id' => $row['FolderID'],
                    'f_name' => $row['FolderName'],
                    'f_comment' => $row['FolderComment'],
                    'creatorID' => $row['CreatorID'],
                    'createdTime' => $row['CreatedTimestamp']
                );    
            }

        }
    }

    echo json_encode($data);
?>