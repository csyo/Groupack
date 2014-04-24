$(function(e) {
   // 測試視窗大小
   $('.testdevice').hide();
   // // 使用者資料儲存
   // if ( getName(localStorage.FB_id) === '-------' )
   // 	save_user();
   getsearchresult();
   testdevice();
   CheckGroupBoard();
   show_groups();
   logSession(localStorage.group_selected);
});

window.onload = function () {
   Group_Board_showMember();
};

function logSession(groupID, logid) {
   if (logid) {
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
      }).done(function(r) {
         console.log(r);
      });
   } else if (groupID){
      console.log("session start.");
      $.post('db/SessionLog.php', {
         id: localStorage.FB_id,
         keyword: localStorage.k_word,
         gid: groupID
      }).done(function(r) {
         console.log(r);
         sessionStorage.setItem("logid", r);
      });
   } else { // Not selecting any group
      console.log('individual search sesssion.');
      $.post('db/SessionLog.php', {
         id: localStorage.FB_id,
         name: localStorage.FB_name,
         keyword: localStorage.k_word,
      }).done(function(r) {
         console.log(r);
         sessionStorage.setItem("logid", r);
      });
   }
}
$(window).resize(function() { // 視窗改變時觸發
	testdevice();
	if (window.matchMedia('(max-width:600px)').matches) { // 手機
		$('#Group_Board').css('width', 200);
	} else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { // 平板
		$('#Group_Board').css('width', 320);
	} else { // 電腦
		$('#Group_Board').css('width', 480);
	}
});
$(function(e) {
   $('#Group_Board > div.Group_Board_header > a').click(function() { // 點擊 群組成員中心的大頭貼
      if (!$('#Group_Board').hasClass('Group_Board_on')) {
         $('#Group_Board').addClass('Group_Board_on');
         $('#Group_Board_area').removeClass('dom_hidden').attr('style', '').parent().removeClass('dom_hidden').attr('style', '');
         $('#Group_Board .Group_Board_arrow').addClass('Group_Board_arrow_bottom');
      } else {
         $('#Group_Board_area').addClass('dom_hidden').parent().addClass('dom_hidden');
         $('#Group_Board .Group_Board_arrow').removeClass('Group_Board_arrow_bottom');
         $('.Group_Board_on').removeClass('Group_Board_on');
      }
   });

   $('body').click(function() {
      if ($('.search_result_read').hasClass('search_result_read_on')) {
         $('.search_result_read').css('opacity', '1');
         $('.search_result_read_on').removeClass('search_result_read_on').next().hide();
         $('.four').css('z-index', '2');
      }
      if ($('.search_result_inf').hasClass('search_result_inf_on')) {
         $('.search_result_inf_on').removeClass('search_result_inf_on').next().hide();
         $('.four').css('z-index', '2');
      }
   });
   $('#scroll-top-top').click(function() { // 移到頁面頂部
      $('html, body').animate({
         scrollTop: '0px'
      }, 400);
   });
   $('#nav > ul.navigation > li').click(function(e) { // nav選單 顯示與變色
	  var _nav = $(this).attr('_nav'), $a = $(this).parents('#nav');
	  if( _nav === 'TopicMap' ){
		GoToTopicMap();
		return false;
	  }
	  if( _nav === 'SearchProcess' ){
		GoToSearchProcess();
		return false;
	  }
	  if( _nav === 'Folder' ){
		showAllFolders(function(){
			 $('#folder-box').show();
			 $('body').css('overflow', 'hidden');
		  });
		return false;
	  }
	  $('#group-box').show();
      $('body').css('overflow', 'hidden');
	  return false;
	  if( !$a.hasClass('li_on') ){
		$a.addClass('li_on');
		$(this).children('div.nav_main').children('a:first').css({
		   'color': '#666',
		   'background': 'rgb(55, 116, 235)'
		}).end().siblings('#addMember').removeClass('dom_hidden');
	  } else {
		$a.removeClass('li_on').find('ul.navigation > li > div.nav_main').children('a').css({
            'color': '#FFF',
            'background': '#222'
         }).end().siblings('#addMember').addClass('dom_hidden');
	  }
   });
   $('#fiexd-header, #wrapper, #myWorkspace').click(function() { // 點擊 #fiexd-header, #wrapper, #myWorkspace 隱藏 nav
      if ($('#nav').hasClass('li_on')) {
         $('#nav').removeClass('li_on').find('ul.navigation > li > div.nav_main').children('a').css({
            'color': '#FFF',
            'background': '#222'
         }).end().siblings('#addMember').addClass('dom_hidden');
      }
   });
   $('input.page_btn').click(function() { // 換頁
      $('#scroll-top-top').trigger('click');
      $('#preloader').find('span').text('請稍後...').end().removeClass('dom_hidden');
      if (!$(this).hasClass('page_btn_now')) {
         $('.show_page_btn').children('input').removeClass('page_btn_now');
         $(this).addClass('page_btn_now');
         var k_page = $(this).attr('id'),
            k_word = localStorage.k_word,
            viewport_width_now = localStorage.viewport_width;
         if ($(this).hasClass('page_btn_next')) {
            $('div.page_btn_area1').addClass('dom_hidden');
            $('input.page_btn_6').addClass('page_btn_now');
            $('div.page_btn_area2').removeClass('dom_hidden');

         }
         if ($(this).hasClass('page_btn_pre')) {
            $('div.page_btn_area2').addClass('dom_hidden');
            $('input.page_btn_1').addClass('page_btn_now');
            $('div.page_btn_area1').removeClass('dom_hidden');
         }
		var groupID = localStorage.group_selected || 1;
         $.ajax({
            url: 'db/searchresult.php',
            cache: false,
            dataType: 'html',
            type: 'POST',
            data: {
               sendkeyword: k_word,
               sendviewportwidth: viewport_width_now,
               sendpage: k_page,
               sendUserID: localStorage.FB_id,
               sendgroupid: groupID
            },
            error: function(xhr) {
               console.log(xhr.responseText);
            },
            success: function(res) {
               document.getElementById('portfolio_wrapper1').innerHTML = res;
               $('#preloader').addClass('dom_hidden');
            }
         });
      }
   });
});
$(function(e) {
   // 顯示目前 topic
   if (localStorage.k_word) {
      $('div.showtopic_span > div').text(localStorage.k_word);
   } else {
      $('div.showtopic_span > div').empty();
   }

   $('#search_again_btn').attr('placeholder', localStorage.k_word).attr('value', localStorage.k_word);
});

