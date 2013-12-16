// 產生好友清單於DOM
$(function show_friend_list() {
   var friendsJson = localStorage.getItem('FB_friends');
   var friends = JSON.parse(friendsJson);
   // 依照字母/筆畫排序
   friends.sort(function (a, b) {
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
   });
   $('div.checkgroup_members_container > div').remove();
   var friendsList = '';
   for (var key = 0; key < friends.length; key++) {
      friendsList += '<div class="checkgroup_members_container_item">' +
         '<div class="checkgroup_members_container_itemText" role="' + friends[key][0] + '">' + friends[key][1] + '</div>' +
         '</div>';
   }
   $('div.addgroup_members_container > form').after(friendsList);
   $('div.checkgroup_members_container > form').after(friendsList);
});
// 輸入文字查詢朋友名字
$(function search_name() {    
   $('#live-search-filter1').keyup(function () {         // Retrieve the input field text and reset the count to zero
              
      var filter = $(this).val(),
         count = 0;         // Loop through the comment list
              
      $('div.addgroup_members_container div.checkgroup_members_container_itemText').each(function () {             // If the list item does not contain the text phrase fade it out
                     
         if ($(this).text().search(new RegExp(filter, 'i')) < 0) {                
            $(this).parent().addClass('dom_hidden');             // Show the list item if the phrase matches and increase the count by 1
                        
         } else {                
            $(this).parent().removeClass('dom_hidden');                
            count++;            
         }        
      });    
   });

   $('#live-search-filter2').keyup(function () {           // Retrieve the input field text and reset the count to zero
              
      var filter = $(this).val(),
         count = 0;         // Loop through the comment list
              
      $('div.checkgroup_members_container div.checkgroup_members_container_itemText').each(function () {             // If the list item does not contain the text phrase fade it out
                     
         if ($(this).text().search(new RegExp(filter, "i")) < 0) {                
            $(this).parent().addClass('dom_hidden');             // Show the list item if the phrase matches and increase the count by 1
                        
         } else {                
            $(this).parent().removeClass('dom_hidden');                
            count++;            
         }        
      });    
   });    
});

function newSection(groupID){
   $.post('php/searchSession.php', {
            fbid: localStorage.FB_id,
            fbname: localStorage.FB_name,
            keyword: localStorage.k_word,
            gid: groupID
         })
            .done(function (r) {
               console.log(r)
            })
            .fail(function (x) {
               console.log(x)
            });
}

