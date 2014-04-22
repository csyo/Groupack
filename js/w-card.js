$(function () {
	// 關閉 Card 選項選單
	$('body').on('click', function () {
		if ($('#inline_workspace_cards div.workspace_cards_content_inf').hasClass('workspace_cards_content_inf_on')) {
			$('#inline_workspace_cards div.workspace_cards_content_inf_on').removeClass('workspace_cards_content_inf_on').next().hide();
			$('#inline_workspace_cards div.workspace_cards_position').css('z-index', '2');
		}
	});

});

// 顯示 Card 選項選單
$(document).on('click', '#inline_workspace_cards div.workspace_cards_content_inf', function () {
	($(this).parents('div.workspace_cards_position').find('div.workspace_cards_content_user_name').attr('fbid') == localStorage.FB_id) ? $(this).siblings('div.workspace_cards_content_inf_field').find('div:nth-child(4)').show() : $(this).siblings('div.workspace_cards_content_inf_field').find('div:nth-child(4)').hide();
	if (!$(this).hasClass('workspace_cards_content_inf_on')) {
		$(this).addClass('workspace_cards_content_inf_on').parents('div.workspace_cards_position').css('z-index', '10').end().next().show();
		// 暫存工作空間卡片資訊
		var info = $(this).siblings('.workspace_picture');
		var title = $(info).find('.click_workspace_cards').text();
		var url = $(info).find('.click_workspace_cards').attr('href');
		var content = $(info).find('p').text();
		var cid = $(this).parents('div.workspace_cards_position').attr('sid');
		info = {
			title: title,
			url: url,
			content: content
		};
		if (cid) info.cid = cid;
		localStorage.setItem('page_info', JSON.stringify(info));
	} else {
		$('#inline_workspace_cards div.workspace_cards_content_inf_on').removeClass('workspace_cards_content_inf_on').next().hide();
		$('#inline_workspace_cards div.workspace_cards_position').css('z-index', '2');
	}
});

// 修改 Card 介面: 確定刪除 Card
$(document).on('click', '#inline_workspace_cards_position_modifycard div.inline_modifycard_wrapper_delect > input', function () {
	$('#cards_area_leave').removeClass('checkModified');
	var sid = $('div.show_modifycard_ready').parents('div.workspace_cards_position').attr('sid');
	$('[sid=' + sid + ']').remove();
	$.colorbox.close();
	$('#inline_modifycard_wrapper_comment').val('');
	$('#inline_modifycard_wrapper_name').val('');
	$('#inline_modifycard_wrapper_url').val('');
	sid = '';
});

// 顯示介面: 新增 Card
function show_addcard(that) {
	var box_width, box_height,
		folderID = $(that).parents('div.workspace_four_column').attr('id');
	localStorage.setItem('folder_selected', folderID );
	if (window.matchMedia('(max-width:600px)').matches) { //手機
		 box_width = '95%';
		 box_height = '90%';
	} else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
		 box_width = '80%';
		 box_height = '80%';
	} else { //電腦
		 box_width = '70%';
		 box_height = '70%';
	}
	$('a.addcard').colorbox({ // click card adding with color-inline
		inline: true,
		fixed: true,
		width: box_width,
		height: box_height,
		reposition: true,
		transition: 'none',
		title: false,
		onComplete: function () {
			$('body').addClass('my_add_card_on').addClass('workspace_resize_on');
		},
		onClosed: function () {
			$('body').removeClass('my_add_card_on').removeClass('workspace_resize_on');
			$('div.show_addcard_ready').removeClass('show_addcard_ready');
		}
	});
}

// 顯示介面: 修改 Card
function show_modifycard() {
	var box_width, box_height;
	if (window.matchMedia('(max-width:600px)').matches) { //手機
		 box_width = '95%';
		 box_height = '90%';
	} else if (window.matchMedia('(min-width: 601px) and (max-width: 980px)').matches) { //平板
		 box_width = '80%';
		 box_height = '80%';
	} else { //電腦
		 box_width = '70%';
		 box_height = '70%';
	}
	$('a.modifycard').colorbox({
		inline: true,
		fixed: true,
		width: box_width,
		height: box_height,
		reposition: true,
		transition: 'none',
		title: false,
		onComplete: function () {
			$('body').addClass('my_modifycard_on').addClass('workspace_resize_on');
			var $a = $('div.show_modifycard_ready').nextAll('div.workspace_picture');
			$('#inline_modifycard_wrapper_comment').val($a.find('p').text());
			$('#inline_modifycard_wrapper_name').val($a.find('h2 > a').text());
			$('#inline_modifycard_wrapper_url').val($a.find('h2 > a').attr('href'));
		},
		onClosed: function () {
			$('body').removeClass('my_modifycard_on').removeClass('workspace_resize_on');
			$('div.show_modifycard_ready').removeClass('show_modifycard_ready');
		}
	});
}

