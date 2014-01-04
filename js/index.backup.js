$(function(e){
	// 處理完成的任務
	if ( JSON.parse( localStorage.task_done || '[]' ).length  ) { taskdone(); }
	// 測試視窗大小
	$('.testdevice').hide();
	// // 使用者資料儲存
	// if ( getName(localStorage.FB_id) === '-------' )
	// 	save_user();
	getsearchresult();
	SliderInit();
	testdevice();
	CheckGroupBoard();
	show_groups();
	Group_Board_showMember();
	setusetime();
	// new session if group is selected
	if (localStorage.group_selected) {
		logSession(localStorage.group_selected);
	};
});
function logSession(groupID, logid){
   if( logid ){
   	console.log("session end.");
      $.ajax({
      	async: false,
 			type: "POST",
      	url: 'db/SessionLog.php',
      	data: {
	         id: localStorage.FB_id,
	         keyword: localStorage.k_word,
	         gid: groupID,
	         logid: logid,
	      }
      }).done(function(r){
      	console.log(r);
      });
   } else {
   	console.log("session start.");
      $.post('db/SessionLog.php', {
         id: localStorage.FB_id,
         keyword: localStorage.k_word,
         gid: groupID
      }).done(function(r){
         console.log(r);
         sessionStorage.setItem("logid",r);
      });
   }
}
$(function(e){
	$(window).resize(function(){  // 視窗改變時觸發
		testdevice();
		if( $('#slider_btn').hasClass('bar_on') ){
			SliderInit();
			CheckSlider();
		}
		if( window.matchMedia('(max-width:600px)').matches ){  //手機
			 $('#Group_Board').css('width', 160);
		}else if( window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches ){  //平板
			$('#Group_Board').css('width', 320);
		}else{  //電腦
			$('#Group_Board').css('width', 480);
		}
	});
	$('#Group_Board > div.Group_Board_header > a').click(function(){  // 點擊 群組成員中心的大頭貼
	console.log('123');
		if( ! $('#Group_Board').hasClass('Group_Board_on') ){
			$('#Group_Board').addClass('Group_Board_on');
			$('#Group_Board_area').removeClass('dom_hidden').attr('style', '').parent().removeClass('dom_hidden').attr('style', '');
			$('#Group_Board .Group_Board_arrow').addClass('Group_Board_arrow_bottom');
		}else{
			$('#Group_Board_area').addClass('dom_hidden').offset({ top: -1000, left: -1000 }).parent().addClass('dom_hidden').offset({ top: -1000, left: -1000 });
			$('#Group_Board .Group_Board_arrow').removeClass('Group_Board_arrow_bottom');
			$('.Group_Board_on').removeClass('Group_Board_on');
		}
	}); 
	$('#showtodolist').click(function(){  // 顯示 task 介面
		var a = localStorage.group_selected || null;
		if( a == null || a == '' ){
			alert('請先選擇群組');
		}else{
			/*
			var $a = $('.timeline_group').filter('[t_sid='+a+']');
			var arr = new Array();
			for( var i=0; i<$a.find('span').length; i++ ){
				var $b = $a.children('span:nth-child('+(i+1)+')');
				arr[i] = $b.attr('t_member')+'__'+$b.text();
			}
			localStorage.setItem('group_selected_member', JSON.stringify( arr ));
			*/
			localStorage.setItem('where', 'slider_a');
			window.top.location.href = './task/index.html';
		}
	});
	$('#showtopicmap').click(function(){  // 顯示 topicmap 介面
		var a = localStorage.group_selected || null;
		if( a == null || a == '' ){		
			alert('請先選擇群組');
		}else if( sessionStorage.getItem('topic_relevance_for'+a)==null ){
			alert('關聯性尚未計算完成,請過1~2分鐘後再進入Topic map ^_^');
		}else if(sessionStorage.getItem('topic_relevance_for'+a)=='[]' ){
		    alert('目前收尋的關鍵字經過計算都沒有關聯耶!');
		}else{
			localStorage.setItem('where', 'slider_a');
			window.top.location.href = './TopicMap/topic_map.html';
		}
	});
	$('#showSearchProcess').click(function(){  // 顯示 SearchProcess 介面
		var a = localStorage.group_selected || null;
		if( a == null || a == '' ){
			alert('請先選擇群組');
		}else{
			localStorage.setItem('where', 'slider_a');
			window.top.location.href = './SearchProcess/searchprocess.html';
		}
	});
	$('body').click(function(){
		if( $('.search_result_read').hasClass('search_result_read_on') ){
			$('.search_result_read').css('opacity', '1');
			$('.search_result_read_on').removeClass('search_result_read_on').next().hide();
			$('.four').css('z-index', '2');
		}
		if( $('.search_result_inf').hasClass('search_result_inf_on') ){
			$('.search_result_inf_on').removeClass('search_result_inf_on').next().hide();
			$('.four').css('z-index', '2');
		}
	});
	$('#scroll-top-top').click(function(){  // 移到頁面頂部
		$('html, body').animate( {scrollTop: '0px'}, 400 );
	});
	$('#nav > ul.navigation > li').click(function(){  // nav選單 顯示與變色
		if( !$('#nav').hasClass('li_on') ){
			if( !$(this).hasClass('search_box') ){
				$('#nav').addClass('li_on');
				$(this).addClass('on').children('div.nav_main').children('a:first').css({'color':'#666', 'background':'rgb(55, 116, 235)'}).end().end().children('ul:first').removeClass('dom_hidden');
			}else{
				$('#nav').addClass('li_on');
				$(this).addClass('on').children('div.nav_main').children('a:first').css({'color':'#666', 'background':'rgb(55, 116, 235)'}).end().end().addClass('search_box_on');
				$('#navigation_input').removeClass('dom_hidden');
			}
		}else{
			if( !$(this).hasClass('on') ){
				$('ul.navigation > li > ul').addClass('dom_hidden');
				$('ul.navigation > li ').removeClass('on').children('div.nav_main').children('a').css({'color':'#FFF', 'background': '#222'});
				$('#navigation_input').addClass('dom_hidden');
				$('ul.navigation > li:nth-child(3)').removeClass('search_box_on');
				if( !$(this).hasClass('search_box') ){
					$(this).addClass('on').children('div.nav_main').children('a:first').css({'color':'#666', 'background':'rgb(55, 116, 235)'}).end().end().children('ul:first').removeClass('dom_hidden');
				}else{
					$(this).addClass('on').children('div.nav_main').children('a:first').css({'color':'#666', 'background':'rgb(55, 116, 235)'}).end().end().addClass('search_box_on');
					$('#navigation_input').removeClass('dom_hidden');
				}
			}else{
				$('#nav').removeClass('li_on');
				$('#navigation_input').addClass('dom_hidden');
				$('ul.navigation > li:nth-child(3)').removeClass('search_box_on');
				$(this).removeClass('on').children('ul:first').addClass('dom_hidden').end().children('div.nav_main').children('a:first').css({'color':'#FFF', 'background':'#222'});
			}
		}
	});
	$('#fiexd-header, #wrapper, #myWorkspace').click(function(){	// 點擊 #fiexd-header, #wrapper, #myWorkspace 隱藏 nav
		if( $('#nav').hasClass('li_on') ){
			$('ul.navigation > li > ul').addClass('dom_hidden');
			$('ul.navigation > li ').removeClass('on').children('div.nav_main').children('a').css({'color':'#FFF', 'background':'#222'});
			$('#nav').removeClass('li_on');
			$('#navigation_input').addClass('dom_hidden');
			$('li.search_box_on').removeClass('search_box_on');
		}
	});
	$('#slider_btn').click( ShowSlider );  // 顯示 slider 介面
	$('#back_main_slider').click( HideSlider );  // 關閉 slider 介面
	$('input.page_btn').click(function(){  // 換頁
		$('#scroll-top-top').trigger('click');
		$('#preloader').find('span').text('請稍後...').end().removeClass('dom_hidden');
		if( !$(this).hasClass('page_btn_now') ){
			$('.show_page_btn').children('input').removeClass('page_btn_now');
			$(this).addClass('page_btn_now');
			var k_page = $(this).attr('id');
			var k_word = localStorage.k_word;
			var viewport_width_now = localStorage.viewport_width;
			if( $(this).hasClass('page_btn_next') ){
				$('div.page_btn_area1').addClass('dom_hidden');
				$('input.page_btn_6').addClass('page_btn_now');
				$('div.page_btn_area2').removeClass('dom_hidden');
				
			}
			if( $(this).hasClass('page_btn_pre') ){
				$('div.page_btn_area2').addClass('dom_hidden');
				$('input.page_btn_1').addClass('page_btn_now');
				$('div.page_btn_area1').removeClass('dom_hidden');
			}
			if ( localStorage.group_selected ) {
				var id = localStorage.group_selected;   // 取得已選擇群組之ID 
				localStorage.setItem('groupid', localStorage.group_selected); // what is this for ?
			}else {
				var id=1;
			}
			var a = localStorage.FB_id;
			$.ajax({         
				url:'http://chding.es.ncku.edu.tw/Groupack/pageresult.php',         
				cache:false,         
				dataType:'html',             
				type:'POST',         
				data:{sendkeyword: k_word, sendviewportwidth: viewport_width_now, sendpage: k_page, sendUserID: a, sendgroupid: id},error:function(xhr) {           
					console.log('Ajax 錯誤: pageresult.php');         
				},         
				success: function(res){	
					document.getElementById('portfolio_wrapper1').innerHTML = res;
					$('#preloader').addClass('dom_hidden');
				}  				
			});
		}
	});
});
$(function(e){
	// 顯示目前 topic
	if( localStorage.k_word ){
		$('div.showtopic_span > div').text( localStorage.k_word );
	}else{
		$('div.showtopic_span > div').empty();
	}
    // 刪除可能存在的多餘資料
    var localStorageKeys = Object.keys(localStorage);
    var redundant = [];
    for (var i = 0; i < localStorageKeys.length; i++) {
        var test = localStorageKeys[i].substr(0, 2);
        if ( test == 'g1' || test == 'w1' )
            redundant.push( localStorageKeys[i] );
	}
	// 取得資料庫內的所有使用者名字
	$.post( "http://chding.es.ncku.edu.tw/Groupack/getNames.php" )
	.done( function(r){ var names = JSON.parse(r); localStorage.setItem('id_name', JSON.stringify(names));})
	.fail( function(e){ console.log(e)});
	
	$('#search_again_btn').attr('placeholder', localStorage.k_word).attr('value', localStorage.k_word);
});
$(function(){  // facebook 登入、登出與顯示
	$('#fblogout').click(function(){
		localStorage.clear();
		alert('成功登出');
		window.top.location.href = 'home.html';
	});
	ShowUserInfo( localStorage.FB_id, localStorage.FB_name );
});
function ShowUserInfo( a, b ){
	$('#show_fbname').text( b ).prev().children().attr('src', 'https://graph.facebook.com/' + a + '/picture').end().prev().attr('title', b).attr('href', localStorage.FB_userURL);
}
$(document).on('click','div.nav_main_search',function(e) {
	$('#search_again_btn').focus().select();
});
//facebook 分享
$(document).on('click', 'div.search_result_inf_field > div.search_result_inf_field_content:nth-child(3)', {
	mode: 's'
}, FeedToFacebook);
$(document).on('click','div.workspace_cards_content_inf_field > div.workspace_cards_content_inf_field_content:nth-child(3)',{
	mode: 'w'
}, FeedToFacebook);
$(document).on('click','div.tag_content_inf_field > div.tag_content_inf_field_content:nth-child(3)',{
	mode: 't'
}, FeedToFacebook);
$(document).on('click', 'div.search_result_inf', function(){  // 顯示 search result 卡片中的選項選單
	var test_search_result_inf_on = $(this).hasClass('search_result_inf_on');
	if( !test_search_result_inf_on ){
		$(this).addClass('search_result_inf_on');
		$(this).parent('.four').css('z-index', '10');
		$(this).next('.search_result_inf_field').show();
	}
	else{
		$('.search_result_inf_on').next('.search_result_inf_field').hide();
		$('.search_result_inf_on').removeClass('search_result_inf_on');
		$('.four').css('z-index', '2');
	}
	var title = $(this).siblings('.picture').find('h2 a').html();
	var content = $('.search_result_inf').siblings('.picture').find('p').html();
	var url = $(this).siblings('.picture').children('a').attr('href');
	var page_info = { 'title': title , 'content':content , 'url':url };
	localStorage.setItem("page_info", JSON.stringify( page_info ));
});
$(document).on('click', 'div.search_result_read', function(){  // 顯示 類似關鍵字推薦
	if( !$(this).hasClass('search_result_read_on') ){
		if( $(this).children('div').text() > 0 ){
			$(this).addClass('search_result_read_on').css('opacity', '0.7').parent('.four').css('z-index', '10').end().next().show();
		}
	}
	else{
		$('div.search_result_read_on').next().hide().end().removeClass('search_result_read_on');
	}		
});
$(document).on('click','#portfolio_wrapper1 a.fancy_iframe', function(){  // 儲存點擊過的搜尋結果
	if( localStorage.where == 'titlelink_a' ){
		localStorage.setItem('where', 'titlelink_aa');
	}else{
		localStorage.setItem('where', 'titlelink_a');
	}
    var title = this.text;
    var content = $(this).parent().siblings('p').text();
    var url = this.href;
    var page_info = { 'title': title , 'url':url ,'content':content };
    localStorage.setItem('page_info', JSON.stringify( page_info ));
    localStorage.setItem('open', url);
    $.post('http://chding.es.ncku.edu.tw/Groupack/save.php', { title: title , content: content, url: url, fbid: localStorage.FB_id, fbname: localStorage.FB_name, keyword : localStorage.k_word , gid:localStorage.group_selected })
    .fail( function(xhr) { console.log(xhr) })
    .done( function(response) { console.log('page info saved') }); 
	$(document).on('click', SetPage);
} );
function testdevice(){  // 測試瀏覽器大小
	var viewportwidth, viewportheight;
	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	if (typeof window.innerWidth != 'undefined'){
		viewportwidth = window.innerWidth,
		viewportheight = window.innerHeight
	}// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
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
function SetPage(){  // 設定當前頁面在哪
	if( localStorage.where == 'titlelink_aa' ){
		localStorage.setItem('where', 'titlelink_a');
	}else{
		localStorage.setItem('where', 'IndexPage');
		$(document).off('click', SetPage);
	}
}
var scroll_st = 0;
function setNav(){	// 偵測垂直滾軸位置來改變 #nav 的顯示
/*
	var scroll_now = window.document.body.scrollTop;
	if( scroll_now > scroll_st ){
		scroll_st = scroll_now;
		$('#nav').addClass('dom_hidden');
		$('#timeline_show_update').css('top', 45);
		$('#Timeline_NotificationArea').css('top', 45);
	}
	if( scroll_now < scroll_st || scroll_now == 0 ){
		scroll_st = scroll_now;
		$('#nav').removeClass('dom_hidden'); 
		$('#timeline_show_update').css('top', 91);
		$('#Timeline_NotificationArea').css('top', 91);
	} 
	if( scroll_now > 0 ){
		if( $('#slider_btn').hasClass('bar_on') ){
			$('#scroll-top-top').addClass('dom_hidden');
		}else{
			$('#scroll-top-top').removeClass('dom_hidden');
		}
		if( $('#nav').hasClass('li_on') ){
			$('ul.navigation > li > ul').addClass('dom_hidden');
			$('ul.navigation > li ').removeClass('on').children('div.nav_main').children('a').css({'color':'#FFF', 'background-color':'#222'});
			$('#nav').removeClass('li_on');
			$('#navigation_input').addClass('dom_hidden');
			$('li.search_box_on').removeClass('search_box_on');
		}
	}else{
		$('#scroll-top-top').addClass('dom_hidden');
	}*/
	if( localStorage.on_time == null ){
		setusetime();
	}
}	
function back_homepage(){  // 回首頁
	window.top.location.href = './home.html';
}
function setusetime(){  // 設定使用者時間
	var d = new Date(); 
	var month = d.getMonth()+1; 
	var day = d.getDate(); 
	var hour = d.getHours(); 
	var minute = d.getMinutes(); 
	var second = d.getSeconds(); 
	var now_time = d.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + (hour<10 ? '0' : '') + hour + ':' + (minute<10 ? '0' : '') + minute + ':' + (second<10 ? '0' : '') + second;
	localStorage.setItem( 'on_time', now_time );
}
// window.onbeforeunload = function set_time_interval(){  // 關鍵字的停留時間
// 	var d = new Date(); 
// 	var month = d.getMonth()+1; 
// 	var day = d.getDate(); 
// 	var hour = d.getHours(); 
// 	var minute = d.getMinutes(); 
// 	var second = d.getSeconds(); 
// 	var now_time = d.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + (hour<10 ? '0' : '') + hour + ':' + (minute<10 ? '0' : '') + minute + ':' + (second<10 ? '0' : '') + second;
// 	var on_time = localStorage.getItem( 'on_time' );
// 	if( on_time ){
// 		ontime_array = on_time.split("/");
// 		ontime_query_array = ontime_array[3].split(":");
// 		offtime_array = now_time.split("/");
// 		offtime_query_array = offtime_array[3].split(":");
// 		var totle_time = 3600;
// 		if( ontime_array[0] == offtime_array[0] && ontime_array[1] == offtime_array[1] && ontime_array[2] == offtime_array[2] && ontime_query_array[0] == offtime_query_array[0] ){
// 			var ontime_totle = parseInt(ontime_query_array[1])*60 + parseInt(ontime_query_array[2]);
// 			var offtime_totle = parseInt(offtime_query_array[1])*60 + parseInt(offtime_query_array[2]);
// 			totle_time = offtime_totle - ontime_totle;
// 		}
// 		localStorage.removeItem('on_time'); 
// 		localStorage.getItem('s_time');
// 		localStorage.setItem('TimeInterval', totle_time);
// 		var s_time = localStorage.getItem('s_time');
// 		console.log("window.onbeforeunload: "+totle_time);
// 		var keyword = localStorage.k_word_old ? localStorage.k_word_old : localStorage.k_word;
// 		$.ajax({
// 			async: false,
// 			cache: false,         
// 			dataType: 'html',
// 			url: 'http://chding.es.ncku.edu.tw/Groupack/searchSession.php',             
// 			type: 'POST',
// 			data: { time_interval: totle_time, keyword: keyword, fbid: localStorage.FB_id, gid: localStorage.group_selected },
// 			error: function (xhr,text,error) { console.log(text+error); },
// 			success: function (res) { console.log(res); localStorage.removeItem('k_word_old'); }
// 		});
// 	}
// };

// session end
function sessionEnd(){
	logSession(localStorage.group_selected, sessionStorage.logid || '0');
}

// end session before reload
window.onbeforeunload = function(){
	sessionEnd();
};

function getsearchresult(){    // 抓 google 搜尋結果
	$('#preloader').find('span').text('請稍後...').end().removeClass('dom_hidden');
	localStorage.setItem('start_move', '');
	var k_word = localStorage.getItem('k_word');
	var viewport_width_now = localStorage.viewport_width;
	if ( localStorage.group_selected ) {
	    var id = localStorage.group_selected; // 取得已選擇群組之ID 
	    var name = $('#'+id).children('a').html();
		localStorage.setItem('groupid', localStorage.group_selected);
	}else {
		var id=1;
	}
	var a = localStorage.FB_id;
	/*
	var check_initial = a+'***'+localStorage.getItem('FB_name');
	$.ajax({
		data: {'FB_id': a,'remove_ID': 'none','check_Group': 'none','check_WFC': 'none','initial': check_initial},
		type: 'post',
		url : 'http://chding.es.ncku.edu.tw/Groupack/T_put.php',
		success : function(response){
			//console.log('Initial_T_savedata:'+response);
			$('body').addClass('Initial_T_savedata'); 
			localStorage.setItem('T_savedataTimeout', '');
			T_long_connect();
		}
	});*/
	if( localStorage.where == 'HomePage' || localStorage.where == 'IndexPage' ){
		localStorage.setItem('where', 'IndexPage');
		$.ajax({         
			url: 'http://chding.es.ncku.edu.tw/Groupack/searchresult.php',         
			cache: false,         
			dataType: 'html',             
			type: 'POST',         
			data: { sendkeyword: k_word, sendviewportwidth: viewport_width_now, sendUserID: a, sendgroupid: id },         
			error: function(xhr) {           
				console.log('Ajax request 發生錯誤: searchresult.php');         
			},         
			success: function(response){ //console.log('->searchresult_success');
				localStorage.setItem('Page1_session', response);
				document.getElementById('portfolio_wrapper1').innerHTML = response; 
				get_topic_relevance(); //edit by chenchenbox
				$('#under-footer').removeClass('dom_hidden').attr('style', '');
				$('#preloader').addClass('dom_hidden');
			}     
		});
	}else{
		localStorage.setItem('where', 'IndexPage');
		document.getElementById('portfolio_wrapper1').innerHTML = '<div id="loading">'+
				'<img src="Image/loading.gif">網頁載入中，請稍候‧‧‧'+
			'</div>'; 
		if( localStorage.Page1_session != '' ){	
			get_topic_relevance(); //edit by chenchenbox
			document.getElementById('portfolio_wrapper1').innerHTML = localStorage.Page1_session;
			$('#preloader').addClass('dom_hidden');
		}else{
			$.ajax({         
				url: 'http://chding.es.ncku.edu.tw/Groupack/searchresult.php',         
				cache: false,         
				dataType: 'html',             
				type: 'POST',         
				data: { sendkeyword: k_word, sendviewportwidth: viewport_width_now, sendUserID: a, sendgroupid: id },         
				error: function(xhr) {           
					console.log('Ajax request 發生錯誤: searchresult.php');         
				},         
				success: function(response){ //console.log('->searchresult_success');
					localStorage.setItem('Page1_session', response);
					document.getElementById('portfolio_wrapper1').innerHTML = response; 
					get_topic_relevance(); //edit by chenchenbox
					$('#under-footer').removeClass('dom_hidden');
					$('#preloader').addClass('dom_hidden');
				}     
			});
		}
	}
	$('#Group_Board').show();
}
function SliderInit(){  // 滑動選單初始化
	var width_now = parseInt( localStorage.viewport_width );
	if( width_now >= 481 ){ 
		if( width_now <= 700 )  var a = width_now * 0.85;
			else  var a = 600;
	}else{  
		var a = width_now - 70;
	}
	$('#Sidebar').data('width', a).css('width', a)
				.children('div.mySidebar_container_up').css('width', a).end()
				.children('div.mySidebar_container_down').css('width', a);
}

function search_again(){
	var k_word = document.getElementById('search_again_btn').value;
	localStorage.setItem('k_word_old', localStorage.k_word);
	localStorage.setItem('k_word', k_word);
	if( !localStorage.FB_id ){
		alert("請登入 Facebook ");
	}else{
		if( k_word == '' ){
			alert("請輸入關鍵字");
		}else{
			document.nav_select_search_form.action = 'usersubmit.php'; 
			window.top.location.href = 'index.html';
		}
	}
}
$("#search_again_form").submit(function(e){
	e.preventDefault();
	search_again();}
);

function Group_Board_showMember(){
	var a = localStorage.group_selected;
	if( a == null ){
		$('#Group_Board_area').html('none');
	}else{
		var $b = $('#group_update_hideArea').find('[t_sid='+a+']').children('span');
		$('#Group_Board_area').html('');
		for( var i=1; i<=$b.length; i++ ){
			var $c = $b.end().children('span:nth-child('+i+')');
			$('#Group_Board_area').append( 
			'<a class="co_a"  target="_blank" href="https://www.facebook.com/'+$c.attr('t_member')+'"><img title="'+$c.text()+'" src="https://graph.facebook.com/'+$c.attr('t_member')+'/picture" width="40px"></a>');
		}
	}
}
function CheckGroupBoard(){
	if( window.matchMedia('(max-width:600px)').matches ){  //手機
		 $('#Group_Board').css('width', 160);
	}else if( window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches ){  //平板
		$('#Group_Board').css('width', 320);
	}else{  //電腦
		$('#Group_Board').css('width', 480);
	}
}
function CheckSlider(){
	var a = $('#Sidebar').data('width');
	$('#wrapper').css( {marginLeft : '-'+a+'px', marginRight : a+'px'} );
	$('#timeline_wrapper').css( {marginLeft : '-'+a+'px', marginRight : a+'px'} );
	$('#myWorkspace').css( {marginLeft : '-'+a+'px', marginRight : a+'px'} );
	$('#fiexd-header').css( {marginLeft : '-'+a+'px', marginRight : a+'px'} );
	$('#nav').css( {marginLeft : '-'+a+'px', marginRight : a+'px'} );
	$('#nav_bg').css( {marginLeft : '-'+a+'px', marginRight : a+'px'} );
	$('#under-footer').css( {marginLeft : '-'+a+'px', marginRight : a+'px'} );
	$('#scroll-top-top').css( {marginLeft : '-'+a+'px', marginRight : a+'px'} );
	$('#Group_Board').css( {marginLeft : '-'+a+'px', marginRight : a+'px'} );
	$('#slider_background').css('right', a+'px');
}
function HideSlider(){    // 隱藏 slider 介面
	$('#slider_btn').removeClass('bar_on');
	$('#slider_background').attr('style', '').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
	$('#Sidebar > div.mySidebar_container_up').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
	$('#Sidebar > div.mySidebar_container_down').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
	$('#wrapper').css( {marginLeft : '', marginRight : ''} );
	$('#timeline_wrapper').css( {marginLeft : '', marginRight : ''} );
	$('#myWorkspace').css( {marginLeft : '', marginRight : ''} );
	$('#fiexd-header').css( {marginLeft : '', marginRight : ''} );
	$('#nav').css( {marginLeft : '', marginRight : ''} );
	$('#nav_bg').css( {marginLeft : '', marginRight : ''} );
	$('#under-footer').css( {marginLeft : '', marginRight : ''} );
	$('#scroll-top-top').css( {marginLeft : '', marginRight : ''} );
	$('#Group_Board').css( {marginLeft : '', marginRight : ''} );
	$('#Sidebar').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
	//左右滑動切換 slider
	$('#slider_background').off('touchmove', MoveSlider_bg).off('touchend', EndSlider_bg);
}
function ShowSlider(){    // 顯示 slider 介面
	var a = $('#Sidebar').data('width');
	$('#Sidebar').removeClass('dom_hidden').css({'top':'', 'left':''});
	$('#slider_btn').addClass('bar_on');
	$('#wrapper').css({marginLeft: '-'+a+'px',marginRight: a+'px'});
	$('#timeline_wrapper').css({marginLeft: '-'+a+'px',marginRight: a+'px'});
	$('#myWorkspace').css({marginLeft: '-'+a+'px',marginRight: a+'px'});
	$('#fiexd-header').css({marginLeft: '-'+a+'px',marginRight: a+'px'});
	$('#nav').css({marginLeft: '-'+a+'px',marginRight: a+'px'});
	$('#nav_bg').css({marginLeft: '-'+a+'px',marginRight: a+'px'});
	$('#under-footer').css({marginLeft: '-'+a+'px',marginRight: a+'px'});
	$('#Group_Board').css({marginLeft: '-'+a+'px',marginRight: a+'px'});
	$('#slider_background').removeClass('dom_hidden').attr('style', '').css('right', a+'px');
	$('#Sidebar > div.mySidebar_container_up').css({'top':'', 'left':''}).removeClass('dom_hidden');
	$('#Sidebar > div.mySidebar_container_down').css({'top':'', 'left':''}).removeClass('dom_hidden');
	$('#scroll-top-top').css( {marginLeft: '-'+a,marginRight: a});
	//左右滑動切換 slider
	$('#slider_background').on('touchmove', MoveSlider_bg).on('touchend', EndSlider_bg);
}
function save_user(){
	$.post('http://chding.es.ncku.edu.tw/Groupack/saveUser.php', { fbid: localStorage.FB_id, fbname: localStorage.FB_name })
	.fail( function (xhr,txt,err) { console.log(err); })
	.done( function (res) { console.log(res); id_name(); });
}
// 取得資料庫內的所有使用者名字
function id_name() {
	$.post('http://chding.es.ncku.edu.tw/Groupack/getNames.php')
	.done( function(r){ var names = JSON.parse(r); localStorage.setItem("id_name", JSON.stringify(names));})
	.fail( function(e){ console.log(e)});
}
// 取得指定ID的名字
function getName(id){
    var findname = JSON.parse( localStorage.id_name || '[]');
    for ( var k=0; k<findname.length; k++)
    	if(id==findname[k].id)
    		return findname[k].name;
	return '-------';
}
function MoveSlider_bg(e){
	if(e.originalEvent.targetTouches.length == 1){
		var touch = e.originalEvent.targetTouches[0];
		if( localStorage.start_move == '' ){
			localStorage.setItem('start_move', touch.pageX+'_'+touch.pageY);
		}
		localStorage.setItem('end_position', touch.pageX+'_'+touch.pageY);
		return false;
	}
}
function EndSlider_bg(){
	if( window.matchMedia('(max-width:600px)').matches ){  //手機
		var d = 5;
	}else if( window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches ){  //平板
			var d = 10;
	}else{  //觸碰電腦
		var d = 30;
	}
	var a = localStorage.start_move;
	a = a.split('_');
	var b = localStorage.end_position;
	b = b.split('_');
	if( Math.abs( parseInt( a[0] ) - parseInt( b[0] ) ) > d ){
		if( ( parseInt( a[0] ) - parseInt( b[0] ) ) < 0 ){  //關閉 slider 介面
				HideSlider();
		}
	}
	localStorage.setItem('start_move', '');
	localStorage.setItem('end_position', '');
}
function get_new_member(){  // 確認新增的群組成員   
	$('.addgroup_wrapper').css('display', 'inline-block');
	$('.addgroup_friends_wrapper').css('display', 'none');
}
function FBInitial(){  // 初始化 facebook api
	FB.init({ appId: '711866978838967', status: true, cookie: true, xfbml: true, channelUrl: 'channel.html' });
}
function FeedToFacebook(event){  // 分享到 facebook
	console.log(event.data.mode);
	switch( event.data.mode ){
		case 's':
			var myURL = $(this).parents('div.search_result_inf_field').next().children('a.fancy_iframe').attr('href');
			break;
		case 'w':
			var myURL = $(this).parents('div.workspace_cards_content_inf_field').next().find('a').attr('href');
			break;
		case 't':
			var myURL = $(this).parents('div.tag_content_inf_field').next().find('a').attr('href');
			break;
		default:
			var myURL = 'http://chding.es.ncku.edu.tw/Groupack/home.html';
			break;
	}
	FB.ui({
			app_id:'142509452587818',
			method: 'send',
			name: 'Groupack',
			link: myURL
		}, function(response){
			if( response.success ){
				var update_notify = '<div class="Timeline_NotificationArea_origin isotope">'+
						'<div class="Timeline_NotificationArea_origin_content">'+
							'<span>Sharing...</span>'+
						'</div>'+
					'</div>'+
					'<div class="Timeline_Notification isotope">'+
						'<div class="Timeline_Notification_icon">'+
							'<img src="Image/share_gray.png" width="20px" style="margin: 5px;">'+
						'</div>'+
						'<div class="Timeline_Notification_event">'+
						'<p>分享成功。</p>'+
						'</div>'+
					'</div>';
			}else{
				var update_notify = '<div class="Timeline_NotificationArea_origin isotope">'+
						'<div class="Timeline_NotificationArea_origin_content">'+
							'<span>Sharing...</span>'+
						'</div>'+
					'</div>'+
					'<div class="Timeline_Notification isotope">'+
						'<div class="Timeline_Notification_icon">'+
							'<img src="Image/share_gray.png" width="20px" style="margin: 5px;">'+
						'</div>'+
						'<div class="Timeline_Notification_event">'+
						'<p>分享失敗。</p>'+
						'</div>'+
					'</div>';
			}
			if( $('#Timeline_NotificationArea').css('display') == 'none' ){
				$('#Timeline_NotificationArea').html( update_notify ).show().delay(3300).hide(200);
			}else{
				$('#Timeline_NotificationArea').delay(3000).html( update_notify ).show().delay(3300).hide(200);
			}
		});
}
function taskdone() {
	console.log("執行: 完成項目移除工作");
	$.post( "http://chding.es.ncku.edu.tw/Groupack/todolist/taskdone.php" , { data: localStorage.task_done, fbid: localStorage.FB_id })
	.fail( function(xhr) {console.log(xhr);})
	.done( function(res) {console.log(res); localStorage.removeItem('task_done'); });
}