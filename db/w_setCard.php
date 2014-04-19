<?php
    /********************************************
    
                更新 [ folder -> card ]
        
    ********************************************/
    error_reporting(E_ALL);
    require "connect.php";
    
    // POST 資料
    $cid = $_POST['cid'];
    $fid = $_POST['fid'];
    $title = $_POST['title'];
    $content = $_POST['content'];
    $url = $_POST['url'];
    $status = '';

    // 新增
    if ( isset($_POST['fbid']) ) {
        $query = sprintf( "INSERT INTO cardinfo (CreatorID,CardID,FolderID,CardName,CardComment,URL)"
            . "SELECT * FROM (SELECT '%s','%s','%s','%s','%s','%s') AS tmp "
            . "WHERE NOT EXISTS ("
            . "SELECT URL FROM cardinfo WHERE CardName = '%s' AND URL = '%s'"
            . ") LIMIT 1",
            mysql_real_escape_string($_POST['fbid']),
            mysql_real_escape_string($cid),
            mysql_real_escape_string($fid),
            mysql_real_escape_string($title),
            mysql_real_escape_string($content),
            mysql_real_escape_string($url),
            mysql_real_escape_string($title),
            mysql_real_escape_string($url));
        mysql_query($query) or die('Invalid query #1: ' . mysql_error());
        echo $query."\n";
        $query = sprintf("SELECT CardID FROM cardinfo WHERE CardName = '%s' AND URL = '%s'",
            mysql_real_escape_string($title),
            mysql_real_escape_string($url));
        $result = mysql_query($query) or die('Invalid query #1: ' . mysql_error());
        $cid = mysql_fetch_assoc($result)['CardID'];
        echo 'cardID='.$cid."\n";
    } else {
        // 更新
        $query = sprintf( "UPDATE cardinfo SET CardName = '%s', CardComment = '%s' , URL = '%s'
            WHERE CardID = '%s'",
            mysql_real_escape_string($title), mysql_real_escape_string($content),
            mysql_real_escape_string($url), mysql_real_escape_string($cid));
        mysql_query($query) or die('Invalid query #2: ' . mysql_error());
        echo $query."\n";
    }

    if ( isset($_POST['tags']) ) {
        $tags = json_decode($_POST['tags']);
        foreach ($tags as $value) {
            $sql = "INSERT INTO cardtag (GroupID, TagID, TagName) "
                 . "SELECT * FROM (SELECT '%s','%s','%s') AS tmp "
                 . "WHERE NOT EXISTS ("
                 . "SELECT TagName,GroupID FROM cardtag WHERE TagName = '%s' AND GroupID = '%s'"
                 . ") LIMIT 1";
            $query = sprintf($sql,
                mysql_real_escape_string($_POST['gid']),
                mysql_real_escape_string($value->tid),
                mysql_real_escape_string($value->name),
                mysql_real_escape_string($value->name),
                mysql_real_escape_string($_POST['gid']));
            mysql_query($query) or die('Invalid query for "'.$query.'": \n'. mysql_error());
            echo $query."\n";

            $query = sprintf("INSERT INTO taginfo (TagID, CardID)"
                    . "SELECT TagID,'%s' FROM cardtag WHERE TagName = '%s' AND GroupID = '%s' LIMIT 1",
                mysql_real_escape_string($cid),
                mysql_real_escape_string($value->name),
                mysql_real_escape_string($_POST['gid']));
            mysql_query($query) or die('Invalid query for "'.$query.'": \n'. mysql_error());
            echo $query."\n";
        }
    }

?>