// 顯示所有 Cards
function showCard(conf) {
	// 設定參數
	var cid = conf.cid, title = conf.title, content = conf.content, url = conf.url, fbid = conf.fbid, is_file = conf.is_file, tags = tagsGen(conf.tags);
	var fbname = '無資料';
	if (fbid == '') fbid = '100005642921358';
	else fbname = getName(fbid);
	var time = (time == '0000-00-00 00:00:00' || time == '') ? time = '------' : conf.time;
	var displayLink = (url.substr(0, 5) == 'https') ? url.substr(8) : (url.substr(0, 4) == 'http') ? url.substr(7) : url;
	if (parseInt(is_file) == 0) {
		var div = '' +
			'<div sid="' + cid + '" class="workspace_cards_position">' +
			'<div class="workspace_cards_content_user isotope-item">' +
			'<div class="workspace_cards_content_user_icon">' +
			'<img src="https://graph.facebook.com/' + fbid + '/picture" width="38px">' +
			'</div>' +
			'<div class="workspace_cards_content_area">' +
			'<div class="workspace_cards_content_user_name" fbid="' + fbid + '">' + fbname + '</div>' +
			'<span>-</span>' +
			'<span class="workspace_cards_content_time">' + time + '</span>' +
			'<span class="tags_area_container">'+ tags +'</span>' +
			'</div>' +
			'</div>' +
			'<div class="workspace_cards_content isotope-item">' +
			'<div class="workspace_cards_content_selectarea" title="選擇">' +
			'<div class="workspace_cards_content_selectarea_icon"></div>' +
			'</div>' +
			'<div class="workspace_cards_content_inf" title="選項選單"></div>' +
			'<div class="workspace_cards_content_inf_field">' +
			'<div class="workspace_cards_content_inf_field_content" title="群組共享">' +
			'<div class="post_group">&nbsp;</div>' +
			'<div class="post_group_text">群組共享</div>' +
			'</div>' +
			'<div class="workspace_cards_content_inf_field_content" title="加上標籤">' +
			'<a class="co_a AddToTag" onclick="addToTag()">&nbsp;</a>' +
			'<div class="post_tag">&nbsp;</div>' +
			'<div class="post_tag_text">加上標籤</div>' +
			'</div>' +
			'<div class="workspace_cards_content_inf_field_content" title="分享">' +
			'<div class="post_share">&nbsp;</div>' +
			'<div class="post_share_text">分享</div>' +
			'</div>' +
			'<div class="workspace_cards_content_inf_field_content" title="修改 Card">' +
			'<a class="co_a modifycard" href="#inline_workspace_cards_position_modifycard" onclick="show_modifycard()" >&nbsp;</a>' +
			'<div class="post_modifycard">&nbsp;</div>' +
			'<div class="post_modifycard_text">修改 Card</div>' +
			'</div>' +
			'</div>' +
			'<div class="workspace_picture" title="entry_topic">' +
			'<div class="show_workspace_cards_content item-description">' +
			'<h2 class="co_h2">' +
			'<a class="co_a click_workspace_cards" href="' + url +
			'" onclick="show_cardcontain()" target="_blank">' + title +
			'</a>' +
			'</h2>' +
			'<p>' + content + '</p>' +
			'<div class="post_url">' +
			'<span>' + displayLink + '</span>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>';
		// 新增到 Folder 介面
		$('div.workspace_cards_folder_comment_inf').after(div);
	}
}

