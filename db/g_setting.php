<?php
    /********************************************
    
                    新增/更新群組成員資料
        
    ********************************************/
    
    // 資料庫參數
    require_once('connect.php');
    
    // POST 資料
    $data = isset( $_POST['data'] ) ? $_POST['data'] : die("no data transmitted.");

    // 剖析資料
    $data = json_decode($data);

    $groupID = $data->ID;
    $groupNAME = $data->NAME;
    // echo $data->admins[0]->id;

    $responseMsg = '';
    function responseMsg($msg){
        $GLOBALS['responseMsg'] = $GLOBALS['responseMsg'] . $msg;
    }

    // 儲存資料
    function store( $data ){
        // 儲存管理員資料
        foreach ( $data->admins as $admins) {
            $sql = sprintf("INSERT IGNORE userinfo VALUES ('%s', '%s')"
                , mysql_real_escape_string($admins->id)
                , mysql_real_escape_string($admins->name));
            mysql_query($sql) or responseMsg('Invalid query #3: ' . mysql_error() . "\n");
            $sql = sprintf("INSERT IGNORE belongsto VALUES ('%s', '%s', '%s')"
                , mysql_real_escape_string($admins->id)
                , mysql_real_escape_string($data->ID)
                , mysql_real_escape_string('ADMIN'));
            $result = mysql_query($sql) or responseMsg('Invalid query #4: ' . mysql_error() . "\n");
            responseMsg(( $result ? $sql."\n" : '' ));
        }
        // 儲存成員資料
        foreach ( $data->members as $members) { 
            $sql = sprintf("INSERT IGNORE userinfo VALUES ('%s', '%s')"
                , mysql_real_escape_string($members->id)
                , mysql_real_escape_string($members->name));
            mysql_query($sql) or responseMsg('Invalid query #5: ' . mysql_error() . "\n");
            $sql = sprintf("INSERT IGNORE belongsto VALUES ('%s', '%s', '%s')"
                , mysql_real_escape_string($members->id)
                , mysql_real_escape_string($data->ID)
                , mysql_real_escape_string('MEMBER'));
            $result = mysql_query($sql) or responseMsg('Invalid query #6: ' . mysql_error() . "\n");
            responseMsg(( $result ? $sql."\n" : '' ));
        }
    }

    // 檢查群組是否存在
    $sql = sprintf("SELECT GroupID FROM groupinfo WHERE GroupID = '%s'"
            , mysql_real_escape_string($groupID));
    $result = mysql_query($sql) or responseMsg('Invalid query #1: ' . mysql_error() . "\n");

    if (mysql_num_rows($result) == 0) {
        // 新增群組
        $sql = sprintf("INSERT INTO groupinfo (GroupID, GroupName, IsOpen) VALUES ('%s', '%s', %d)"
                , mysql_real_escape_string($groupID)
                , mysql_real_escape_string($groupNAME)
                , $data->isOpen);
        $result = mysql_query($sql) or responseMsg('Invalid query #2.0: ' . mysql_error() . "\n");
        responseMsg(( $result ? $sql."\n" : '' ));

        $sql = sprintf( "INSERT INTO folderinfo (GroupID,FolderID,FolderName,FolderComment,CreatorID)
            VALUES ('%s','%s','%s','%s','%s')",
            mysql_real_escape_string($groupID),  mysql_real_escape_string($_POST['fid']),
            mysql_real_escape_string('未分類'), mysql_real_escape_string('預設資料夾'),
            mysql_real_escape_string($data->admins[0]->id));
        $result = mysql_query($sql) or responseMsg('Invalid query #2.1: ' . mysql_error() . "\n");
        responseMsg(( $result ? $sql."\n" : '' ));

        store($data);

    } else {
        if ( isset( $data->admins ) && isset( $data->members ) ) {
            // 需要更新 belongsto
            // 清空舊資料
            $sql = sprintf("DELETE FROM belongsto WHERE GroupID = '%s'"
                , mysql_real_escape_string($groupID));
            mysql_query($sql) or responseMsg('Invalid query #7: ' . mysql_error() . "\n");
            responseMsg($sql."\n");

            store($data);

            // 更新群組資料
            $sql = sprintf("UPDATE groupinfo SET GroupName = '%s', IsOpen = %d WHERE GroupID = '%s'"
                , mysql_real_escape_string($groupNAME), $data->isOpen
                , mysql_real_escape_string($groupID));
            $result = mysql_query($sql) or responseMsg('Invalid query #10: ' . mysql_error() . "\n");
            responseMsg(( $result ? $sql."\n" : '' ));
        }
    }
    if ($responseMsg)
        echo $responseMsg;
?>