// 介面調整
$(function interface() {
   // 由目前成員清單產生管理員候選人清單
   $('a.addkeeper_add').click(function show_admin_list() {
      var div = '',
      $keepersContainer = $('div.checkgroup_keepers_container'),
      $keepers = $keepersContainer.children('div'),
      $members = $('div.checkgroup_member_container').children('a');
      
      if ($keepers.length != 0)
         $keepers.remove();

      for (var x = 0, item; item = $members[x]; x++) {
         div += '\
         <div class="checkgroup_members_container_item">\
            <div class="checkgroup_members_container_itemText" role="' + $(item).attr('role') + '">' + $(item).attr('title') + '</div>\
         </div>';
      }
      $keepersContainer.append(div);
   });
   // 顯示已選擇群組的對話框
   $('#addMember').on('click', 'li.group_select_checkgroup > a', function show_group(e) {
      var groupID = this.parentNode.id;
      if (groupID === localStorage.group_selected) {
         alert('已經選擇此群組了。');
      } else {
         var groupName = $(this).text();
         $('div.select_group_notify_wrapper_show').text(groupName);
         $('div.Group_Board_inf_text').text(groupName).attr('g_id', groupID);
         $('#select_group_notify').toggle(400).delay(2400).hide(400);
         localStorage.setItem('group_selected', groupID);
         newSection(groupID);
         if ($('.workspace_on')[0] === undefined) workspaceLeave();
         $('div.Group_Board_inf_text').text(groupName).attr('g_id', groupID);
         Group_Board_showMember();
         get_topic_relevance(); //edit by chenchenbox
      }
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
         if ($('#timeline_update_temp > div').length != 0) {
            $('#timeline_notificationCountArea').hide();
            $('#timeline_show_update').show(50);
         }
      }
   });

   // 選擇成員 in 新增群組
   $(document).on('click', 'div.addgroup_members_container div.checkgroup_members_container_itemText', function choose_member() {
      if (!$(this).hasClass('addgroup_friends_select_on')) {
         if (!$(this).hasClass('addgroup_friends_select_be_selected')) {
            $(this).addClass('addgroup_friends_select_be_selected').css('background-color', 'rgba(59, 120, 240, 0.87)');
            var fbID = $(this).attr('role');
            var fbNAME = $(this).text();
            addMember(fbID + ',' + fbNAME);
            $('div.addgroup_member_container').append('' +
               '<a class="co_a" id="temp_" role="' + fbID + '"' + 'href="javascript: void(0);" title="' + fbNAME + '" CheckTemp="Is_temp">' +
               '<img class="temp_" src="https://graph.facebook.com/' + fbID + '/picture" width="40px">' +
               '</a>'
            );
         } else {
            var fbID = $(this).attr('role');
            $('#' + fbID + '').remove();
            $('div.addgroup_member_container [role=' + fbID + ']').remove();
            $(this).css('background-color', '').removeClass('addgroup_friends_select_be_selected');
            removeMember(fbID);
         }
      }
   });

   // 選擇成員 in 檢視群組
   $(document).on('click', 'div.checkgroup_members_container div.checkgroup_members_container_itemText', function choose_member() {
      if (!$(this).hasClass('checkgroup_friends_select_on')) {
         if (!$(this).hasClass('checkgroup_friends_select_be_selected')) {
            $(this).addClass('checkgroup_friends_select_be_selected').css('background-color', 'rgba(59, 120, 240, 0.87)');
            var fbID = $(this).attr('role'); // console.log(fbID);
            var fbNAME = $(this).text(); // console.log(fbNAME);
            addMember(fbID + ',' + fbNAME);
            $('div.checkgroup_member_container').append(
               '<a class="co_a" id="temp_" role="' + fbID + '"' + 'href="javascript:;" title="' + fbNAME + '" CheckTemp="Is_temp">' +
               '<img class="temp_" src="https://graph.facebook.com/' + fbID + '/picture" width="40px">' +
               '</a>'
            );
         } else {
            var fbID = $(this).attr('role');
            $('div.checkgroup_member_container').children('[role=' + fbID + ']').remove();
            $(this).css('background-color', '').removeClass('checkgroup_friends_select_be_selected');
            removeMember(fbID);
         }
      }
   });

   // 選擇管理者 in 檢視群組
   $(document).on('click', 'div.checkgroup_keepers_container div.checkgroup_members_container_itemText', function choose_admin() {
      if (!$(this).hasClass('checkgroup_keepers_select_on')) {
         var fbID = $(this).attr('role'); console.log(fbID);
         var fbNAME = $(this).text();

         if (!$(this).hasClass('checkgroup_keepers_select_be_selected')) {
            $(this).addClass('checkgroup_keepers_select_be_selected').css('background-color', 'rgba(59, 120, 240, 0.87)');
            $('div.checkgroup_keeper_container').append(
               '<a class="co_a" id="temp_" role="' + fbID + '"' + 'href="javascript: void(0);" title="' + fbNAME + '">' +
               '<img class="temp_" src="https://graph.facebook.com/' + fbID + '/picture" width="40px">' +
               '</a>'
            );
            removeMember(fbID);
            $('div.checkgroup_member_container').children('[role=' + fbID + ']').remove();
         } else {
            $('div.checkgroup_keeper_container').children('[role=' + fbID + ']').remove();
            $(this).css('background-color', '').removeClass('checkgroup_keepers_select_be_selected');
            addMember(fbID + ',' + fbNAME);
            $('div.checkgroup_member_container').append(
               '<a class="co_a" id="' + fbID + '" role="' + fbID + '"' + 'href="javascript:;" title="' + fbNAME + '">' +
               '<img class="temp_" src="https://graph.facebook.com/' + fbID + '/picture" width="40px">' +
               '</a>'
            );
         }
      }
   });

   // 顯示 新增群組
   $('ul.group_select > li:last-child').click(function show_addG() {
      $('#addgroup').removeClass('dom_hidden').attr('style', '');
      $('#addgroup_background').removeClass('dom_hidden').attr('style', '');
      $('div.addgroup_container').removeClass('dom_hidden').attr('style', '');
      $('div.addgroup_footer').removeClass('dom_hidden').attr('style', '');
      // 將自己加到清單中
      var myId = localStorage.FB_id;
      if (!document.getElementById(myId)) {
         var me = '<a class="co_a" id="' + myId + '" role="' + myId + '" href="javascript:;" title="' + localStorage.FB_name + '"><img class="temp_" src="https://graph.facebook.com/' + myId + '/picture" width="40px"></a>';
         $('div.addgroup_member_container').append(me);
      }
      $('#group-name').focus().select();
   });

   // 顯示 檢視群組
   $(document).on('click', 'div.group_select_checkgroup_check', function show_checkG() {
      $('#checkgroup').addClass('checkgroup_on').removeClass('dom_hidden').attr('style', '');
      $('#checkgroup_background').removeClass('dom_hidden').attr('style', '');
      $('div.checkgroup_container').removeClass('dom_hidden').attr('style', '');
      $('div.checkgroup_footer').removeClass('dom_hidden').attr('style', '');
      $('div.checkgroup_header_text').text($(this).next().text());
      var groupID = this.parentNode.id;
      var groupName = $('#' + groupID).children('a').html();
      localStorage.setItem('editGroup', groupID);

      // 一般成員：隱藏修改名稱與刪除群組按鈕
      $.post('php/g_getRole.php', {
         sendid: localStorage.FB_id,
         sendgid: groupID
      }, function (r) {
         var role = JSON.parse(r);
         role = role.role; // console.log(role);
         if (role == 'MEMBER') {
            $('div.checkgroup_addkeeper_action_add').hide();
            $('div.checkgroup_header_right_modify').hide();
            $('#delete_group_center_btn2').attr('title', '離開群組').nextAll('.checkgroup_header_right_delect_text').text('離開').attr('title', '離開');
         } else {
            $('div.checkgroup_addkeeper_action_add').show();
            $('div.checkgroup_header_right_modify').removeAttr('style');
            $('#delete_group_center_btn2').attr('title', '刪除群組').nextAll('.checkgroup_header_right_delect_text').text('刪除').attr('title', '刪除');
         }
      });

      // 顯示管理員
      showAdmin(groupID);
      // 顯示成員
      $.post('php/g_getMembers.php', {
         sendgid: groupID
      })
         .fail(function (x) {
            console.log(x.responseText);
         })
         .done(function (r) {
            console.log("get members from "+groupID+" done.")
            var members = JSON.parse(r);
            if (members.length)
               for (var i = 0, member; member = members[i]; i++)
                  showMember(member.fbid, member.fbname);
         });
   });

   // 確定 in 選擇成員 (新增群組)
   $('div.addgroup_members_footer_right').children('div.addgroup_footer_submit').click(function submit_choose_member() {
      $('div.addgroup_members_container div.checkgroup_members_container_item').css('background-color', '').removeClass('checkgroup_friends_select_be_selected');
      $('div.addgroup_member_container > a').filter('#temp_').attr('id', '');
      $('div.addgroup_members_container').addClass('dom_hidden').offset({
         top: -5000,
         left: -5000
      });
      $('div.addgroup_footer_right').removeClass('dom_hidden').css({
         'top': '',
         'left': ''
      });
      $('div.addgroup_members_footer_right').addClass('dom_hidden').offset({
         top: -5000,
         left: -5000
      });
   });

   // 確定 in 選擇成員 (檢視群組)
   $('.checkgroup_members_footer_right').children('div.checkgroup_footer_submit').click(function submit_choose_member() {
      $('div.checkgroup_members_container div.checkgroup_members_container_itemText').css('background-color', '').removeClass('checkgroup_friends_select_be_selected');
      $('div.checkgroup_member_container > a').filter('#temp_').attr('id', '');
      $('div.checkgroup_members_container').addClass('dom_hidden').offset({
         top: -5000,
         left: -5000
      });
      $('div.checkgroup_footer_right').removeClass('dom_hidden').css({
         'top': '',
         'left': ''
      });
      $('div.checkgroup_members_footer_right').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
   });

   // 確定 in 選擇管理者 (檢視群組)
   $('.checkgroup_keepers_footer_right').children('div.checkgroup_footer_submit').click(function submit_choose_admin() {
      $('div.checkgroup_keepers_container div.checkgroup_members_container_itemText').css('background-color', '').removeClass('checkgroup_keepers_select_be_selected');
      $('div.checkgroup_keeper_container > a').filter('#temp_').attr('id', '');
      $('div.checkgroup_keepers_container').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.checkgroup_footer_right').removeClass('dom_hidden').css({
         'top': '',
         'left': ''
      });
      $('div.checkgroup_keepers_footer_right').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
   });

   // 刪除/離開群組 in 檢視群組 (管理者/成員)
   $('#delete_group_center_btn2').click(function delete_leave_group() {
      if ($('div.checkgroup_addkeeper_action_add').css('display') === 'none') {
         if (confirm('確定要離開這個群組？')) {
            var groupID = localStorage.editGroup;
            var myID = localStorage.FB_id;
            $.post('php/g_leave.php', {
               gid: groupID,
               fbid: myID
            })
               .fail(function (x) {
                  console.log(x.responseText);
               })
               .done(function (r) {
                  console.log(r)
                  var msg1 = groupID + '***' + 'leave';
                  var a = window.setTimeout(function () {
                     T_savedata(msg1, 'none', 'none', 'none');
                  }, 1000);
                  localStorage.setItem('T_savedataTimeout', a);
               });
            removeGroupDom(groupID);
            $('div.checkgroup_members_container').addClass('dom_hidden').offset({
               top: -5000,
               left: -5000
            });
            $('div.checkgroup_footer_right').removeClass('dom_hidden').css({
               'top': '',
               'left': ''
            });
            $('div.checkgroup_members_footer_right').addClass('dom_hidden').offset({
               top: -1000,
               left: -1000
            });
         }
      } else {
         if (confirm('確定刪除這個群組？')) {
            var groupID = localStorage.editGroup;
            var groupNAME = $('li#' + groupID).find('a').text();
            $.post('http://chding.es.ncku.edu.tw/Groupack/group/delete.php', {
               sendgid: groupID
            })
               .done(function (r) {
                  console.log(r)
                  var msg1 = groupID + '***' + 'delete' + '***' + groupNAME;
                  var a = window.setTimeout(function () {
                     T_savedata(msg1, 'none', 'none', 'none');
                  }, 1000);
                  localStorage.setItem('T_savedataTimeout', a);
               }).fail(function (x) {
                  console.log(x)
               });
            removeGroupDom(groupID);
            $('div.checkgroup_members_container').addClass('dom_hidden').offset({
               top: -5000,
               left: -5000
            });
            $('div.checkgroup_footer_right').removeClass('dom_hidden').css({
               'top': '',
               'left': ''
            });
            $('div.checkgroup_members_footer_right').addClass('dom_hidden').offset({
               top: -1000,
               left: -1000
            });
         }
      }
   });

   // 修改名稱 in 檢視群組 (管理者)
   $('#delete_group_center_btn1').click(function edit_group_name() {
      var groupID = localStorage.editGroup;
      var oldName = $('#' + groupID).children('a').html();
      var newName = prompt('輸入新的群組名稱:', oldName);
      if (newName)
         localStorage.setItem('change_name', newName);
   });

   // 完成 in 新增群組
   $('div.addgroup_footer_right').children('div.addgroup_footer_submit').click(function new_group() {
      var groupName = document.getElementById("group-name").value; // 取得群組名稱
      if (!groupName) { // 群組名稱不得為空
         alert('沒有輸入群組名稱！');
      } else {
         var groupID = "g" + ( new Date().getTime() ); // 設定群組 ID
         setGroup(groupID, groupName, "ADD"); // 設定群組資料
         // 隱藏新增群組界面
         $('#addgroup').addClass('dom_hidden').offset({
            top: -1000,
            left: -1000
         });
         $('#addgroup_background').addClass('dom_hidden').offset({
            top: -1000,
            left: -1000
         });
         $('div.addgroup_container').addClass('dom_hidden').offset({
            top: -1000,
            left: -1000
         });
         $('div.addgroup_footer').addClass('dom_hidden').offset({
            top: -1000,
            left: -1000
         });
         $('div.addgroup_member_container > a').children('[class=temp_]').remove();
         $('div.addgroup_member_container > a:empty').remove();
         $('div.checkgroup_members_container_itemText').removeClass('addgroup_friends_select_on');
      }
   });
   // 完成 in 檢視群組
   $('div.checkgroup_footer_right').children('div.checkgroup_footer_submit').click(function edit_group() {
      var groupID = localStorage.editGroup; // 紀錄編輯中的 group ID
      var groupName = $('#' + groupID).children('a').html(); // 取得群組名稱
      if (localStorage.change_name) {
         groupName = localStorage.change_name;
         $('#' + groupID).children('a').html(groupName);
         $('#' + groupID).children('a').attr('title', groupName);
         if (groupID == localStorage.group_selected) {
            $('div.Group_Board_inf_text').text(groupName);
            $('div.Group_Board_inf_text').attr('g_id', groupID);
         }
      }
      setGroup(groupID, groupName, 'EDIT'); // 設定修改後群組資料
      $('#checkgroup').removeClass('checkgroup_on').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('#checkgroup_background').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.checkgroup_container').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.checkgroup_footer').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.checkgroup_member_container > a').children('[class=temp_]').remove();
      $('div.checkgroup_member_container > a:empty').remove();
      $('div.checkgroup_members_container_itemText').removeClass('checkgroup_friends_select_on').removeClass('checkgroup_keepers_select_on');
      localStorage.removeItem('change_name');
      Group_Board_showMember();
   });
   // 取消 in 新增群組
   $('div.addgroup_footer_right').children('div.addgroup_footer_cancel').click(function cancel_addG() {
      $('#addgroup').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('#addgroup_background').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.addgroup_container').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.addgroup_footer').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.addgroup_member_container > a').children('[class=temp_]').remove();
      $('div.addgroup_member_container > a:empty').remove();
      //$('ul.addgroup_friends_select > li').attr('class', '');
      $('div.checkgroup_members_container_itemText').removeClass('addgroup_friends_select_on');
      removeList();
   });
   // 取消 in 檢視群組
   $('div.checkgroup_footer_right').children('div.checkgroup_footer_cancel').click(function cancel_editG() {
      $('#checkgroup').removeClass('checkgroup_on').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('#checkgroup_background').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.checkgroup_container').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.checkgroup_footer').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.checkgroup_member_container > a').children('[class=temp_]').remove();
      $('div.checkgroup_member_container > a:empty').remove();
      $('div.checkgroup_keeper_container > a').children('[class=temp_]').remove();
      $('div.checkgroup_keeper_container > a:empty').remove();
      $('div.checkgroup_members_container_itemText').removeClass('checkgroup_friends_select_on').removeClass('checkgroup_keepers_select_on');
      localStorage.removeItem('change_name');
      removeList();
      localStorage.removeItem('editGroup');
   });
   // 顯示 選擇成員 介面
   $('a.addmember_add').click(function show_choose_member() {
      var test1 = $('#checkgroup').hasClass('checkgroup_on');
      if (test1) {
         var li_num = $('div.checkgroup_member_container > a').length;
         for (var x = 1; x <= li_num; x++) {
            var temp = $('div.checkgroup_member_container > a:nth-child(' + x + ')').attr('role');
            if (temp) {
               $('div.checkgroup_members_container [role=' + temp + ']').addClass('checkgroup_friends_select_on').css('background-color', '');
            }
         }
         var li_num = $('div.checkgroup_keeper_container > a').length;
         for (var x = 1; x <= li_num; x++) {
            var temp = $('div.checkgroup_keeper_container > a:nth-child(' + x + ')').attr('role');
            if (temp) {
               $('div.checkgroup_members_container_item [role=' + temp + ']').addClass('checkgroup_friends_select_on').css('background-color', '');
            }
         }
         $('div.checkgroup_members_container').removeClass('dom_hidden').css({
            'top': '',
            'left': ''
         });
         $('div.checkgroup_footer_right').addClass('dom_hidden').offset({
            top: -1000,
            left: -1000
         });
         $('div.checkgroup_members_footer_right').removeClass('dom_hidden').css({
            'top': '',
            'left': ''
         });
      } else {
         var li_num = $('div.addgroup_member_container').children('a').length;
         for (var x = 1; x <= li_num; x++) {
            var role = $('div.addgroup_member_container > a:nth-child(' + x + ')').attr('role');
            if (role) {
               $('div.addgroup_members_container [role=' + role + ']').addClass('addgroup_friends_select_on').css('background-color', '');
            }
         }
         $('div.addgroup_members_container').removeClass('dom_hidden').css({
            'top': '',
            'left': ''
         });
         $('div.addgroup_footer_right').addClass('dom_hidden').offset({
            top: -1000,
            left: -1000
         });
         $('div.addgroup_members_footer_right').removeClass('dom_hidden').css({
            'top': '',
            'left': ''
         });
      }
   });
   // 顯示 選擇管理者 介面
   $('a.addkeeper_add').click(function show_choose_admin() {
      var num = $('div.checkgroup_member_container').children('a').length;
      for (var x = 1; x <= num; x++) {
         var temp = $('div.checkgroup_keeper_container > a:nth-child(' + x + ')').attr('role');
         if (temp) {
            $('div.checkgroup_keepers_container [role=' + temp + ']').attr('class', 'checkgroup_keepers_select_on').css('background-color', '');
         }
      }
      $('div.checkgroup_keepers_container').removeClass('dom_hidden').css({
         'top': '',
         'left': ''
      });
      $('div.checkgroup_footer_right').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.checkgroup_keepers_footer_right').removeClass('dom_hidden').css({
         'top': '',
         'left': ''
      });
   });
   // 離開 選擇成員 介面 (新增群組)
   $('div.addgroup_members_footer_right').children('div.addgroup_footer_cancel').click(function close_choose_member() {
      $('div.addgroup_member_container > a').filter('#temp_').remove();
      $('div.addgroup_members_container div.checkgroup_members_container_itemText').css('background-color', '').removeClass('addgroup_friends_select_be_selected');
      $('div.addgroup_members_container').addClass('dom_hidden').offset({
         top: -5000,
         left: -5000
      });
      $('div.addgroup_footer_right').removeClass('dom_hidden').css({
         'top': '',
         'left': ''
      });
      $('div.addgroup_members_footer_right').addClass('dom_hidden').offset({
         top: -5000,
         left: -5000
      });
      removeList();
   });
   // 離開 選擇成員 介面 (檢視群組)
   $('.checkgroup_members_footer_right').children('div.checkgroup_footer_cancel').click(function close_choose_member() {
      $('div.checkgroup_member_container > a').filter('#temp_').remove();
      $('.checkgroup_members_container div.checkgroup_members_container_itemText').css('background-color', '').removeClass('checkgroup_friends_select_be_selected');
      $('div.checkgroup_members_container').addClass('dom_hidden').offset({
         top: -5000,
         left: -5000
      });
      $('div.checkgroup_footer_right').removeClass('dom_hidden').css({
         'top': '',
         'left': ''
      });
      $('div.checkgroup_members_footer_right').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      //removeList();
   });
   // 離開 選擇管理者 介面 (檢視群組)
   $('.checkgroup_keepers_footer_right').children('div.checkgroup_footer_cancel').click(function close_choose_admin() {
      $('div.checkgroup_member_container').append($('div.checkgroup_keeper_container > a').filter('#temp_'));
      $('div.checkgroup_member_container > a').filter('#temp_').attr('id', '');
      $('div.checkgroup_keeper_container > a').filter('#temp_').remove();
      $('div.checkgroup_keepers_container div.checkgroup_members_container_itemText').css('background-color', '').removeClass('checkgroup_keepers_select_be_selected');
      $('div.checkgroup_keepers_container').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
      $('div.checkgroup_footer_right').removeClass('dom_hidden').css({
         'top': '',
         'left': ''
      });
      $('div.checkgroup_keepers_footer_right').addClass('dom_hidden').offset({
         top: -1000,
         left: -1000
      });
   });

});

