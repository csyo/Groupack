$(function() {
   // 關閉介面: 管理 Workspace 選項選單
   $('body').on('click', function() {
      if ($('#myWorkspace div.w_engine').hasClass('workspace_manager_area_on')) {
         $('#myWorkspace div.workspace_manager_area_on').removeClass('workspace_manager_area_on').children('div.workspace_manager_area').hide();
      }
   });

   // 顯示介面: 新增 workspace
   $('#Workspace_nav a.add_workspace, #sharing_with_group a.add_workspace').click(function() {
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
      $('a.add_workspace').colorbox({
         inline: true,
         fixed: true,
         width: box_width,
         height: box_height,
         reposition: true,
         transition: 'none',
         title: false,
         onComplete: function() {
            if ($('body').hasClass('sharing_with_group_z')) {
               $('#cboxOverlay').css('z-index', 100001);
               $('#colorbox').css('z-index', 100001);
            }
            $('body').addClass('my_add_workspace_on').addClass('workspace_resize_on');
         },
         onClosed: function() {
            if ($('body').hasClass('sharing_with_group_z')) {
               $('#cboxOverlay').css('z-index', '');
               $('#colorbox').css('z-index', '');
            }
            $('body').removeClass('my_add_workspace_on').removeClass('workspace_resize_on');
         }
      });
   });

   // *顯示介面: 顯示 Workspace 中所有 Folders
   $('#Workspace_nav').on('click', 'li.w-item > a', function() {
      $('#preloader').find('span').text('請稍後...').end().removeClass('dom_hidden');
      $('#myWorkspace div.workspace_title_inf').children('span').text($(this).text()); // 顯示 workspace 名稱
      $(this).addClass('workspace_on_now');
      $('#myWorkspace').addClass('workspace_on').css({
         marginLeft: '',
         marginRight: ''
      }).removeClass('dom_hidden').attr('style', '');
      $('#wrapper').css({
         marginLeft: '',
         marginRight: ''
      }).addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('#under-footer').css({
         marginLeft: '',
         marginRight: ''
      }).addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('#timeline_wrapper').css({
         marginLeft: '',
         marginRight: ''
      }).addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      EnterWS(this);
   });

   // 離開介面: 離開 Workspace 中所有 Folders
   $('#delete_workspace').click(function() {
      closeWShelper();
   });

   // 顯示介面: 修改 Workspace
   $('#myWorkspace a.modifyworkspace').click(function() {
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
      $('a.modifyworkspace').colorbox({
         inline: true,
         fixed: true,
         width: box_width,
         height: box_height,
         reposition: true,
         transition: 'none',
         title: false,
         onComplete: function() {
            $('body').addClass('my_modifyworkspace_on').addClass('workspace_resize_on');
            $('#inline_modifyworkspace_wrapper_comment').val($('div.workspace_comment_inf > span').text());
            $('#inline_modifyworkspace_wrapper_name').val($('div.workspace_title_inf > span').text());
         },
         onClosed: function() {
            $('body').removeClass('my_modifyworkspace_on').removeClass('workspace_resize_on');
         }
      });
   });
});

// 顯示介面: 管理 Workspace 選項選單
$(document).on('click', '#myWorkspace div.w_engine', function() {
   ($('#myWorkspace div.workspace_user_name').attr('role') === localStorage.FB_id) ? $('#myWorkspace div.workspace_manager_modifyworkspace').show() : $('#myWorkspace div.workspace_manager_modifyworkspace').hide();
   if (!$(this).hasClass('workspace_manager_area_on')) {
      $(this).addClass('workspace_manager_area_on').children().show();
   }
});

// 關閉介面: 離開 workspace