function ShowUserInfo(a, b) {
   $('#show_fbname').text(b).prev().children().attr('src', 'https://graph.facebook.com/' + a + '/picture').end().prev().attr('title', b).attr('href', localStorage.FB_userURL);
}
$(document).on('click', 'div.nav_main_search', function(e) {
   $('#search_again_btn').focus().select();
});
$(document).on('click', '#folder-box_leave', function(e) {  // 離開 folder 介面
	$('#folder-box').hide();
	$('body').css('overflow', '');
});
//facebook 分享
$(document).on('click', 'div.search_result_inf_field > div.search_result_inf_field_content:nth-child(3)', {
   mode: 's'
}, FeedToFacebook);
$(document).on('click', 'div.workspace_cards_content_inf_field > div.workspace_cards_content_inf_field_content:nth-child(3)', {
   mode: 'w'
}, FeedToFacebook);
$(document).on('click', 'div.tag_content_inf_field > div.tag_content_inf_field_content:nth-child(3)', {
   mode: 't'
}, FeedToFacebook);
$(document).on('click', 'div.search_result_inf', function() { // 顯示 search result 卡片中的選項選單
   var test_search_result_inf_on = $(this).hasClass('search_result_inf_on');
   if (!test_search_result_inf_on) {
      $(this).addClass('search_result_inf_on');
      $(this).parent('.four').css('z-index', '10');
      $(this).next('.search_result_inf_field').show();
   } else {
      $('.search_result_inf_on').next('.search_result_inf_field').hide();
      $('.search_result_inf_on').removeClass('search_result_inf_on');
      $('.four').css('z-index', '2');
   }
   var title = $(this).siblings('.picture').find('h2 a').html();
   var content = $('.search_result_inf').siblings('.picture').find('p').html();
   var url = $(this).siblings('.picture').children('a').attr('href');
   var page_info = {
      'title': title,
      'content': content,
      'url': url
   };
   localStorage.setItem("page_info", JSON.stringify(page_info));
});

$(document).on('click', '#fiexd-header div.leave', function() { // 離開 再次搜尋介面
	$(this).parent().hide();
});

$(document).on('click', '#search-again-btn', function() { // 顯示 再次搜尋介面
	$(this).parents('#headNav').siblings('div.search-again').show().find('#search-box').focus();
});

$(document).on('keydown', '#search-box', function(e){  // 再次搜尋時
	if( $(this).is(':focus') && (e.keyCode == 13) ){
		if( $(this).val().trim() === '' ){ alertify.alert('請輸入搜尋內容'); return false; }
			localStorage.setItem( 'k_word', $(this).val().trim() );
			getsearchresult();
	}
});