// 顯示資料庫內使用者所在的群組
function show_groups() {
   $.post('db/g_fetch.php', {
      userid: localStorage.FB_id
   }, function (r) {
      var data = JSON.parse(r);
      var myGroup = '';
      // for (var i = 0, item; item = data[i]; i++) {
      for (var g_id in data) {
         myGroup += '\
         <li class="group_select_checkgroup group-item" id="' + g_id + '">\
            <div class="group_select_checkgroup_check">\
            <div class="group_select_checkgroup_check_icon"></div>\
            <div class="group_select_checkgroup_check_inf">編輯群組</div>\
            </div>\
            <a class="co_a" title="' + data[g_id].g_name + '">' + data[g_id].g_name + '</a>\
         </li>';
      }
      // TODO:
      // 將群組資料存入 localStorage

      $('#addMember').prepend(myGroup);
      if (localStorage.k_word) {
         $('.showtopic_span').children('div').text(localStorage.k_word);
      } else {
         $('.showtopic_span').children('div').text("軟體工程");
      }
      if (localStorage.group_selected) {
         var id = localStorage.group_selected; //console.log(id);    // 取得已選擇群組之ID 
         var name = $('#' + id).children('a').html();
         $('div.Group_Board_inf_text').text(name).attr('g_id', id);
      } else {
         $('div.Group_Board_inf_text').text('尚未選擇群組').attr('g_id', '');
      }
      $('div.Group_Board_inf').show();
      Group_Board_showMember();
   })
      .fail(function (e) {
         console.log(e)
      });
}
// 處理群組資料
function setGroup(gid, gname, mode) {
   var groupData = {
      ID: gid,
      NAME: gname,
      admins: [],
      members: []
   };

   if (mode === 'ADD') { // 新增群組
      // 新增群組到DOM
      var myGroup = '\
        	<li class="group_select_checkgroup group-item" id="' + gid + '">\
				<div class="group_select_checkgroup_check">\
        			<div class="group_select_checkgroup_check_icon"></div>\
        			<div class="group_select_checkgroup_check_inf">編輯群組</div>\
        		</div>\
        		<a class="co_a" href="javascript:;" title="' + gname + '">' + gname + '</a>\
        	</li>';
      $('#addMember').prepend(myGroup);

      // 新增群組創建者(預設管理員)資料
      groupData.admins.push({
         id: localStorage.FB_id,
         name: localStorage.FB_name
      });
      // 取得成員資料
      groupData = setMemberData(groupData);

      // 傳送群組資料到資料庫
      sendGroup(groupData);

   } else if (mode === 'EDIT') { // 修改群組
      // 修改DOM上的群組名稱
      $('li#' + gid + ' a').html(gname);

      // 設定新增的管理員
      var num = $('div.checkgroup_keeper_container').children('a').length;
      for (var x = 1; x <= num; x++) {
         var $a = $('div.checkgroup_keeper_container > a:nth-child(' + x + ')');
         var adminID = $a.attr('role');
         var adminNAME = $a.attr('title');
         groupData.admins.push({
            id: adminID,
            name: adminNAME
         });
      }

      // 取得成員資料
      groupData = setMemberData(groupData);
      sendGroup(groupData);
      localStorage.removeItem('editGroup'); // 結束修改群組
      $('div.checkgroup_keeper_container > a').children('[class=temp_]').remove();
      $('div.checkgroup_keeper_container > a:empty').remove();
   }
}
// 傳送群組資料
function sendGroup(data) {

   if (data) {
      console.log(JSON.stringify(data));
      $.post('./db/g_setting.php',{ data: JSON.stringify(data) })
      .fail(function(x){ console.log(x.responseText); })
      .done(function(r){
         console.log(r);
      });
      removeList();
   }

}

