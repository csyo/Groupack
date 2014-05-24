$(function(e) {
   getSearchResult();
   CheckGroupBoard();
   logSession(localStorage.group_selected);
   refreshGroupData();
});

window.onload = function () {
   Group_Board_showMember();
};

function logSession(groupID, logid) {
   if (logid) {
      console.log("session end.");
      $.post('db/SessionLog.php', {
         id: localStorage.FB_id,
         keyword: localStorage.k_word,
         gid: groupID,
         logid: logid,
      })
      .done(function(r) {
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
	if (window.matchMedia('(max-width:600px)').matches) { // 手機
		$('#Group_Board').css('width', 200);
	} else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { // 平板
		$('#Group_Board').css('width', 320);
	} else { // 電腦
		$('#Group_Board').css('width', 480);
	}
});
$(function(e) {
   // click on the group info board
   $('#Group_Board div.Group_Board_header').click(function(e) {
      if (e.target.id === 'leave-group') return;
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
	  var _nav = $(this).attr('_nav'), $nav = $(this).parents('#nav');
     switch (_nav) {
      case 'TopicMap':
   		GoToTopicMap();
         break;
      case 'SearchProcess':
   		GoToSearchProcess();
         break;
      case 'Folder':
   		showAllFolders(function(){
   			 $('#folder-box').show();
   			 $('body').css('overflow', 'hidden');
         });
         break;
      case 'Group':
   	   $('#group-box').show();
         $('body').css('overflow', 'hidden');
         getAllGroup();
         break;
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
   // page change
   $('input.page_btn').click(function() {
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
         getSearchResult($(this).attr('id'));
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
		if( !$(this).val().trim() ) alertify.alert('請輸入搜尋內容');
      else {
   		localStorage.setItem( 'k_word', $(this).val().trim() );
   		getSearchResult();
      }
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
function getSearchResult(page, keyword) {
   var self = getSearchResult, api, index,
      groupID = localStorage.group_selected;

   keyword = keyword || localStorage.k_word;
   page = page || 1;
   index = (page-1) * 10 + 1 || 1;
   api = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyA2oggXqL26GRI09JFM4Gt0BULRjmC4Xwk&cx=013036536707430787589:_pqjad5hr1a&q='+ keyword +'&googlehost=google.com.tw&alt=json&start='+ index +'&fields=items(title,link,snippet)';

   // loading alert
   $('#preloader').find('span').text('請稍後...').end().removeClass('dom_hidden');

   $.getJSON(api, function(data){
      var items = [];
      if (!data) return;

      data.items.forEach( function(item) {
         items.push( self.template(item) );
      });
      $('#portfolio_wrapper1').html( items.join('') );

      self.after(data, keyword);
   }).fail(function(e){
      console.log(e.responseText);
      self.backupApi(keyword, page);
   });
   $('#Group_Board').show();
}
getSearchResult.after = function (data, keyword) {
   localStorage.setItem('Page1_session', data);
   get_topic_relevance();
   anonymousRecommand.getRecommandGroupID();
   anonymousRecommand.getGroupRecommend();
   $('#recommand_area').removeClass('dom_hidden'); 
   $('#Rslider').css( "height", $('#recommand_area').height()-30 );
   $('#under-footer').removeClass('dom_hidden').attr('style', '');
   $('#preloader').addClass('dom_hidden');
   $('#showtopic').children('div.showtopic_span').children().text( keyword );
   if (!localStorage.group_selected) $('#wrapper').find('div.search_result_inf_field_content').addClass('dom_hidden');
}
/**
 * @param {Object} data = { url: ... , title: ... , content: ... } 
 */
getSearchResult.template = function (data) {
   if (!data) throw Error('Nothing has passed!');
   return ''+
   '<div class="four columns portfolio-item isotope-item _search_result">\
      <div class="search_result_inf" title="選項選單"></div>\
      <div class="search_result_inf_field">\
         <div class="search_result_inf_field_content" title="群組共享">\
            <div class="post_group">&nbsp;</div>\
            <div class="post_group_text">群組共享</div>\
         </div>\
         <div class="search_result_inf_field_content" title="分享">\
            <div class="post_share">&nbsp;</div>\
            <div class="post_share_text">分享</div>\
         </div>\
      </div>\
      <div class="picture">\
         <a class="co_a fancy_iframe" href="'+ data.link +'" target="_self" >\
            <div class="search_result_overlay image-overlay-link" style="opacity: 0; display: block;"></div>\
         </a>\
         <div class="item-description alt">\
            <h2 class="co_h2"><a class="co_a fancy_iframe" href="'+ data.link +'" target="_blank" >'+ data.title +'</a></h2>\
            <p>'+ data.snippet +'</p>\
            <div class="post_url"><span>'+ data.link.substr(data.link.search('://')+3) +'</span></div>\
         </div>\
      </div>\
   </div>';
}

getSearchResult.backupApi = function (keyword, page){
   console.log('Using deprecated search API');
   index = (page-1) * 8 + 1 || 0;
   var api = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q='+ keyword +'&rsz=8&start='+ index +'&gl=tw&callback=?';
   $.getJSON(api, function(data){
      var items = [];

      data.responseData.results.forEach( function(item) {
         var obj = {};
         obj.link = item.url;
         obj.snippet = item.content;
         obj.title = item.title;
         items.push( getSearchResult.template(obj) );
      });
      $('#portfolio_wrapper1').html( items.join('') );
      getSearchResult.after(data, keyword);
   });
}

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
		window.top.location.href = './TopicMap/topic_map.html';
	}
}

function GoToSearchProcess(){ // 顯示 SearchProcess 介面
	var a = localStorage.group_selected || null;
	if (a == null || a == '') {
		alertify.alert('請先選擇群組');
	} else {
		window.top.location.href = './SearchProcess/searchprocess.html';
	}
}
var anonymousRecommand = {
   recommandGID: { gid: 'g1389378895207' }//Default: Team Groupack
};

anonymousRecommand.getGroupRecommend = function(){
	$.post('db/AnonymousRecommand.php', { sentgroupid: this.recommandGID.gid  })         
		.fail(function(xhr){           
   		console.log(xhr.responseText);         
		})        
		.success(function(response){ 
				var recommand_data = JSON.parse(response);
				console.log(recommand_data);
				for(var i=0; i<3; i++){
					$('#recommand_result_title:nth-child(1)')[i].innerHTML = recommand_data[i].title;
					$('#recommand_result_content:nth-child(2)')[i].innerHTML = recommand_data[i].summary;
					$('#recommand_result_url:nth-child(3)')[i].innerHTML = recommand_data[i].url;
				}
		});
}
anonymousRecommand.getRecommandGroupID = function(){
	$.post('db/RecommandGroupID.php', { sentgroupid: localStorage.group_selected || '', sentid: localStorage.FB_id  })         
		.fail(function(xhr){           
         console.log(xhr.responseText);         
		})       
		.success(function(response){ 
				//change the DOM innerHTML
				this.recommandGID = JSON.parse(response);
				$('#recommand_title').text("來自群組「"+this.recommandGID.gname+"」的推薦");
		}.bind(this));
}
