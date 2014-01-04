<?php
    /********************************************
    
                更新 [ folder -> card ]
        
    ********************************************/
    
    require "connect.php";
    
    // POST 資料
    $cid = $_POST['cid'];
    $fid = $_POST['fid'];
    $title = $_POST['title'];
    $content = $_POST['content'];
    $url = $_POST['url'];
    // $time = $_POST['time'];
    $status = '';

    // 新增
    if ( isset($_POST['fbid']) ) {
        $query = sprintf( "INSERT INTO careinfo (CreatorID,CardID,FolderID,CardName,CardComment,URL)
            VALUES ('%s','%s','%s','%s','%s','%s')",
            mysql_real_escape_string($fbid), mysql_real_escape_string($cid),
            mysql_real_escape_string($fid), mysql_real_escape_string($title), mysql_real_escape_string($content), mysql_real_escape_string($url));
        mysql_query($query) or die('Invalid query #1: ' . mysql_error());
        $status = "Adding";
        echo $_POST['fbid'] .": \n";
    } else {
        // 更新
        $query = sprintf( "UPDATE careinfo SET CardName = '%s', CardComment = '%s' , URL = '%s'
            WHERE CardID = '%s'",
            mysql_real_escape_string($title), mysql_real_escape_string($content),
            mysql_real_escape_string($url), mysql_real_escape_string($cid));
        mysql_query($query) or die('Invalid query #2: ' . mysql_error());
        $status = "Updating";
    }

   echo $status." Card (".$cid.") \"".$title."\" , url: ".$url." at Folder ".$fid;
?>