function setMemberData(groupData) {
   // 取得成員資料
   var memberList = getMembers();
   memberList.forEach(function (member) {
      var data = member.split(',');
      groupData.members.push({
         id: data[0],
         name: data[1]
      });
   });
   return groupData;
}
// 刪除點擊之成員
$(document).on('click', 'div.delete-able > a', function detele_member(e) {
   var memberID = $(this).attr('role');
   if (memberID === localStorage.FB_id) {
      // 點自己圖像不刪除
   } else if ($('div.checkgroup_addkeeper_action_add').css('display') === 'none') {
      // 一般成員不能刪除其他成員
   } else if ( confirm('確定刪除？') ) {
      $(this).remove();
      $('div.addgroup_members_container [role=' + memberID + ']')
      .removeClass('addgroup_friends_select_on')
      .removeClass('addgroup_friends_select_be_selected');
      removeMember(memberID);
   }
});
// 刪除點擊之管理員
$(document).on('click', 'div.checkgroup_keeper_container > a', function delete_admin(e) {
   var fbID = $(this).attr('role');
   var fbNAME = $(this).attr('title');
   if (fbID == localStorage.FB_id) {
      // 點自己圖像不刪除
   } else if ($('div.checkgroup_addkeeper_action_add').css("display") == "none") {
      // 一般成員不能刪除管理員
   } else if (confirm('確定刪除？')) {
      console.log("恢復恢復成員身份: " + fbNAME);
      // 恢復成員身份
      $('div.checkgroup_members_container [role=' + fbID + ']').addClass('addgroup_friends_select_on');
      addMember(fbID + ',' + fbNAME);
      $('div.checkgroup_member_container').append('' +
         '<a class="co_a" id="" role="' + fbID + '"' + 'href="javascript: void(0);" title="' + fbNAME + '">' +
         '<img class="temp_" src="https://graph.facebook.com/' + fbID + '/picture" width="40px">' +
         '</a>'
      );
      $(this).remove();
   }
});

