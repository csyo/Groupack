<?php
    /********************************************
    
    取得資料庫內 folder , 使用 JSON 格式回傳資料
        
    ********************************************/
    
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    $wid = $_POST['wid'];
    
    $query = "SELECT * FROM workspace_folder WHERE W_ID = '$wid'";
    $getFolders = mysql_query($query) or die('MySQL failed: '.mysql_error());
    
    $data = array();
    while ($folder = mysql_fetch_assoc($getFolders)) {

        $fid = $folder['FOLDER_ID'];
        $fname = $folder['FOLDER_NAME'];
        $ftext = $folder['COMMENT'];
        $time = $folder['FOLDER_TIMESTAMP'];
        $id = $folder['FOLDER_CREATOR'];

        $data[] =  array( 'fid' => $fid , 'fname' => $fname , 'ftext' => $ftext , 'ftime' => $time , 'id' => $id );

    }
    echo json_encode($data);
?>