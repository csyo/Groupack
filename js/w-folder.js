$(function () {

	// 關閉介面: 管理 Folder 選項選單
	$('body').on('click', function () {
		if ($('#folder-box div.f_engine').hasClass('folders_manager_area_on')) {
			$('#folder-box div.folders_manager_area_on').removeClass('folders_manager_area_on').next().hide();
		}
	});

	// 關閉介面: 管理 folder 選項選單 ( 在card介面 右上方 )
	$('body').on('click', function () {
		if ($('#cards_area_manager').hasClass('folders_manager_area_on')) {
			$('#card_wrapper a.folders_manager_area_on').removeClass('folders_manager_area_on').parents('div.cards_area').prev().hide();
		}
	});

});

// 顯示介面: 管理 Folder 選項選單
$(document).on('click', '#folder-box div.f_engine', function () {
	($(this).siblings('div.workspace_folders_user').children('div').attr('role') == localStorage.FB_id) ? $('#folder-box div.workspace_folders_manager_modifyfolder').show() : $('#folder-box div.workspace_folders_manager_modifyfolder').hide();
	if (!$(this).hasClass('folders_manager_area_on')) {
		$(this).addClass('folders_manager_area_on').next().show();
	}
});

// 顯示介面: 管理 folder 選項選單 ( 在 Card 介面 右上方 )
$(document).on('click', '#cards_area_manager', function () {
	($('a.show_card_on').parent().next().children('div').attr('role') == localStorage.FB_id) ? $('#card_wrapper div.folders_manager_modifyfolder').show() : $('#card_wrapper div.folders_manager_modifyfolder').hide();
	if (!$(this).hasClass('folders_manager_area_on')) {
		$(this).addClass('folders_manager_area_on').parents('div.cards_area').prev().show();
	}
});

$(function () {

	// 顯示介面: 新增 Folder
	$('#folder-box a.addfolder').click( showAddFolder );

	// 顯示介面: 顯示 Folder 中所有 Cards
	$('#folder-box').on('click', 'a.workspace_folder_area', function () {
		/* 處理資料 */
		cardsInFolder(this);
		/* 處理介面 */
		$(this).addClass('show_card_on');
		$('#asus_upload').attr('asus_fID', $(this).parents('div.workspace_four_column').attr('id'));
		$('div.cards_area_header_text').text($(this).nextAll('div.workspace_folder_title_inf').find('div.workspace_folder_title_inf_text').text());
		$('div.workspace_cards_folder_comment_inf > span').text($(this).nextAll('div.workspace_folder_comment_inf').find('div.workspace_folder_comment_inf_text').text());
		$('#card_wrapper_background').removeClass('dom_hidden').attr('style', '');
		$('#card_wrapper').removeClass('dom_hidden').attr('style', '');
		$('div.cards_area').removeClass('dom_hidden').attr('style', '');
		$('div.cards_area_header').removeClass('dom_hidden').attr('style', '');
		$('body').attr('tag', 'w');
	});

	// 關閉介面: 離開 Folder 中所有 Cards
	$('#cards_area_leave').click(function () {
		localStorage.removeItem('folder_selected');
		$('#inline_workspace_cards').find('div.workspace_cards_position').remove(); // 清空
		$('#card_wrapper_background').addClass('dom_hidden');
		$('#card_wrapper').addClass('dom_hidden');
		$('div.cards_area').addClass('dom_hidden');
		$('div.cards_area_header').addClass('dom_hidden');
		$('a.show_card_on').removeClass('show_card_on');
		$('div.cards_area_nav').hide();
		$('#inline_workspace_cards').css('top', '42px');
		$('div.workspace_cards_content_selectarea').hide();
		$('div.cards_area_select_icon_click').removeClass('cards_area_select_icon_click');
		$('div.workspace_cards_content_selectarea_icon_select').removeClass('workspace_cards_content_selectarea_icon_select');
	});
});

function cardsInFolder(that){
	var folderID = that.parentNode.parentNode.id;
	localStorage.setItem("folder_selected", folderID);
	// 取得所有 Card
	$.post("db/w_getCards.php", {
		fid: folderID,
		gid: localStorage.group_selected
	})
		.fail(function (x, e, txt) {
			console.log(txt);
		})
		.done(function (r) {
			console.log("成功取得 Card 資料 from " + folderID);
			var data = JSON.parse(r);
			cardsInFolder.data = data;
			var div = '';
			data.sort(function(a,b){
				if (a.time < b.time) return 1; else return -1;
			})
			.forEach(function(item) {
				var conf = {
					cid: item.cid,
					title: item.title,
					content: item.content,
					url: item.url,
					fbid: item.fbid,
					time: item.time,
					is_file: item.is_file
				};
				if (item.tags) conf.tags = item.tags;
				div += showCard(conf);
			});
			// 新增到 Folder 介面
			$('div.workspace_cards_folder_comment_inf').after(div);
		});
}

