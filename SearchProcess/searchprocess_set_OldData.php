<?php
 //傳送看過的瀏覽歷程資料到伺服器Search_Process_Old_Data的資料夾底下(txt檔)
 //檔案命名方式'Group_'+群組ID+'_of_'+個人ID+'.txt'
 $GID = $_POST['sentgroupid'];
 $UID = $_POST['sentuserid'];
 $OldData = $_POST['sentolddata'];
 
 $filename="Group_".$GID."_of_".$UID.".txt";
 $fp=fopen( 'Search_Process_Old_Data/'.$filename ,"w");
 fputs($fp, $OldData);
 fclose($fp);
?>