$(document).ready(function(e){
	
	/****** 有點多餘就藏起來吧 ******/
	$('.testdevice').hide();
	testdevice();
	$(window).resize(function(){    // 視窗改變時觸發
		var check_colorbox = $('body').hasClass('Show_GroupMemberAreaInf_on');
		if( check_colorbox ){
			var colorbox_width = window.innerWidth;
			var colorbox_height = window.innerHeight;
			colorbox_width = colorbox_width*0.98;
			colorbox_height = colorbox_height*0.98;
			$.colorbox.resize({ width: colorbox_width, height: colorbox_height });
		}
		testdevice();
		if( localStorage.getItem('viewport_width')<=400 )  $('#Group_Board').css('width', 160);
			else  $('#Group_Board').css('width', 320);
	});
	var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
	window.addEventListener(orientationEvent, function(){
		//alert('HOLY ROTATING SCREENS BATMAN:' + window.orientation + " " + screen.width);
		mode = window.orientation == 90 ? 'landscape' : 'portrait';
		if ( mode == 'landscape' ){    // 橫
			$('#showtopic > input').attr('value', '橫向' );
			localStorage.setItem( 'min_height', window.innerHeight );
		} 
		else {    //直
			$('#showtopic > input').attr('value', '直向');
			localStorage.setItem( 'max_width', window.innerWidth );
		}
	}, false);
	
	// fancybox-iframe: 搜尋結果 介面 
	$('.fancy_iframe').fancybox({    // click google search result with fancybox-iframe
			'width'			: '100%',
			'height'		: '95%',
			'autoScale'		: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'			: 'iframe',
		afterShow: function(){
			var v_o_url = $(this).attr('href');
			$('.fancybox-iframe').attr('id', 'fancybox_wrapper');
			var header = 
				'<div id="titlelink_nav">'+
					'<ul class="titlelink_navigation">'+
						'<li>'+
							'<div class="nav_main">'+
								'<a class="co_a" href="javascript: void(0);" title="share with gruop"><div class="nav_main_gruop"></div></a>'+
							'</div>'+
							'<div class="nav_main_text">'+
								'<a class="co_a" href="javascript: void(0);" title="share with gruop"><div class="nav_main_gruop_text">群組共享</div></a>'+
							'</div>'+
						'</li>'+
						'<li>'+
							'<div class="nav_main">'+
								'<a class="co_a" href="'+v_o_url+'" title="view original website" target="_blank"><div class="nav_main_view_original"></div></a>'+
							'</div>'+
							'<div class="nav_main_text">'+
								'<a class="co_a" href="'+v_o_url+'" title="view original website" target="_blank"><div class="nav_main_view_original_text">原始網站</div></a>'+
							'</div>'+
						'</li>'+
						'<li>'+
							'<div class="nav_main">'+
								'<a class="co_a" href="javascript: void(0);" title="comment and rating this"><div class="nav_main_comment"></div></a>'+
							'</div>'+
							'<div class="nav_main_text">'+
								'<a class="co_a" href="javascript: void(0);" title="comment and rating this"><div class="nav_main_comment_text">撰寫評論</div></a>'+
							'</div>'+
						'</li>'+
					'</ul>'+
				'</div>';
			$('.fancybox-outer').prepend( header ); 
		} ,
		afterClose: function(){ localStorage.removeItem("page_info"); localStorage.removeItem("open");}
	});
	
	// fancybox-iframe: Topic Map 介面 
	$('#showtopicmap').fancybox({
			'width'			: '100%',
			'height'		: '100%',
			'autoScale'		: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'			: 'iframe',	
		beforeLoad: function(){
			$('.main_slider').removeClass('bar_on');
			$('#slider_background').css('display', 'none');
			$("#slider_background").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$(".mySidebar").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$('#wrapper').css( {marginLeft:'',marginRight:''} );
			$("#timeline_wrapper").css( {marginLeft:'',marginRight:''} );
			$(".topic_map").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$(".workspace").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$("#fiexd-header").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$("#nav").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$("#nav_bg").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$("#under-footer").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$('.mySidebar').css('display', 'none');
		},
		afterShow: function(){
			var v_o_url = $(this).attr('href');
			$('.fancybox-iframe').attr('id', 'fancybox_wrapper');
		}
	});
	
	// fancybox-iframe: to do list 介面 
	$('#showtodolist').fancybox({
			'width'			: '100%',
			'height'		: '100%',
			'autoScale'		: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'			: 'iframe',	
		beforeLoad: function(){
			$('.main_slider').removeClass('bar_on');
			$('#slider_background').css('display', 'none');
			$("#slider_background").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$(".mySidebar").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$('#wrapper').css( {marginLeft:'',marginRight:''} );
			$("#timeline_wrapper").css( {marginLeft:'',marginRight:''} );
			$(".topic_map").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$(".workspace").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$("#fiexd-header").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$("#nav").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$("#nav_bg").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$("#under-footer").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
			$('.mySidebar').css('display', 'none');
		},
		afterShow: function(){
			var v_o_url = $(this).attr('href');
			$('.fancybox-iframe').attr('id', 'fancybox_wrapper');
		}
	});
		
	// 顯示選項選單
	$(document).on('click', '.search_result_inf', function(){
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
	
	// 顯示類似搜尋推薦
	$(document).on('click', '.search_result_read', function(){
		var test_search_result_read_on = $(this).hasClass('search_result_read_on');
		if( !test_search_result_read_on ){
			var test1 = $(this).children('div').text();
			if( test1 > 0 ){
				$(this).addClass('search_result_read_on');
				$(this).css('opacity', '0.5');
				$(this).parent('.four').css('z-index', '10');
				$(this).next('.search_result_read_field').show();
			}
		}
		else{
			$('.search_result_read_on').next('.search_result_read_field').hide();
			$('.search_result_read_on').removeClass('search_result_read_on');
		}		
	});
	$('body').on('click', function() {
		var test_search_result_read_on = $('.search_result_read').hasClass('search_result_read_on');
		if( test_search_result_read_on ){
			$('.search_result_read').css('opacity', '1');
			$('.search_result_read_on').next('.search_result_read_field').hide();
			$('.search_result_read_on').removeClass('search_result_read_on');
			$('.four').css('z-index', '2');
		}
	});
	$('body').on('click', function() {
		var test_search_result_inf_on = $('.search_result_inf').hasClass('search_result_inf_on');
		if( test_search_result_inf_on ){
			$('.search_result_inf_on').next('.search_result_inf_field').hide();
			$('.search_result_inf_on').removeClass('search_result_inf_on');
			$('.four').css('z-index', '2');
		}
	});
	
	$('.image-overlay-link').hover(function(){    // 搜尋結果顯示特效
		$(this).css('opacity', '1');
		}, function() {
		$(this).css('opacity', '0');
    });
	$('#scroll-top-top').click(function(){    // 慢速移到頁面頂部
		$('html,body').animate( {scrollTop: '0px'}, 700 );
	});
	$('ul.navigation > li').click(function(){	//nav選單顯示與變色
		var test1 = $('#nav').hasClass('li_on');
		var test2 = $(this).hasClass('on');
		var test3 = $(this).hasClass('search_box');
		if( !test1 ){
			if( !test3 ){
				$('#nav').addClass('li_on');
				$(this).addClass('on');
				$(this).children('.nav_main').children('a:first').css('color', '#666');
				$(this).children('.nav_main').children('a:first').css('background-color', '#DDD');
				$(this).children('ul:first').css('display', 'block');
			}else{
				$('#nav').addClass('li_on');
				$(this).addClass('on');
				$(this).children('.nav_main').children('a:first').css('color', '#666');
				$(this).children('.nav_main').children('a:first').css('background-color', '#DDD');
				$(this).addClass('search_box_on');
				$('#navigation_input').css('display', 'block');
			}
		}else{
			if( !test2 ){
				$('ul.navigation > li > ul').css('display', 'none');
				$('ul.navigation > li ').children('.nav_main').children('a').css('color', '#FFF');
				$('ul.navigation > li ').children('.nav_main').children('a').css('background-color', '#222');
				$('ul.navigation > li').removeClass('on');
				$('#navigation_input').css('display', 'none');
				$('ul.navigation > li:nth-child(3)').removeClass('search_box_on');
				if( !test3 ){
					$(this).addClass('on');
					$(this).children('.nav_main').children('a:first').css('color', '#666');
					$(this).children('.nav_main').children('a:first').css('background-color', '#DDD');
					$(this).children('ul:first').css('display', 'block');
				}else{
					$(this).addClass('on');
					$(this).children('.nav_main').children('a:first').css('color', '#666');
					$(this).children('.nav_main').children('a:first').css('background-color', '#DDD');
					$(this).addClass('search_box_on');
					$('#navigation_input').css('display', 'block');
				}
			}else{
				$('#nav').removeClass('li_on');
				$(this).removeClass('on');
				$('#navigation_input').css('display', 'none');
				$('ul.navigation > li:nth-child(3)').removeClass('search_box_on');
				$(this).children('ul:first').css('display', 'none');
				$(this).children('.nav_main').children('a:first').css('color', '#FFF');
				$(this).children('.nav_main').children('a:first').css('background-color', '#222');
			}
		}
	});
	$('#fiexd-header').click(function(){	// 點擊 #fiexd-header 隱藏 nav
		var test1 = $('#nav').hasClass('li_on');
		if( test1 ){
			$('ul.navigation > li > ul').css('display', 'none');
			$('ul.navigation > li ').children('.nav_main').children('a').css('color', '#FFF');
			$('ul.navigation > li ').children('.nav_main').children('a').css('background-color', '#222');
			$('ul.navigation > li').removeClass('on');
			$('#nav').removeClass('li_on');
			$('#navigation_input').css('display', 'none');
			$('ul.navigation > li:nth-child(3)').removeClass('search_box_on');
		}
	});
	$('#wrapper').click(function(){    // 點擊 #wrapper 隱藏 nav
		var test1 = $('#nav').hasClass('li_on');
		if( test1 ){
			$('ul.navigation > li > ul').css('display', 'none');
			$('ul.navigation > li ').children('.nav_main').children('a').css('color', '#FFF');
			$('ul.navigation > li ').children('.nav_main').children('a').css('background-color', '#222');
			$('ul.navigation > li').removeClass('on');
			$('#nav').removeClass('li_on');
			$('#navigation_input').css('display', 'none');
			$('ul.navigation > li:nth-child(3)').removeClass('search_box_on');
		}
	});
	$('#under-footer').click(function(){    // 點擊 #under-footer 隱藏 nav
		var test1 = $('#nav').hasClass('li_on');
		if( test1 ){
			$('ul.navigation > li > ul').css('display', 'none');
			$('ul.navigation > li ').children('.nav_main').children('a').css('color', '#FFF');
			$('ul.navigation > li ').children('.nav_main').children('a').css('background-color', '#222');
			$('ul.navigation > li').removeClass('on');
			$('#nav').removeClass('li_on');
			$('#navigation_input').css('display', 'none');
			$('ul.navigation > li:nth-child(3)').removeClass('search_box_on');
		}
	});
	$('.main_slider').click(function(){    // 顯示 slider 介面
		var width_now = localStorage.getItem( 'max_width' );
		if( !width_now )  width_now = localStorage.getItem( 'viewportwidth' );
		if( width_now <= 0 )	width_now = window.innerWidth;
		if( width_now >= 481 ){ 
			if( width_now <= 700 )  var test = width_now * 0.85;
				else  var test = 600;
			$('.mySidebar').css('width', test);
			$('.mySidebar_container_up').css('width', test);
			$('.mySidebar_container_down').css('width', test);
			$(this).addClass('bar_on');
			$('.mySidebar').css('display', 'block');
			$(".mySidebar").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#wrapper").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#timeline_wrapper").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$(".workspace").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#fiexd-header").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#nav").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#nav_bg").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#under-footer").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#slider_background").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$('#slider_background').css('display', 'block');
		}
		else{  
			var test = width_now - 70;
			$('.mySidebar').css('width', test);
			$('.mySidebar_container_up').css('width', test);
			$('.mySidebar_container_down').css('width', test);
			$(this).addClass('bar_on');
			$('.mySidebar').css('display', 'block');
			$(".mySidebar").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#wrapper").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#timeline_wrapper").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$(".workspace").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#fiexd-header").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#nav").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#nav_bg").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#under-footer").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$("#slider_background").animate( {marginLeft: '-'+test,marginRight: test}, 50 );
			$('#slider_background').css('display', 'block');
		}
	});
	$('#back_main_slider').click(function(){    // 隱藏 slider 介面
		$('.main_slider').removeClass('bar_on');
		$('#slider_background').css('display', 'none');
		$("#slider_background").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
		$(".mySidebar").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
		$('#wrapper').css( {marginLeft:'',marginRight:''} );
		$("#timeline_wrapper").css( {marginLeft:'',marginRight:''} );
		$(".workspace").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );		
		$("#fiexd-header").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
		$("#nav").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
		$("#nav_bg").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
		$("#under-footer").animate( {marginLeft:'0px',marginRight:'0px'}, 50 );
		$('.mySidebar').css('display', 'none');
	});
	// facebook 登入、登出以及顯示
	var user_fb_name = localStorage.getItem( 'FB_name' );
	var user_fb_id = localStorage.getItem( 'FB_id' );
	var user_fb_userURL= localStorage.getItem( 'FB_userURL' );
	var user_fb_picture_link = "https://graph.facebook.com/" + user_fb_id + "/picture";
	document.getElementById('show_fbname').innerHTML = user_fb_name + " │ 登入中";
	$('.nav_main_fb_container').children('img').attr('src', user_fb_picture_link);
	$('.nav_main_fb_wrapper > li:nth-child(1)').children('a').attr('title', user_fb_name);
	$('.nav_main_fb_wrapper > li:nth-child(1)').click(function(){
		$(this).children('a').attr('href', user_fb_userURL);
	});
	$('.nav_main_fb_wrapper > li:nth-child(2)').click(function(){
		localStorage.clear();
		alert( "成功登出" );
		window.top.location.href = "http://chding.es.ncku.edu.tw/collaborative_search/";
	});
	$('.page_btn').click(function(){    // 換頁
		$('html,body').animate( {scrollTop: '0px'}, 700 );
		var test1 = $(this).hasClass('page_btn_now');
		var test2 = $(this).hasClass('page_btn_next');
		var test3 = $(this).hasClass('page_btn_pre');
		if( !test1 ){
			$('.show_page_btn').children('input').removeClass('page_btn_now');
			$(this).addClass('page_btn_now');
			var k_page = $(this).attr('id');
			var k_word = localStorage.getItem('k_word');
			var viewport_width_now = localStorage.getItem( 'viewport_width' );
			if( test2 ){
				$('.page_btn_area1').css('display', 'none');
				$('.page_btn_6').addClass('page_btn_now');
				$('.page_btn_area2').show(300);
			}
			if( test3 ){
				$('.page_btn_area2').css('display', 'none');
				$('.page_btn_1').addClass('page_btn_now');
				$('.page_btn_area1').show(300);
			}
			$.ajax({         
				url: 'pageresult.php',         
				cache: false,         
				dataType: 'html',             
				type: 'POST',         
				data: { sendkeyword: k_word, sendviewportwidth: viewport_width_now, sendpage: k_page, },         
				error: function(xhr) {           
					alert('Ajax request 發生錯誤');         
				},         
				success: function(response){
					//alert("getsearchresult -> success");		
					$('#portfolio_wrapper1').css('display', 'none');
					$('#portfolio_wrapper2').css('display', 'block');
					document.getElementById('portfolio_wrapper2').innerHTML = response; 						
				}  				
			});
		}
	});
	
	$('#workspace_timeline_switcher').click(function(){    // 進入 timeline 介面
		$('.workspace_timeline_container').addClass('timeline_on');
		$('#delete_workspace').css('display', 'none');
		$('.workspace_container').css('display', 'none');
		$('#workspace_timeline_switcher').css('display', 'none');
		$('#workspace_workspace_switcher').css('display', 'block');
		$('#delete_workspace').css('display', 'block');
		$('.workspace_timeline_container').show(300);
	});
	$('#workspace_workspace_switcher').click(function(){    // 回到 workspace 介面
		$('.workspace_timeline_container').removeClass('timeline_on');
		$('#delete_workspace').css('display', 'none');
		$('.workspace_timeline_container').css('display', 'none');
		$('#workspace_workspace_switcher').css('display', 'none');
		$('#workspace_timeline_switcher').css('display', 'block');
		$('#delete_workspace').css('display', 'block');
		$('.workspace_container').show(300);
	});
	$('.comment_write_rating_stars').click(function(){
		$(this).css('background','no-repeat url(\' Image/rating_large_star_blue.png \')');
		$(this).prevAll().css('background','no-repeat url(\' Image/rating_large_star_blue.png \')');
		$(this).nextAll().css('background','no-repeat url(\' Image/rating_large_star.png \')');
		$(this).addClass('star');
		$(this).prevAll().addClass('star');
		$(this).nextAll().removeClass('star');
	});
		
	// 顯示目前 topic 和 group
	if ( localStorage.k_word )
		$('.showtopic_span').children('div').text( localStorage.k_word );
	else
		$('.showtopic_span').children('div').text( "軟體工程" );
	if ( localStorage.group_selected ) {
	    var id = localStorage.group_selected;     //console.log(id);    // 取得已選擇群組之ID 
	    var name = $('#'+id).children('a').html();
	    $('.showgroup_span').children('div').text( name );
	} else
	    $('.showgroup_span').children('div').text( "尚未選擇群組" );
    
    // 刪除可能存在的多餘資料
    var localStorageKeys = Object.keys(localStorage);
    var redundant = [];
    for (var i = 0; i < localStorageKeys.length; i++) {
        var test = localStorageKeys[i].substr(0, 2);
        if ( test == 'g1' || test == 'w1' )
            redundant.push( localStorageKeys[i] );
	}
	
	// 取得資料庫內的所有使用者名字
	$.post( "getNames.php" )
	.done( function(r){ var names = JSON.parse(r); localStorage.setItem("id_name", JSON.stringify(names));})
	.fail( function(e){ console.log(e)});
	
	$('.showtopic_span').click( function() {
	$('#searchprocess').remove()
	});
	
	$('#search_again_btn')
	.attr('placeholder', localStorage.k_word).attr('value', localStorage.k_word);
	
	function Group_Board_showMember(){
		if( localStorage.getItem('group_selected') == null ){
			$('#Group_Board_area').html('none');
		}else{
			var a = localStorage.getItem('group_selected');
			var b = $('#group_update_hideArea').find('[t_sid='+a+']');
			$('#Group_Board_area').html('');
			for( var i=1; i<=$(b).children('span').length; i++ ){
				$('#Group_Board_area').append( 
				'<img src="https://graph.facebook.com/'+$(b).children('span:nth-child('+i+')').attr('t_member')+'/picture" width="35px">');
			}
		}
	}
});
$(document).on('click','.nav_main_search',function() {
    $('#search_again_btn').focus().select();
});

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
	localStorage.setItem( 'viewport_width', viewportwidth );
	localStorage.setItem( 'viewport_height', viewportheight );
	//alert( "Your viewport 'width x height' is " + viewportwidth + "x" + viewportheight);
}