// 修改 Folder 介面: 確定修改 Folder
$(document).on('click', '#inline_folders_manager_modifyfolder div.inline_modifyfolder_wrapper_submit > input', function () {
	// 更新 DOM 內容    
	if (!$('a.workspace_folder_area').hasClass('show_card_on')) {
		var $a = $('div.show_modifyfolder_ready').nextAll('div.workspace_folders');
		$a.find('div.workspace_folder_title_inf_text').text($('#inline_modifyfolder_wrapper_name').val());
		$a.find('div.workspace_folder_comment_inf_text').text($('#inline_modifyfolder_wrapper_comment').val());
	} else {
		$('a.show_card_on').nextAll('div.workspace_folder_title_inf').find('div.workspace_folder_title_inf_text').text($('#inline_modifyfolder_wrapper_name').val());
		$('a.show_card_on').nextAll('div.workspace_folder_comment_inf').find('div.workspace_folder_comment_inf_text').text($('#inline_modifyfolder_wrapper_comment').val());
	}
	$('div.cards_area_header_text').text($('#inline_modifyfolder_wrapper_name').val());
	$('div.workspace_cards_folder_comment_inf > span').text($('#inline_modifyfolder_wrapper_comment').val());
	$.colorbox.close();
});

// 修改 Folder 介面: 確定刪除 Folder
$(document).on('click', '#inline_folders_manager_modifyfolder div.inline_modifyfolder_wrapper_delect > input', function () {
	if (!$('a.workspace_folder_area').hasClass('show_card_on')) {
		$('div.show_modifyfolder_ready').parent('div.workspace_four_column').remove();
	} else {
		$('a.show_card_on').parents('div.workspace_four_column').remove();
	}
	$.colorbox.close();
	$('#card_wrapper_background').addClass('dom_hidden');
	$('#card_wrapper').addClass('dom_hidden');
	$('div.cards_area').addClass('dom_hidden');
	$('div.cards_area_header').addClass('dom_hidden');
	$('#inline_modifyfolder_wrapper_comment').val('');
	$('#inline_modifyfolder_wrapper_name').val('');
});

// 顯示介面: 修改 folder
function show_modifyfolder() {
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
	$('a.modifyfolder').colorbox({
		inline: true,
		fixed: true,
		width: box_width,
		height: box_height,
		reposition: true,
		transition: 'none',
		title: false,
		onComplete: function () {
			$('body').addClass('my_modifyfolder_on').addClass('workspace_resize_on');
			if (!$('a.workspace_folder_area').hasClass('show_card_on')) {
				var $a = $('div.show_modifyfolder_ready').nextAll('div.workspace_folders');
				$('#inline_modifyfolder_wrapper_comment').val($a.find('div.workspace_folder_comment_inf_text').text());
				$('#inline_modifyfolder_wrapper_name').val($a.find('div.workspace_folder_title_inf_text').text());
			} else {
				$('#inline_modifyfolder_wrapper_comment').val($('a.show_card_on').nextAll('div.workspace_folder_comment_inf').find('div.workspace_folder_comment_inf_text').text());
				$('#inline_modifyfolder_wrapper_name').val($('a.show_card_on').nextAll('div.workspace_folder_title_inf').find('div.workspace_folder_title_inf_text').text());
			}
		},
		onClosed: function () {
			$('body').removeClass('my_modifyfolder_on').removeClass('workspace_resize_on');
			$('div.show_modifyfolder_ready').removeClass('show_modifyfolder_ready');
		}
	});
}

// 新增 Folder 介面: 確定新增 Folder
$(document).on('click', '#inline_workspace_manager_addfolder div.inline_folder_wrapper_submit > input', newFolder);

function newFolder() {
	$('div.noFolder').remove();
	var name = $('#inline_folder_wrapper_name').val();
	var comment = $('#inline_folder_wrapper_comment').val();

	if (name) {
		var id = addFolder(name, comment),
			test = $('#sharing_with_group').hasClass('sharing_with_group_on');
		
		// 新增到 群組共享 or WS介面
		test ? addToSharing(id, name) : foldersInWS(id, name, comment); 
		
		$.colorbox.close();
		$('#inline_folder_wrapper_comment').val('');
		$('#inline_folder_wrapper_name').val('');
	} else {
		alertify.alert("請輸入 Folder 名稱!");
	}
}

// 新增 folder 到資料庫
function addFolder(name, comment) {
	var folderID = "f" + createID(),
		gID = localStorage.group_selected;
	// 傳送到資料庫
	$.post("db/w_setFolder.php", {
		gid: gID,
		fid: folderID,
		fname: name,
		comment: comment,
		fbid: localStorage.FB_id
	})
		.fail(function (x) {
			console.log(x.responseText);
		})
		.done(function (r) {
			console.log(r);
			getGroupUpdated();
		});
	return folderID;
}

