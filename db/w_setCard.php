<?php
    /********************************************
    
                更新 [ folder -> card ]
        
    ********************************************/
    error_reporting(E_ALL);
    require "connect.php";
    
    // 新增
    if ( isset($_POST['fbid']) ) {
        $query = sprintf("SELECT CardID FROM cardinfo WHERE CardName = '%s' AND URL = '%s' AND FolderID = '%s'",
            mysql_real_escape_string($_POST['title']),
            mysql_real_escape_string($_POST['url']),
            mysql_real_escape_string($_POST['fid']));
        $result = mysql_query($query) or die('Invalid query #1: ' . mysql_error());
        $cid = mysql_fetch_assoc($result)['CardID'];

        if ($cid == '') {
            $query = sprintf( "INSERT INTO cardinfo (CreatorID,CardID,FolderID,CardName,CardComment,URL)"
                . "VALUE ('%s','%s','%s','%s','%s','%s')",
                mysql_real_escape_string($_POST['fbid']),
                mysql_real_escape_string($_POST['cid']),
                mysql_real_escape_string($_POST['fid']),
                mysql_real_escape_string($_POST['title']),
                mysql_real_escape_string($_POST['content']),
                mysql_real_escape_string($_POST['url']));
            mysql_query($query) or die('Invalid query #1: ' . mysql_error());
            echo $query."\n";
        } else {
            $_POST['cid'] = $cid;
        }
        echo 'cardID='.$_POST['cid']."\n";
    } else {
        // 更新
        $query = sprintf("UPDATE cardinfo SET CardName = '%s', CardComment = '%s', URL = '%s' WHERE CardID = '%s'",
            mysql_real_escape_string($_POST['title']), mysql_real_escape_string($_POST['content']),
            mysql_real_escape_string($_POST['url']), mysql_real_escape_string($_POST['cid']));
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

            $query = sprintf("INSERT IGNORE taginfo (TagID, CardID)"
                    . "SELECT TagID,'%s' FROM cardtag WHERE TagName = '%s' AND GroupID = '%s' LIMIT 1",
                mysql_real_escape_string($_POST['cid']),
                mysql_real_escape_string($value->name),
                mysql_real_escape_string($_POST['gid']));
            mysql_query($query) or die('Invalid query for "'.$query.'": \n'. mysql_error());
            echo $query."\n";
        }
    } else echo "No Tags!";

?>