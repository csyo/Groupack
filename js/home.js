$(function(){  // 瀏覽器窗口大小改變
	$(window).resize(function(){
		var a = $('#FeatureWrapper').hasClass('Feature_on');
		if( window.matchMedia('(max-width:600px)').matches ){  //手機
			if(a){
				$('.Feature_on').removeClass('Feature_on');
				$('#FeatureWrapper').css('bottom', '-220px');
				$('#slider_th').hide();
				$('#FeatureWrapper_btn').css('bottom', 0);
				$('#FeatureWrapper_btn > div.FeatureWrapper_btn_icon').removeClass('arrow_bottom');
			}
			$('#InputWrapper').css('bottom', '');
		}else if( window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches ){  //平板
			if(a){
				$('.Feature_on').removeClass('Feature_on');
				$('#FeatureWrapper').css('bottom', '-220px');
				$('#slider_th').hide();
				$('#FeatureWrapper_btn').css('bottom', 0);
				$('#FeatureWrapper_btn > div.FeatureWrapper_btn_icon').removeClass('arrow_bottom');
			}
			$('#InputWrapper').css('bottom', '');
		}else{  //電腦
			if(!a){
				$('#FeatureWrapper').addClass('Feature_on');
				$('#FeatureWrapper').css('bottom', 0);
				$('#slider_th').show();
				$('#FeatureWrapper_btn').css('bottom', 180);
				$('#InputWrapper').css('bottom', 220);
				$('#FeatureWrapper_btn > div.FeatureWrapper_btn_icon').addClass('arrow_bottom');
			}
		}
	});
});
$(document).on('click', '#InputWrapper div.InputUp_btn', function(){  // 點擊 搜尋
	var check_fbstatus = localStorage.getItem('FB_id');
	if( !check_fbstatus ){ 
		alert('請登入 Facebook');
	}else{ 
		$('#InputWrapper div.InputInlineContainerUp').animate( {marginLeft:'5000px',marginRight:'5000px'}, 'normal' ).hide();
		$('#InputWrapper div.InputInlineContainerDown').css('display', 'inline-block');
		$('#InputWrapper div.InputInlineContainerDown form').show(50);
	}
});
$(document).on('click', '#NavTutorial', function(){  // 點擊 tour
	window.location.href= 'TOUR/tour.html';
});
$(document).on('click', '#FeatureWrapper_btn > div.FeatureWrapper_btn_icon', function(){  // 點擊 guide 箭頭
	var a = $('#FeatureWrapper').hasClass('Feature_on');
	if( window.matchMedia('(max-width:600px)').matches ){  //手機
		if(a){
			$('.Feature_on').removeClass('Feature_on');
			$('#FeatureWrapper').css('bottom', '-220px');
			$('#slider_th').hide();
			$('#FeatureWrapper_btn').css('bottom', 0);
			$(this).removeClass('arrow_bottom');
		}else{
			$('#FeatureWrapper').addClass('Feature_on').css('bottom', 0);
			$('#slider_th').show();
			$('#FeatureWrapper_btn').css('bottom', 180);
			$(this).addClass('arrow_bottom');
		}
	}else if( window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches ){  //平板
		if(a){
			$('.Feature_on').removeClass('Feature_on');
			$('#FeatureWrapper').css('bottom', '-220px');
			$('#slider_th').hide();
			$('#FeatureWrapper_btn').css('bottom', 0);
			$(this).removeClass('arrow_bottom');
		}else{
			$('#FeatureWrapper').addClass('Feature_on').css('bottom', 0);
			$('#slider_th').show();
			$('#FeatureWrapper_btn').css('bottom', 180);
			$(this).addClass('arrow_bottom');
		}
	}else{  //電腦
		if(a){
			$('.Feature_on').removeClass('Feature_on');
			$('#FeatureWrapper').css('bottom', '-220px');
			$('#slider_th').hide();
			$('#FeatureWrapper_btn').css('bottom', 0);
			$('#InputWrapper').css('bottom', 46);
			$(this).removeClass('arrow_bottom');
		}else{
			$('#FeatureWrapper').addClass('Feature_on').css('bottom', 0);
			$('#slider_th').show();
			$('#FeatureWrapper_btn').css('bottom', 180);
			$('#InputWrapper').css('bottom', 220);
			$(this).addClass('arrow_bottom');
		}
	}
});
var AboutMode = 'closed', AboutTemp = false;
$(function(){  // 切換 nav
	$('#NavContact').click(function(){
		AboutTemp = true;
		if( AboutMode == 'opened' ){
			AboutMode = 'closed';
			$('#NavAbout').hide();
		}else if( AboutMode == 'closed' ){
			AboutMode = 'opened';
			$('#NavAbout').show();
		}
	});
	$('#NavAbout').click(function(){
		AboutTemp = true;
	});
	$(document).on('click', function(){  // 切換 nav
		if( AboutTemp ){
			AboutTemp = false;
		}else{
			AboutTemp = false;
			AboutMode = 'closed';
			$('#NavAbout').hide();
		}
	});
});
function Initial(){  // groupack 首頁 初始化
	localStorage.setItem('where', 'HomePage');
	$('#slider_container > .slider_container_area:nth-child(1)').addClass('_on');
	if( window.matchMedia('(max-width:600px)').matches ){  //手機
		$('#FeatureWrapper').css('bottom', '-220px');
		$('#slider_th').hide();
	}else if( window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches ){  //平板
		$('#FeatureWrapper').css('bottom', '-220px');
		$('#slider_th').hide();
	}else{  //電腦
		$('#FeatureWrapper').css('bottom', 0);
		$('#slider_th').show();
		$('#FeatureWrapper_btn > div.FeatureWrapper_btn_icon').addClass('arrow_bottom');
		$('#FeatureWrapper').addClass('Feature_on');
	}
}
function oplogin(){  // facebook api 初始化
	FB.init({ appId: window.location.host === 'localhost' ? '282881761865946' : '520695818049915', status: true, cookie: true, xfbml: true });
	// appid請去FB申請應用程式
	fbstatus();
	$('#InputWrapper').show();
	// 設定 瀏覽器窗口大小
	$.viewport.set();
}
function fblogin(){  // facebook 登入
    FB.login(function(response){
        if (response.authResponse){  // 登入成功
			/*var access_token =   FB.getAuthResponse()['accessToken'];
			console.log('Access Token = '+ access_token);*/
			localStorage.setItem( 'FB_Access_Token', response.authResponse.accessToken );
			console.log( response.authResponse );
			console.log( response.authResponse.userID );
            FB.api('/me', function(response){
				getFriends();
				console.log( response );
				localStorage.setItem( 'FB_api', JSON.stringify(response));  
				localStorage.setItem( 'FB_id',  response.id );
				localStorage.setItem( 'FB_name', response.name );
				localStorage.setItem( 'FB_messages', response.username + '@facebook.com'); 
				localStorage.setItem( 'FB_main_email', response.email );
				localStorage.setItem( 'FB_userURL', response.link);
				//get_fb_info();
				fbstatus();
            });
        }
        else{  // 登入失敗
            alert('登入失敗。');
        }
    },{
		scope: 'email, user_about_me, friends_about_me, read_mailbox, xmpp_login, publish_stream, read_stream'
	});
}
function fblogout(){  // facebook 登出
    FB.getLoginStatus(function(response){
        if(response.status === 'connected'){
            FB.logout(function(response){  // user is now logged out
				alert('成功登出。');
            });
        }
		else if(response.status === 'not_authorized'){    // the user is logged in to Facebook, but has not authenticated your app
            FB.logout(function(response){  // user is now logged out
                alert("您的授權碼已過期，請重新登入！");
            });
        }
		else{  // the user isn't logged in to Facebook.
            alert('您尚未登入Facebook，請重新登入！');
        }
		localStorage.clear();
		location.replace('home.html');
    });
}
function getFriends(){  // get facebook friends
	FB.api('/me/friends', function(response){
		var Arr=new Array();
		if(response.data){
			var html = '<table id="friendTable" >';
			$.each(response.data,function(index,friend) {
            html += ('<tr>' + '<th>' + friend.id + '</th>' + '<td id="' + friend.id + '">' + friend.name + '</td>' + '</tr>');
			});
			$('#friends_title').css('display','block');
			document.getElementById('friends').innerHTML = html + '</table>';
			var friends_counter = document.getElementById('friendTable').rows.length;
			var friends_ary = new Array();  // friends_ary == FB朋友的二維陣列[id][name]
			for( var x = 0; x < friends_counter; x++ ){
				var test = document.getElementById('friendTable').rows[x].cells;
				friends_ary[x] = new Array();
				friends_ary[x][0] = test[0].innerHTML;
				friends_ary[x][1] = test[1].innerHTML;
			}
			var friends_json = JSON.stringify( friends_ary );  // friends_json == FB朋友的二維陣列的json格式
			localStorage.setItem( 'FB_friends', friends_json );
		}
		else{
			alert('Error!');
		}
	});
}
function fbstatus(){  // 顯示 facebook 登入/登出 按鈕
	var check_fbstatus = localStorage.FB_id;
    if( !check_fbstatus ){ 
        $('#NavFacebook').attr('title', 'Login').nextAll('div').text('Login');
    }else{ 
        $('#NavFacebook').attr('title', 'Logout').nextAll('div').text('Logout');
		$('#InputWrapper div.InputInlineContainerUp').animate( {marginLeft:'5000px',marginRight:'5000px'}, 'normal' ).hide();
		$('#InputWrapper div.InputInlineContainerDown').css('display', 'inline-block');
		$('#InputWrapper div.InputInlineContainerDown form').show(50);
    } 
}
function AfterSwiping(){  // 左右滑動 guide
	var _nth = $('#slider_container').attr('_index');
	$('#slider_th').text(_nth);
	switch( _nth ){
		case '1': 
			$('#swipe_prev').hide();
			$('._on').removeClass('_on');
			$('#slider_container > .slider_container_area:nth-child('+_nth+')').addClass('_on');
			break;
		default:	
			$('#swipe_prev').show();
			$('._on').removeClass('_on');
			$('#slider_container > .slider_container_area:nth-child('+_nth+')').addClass('_on');
			if( _nth == '9' )  $('#swipe_next').hide();
				else  $('#swipe_next').show();
			break;
	}
}
function TopicSubmit(){  // 登入 facebook 才可以使用： 搜尋
	var k_word = document.getElementById('InputDown_btn1').value;
	localStorage.setItem( 'k_word', k_word );
	var check_fblogin = localStorage.FB_id;
	if( !check_fblogin ){
		alert('請登入 Facebook');
	}else{
		if( k_word == '' ){
			alert('請輸入 Topic');
		}else{
			document.TopicForm.action = 'usersubmit.php'; 
			window.top.location.href = 'index.html';
		}
	}
}
function Facebook_btn(){  // 登入/登出 facebook
	var a = $('#NavFacebook').attr('title');
	if( a === 'Login'){
		fblogin();
	}else if( a === 'Logout'){
		fblogout();
	}
}