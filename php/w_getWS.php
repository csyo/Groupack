<?php
    /****************************************************
    
      取得資料庫內所有 workspace 資料 , 使用 JSON 格式回傳
        
    ****************************************************/
    
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    $gid = $_POST['gid'];
    
    $query = sprintf( "SELECT * FROM workspace WHERE G_ID = '%s'" , mysql_real_escape_string($gid) );
    $workspaces = mysql_query($query) or die('MySQL failed: '.mysql_error());
    
    $data = array();
    while ( $workspace = mysql_fetch_assoc( $workspaces ) ) {

        $wid = $workspace['W_ID'];
        $wname = $workspace['W_NAME'];
        
        $query = sprintf( "SELECT * FROM workspace_folder WHERE W_ID = '%s'" , mysql_real_escape_string($wid) );
        $folders = mysql_query($query) or die('MySQL failed: '.mysql_error());
        
        $f = array();
        while ( $folder = mysql_fetch_assoc( $folders ) ) {
            
            $f[] =  array( 'fid' => $folder['FOLDER_ID'] , 'fname' => $folder['FOLDER_NAME'] );
        }

        $data[] =  array( 'wid' => $wid , 'wname' => $wname , 'folders' => $f );

    }
    echo json_encode($data);
?>