function closeWShelper() {
   var a = $('body').hasClass('timeline_on');
   if (!a) {
      $('#wrapper').removeClass('dom_hidden').attr('style', '');
      $('#under-footer').removeClass('dom_hidden').attr('style', '');
      $('#myWorkspace').removeClass('workspace_on').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.workspace_on_now').removeClass('workspace_on_now');
   } else {
      $('#timeline_wrapper').removeClass('dom_hidden').attr('style', '');
      $('#myWorkspace').removeClass('workspace_on').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.workspace_on_now').removeClass('workspace_on_now');
      if ($('#timeline_update_temp > div').length != 0) {
         $('#timeline_notificationCountArea').hide();
         $('#timeline_show_update').show(50);
      }
   }
   $('div.noFolder').remove();
   localStorage.removeItem('workspace_selected');
   localStorage.removeItem('folder_selected');
}

// 點擊進入 workspace 後 , 顯示所有 folder

function EnterWS(e) {
   var id = e.name; // 取得 wID
   console.log('選中:' + id);
   localStorage.setItem('workspace_selected', id);

   if (id) {
      $('div.workspace_four_column').remove(); // 清空之前的項目
      var data = processGroupData().workspaces;
      // 取得 workspace 資料
      if (data) {
         // 取得選中 workspace
         for (var i = 0, item; item = data[i]; i++) {
            if (item.w_id === id) {
               console.log(id + ' 資料存在');
               $('div.workspace_comment_inf span').text(item.w_comment);
               $('div.workspace_user div').attr('role', item.creatorID).text(getName(item.creatorID));
               $('div.workspace_user span[role=time]').text(item.createdTime);
               // 取得此 workspace 所有 folder
               if (item.folders) {
                  $('div.noFolder').remove();
                  for (var j = 0, folder; folder = item.folders[j]; j++)
                     foldersInWS(folder.f_id, folder.f_name, folder.f_comment, folder.createdTime, folder.creatorID);
               } else {
                  if ($('div.noFolder'))
                     $('div.workspace_user').after('<div class="noFolder">目前還沒有任何資料夾</div>');
               }
               break;
            }
         }
         $('#preloader').addClass('dom_hidden');

      }
   }
}

// 新增 Workspace 介面: 確定新增 Workspace
$(document).on('click', '#inline_workspace div.inline_workspace_wrapper_submit > input', newWorkspace);

function newWorkspace() {
   var name = $('#inline_workspace_wrapper_name').val();
   var comment = $('#inline_workspace_wrapper_comment').val();

   if (name) {

      // 建立 workspace 並取得 wID
      var id = addWorkspace(name, comment);

      // 新增到 DOM
      var item = '' +
         '<li class="w-item" name="' + id + '">' +
         '<a class="co_a" title="' + name + '" name="' + id + '">' + name + '</a>' +
         '</li>';
      $('#Workspace_nav').prepend(item);

      // 直接新增到群組共享上
      if ($('#sharing_with_group').hasClass('sharing_with_group_on')) {
         if (!$('div.sharing_with_group_select').length) {
            $('.sharing_with_group_container').before('<div class="sharing_with_group_select"></div>');
         }
         var field = '' +
            '<div class="sharing_with_group_select_field" style="display: block;"></div>' +
            '<div class="_select_workspace" data="' + id + '" style="">' + name + '</div>';
         $('div.sharing_with_group_select').append(field);
      }

      // WS 時間戳
      var a = nowTime().split(" ");
      $('div.workspace_user_name').attr('role', localStorage.FB_id).text(localStorage.FB_name);
      $('div.workspace_user').find('span[role=time]').text(a[1]);
      $('div.workspace').attr('sid', a[0]);
      $('div.workspace_comment_inf > span').text(comment);

      // 關閉介面 , 清空數據
      $.colorbox.close();
      $('#inline_workspace_wrapper_comment').val('');
      $('#inline_workspace_wrapper_name').val('');

   } else {
      alert("請輸入 Workspace 名稱!");
   }
}

// 新增 workspace 到資料庫

function addWorkspace(name, comment) {
   var wID = "w" + createID();
   var gID = localStorage.group_selected;
   // 傳送到資料庫
   $.post("db/w_setWorkspace.php", {
      gid: gID,
      wid: wID,
      wname: name,
      comment: comment,
      fbid: localStorage.FB_id
   })
      .fail(function(e) {
         console.log(e);
      })
      .done(function(r) {
         console.log(r);
         getGroupUpdated();
      });
   return wID;
}

