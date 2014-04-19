<?php
    // 資料庫參數
    require "connect.php";
    
    $query = sprintf("SELECT * FROM cardinfo WHERE FolderID = '%s'
        AND NOT EXISTS (SELECT * FROM taginfo WHERE cardinfo.CardID = taginfo.CardID)
        ORDER BY CreatedTimestamp ASC" ,
        mysql_real_escape_string($_POST['fid']));    
    $cards = mysql_query($query) or die('Invalid query from getCards.php: #1 ' . mysql_error());
    
    $data = array();
    while ($card = mysql_fetch_assoc($cards)) {
        $data[] =  array(
            'fbid' => $card['CreatorID'] ,
            'cid' => $card['CardID'] ,
            'title' => $card['CardName'] ,
            'content' => $card['CardComment'] ,
            'url' => $card['URL'] ,
            'time' => $card['CreatedTimestamp'] ,
            'is_file' => $card['IsFile']
        );
    }

    $query = sprintf("SELECT cardinfo . * , GROUP_CONCAT(cardtag.TagID, '_',cardtag.TagName SEPARATOR ', ') AS Tags
        FROM cardinfo, taginfo, cardtag
        WHERE FolderID = '%s' AND GroupID = '%s'
        AND cardinfo.CardID = taginfo.CardID
        AND taginfo.TagID = cardtag.TagID
        GROUP BY CardID
        ORDER BY CreatedTimestamp ASC",
        mysql_real_escape_string($_POST['fid']),    
        mysql_real_escape_string($_POST['gid']));
    $cards = mysql_query($query) or die('Invalid query from getCards.php: #2 ' . mysql_error());
    
    while ($card = mysql_fetch_assoc($cards)) {
        $data[] =  array(
            'fbid' => $card['CreatorID'] ,
            'cid' => $card['CardID'] ,
            'title' => $card['CardName'] ,
            'content' => $card['CardComment'] ,
            'url' => $card['URL'] ,
            'time' => $card['CreatedTimestamp'] ,
            'is_file' => $card['IsFile'],
            'tags' => $card['Tags']
        );
    }    

    echo json_encode($data);
?>