// 顯示成員 in 檢視群組
function showMember(id, name) {
   // 加入成員。
   var member = '<a class="co_a" id="" role="' + id + '" href="javascript: void(0);" title="' + name + '"><img class="temp_" src="https://graph.facebook.com/' + id + '/picture" width="40px"></a>';
   $('div.checkgroup_member_container').append(member);
   addMember(id +','+ name);
}
// 顯示管理員
function showAdmin(gid) {
   console.log(gid);
   $.post('php/g_getAdmins.php', {
      sendgid: gid
   })
      .fail(function (x) {
         console.log(x.responseText);
      })
      .done(function (r) {
         console.log(r);
         if (r.substr(0, 1) !== '<' && r !== '[]') {
            var data = JSON.parse(r);
            var admins = data.admins;
            if (admins !== undefined) {
               for (var key = 0; key < admins.length; key++) {
                  var adminID = admins[key].fbid;
                  var adminName = admins[key].fbname;
                  var admin = '<a class="co_a" id="" role="' + adminID + '" href="javascript: void(0);" title="' + adminName + '"><img class="temp_" src="https://graph.facebook.com/' + adminID + '/picture" width="40px"></a>';
                  $('div.checkgroup_keeper_container').append(admin);
               }
            } else console.log("錯誤: 沒有管理員資料");
         } else console.log("錯誤: 取得管理員資料失敗");
      });
}