// 儲存點擊過的搜尋結果
$(document).on('click','.fancy_iframe', function() {
    var title = $(this).html();
    var content = $(this).parent().siblings('p').html();
    var url = this.href;
    var page_info = { 'title': title , 'url':url ,'content':content };
    localStorage.setItem("page_info", JSON.stringify( page_info ));
    localStorage.setItem("open", url);
    $.post( 'save.php', { sendtitle: title , sendcontent: content, sendurl: url, sendid: localStorage.FB_id, sendname: localStorage.FB_name, sendkeyword : localStorage.k_word , sendgid:localStorage.group_selected })
    .fail( function(xhr) { console.log(xhr) })
    .done( function(response) { console.log("page info saved") }); 
} );

function titlelink_back(){
	$('#wrapper').css('position', 'relative');
	$('#wrapper').css( {marginLeft:'',marginRight:''} );
	$("#timeline_wrapper").css( {marginLeft:'',marginRight:''} );
	$("#show_titlelink").css('display','none');
	document.getElementById('titlelink_wrapper').innerHTML = "<div id='loading'>"+"<img src='http://chding.es.ncku.edu.tw/collaborative_search/loading.gif'>網頁載入中，請稍候‧‧‧</div>";
	$('#titlelink_wrapper').removeClass('titlelink_wrapper_on');
}
var scroll_st = 0;
function setNav(){	// 偵測垂直滾軸位置來改變 #nav 的顯示
	var scroll_now = window.document.body.scrollTop;
	if( scroll_now > scroll_st ){
		scroll_st = scroll_now;
		$("#nav").hide();
		$("#timeline_show_update").css('top', 45);
		$("#Timeline_NotificationArea").css('top', 45);
	}
	if( scroll_now < scroll_st || scroll_now == 0 ){
		scroll_st = scroll_now;
		$("#nav").show(); 
		$("#timeline_show_update").css('top', 91);
		$("#Timeline_NotificationArea").css('top', 91);
	} 
	if( scroll_now != 0 )	$("#scroll-top-top").show(); 
		else	$("#scroll-top-top").hide();
	if( localStorage.getItem( 'on_time' ) == null ){
		 setusetime();
	}
}	
function back_homepage(){    // 回首頁
	window.top.location.href = " http://chding.es.ncku.edu.tw/collaborative_search/ ";
}
function setusetime(){    // 
	var d = new Date(); 
	var month = d.getMonth()+1; 
	var day = d.getDate(); 
	var hour = d.getHours(); 
	var minute = d.getMinutes(); 
	var second = d.getSeconds(); 
	var now_time = d.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + (hour<10 ? '0' : '') + hour + ':' + (minute<10 ? '0' : '') + minute + ':' + (second<10 ? '0' : '') + second;
	localStorage.setItem( 'on_time', now_time );
}
window.onbeforeunload = function() { 
	var d = new Date(); 
	var month = d.getMonth()+1; 
	var day = d.getDate(); 
	var hour = d.getHours(); 
	var minute = d.getMinutes(); 
	var second = d.getSeconds(); 
	var now_time = d.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + (hour<10 ? '0' : '') + hour + ':' + (minute<10 ? '0' : '') + minute + ':' + (second<10 ? '0' : '') + second;
	var on_time = localStorage.getItem( 'on_time' );
	if( on_time ){
		ontime_array = on_time.split("/");
		ontime_query_array = ontime_array[3].split(":");
		offtime_array = now_time.split("/");
		offtime_query_array = offtime_array[3].split(":");
		if( ontime_array[0] == offtime_array[0] && ontime_array[1] == offtime_array[1] && ontime_array[2] == offtime_array[2] && ontime_query_array[0] == offtime_query_array[0] ){
			var ontime_totle = parseInt(ontime_query_array[1])*60 + parseInt(ontime_query_array[2]);
			var offtime_totle = parseInt(offtime_query_array[1])*60 + parseInt(offtime_query_array[2]);
			var totle_time = offtime_totle - ontime_totle;
		}
		else{
			var totle_time = 3600;
		}
		localStorage.removeItem('on_time'); 
		var s_time = localStorage.getItem('s_time');
		$.ajax({      
			async:false,
			url: 'save_time.php',         
			cache: false,         
			dataType: 'html',             
			type: 'POST',    
			data: { time_value: totle_time, s_time_value: s_time, },		
			error: function(xhr) {           
				alert('Ajax request 發生錯誤: save_radio.php');         
			},         
			success: function(response){
			}     
		}); 
	}
}
function getsearchresult(){    // onLoad 時，抓 google 搜尋結果
	var k_word = localStorage.getItem('k_word');
	var viewport_width_now = localStorage.getItem( 'viewport_width' );
	if ( localStorage.group_selected ) {
	    var id = localStorage.group_selected;     //console.log(id);    // 取得已選擇群組之ID 
	    var name = $('#'+id).children('a').html();
		localStorage.setItem( 'groupid', localStorage.group_selected );
	    $('.showgroup_span').children('div').text( name );
	}else {
		var id=1;
	}
	var a = localStorage.getItem('FB_id');
	var check_initial = a+'***'+localStorage.getItem('FB_name');
	show_groups();
	setusetime();
	$.ajax({
		data : { 'FB_id': a,'remove_ID': 'none','check_Group': 'none','check_WFC': 'none','initial': check_initial },
		type : 'post',
		url : 'T_put.php',
		success : function(response){
			//console.log('Initial_T_savedata:'+response);
			$('body').addClass('Initial_T_savedata'); 
			localStorage.setItem('T_savedataTimeout', '');
			var setTimeID = window.setTimeout( function(){
				T_long_connect();
			}, 1000 );
			localStorage.setItem('T_savedataTimeout', setTimeID);
		}
	});
	Group_Board_showMember();
	$.ajax({         
		url: 'searchresult.php',         
		cache: false,         
		dataType: 'html',             
		type: 'POST',         
		data: { sendkeyword: k_word, sendviewportwidth: viewport_width_now, sendUserID: a, sendgroupid: id, },         
		error: function(xhr) {           
			alert('Ajax request 發生錯誤');         
		},         
		success: function(response){ console.log('searchresult_success');
			document.getElementById('portfolio_wrapper1').innerHTML = response; 
		}     
	});
}
//--------------edit by 英杰  畫圓
/*function writecircle(){
		var c=document.getElementById("myCanvas");
		var cxt=c.getContext("2d");
		cxt.fillStyle="#FF0000";
		cxt.beginPath();
		cxt.arc(100,100,80,0,Math.PI*2,true);
		cxt.closePath();
		cxt.fill();
		var text = "collaborative seacrh";
		cxt.fillStyle="#008000";
		cxt.font = "italic 10px serif";
		cxt.fillText(text, 50, 100);
}*/
function show2(){
		cxt.fillStyle="#FF0000";
		cxt.beginPath();
		cxt.arc(300,100,80,0,Math.PI*2,true);
		cxt.closePath();
		cxt.fill();
		var text = "1111 seacrh";
		cxt.fillStyle="#008000";
		cxt.font = "italic 10px serif";
		cxt.fillText(text, 270, 100);
		}

