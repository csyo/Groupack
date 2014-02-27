<?php	set_time_limit(0);

//保存數据的文件
$file_name  = dirname(__FILE__).'/TimelinePolling/'.$_GET['FB_id'].'.txt';

//獲取文件上傳更新時間
$last_modif_time = isset($_GET['timestamp']) ? $_GET['timestamp'] : 0;
//獲取文件更新時間
$current_modif_time = filemtime( $file_name );

//如果文件沒有被修改，則阻塞不返回
while( $current_modif_time <= $last_modif_time ){
	//阻塞10ms
	usleep(10000);
	//清除文件狀態緩存
	clearstatcache();
	//獲取文件更新時間
	$current_modif_time = filemtime($file_name);
}
//返回數据
$response = array();
//獲取文件內保存的內容
$response['msg'] = file_get_contents($file_name);
//獲取文件修改時間
$response['timestamp'] = $current_modif_time;
$response['last_modif_time'] = $last_modif_time;
//返回json格式的數据
echo json_encode($response);
//刷新輸出緩沖
flush();
?>