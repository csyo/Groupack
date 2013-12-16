<?php
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    $fid = $_POST['fid'];
    
    $query = sprintf( "SELECT * FROM folder_card WHERE FOLDER_ID = '%s' ORDER BY `CARD_TIMESTAMP` ASC" , mysql_real_escape_string($fid) );    
    $cards = mysql_query($query);
    if (!$cards) {
        $message  = 'Invalid query from getCards.php: ' . mysql_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
    
    $data = array();
    while ($card = mysql_fetch_assoc($cards)) {
        $data[] =  array( 'fbid' => $card['CARD_CREATOR'] , 'cid' => $card['CARD_ID'] , 'title' => $card['TITLE'] , 'content' => $card['CONTENT'] , 'url' => $card['URL'] , 'time' => $card['CARD_TIMESTAMP'] , 'is_file' => $card['IS_FILE'] );
    }
    
    echo json_encode($data);
?>