<?php
    // 資料庫參數
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Not connected: '.mysql_error());
    mysql_select_db($dbname, $connect) or die('Failed selecting: '.mysql_error());  
    mysql_set_charset('utf8') or die('Failed to set utf-8');
    
    // POST 參數
    $id = isset($_POST['xid']) ? $_POST['xid'] :'';
    
    switch ( $id[0] ) {
        case "c": // remove card
            $query = sprintf( "DELETE FROM folder_card WHERE CARD_ID = '%s'" , mysql_real_escape_string($id));
            $result = mysql_query($query);
            if (!$result) {
                $message  = 'Invalid query #1: ' . mysql_error() . "\n";
                $message .= 'Whole query: ' . $query;
                die($message);
            }
            echo $id." (card) is deleted.";
            break;
        case "f": // remove folder
            $query = sprintf( "DELETE FROM folder_card WHERE FOLDER_ID = '%s'" , mysql_real_escape_string($id));
            $result = mysql_query($query);
            if (!$result) {
                $message  = 'Invalid query #2: ' . mysql_error() . "\n";
                $message .= 'Whole query: ' . $query;
                die($message);
            }
            $query = sprintf( "DELETE FROM workspace_folder WHERE FOLDER_ID = '%s'" , mysql_real_escape_string($id));
            $result = mysql_query($query);
            if (!$result) {
                $message  = 'Invalid query #3: ' . mysql_error() . "\n";
                $message .= 'Whole query: ' . $query;
                die($message);
            }
            echo $id." (folder) is deleted.";
            break;
        case "w": // remove workspace
            $query = sprintf( "SELECT FOLDER_ID FROM workspace_folder WHERE W_ID = '%s'" , mysql_real_escape_string($id));
            $select = mysql_query($query);
            if (!$select) {
                $message  = 'Invalid query #4: ' . mysql_error() . "\n";
                $message .= 'Whole query: ' . $query;
                die($message);
            }
            while ( $row = mysql_fetch_assoc($select) ) {
                $folderID = $row['FOLDER_ID'];
                $query = sprintf( "DELETE FROM folder_card WHERE FOLDER_ID = '%s'" , mysql_real_escape_string($folderID) );
                $result = mysql_query($query);
                if (!$result) {
                    $message  = 'Invalid query #5: ' . mysql_error() . "\n";
                    $message .= 'Whole query: ' . $query;
                    die($message);
                }
                $query = sprintf( "DELETE FROM workspace_folder WHERE FOLDER_ID = '%s'" , mysql_real_escape_string($folderID) );
                $result = mysql_query($query);
                if (!$result) {
                    $message  = 'Invalid query #6: ' . mysql_error() . "\n";
                    $message .= 'Whole query: ' . $query;
                    die($message);
                }
            }
            $query = sprintf( "DELETE FROM workspace_folder WHERE W_ID = '%s'" , mysql_real_escape_string($id));
            $result = mysql_query($query);
            if (!$result) {
                $message  = 'Invalid query #7: ' . mysql_error() . "\n";
                $message .= 'Whole query: ' . $query;
                die($message);
            }
            $query = sprintf( "DELETE FROM workspace WHERE W_ID = '%s'" , mysql_real_escape_string($id));
            $result = mysql_query($query);
            if (!$result) {
                $message  = 'Invalid query #8: ' . mysql_error() . "\n";
                $message .= 'Whole query: ' . $query;
                die($message);
            }
            echo $id." (workspace) is deleted.";
            break;
        default:
            break;
        
    }
?>