<?php
    /********************************************
    
                    退出/刪除群組
        
    ********************************************/
    
    require "connect.php";

    if ( isset( $_POST['gid'] ) ) {
        if ( isset($_POST['fbid']) ) {
            // 退出群組
            $sql = sprintf("DELETE FROM belongsto WHERE GroupID = '%s' AND UserID = '%s'",
                    mysql_real_escape_string($_POST['gid']), mysql_real_escape_string($_POST['fbid']));
        } else {
            // 刪除群組
            $sql = sprintf("DELETE FROM groupinfo WHERE GroupID = '%s'",
                    mysql_real_escape_string($_POST['gid']));
        }
        mysql_query($sql) or die(mysql_error());        
        echo $sql;
    } else {
        die("no data transmitted");
    }

?>