// 修改 Workspace 介面: 確定修改 Workspace
$(document).on('click', '#inline_workspace_manager_modifyworkspace div.inline_modifyworkspace_wrapper_submit > input', editWorkspace);

function editWorkspace() {
   var name = $('#inline_modifyworkspace_wrapper_name').val(),
      comment = $('#inline_modifyworkspace_wrapper_comment').val(),
      wid = localStorage.workspace_selected,
      gid = localStorage.group_selected;

   // 傳送到資料庫
   $.post("db/w_setWorkspace.php", {
      gid: gid,
      wid: wid,
      wname: name,
      comment: comment,
      fbid: localStorage.FB_id
   })
      .fail(function(e) {
         console.log(e);
      })
      .done(function(r) {
         console.log(r);
         getGroupUpdated();
         // console.log('editWorkspace: T_savedata');
         // if (localStorage.T_savedataTimeout) {
         // 	window.setTimeout(function () {
         // 		var a = window.setTimeout(function () {
         // 			T_savedata('none', 'none', wid, 'none');
         // 		}, 1000);
         // 		localStorage.setItem('T_savedataTimeout', a);
         // 	}, 3000);
         // } else {
         // 	var a = window.setTimeout(function () {
         // 		T_savedata('none', 'none', wid, 'none');
         // 	}, 1000);
         // 	localStorage.setItem('T_savedataTimeout', a);
         // }
      });

   // 更新 顯示 內容
   $('div.workspace_title_inf > span').text(name);
   $('div.workspace_comment_inf > span').text(comment);
   $('div.workspace_on_now > div').text(name);

   // 關閉介面 , 清空數據
   $.colorbox.close();
   $('#inline_modifyworkspace_wrapper_comment').val('');
   $('#inline_modifyworkspace_wrapper_name').val('');
}

// 修改 Workspace 介面: 確定刪除 Workspace
$(document).on('click', '#inline_workspace_manager_modifyworkspace div.inline_modifyworkspace_wrapper_delect > input', function() {
   /* 後端處理 */
   removeById(localStorage.workspace_selected);
   localStorage.removeItem('workspace_selected');
   /* 介面處理 */
   $('div.workspace_title_inf > span').text('');
   $('div.workspace_comment_inf > span').text('');
   $('div.workspace_on_now').remove();
   $.colorbox.close();
   $('#inline_modifyworkspace_wrapper_comment').val('');
   $('#inline_modifyworkspace_wrapper_name').val('');
   if (!$('body').hasClass('timeline_on')) {
      $('#wrapper').removeClass('dom_hidden').attr('style', '');
      $('#under-footer').removeClass('dom_hidden').attr('style', '');
      $('#myWorkspace').removeClass('workspace_on').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.workspace_on_now').removeClass('workspace_on_now');
   } else {
      $('#timeline_wrapper').removeClass('dom_hidden').attr('style', '');
      $('#myWorkspace').removeClass('workspace_on').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.workspace_on_now').removeClass('workspace_on_now');
   }
   $('div.workspace_four_column').remove();
   $('div.workspace_cards_position').remove();
});

// 顯示群組所有 Workspaces
$(document).on('click', 'div.nav_main_w', function() {
   if (!localStorage.group_selected) {
      alert('請先選擇群組!');
      return;
   }
   var workspaces = processGroupData().workspaces,
      div = '',
      $ul = $('#Workspace_nav').find('li.w-item').remove().end();
   if (workspaces) {
      for (var i = workspaces.length - 1; i >= 0; i--) {
         div += '<li class="w-item" name="' + workspaces[i].w_id + '">' +
            '<a class="co_a" name="' + workspaces[i].w_id + '">' + workspaces[i].w_name + '</a>';
      }
      $ul.prepend(div);
   }
});
