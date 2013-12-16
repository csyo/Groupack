$(document).ready(function(e){
	$('#_back').click( function(){
		window.location.href = '../index.html';
	});
	// 視窗改變時觸發
	$(window).resize(function(){   
		testdevice();
		window.location.reload();
	});
});
//從資料庫抓取新搜尋的關鍵字群
function get_new_data(){   
	var id;	//groupID
	if ( localStorage.group_selected ) {
	    id = localStorage.getItem('group_selected');  
	}
	else {
		var name=1;
	}
	
	var search_process_old_data;
	if( json_old_data.length==0 ){
		console.log("儲存端沒有值");
		search_process_old_data = new Array();
		search_process_old_data = JSON.stringify(search_process_old_data);
		console.log('nothing');
	}
	else{
		console.log("儲存端有值");
		search_process_old_data = json_old_data;
		console.log(json_old_data);
	}
		
	$.ajax({         
		url: 'http://chding.es.ncku.edu.tw/Groupack_new/SearchProcess/searchprocess_get_new_data.php',         
		cache: false,         
		dataType: 'html',             
		type: 'POST',         
		async: false,
		data: { sentgroupid:id , sentOldData:search_process_old_data },         
		error: 	function(xhr){           
				alert('Ajax request 發生錯誤:searchprocess_get_new_data.php');         
				},         
		success: function(response){ 	
				new_data=JSON.parse(response);	
				console.log(response);
		}
	});
}

function get_member(){
	var id;

	if ( localStorage.group_selected ) {
	    id = localStorage.getItem('group_selected');  // 取得已選擇群組之ID 
	}
	else {
		var name=1;
	}
	$.ajax({         
		url: 'http://chding.es.ncku.edu.tw/Groupack_new/SearchProcess/searchprocess_get_member.php',         
		cache: false,         
		dataType: 'html',             
		type: 'POST',       
		async: false,
		data: { sentgroupid:id },         
		error: 	function(xhr){           
				alert('Ajax request 發生錯誤:searchprocess_get_member.php');         
				},         
		success: function(response){ 	
				//console.log('group_member='+response);		
				group_member = JSON.parse(response);
		}
	});
}
//取得Search_Process_Old_Data資料夾下的txt檔(已瀏覽過的關鍵字群)
function get_old_data(){
	var groupID = localStorage.group_selected;
	var userID = localStorage.FB_id;
	
	$.ajax({         
		url: 'http://chding.es.ncku.edu.tw/Groupack_new/SearchProcess/searchprocess_get_OldData.php',         
		cache: false,         
		dataType: 'html',             
		type: 'POST',       
		async: false,
		data: { sentgroupid:groupID , sentuserid:userID },         
		error: 	function(xhr){           
				alert('Ajax request 發生錯誤:searchprocess_get_OldData.php');         
				},         
		success: function(response){ 		
				json_old_data = response;
		}
	});	
}
//將已瀏覽過的關鍵字群，傳到伺服器的Search_Process_Old_Data資料夾下存為txt檔
function set_old_data(){
	var groupID = localStorage.group_selected;
	var userID = localStorage.FB_id;
	var s_old_data = localStorage.getItem("search_process_data_for_"+groupID );
	
	$.ajax({         
		url: 'http://chding.es.ncku.edu.tw/Groupack_new/SearchProcess/searchprocess_set_OldData.php',         
		cache: false,         
		dataType: 'html',             
		type: 'POST',       
		async: false,
		data: { sentgroupid:groupID , sentuserid:userID , sentolddata:s_old_data },         
		error: 	function(xhr){           
				alert('Ajax request 發生錯誤:searchprocess_set_OldData.php');         
				},         
		success: function(response){ 				
		}
	});
}
function testdevice(){
	//測試瀏覽器大小
	var viewportwidth;
	var viewportheight;
	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	if (typeof window.innerWidth != 'undefined'){
		viewportwidth = window.innerWidth,
		viewportheight = window.innerHeight
	}
	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
	else if (typeof document.documentElement != 'undefined'&& typeof document.documentElement.clientWidth !='undefined' && document.documentElement.clientWidth != 0){
		viewportwidth = document.documentElement.clientWidth,
		viewportheight = document.documentElement.clientHeight
	}// older versions of IE
	else{
		viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
		viewportheight = document.getElementsByTagName('body')[0].clientHeight
	}
	localStorage.setItem('viewport_width', viewportwidth);
	localStorage.setItem('viewport_height', viewportheight);
}