function addToTag() {
	alertify.prompt("加上標籤，並以「,」分隔", function (e, str) {
	    if (e) {
	    	var data = JSON.parse(localStorage.page_info);
	    	if (str) str.split(',').forEach(function(tag, index){
	            data.tags = data.tags || [];
	            var name = tag.trim();
	            if (name) data.tags.push({ name: name, tid: 't' + (createID() + index) });
	        });
	        sendCard(data)
	        	.success(function(r){
	        		console.log(data, r);
	        		var div = '';
	        		data.tags.forEach(function(tag){
						div += '<span class="tag_span" tid="'+ tag.tid +'">'+ tag.name +'</span>';
					});
	        		$('div[sid='+ data.cid +']').find('span.tags_area_container').append(div);
	        	})
	        	.fail(function(x){
	        		console.log(x.responseText);
	        	});
	    }
	});
}

function tagsGen(data) {
	var div = '';
	if (!data) return div;
	data.split(',').forEach(function(tag){
		var tmp = tag.trim().split('_');
		div += '<span class="tag_span" tid="'+ tmp[0] +'">'+ tmp[1] +'</span>';
	});
	return div;
}

// 新增 Card 介面: 確定新增 Card
$(document).on('click', '#inline_folders_manager_addcard div.inline_card_wrapper_submit > input', newCard);

function newCard() {
	var fID = localStorage.folder_selected,
		name = $('#inline_card_wrapper_name').val(),
		content = $('#inline_card_wrapper_comment').val(),
		url = $('#inline_card_wrapper_url').val();

	if (name && url) {

		// 參數設定
		var displayLink = (url.substr(0, 5) == 'https') ? url.substr(8) : (url.substr(0, 4) == 'http') ? url.substr(7) : url,
		 cID = "c" + createID(),
		 time = getNow();

		var data = {
			cid: cID,
			fid: fID,
			title: name,
			content: content,
			url: url,
			time: time
		};

		// 傳送到資料庫
		sendCard(data, true).success(function(r){
			console.log(r);
		});

		// 關閉介面: 新增 Card
		$.colorbox.close();
		$('#inline_card_wrapper_url').val('');
		$('#inline_card_wrapper_comment').val('');
		$('#inline_card_wrapper_name').val('');
	} else {
		alertify.alert("請輸入\"名稱\"以及\"網址\"後再按\"確定\"!");
	}
}

// 修改 Card 介面: 確定修改 Card
$(document).on('click', '#inline_workspace_cards_position_modifycard div.inline_modifycard_wrapper_submit > input', editCard);

function editCard() {
	// 取得修改資訊
	var name = $('#inline_modifycard_wrapper_name').val();
	var content = $('#inline_modifycard_wrapper_comment').val();
	var url = $('#inline_modifycard_wrapper_url').val();
	var fID = localStorage.folder_selected;
	var cID = localStorage.card_selected;
	var time = getNow();
	var data = {
		cid: cID,
		fid: fID,
		title: name,
		content: content,
		url: url,
		time: time
	};

	// 傳送資料
	sendCard(data).success(function(r){
			console.log(r);
	});

	// 修改 DOM
	var card = $('div[sid="' + cID + '"]');
	$('#inline_workspace_cards > [sid=' + cID + ']')
		.find('p').text(content)
		.end()
		.find('h2 > a').text(name)
		.end()
		.find('h2 > a').attr('href', url)
		.end()
		.find('.post_url').children('span').text(url)
		.end()
		.find('span.workspace_cards_content_time').html(time);

	// 結束編輯
	$.colorbox.close();
	localStorage.removeItem('card_selected');
	$('#inline_modifycard_wrapper_comment').val('');
	$('#inline_modifycard_wrapper_name').val('');
	$('#inline_modifycard_wrapper_url').val('');
}

// 傳送單個 Card 資料
function sendCard(cardInfo, config) {
	var data = cardInfo;

	if (config) {
		data.fbid = localStorage.FB_id;
	}
	if (data.tags){
		data.tags = JSON.stringify(data.tags);
		data.gid = localStorage.group_selected;
	}

	return $.post("db/w_setCard.php", data);
}

// 刪除 Card 介面: 確定刪除 Card
$(document).on('click', '#inline_workspace_cards_position_modifycard div.inline_modifycard_wrapper_delect > input', function () {
	removeById(localStorage.card_selected);
});

// 點擊卡片標題: 顯示 Card 內容
$(document).on('click', 'a.click_workspace_cards', function show_cardcontain() {
	if (localStorage.where == 'titlelink_a') {
		localStorage.setItem('where', 'titlelink_aa');
	} else {
		localStorage.setItem('where', 'titlelink_a');
	}
	console.log('show_cardcontain ' + localStorage.where);
	$(document).on('click', SetPage);
});