function get_new_member(){    // 確認新增的群組成員   
	$('.addgroup_wrapper').css('display', 'inline-block');
	$('.addgroup_friends_wrapper').css('display', 'none');
}
// 儲存(關鍵字＋時間)使用者當前搜尋階段
//---------------------------edited by 家誠
function searchsession() {    
	var k_word = localStorage.getItem('k_word');
    $.ajax({         
	    url: 'searchsession.php',         
    	cache: false,         
    	dataType: 'html',             
    	type: 'POST',         
    	data: { sendword: k_word, sendid: localStorage.getItem('FB_id'), sendname: localStorage.getItem('FB_name'), sendgid: localStorage.getItem('group_selected') },
    	error: function(xhr) {      console.log(xhr);     
    		console.log('Ajax request 發生錯誤: searchrsession.php');         
    	},         
    	success: function(response){ console.log(response);
			localStorage.setItem( 's_time', response );
		}     
    });  
}
//---------------------------edited by 家誠
function getcomment(){    // 抓取評論
    $.ajax({         
	    url: 'getcomment.php',         
    	cache: false,         
    	dataType: 'html',             
    	type: 'POST',         
    	data: { sendurl: localStorage.getItem('titleUrl')},         
    	error: function(xhr) {           
    		alert('Ajax request 發生錯誤: getcomment.php');         
    	},         
    	success: function(response){
			localStorage.setItem( 'savecomment', response );
			//alert(response); //接收getcomment.php回傳的所有評論
		}     
    });  
}
function getrating(){    // 抓取評分
    $.ajax({         
	    url: 'getrating.php',         
    	cache: false,         
    	dataType: 'html',             
    	type: 'POST',         
    	data: { sendurl: localStorage.getItem('titleUrl')},         
    	error: function(xhr) {           
    		alert('Ajax request 發生錯誤: getrating.php');         
    	},         
    	success: function(response){
			localStorage.setItem( 'saverating', response );
			//alert(response); //接收getrating.php回傳的所有評分
		}     
    });  
}
function comment_save(){    // 儲存評論
	var commentTxt = document.getElementById("comment_txt").value;
    $.ajax({         
	    url: 'comment_save.php',         
    	cache: false,         
    	dataType: 'html',             
    	type: 'POST',         
    	data: { comment: commentTxt, sendid: localStorage.getItem('FB_id') , sendurl: localStorage.getItem('titleUrl') },		
    	error: function(xhr) {           
    		alert('Ajax request 發生錯誤: comment_save.php');         
    	},         
    	success: function(response){
		}     
    });  
}
function save_radio(ratingvalue){    // 儲存評分
	//var ratingvalue = document.getElementById("rating").value;
    $.ajax({         
	    url: 'save_radio.php',         
    	cache: false,         
    	dataType: 'html',             
    	type: 'POST',         
    	data: { rating_value: ratingvalue, sendid: localStorage.getItem('FB_id') , sendurl: localStorage.getItem('titleUrl')},		
    	error: function(xhr) {           
    		alert('Ajax request 發生錯誤: save_radio.php');         
    	},         
    	success: function(response){
		}     
    });  
}
function search_again(){    // co_search 介面上再度搜尋
	var k_word = document.getElementById('search_again_btn').value;
	localStorage.setItem( 'k_word', k_word );
	var check_fblogin = localStorage.getItem('FB_id');
	if( !check_fblogin ){
		alert("請登入 Facebook ");
	}else{
		if( k_word == '' ){
			alert("請輸入關鍵字");
		}else{
			document.nav_select_search_form.action = "http://chding.es.ncku.edu.tw/collaborative_search/usersubmit.php"; 
			window.top.location.href = " http://chding.es.ncku.edu.tw/collaborative_search/co_search.html ";
		}
	}
}