$(document).on('click', '#logout', function() { // 登出
	alertify.confirm('確定要登出 Groupack 嗎？', function (e) {
      if (e) {
   		localStorage.clear();
   		alertify.alert('成功登出');
   		window.top.location.href = 'home.html';
   		ShowUserInfo(localStorage.FB_id, localStorage.FB_name);
   	}
   });
});

$(document).on('click', 'div.search_result_read', function() { // 顯示 類似關鍵字推薦
   if (!$(this).hasClass('search_result_read_on')) {
      if ($(this).children('div').text() > 0) {
         $(this).addClass('search_result_read_on').css('opacity', '0.7').parent('.four').css('z-index', '10').end().next().show();
      }
   } else {
      $('div.search_result_read_on').next().hide().end().removeClass('search_result_read_on');
   }
});
// 儲存點擊過的搜尋結果
$(document).on('click', '#portfolio_wrapper1 a.fancy_iframe', function() {
   var title = this.text,
      content = $(this).parent().siblings('p').text(),
      url = this.href,
      page_info = {
         'title': title,
         'url': url,
         'content': content
      };
   if (localStorage.where == 'titlelink_a') {
      localStorage.setItem('where', 'titlelink_aa');
   } else {
      localStorage.setItem('where', 'titlelink_a');
   }
   localStorage.setItem('page_info', JSON.stringify(page_info));
   localStorage.setItem('open', url);

   if (sessionStorage.logid) {
      page_info.sid = sessionStorage.logid;
   }
   $.post('db/save.php', page_info)
      .fail(function(xhr) {
         console.log(xhr)
      })
      .done(function(r) {
         console.log('page info saved:\n' + r);
      });
   $(document).on('click', SetPage);
});

function testdevice() { // 測試瀏覽器大小
   var a = $.viewport.set();
   $('#addMember').css('max-height', parseInt(a.split(',')[1]) - 91 + 'px');
}

function SetPage() { // 設定當前頁面在哪
   if (localStorage.where == 'titlelink_aa') {
      localStorage.setItem('where', 'titlelink_a');
   } else {
      localStorage.setItem('where', 'IndexPage');
      $(document).off('click', SetPage);
   }
}

function back_homepage() { // 回首頁
   window.top.location.href = './home.html';
}

// session end

function sessionEnd() {
   logSession(localStorage.group_selected, sessionStorage.logid || '0');
}

// end session before reload
window.onbeforeunload = function() {
   sessionEnd();
};

// fetch search result
function getsearchresult() {
   $('#preloader').find('span').text('請稍後...').end().removeClass('dom_hidden');
   var k_word = localStorage.k_word,
      viewport_width_now = localStorage.viewport_width;

   var group = localStorage.group_selected || 1;

   if (localStorage.where == 'HomePage' || localStorage.where == 'IndexPage') {
      localStorage.setItem('where', 'IndexPage');
      $.ajax({
         url: 'db/searchresult.php',
         cache: false,
         dataType: 'html',
         type: 'POST',
         data: {
            sendkeyword: k_word,
            sendviewportwidth: viewport_width_now,
            sendUserID: localStorage.FB_id,
            sendgroupid: group
         },
         error: function(xhr) {
            console.log(xhr.responseText);
         },
         success: function(response) { //console.log('->searchresult_success');
            localStorage.setItem('Page1_session', response);
            document.getElementById('portfolio_wrapper1').innerHTML = response;
            get_topic_relevance(); //edit by chenchenbox
            $('#under-footer').removeClass('dom_hidden').attr('style', '');
            $('#preloader').addClass('dom_hidden');
			$('#showtopic').children('div.showtopic_span').children().text( k_word );
            if (!localStorage.group_selected) $('#wrapper').find('div.search_result_inf_field_content').addClass('dom_hidden');
         }
      });
   } else {
      localStorage.setItem('where', 'IndexPage');
      document.getElementById('portfolio_wrapper1').innerHTML = '<div id="loading">' +
         '<img src="Image/loading.gif">網頁載入中，請稍候‧‧‧' +
         '</div>';
      if (localStorage.Page1_session != '') {
         get_topic_relevance(); //edit by chenchenbox
         document.getElementById('portfolio_wrapper1').innerHTML = localStorage.Page1_session;
         $('#preloader').addClass('dom_hidden');
      } else {
         $.ajax({
            url: 'db/searchresult.php',
            cache: false,
            dataType: 'html',
            type: 'POST',
            data: {
               sendkeyword: k_word,
               sendviewportwidth: viewport_width_now,
               sendUserID: localStorage.FB_id,
               sendgroupid: group
            },
            error: function(xhr) {
               console.log(xhr.responseText);
            },
            success: function(response) { //console.log('->searchresult_success');
               localStorage.setItem('Page1_session', response);
               document.getElementById('portfolio_wrapper1').innerHTML = response;
               get_topic_relevance(); //edit by chenchenbox
               $('#under-footer').removeClass('dom_hidden');
               $('#preloader').addClass('dom_hidden');
			   $('#showtopic').children('div.showtopic_span').children().text( k_word );
               if (!localStorage.group_selected) $('#wrapper').find('div.search_result_inf_field_content').addClass('dom_hidden');
            }
         });
      }
   }
   $('#Group_Board').show();
}

