<?php
 //從伺服器Search_Process_Old_Data拿取曾經看過的關鍵字歷程txt檔案
 //檔案命名方式'Group_'+群組ID+'_of_'+個人ID+'.txt'
 $GID = $_POST['sentgroupid'];
 $UID = $_POST['sentuserid'];
 
 $filename="Group_".$GID."_of_".$UID.".txt";
 $path ='Search_Process_Old_Data/'.$filename;
 
 if(file_exists($path)){
	$fp=fopen('Search_Process_Old_Data/'.$filename,"r+");
	$OldData=fgets($fp);
	fputs($fp, $OldData);
	fclose($fp);
	echo $OldData;
 }else{
    echo ""; 
 }
?>