// folder 介面樣板
function folderTemplate(data) {

	var fid = data.fid, name = data.name, comment = data.comment, time = data.time, creator = data.creator;

	// 新增 folder 調整參數
	if (typeof time === 'undefined' || time === null) time = '0000-00-00 00:00:00';
	if (typeof creator === 'undefined' || creator === null) creator = localStorage.FB_id;

	// folder 時間戳
	var a = nowTime().split(" ");
	Time = (time == '0000-00-00 00:00:00') ? a[1] : time;

	return '' +
		'<div class="workspace_four_column" id="' + fid + '" sid="' + a[0] + '">' +
		'<div class="workspace_folders_title">&nbsp;</div>' +
		( name === '未分類' ? '' : ('<div class="workspace_folders_title_icon f_engine" title="管理 folder">動作</div>' +
		'<div class="workspace_folders_manager_area">' +
		'<div class="workspace_folders_manager_addcard">' +
		'<a class="co_a addcard" href="#inline_folders_manager_addcard" onclick="show_addcard(this)">&nbsp;</a>' +
		'<div class="workspace_folders_manager_addcard_icon"></div>' +
		'<div class="workspace_folders_manager_addcard_text">新增 Card</div>' +
		'</div>' +
		'<div class="workspace_folders_manager_modifyfolder">' +
		'<a class="co_a modifyfolder" href="#inline_folders_manager_modifyfolder" onclick="show_modifyfolder()">&nbsp;</a>' +
		'<div class="workspace_folders_manager_modifyfolder_icon"></div>' +
		'<div class="workspace_folders_manager_modifyfolder_text">修改 Folder</div>' +
		'</div>' +
		'</div>') ) +
		'<div class="workspace_folders">' +
		'<a class="co_a workspace_folder_area" href="javascript: void(0);">&nbsp;</a>' +
		'<div class="workspace_folder_title_inf">' +
		'<div class="workspace_folder_title_inf_text">' + name + '</div>' +
		'</div>' +
		'<div class="workspace_folder_comment_inf">' +
		'<div class="workspace_folder_comment_inf_text">' + comment + '</div>' +
		'</div>' +
		'</div>' +
		(name === '未分類' ? '' : ('<div class="workspace_folders_user">' +
		'<div class="workspace_folders_user_name" role="' + creator + '">' + getName(creator) +
		'</div>' +
		'<span> 創建於 </span>' +
		'<span role="time">' + Time + '</span>' +
		'</div>')) +
		'</div>';
}

// 修改 Folder 介面: 確定修改 Folder
$(document).on('click', '#inline_folders_manager_modifyfolder div.inline_modifyfolder_wrapper_submit > input', editFolder);

function editFolder() {
	var name = $('#inline_modifyfolder_wrapper_name').val();
	var comment = $('#inline_modifyfolder_wrapper_comment').val();
	var gid = localStorage.group_selected;
	var fid = localStorage.folder_selected;

	// 傳送到資料庫
	$.post("db/w_setFolder.php", {
		gid: gid,
		fid: fid,
		fname: name,
		comment: comment,
	})
		.fail(function (x, e, txt) {
			console.log(txt);
		})
		.done(function (r) {
			console.log(r);
			getGroupUpdated();
			$('#inline_modifyfolder_wrapper_comment').val('');
			$('#inline_modifyfolder_wrapper_name').val('');
		});
}

// 刪除 Folder 介面: 確定刪除 Folder
$(document).on('click', '#inline_folders_manager_modifyfolder div.inline_modifyfolder_wrapper_delect > input', function () {
	removeById(localStorage.folder_selected);
	localStorage.removeItem('folder_selected');
	if ($('div.workspace_four_column').length === 0) {
		$('div.workspace_user').after('<div class="noFolder">目前還沒有任何資料夾</div>');
	}
});

// 顯示群組所有 folder
function showAllFolders(callback) {
   if (!localStorage.group_selected) {
      alertify.alert('請先選擇群組!');
      return;
   }
   var folders = processGroupData().folders,
      div = '',
      $div = $('#folder-box').find('div.workspace_columns')
      			.find('div.workspace_four_column').remove().end();
   if (folders) {
      for (var i = 0, item; item = folders[i]; i++) {
      	 var data = {
      	 	fid: item.f_id,
      	 	name: item.f_name,
      	 	comment: item.f_comment,
      	 	time: item.createdTime,
      	 	creator: item.creatorID
      	 };
         div += folderTemplate(data);
      }
      $div.prepend(div);
   }
   callback && callback();
}

// 顯示新增 folder 介面
function showAddFolder(){
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
	$('a.addfolder').colorbox({
		inline: true,
		fixed: true,
		width: box_width,
		height: box_height,
		reposition: true,
		transition: 'none',
		title: false,
		onComplete: function () {
			var a = $('body').hasClass('sharing_with_group_z');
			if (a) {
				$('#cboxOverlay').css('z-index', 100001);
				$('#colorbox').css('z-index', 100001);
			}
			$('body').addClass('my_add_folder_on').addClass('workspace_resize_on');
		},
		onClosed: function () {
			var a = $('body').hasClass('sharing_with_group_z');
			if (a) {
				$('#cboxOverlay').css('z-index', '');
				$('#colorbox').css('z-index', '');
			}
			$('body').removeClass('my_add_folder_on').removeClass('workspace_resize_on');
		}
	});
}

function foldersInWS(id, name, comment) {
	var data = {
      	 	id: id,
      	 	name: name,
      	 	comment: comment,
      	 	time: getNow(),
      	 	creator: localStorage.FB_id
    };
	$('#folder-box').find('div.workspace_columns').prepend(folderTemplate(data));
}