function search_again() {
   var k_word = document.getElementById('search_again_btn').value;
   localStorage.setItem('k_word_old', localStorage.k_word);
   localStorage.setItem('k_word', k_word);
   if (!localStorage.FB_id) {
      alertify.alert("請登入 Facebook ");
   } else {
      if (k_word == '') {
         alertify.alert("請輸入關鍵字");
      } else {
         document.nav_select_search_form.action = 'usersubmit.php';
         window.top.location.href = 'index.html';
      }
   }
}
$("#search_again_form").submit(function(e) {
   e.preventDefault();
   search_again();
});

function CheckGroupBoard() {
   if (window.matchMedia('(max-width:600px)').matches) { //手機
      $('#Group_Board').css('width', 160);
   } else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
      $('#Group_Board').css('width', 320);
   } else { //電腦
      $('#Group_Board').css('width', 480);
   }
}

function get_new_member() { // 確認新增的群組成員   
   $('.addgroup_wrapper').css('display', 'inline-block');
   $('.addgroup_friends_wrapper').css('display', 'none');
}

function FBInitial() { // 初始化 facebook api
   FB.init({
      appId: window.location.host === 'localhost' ? '282881761865946' : '520695818049915',
      status: true,
      cookie: true,
      xfbml: true
   });
}

function FeedToFacebook(event) { // 分享到 facebook
   console.log(event.data.mode);
   switch (event.data.mode) {
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
      app_id: '520695818049915',
      method: 'send',
      name: 'Groupack',
      link: myURL
   }, function(response) {
      if (response.success) {
         var update_notify = '<div class="Timeline_NotificationArea_origin isotope">' +
            '<div class="Timeline_NotificationArea_origin_content">' +
            '<span>Sharing...</span>' +
            '</div>' +
            '</div>' +
            '<div class="Timeline_Notification isotope">' +
            '<div class="Timeline_Notification_icon">' +
            '<img src="Image/share_gray.png" width="20px" style="margin: 5px;">' +
            '</div>' +
            '<div class="Timeline_Notification_event">' +
            '<p>分享成功。</p>' +
            '</div>' +
            '</div>';
      } else {
         var update_notify = '<div class="Timeline_NotificationArea_origin isotope">' +
            '<div class="Timeline_NotificationArea_origin_content">' +
            '<span>Sharing...</span>' +
            '</div>' +
            '</div>' +
            '<div class="Timeline_Notification isotope">' +
            '<div class="Timeline_Notification_icon">' +
            '<img src="Image/share_gray.png" width="20px" style="margin: 5px;">' +
            '</div>' +
            '<div class="Timeline_Notification_event">' +
            '<p>分享失敗。</p>' +
            '</div>' +
            '</div>';
      }
      if ($('#Timeline_NotificationArea').css('display') == 'none') {
         $('#Timeline_NotificationArea').html(update_notify).show().delay(3300).hide(200);
      } else {
         $('#Timeline_NotificationArea').delay(3000).html(update_notify).show().delay(3300).hide(200);
      }
   });
}

function GoToTopicMap(){ // 顯示 topicmap 介面
	var a = localStorage.group_selected || null;
	if (a == null || a == '') {
		alertify.alert('請先選擇群組');
	} else if (sessionStorage.getItem('topic_relevance_for' + a) == null) {
		alertify.alert('關聯性尚未計算完成,請過1~2分鐘後再進入Topic map');
	} else if (sessionStorage.getItem('topic_relevance_for' + a) == "[] ") {
		alertify.alert('目前搜尋的關鍵字經過計算都沒有關聯!');
	} else {
		localStorage.setItem('where', 'slider_a');
		window.top.location.href = './TopicMap/topic_map.html';
	}
}

function GoToSearchProcess(){ // 顯示 SearchProcess 介面
	var a = localStorage.group_selected || null;
	if (a == null || a == '') {
		alertify.alert('請先選擇群組');
	} else {
		localStorage.setItem('where', 'slider_a');
		window.top.location.href = './SearchProcess/searchprocess.html';
	}
}