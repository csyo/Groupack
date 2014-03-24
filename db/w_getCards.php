<?php
    // 資料庫參數
    require "connect.php";
    
    $fid = $_POST['fid'];
    
    $query = sprintf( "SELECT * FROM cardinfo WHERE FolderID = '%s'
        ORDER BY CreatedTimestamp ASC" , mysql_real_escape_string($fid) );    
    $cards = mysql_query($query) or die('Invalid query from getCards.php: ' . mysql_error());
    
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
    
    echo json_encode($data);
?>