// 加入成員 到 memberList
function addMember(id_name) {
   // 紀錄新選成員ID；
   var memberList = getMembers(),
      tmp = memberList,
      id = id_name.split(',')[0];
   tmp.forEach( function(val){
      val = val.split(',')[0];
   });
   // 加入成員ID, 避免有重複
   if ($.inArray(id, tmp) === -1)
      memberList.push(id_name);
   // 轉回JSON字串，存回localStorage
   localStorage.setItem('memberList', JSON.stringify(memberList));
   console.log(memberList);
}
// 移除成員 從 memberList
function removeMember(id) {
   var memberList = getMembers(),
      tmp = [],
      removed = '';

   memberList.forEach( function(val){
      tmp.push(val.split(',')[0]);
   });

   console.log(tmp);

   removed = memberList.splice($.inArray(id, tmp), 1);
   localStorage.memberList = JSON.stringify(memberList);
   console.log(memberList);
}
// 取得群組成員清單 (memberList)
function getMembers() {
   var memberList = localStorage.memberList; //從localStorage取得JSON字串
   if (!memberList) { // 項目不存在
      memberList = []; // 建立空陣列
      // if ($('#addgroup').hasClass('dom_hidden')) {
      //    for (var i = 0; i < $('div.checkgroup_member_container > a').length; i++) {
      //       memberList[i] = $('div.checkgroup_member_container > a:nth-child(' + (i + 1) + ')').attr('role');
      //    }
      // } else {
      //    for (var i = 0; i < $('div.addgroup_member_container > a').length; i++) {
      //       memberList[i] = $('div.addgroup_member_container > a:nth-child(' + (i + 1) + ')').attr('role');
      //    }
      // }
      localStorage.setItem('memberList', JSON.stringify(memberList)); //存到localStorage
   } else {
      memberList = JSON.parse(memberList); // 轉成陣列
   }
   return memberList;
}
// 刪除 memberList localStorage
function removeList() {
   // var memberList = getMembers();
   // if (memberList.length) // 陣列不為空
   //    for (var i = 0; i < memberList.length; i++) {
   //       var key = memberList[i];
   //       localStorage.removeItem(key);
   //    }
   localStorage.removeItem('memberList');
}

function removeGroupDom(groupID) {
   if (groupID == localStorage.group_selected) {
      $('div.Group_Board_inf_text').text('尚未選擇群組').attr('g_id', '');
      localStorage.removeItem('group_selected');
      $('.add_workspace').removeClass('cboxElement');
      Group_Board_showMember();
   }
   $('li#' + groupID).remove();
   localStorage.removeItem(groupID);
   $('#checkgroup').removeClass('checkgroup_on').addClass('dom_hidden').offset({
      top: -1000,
      left: -1000
   });
   $('#checkgroup_background').addClass('dom_hidden').offset({
      top: -1000,
      left: -1000
   });
   $('div.checkgroup_container').addClass('dom_hidden').offset({
      top: -1000,
      left: -1000
   });
   $('div.checkgroup_footer').addClass('dom_hidden').offset({
      top: -1000,
      left: -1000
   });
   $('div.checkgroup_member_container > a').children('[class=temp_]').remove();
   $('div.checkgroup_member_container > a:empty').remove();
   $('div.checkgroup_keeper_container > a').children('[class=temp_]').remove();
   $('div.checkgroup_keeper_container > a:empty').remove();
   $('div.checkgroup_members_container_itemText').removeClass('checkgroup_friends_select_on').removeClass('checkgroup_keepers_select_on');
   removeList();
}

function Group_Board_showMember() {
   if (localStorage.getItem('group_selected') == null) {
      $('#Group_Board_area').html('none');
   } else {
      var a = localStorage.getItem('group_selected');
      var b = $('#group_update_hideArea').find('[t_sid=' + a + ']');
      $('#Group_Board_area').html('');
      var c = '';
      for (var i = 1; i <= $(b).children('span').length; i++) {
         c += '<a class="co_a"  target="_blank" href="https://www.facebook.com/' + $(b).children('span:nth-child(' + i + ')').attr('t_member') + '"><img title="' + $(b).children('span:nth-child(' + i + ')').text() + '" src="https://graph.facebook.com/' + $(b).children('span:nth-child(' + i + ')').attr('t_member') + '/picture" width="35px"></a>';
      }
      $('#Group_Board_area').append(c);
   }
}

