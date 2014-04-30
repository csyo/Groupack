// Leave group
$(document).on('click', '#group-box_leave', function(e) {
	$('#group-box').hide();
	$('body').css('overflow', '');
});
// Leave 'Add Group'
$(document).on('click', '#addgroup-leave', function(e) {
	$('#addgroup').hide().siblings('#addgroup_background').hide();
   $('#addgroup-member-area').find('a').remove();
   removeList();
});
// Leave 'Edit Group' UI
$(document).on('click', '#checkgroup-leave', function(e) {
	$('#checkgroup').hide().siblings('#checkgroup_background').hide();
});
// Show 'Edit Group' UI
$(document).on('click', '#group-user > div > div.edit', function(e) {
	show_checkG(e);
	$('#checkgroup').show().siblings('#checkgroup_background').show();
   removeList();
});
// Leave 'Add Members' UI @ 'Add Group'
$(document).on('click', '#addgroup-back', function(e) {
	$('#addgroup-member-area > a').filter('#temp_').remove();
	$('#addgroup [level=2]').addClass('dom_hidden').find('div.checkgroup_members_container_itemText').css('background-color', '').removeClass('addgroup_friends_select_be_selected');
	$('#addgroup-submit').removeClass('dom_hidden').siblings('#addgroup-back').addClass('dom_hidden');
});
// Leave 'Add Members' UI @ 'Edit Group'
$(document).on('click', '#checkgroup-back', function(e) {
	$('#checkgroup-member-area > a').filter('#temp_').remove();
	$('#checkgroup [level=2]').addClass('dom_hidden').find('div.checkgroup_members_container_itemText').css('background-color', '').removeClass('addgroup_friends_select_be_selected');
	$('#checkgroup-submit').removeClass('dom_hidden').siblings('#checkgroup-back').addClass('dom_hidden');
});
// Leave 'Add Administers' @ 'Edit Group'
$(document).on('click', '#checkgroup-back-keeper', function(e) {
	$('#checkgroup-member-area').append($('#checkgroup-keeper-area > a').filter('#temp_'));
	$('#checkgroup-member-area > a').filter('#temp_').attr('id', '');
	$('#checkgroup-keeper-area > a').filter('#temp_').remove();
	$('#checkgroup [level=3]').addClass('dom_hidden').find('div.checkgroup_members_container_itemText').css('background-color', '').removeClass('checkgroup_keepers_select_be_selected');
	$('#checkgroup-submit').removeClass('dom_hidden').siblings('#checkgroup-back-keeper').addClass('dom_hidden');
});
// Show 'Add Members' UI @ 'Add Group'
$(document).on('click', '#addgroup a.addmember_add', function(e) {
	var li_num = $('#addgroup-member-area').children('a').length;
	 for (var x = 1; x <= li_num; x++) {
		var role = $('#addgroup-member-area > a:nth-child(' + x + ')').attr('role');
		if (role) {
		   $('#addgroup [level=2] [role=' + role + ']').addClass('addgroup_friends_select_on').css('background-color', '');
		}
	 }
	 $('#addgroup [level=2]').removeClass('dom_hidden');
	 $('#addgroup-submit').addClass('dom_hidden').siblings('#addgroup-back').removeClass('dom_hidden');
});

// Show 'Add Members' UI @ 'Edit Group'
$(document).on('click', '#checkgroup a.addmember_add', function(e) {
	var li_num = $('#checkgroup-member-area > a').length;
	for (var x = 1; x <= li_num; x++) {
		var temp = $('#checkgroup-member-area > a:nth-child(' + x + ')').attr('role');
		if (temp) {
		   $('#checkgroup [level=2] [role=' + temp + ']').addClass('checkgroup_friends_select_on').css('background-color', '');
		}
	}
	var li_num = $('#checkgroup-keeper-area > a').length;
	for (var x = 1; x <= li_num; x++) {
		var temp = $('#checkgroup-keeper-area > a:nth-child(' + x + ')').attr('role');
		if (temp) {
		   $('div.checkgroup_members_container_item [role=' + temp + ']').addClass('checkgroup_friends_select_on').css('background-color', '');
		} 
	}
	$('#checkgroup [level=2]').removeClass('dom_hidden');
	$('#checkgroup-submit').addClass('dom_hidden').siblings('#checkgroup-back').removeClass('dom_hidden');
	$('div.checkgroup_footer_right').addClass('dom_hidden');
	$('div.checkgroup_members_footer_right').removeClass('dom_hidden');
});

// Toggle 'Public/Private' @ 'Add Group'
$(document).on('click', '#addgroup_btn', function(e) {
	$(this).siblings('div.activated').siblings('div').addClass('activated').end().removeClass('activated');
});
// Toggle 'Public/Private' @ 'Edit Group'
$(document).on('click', '#checkgroup_btn', function(e) {
	$(this).siblings('div.activated').siblings('div').addClass('activated').end().removeClass('activated');
});

// Submit @ 'Edit Group'
$('#checkgroup-submit').click(function(){
   var data = localStorage.editGroup.split('_');
   setGroup({ gid: data[0] , gname: data[1] , mode: 'EDIT' }, function(){
      $('#checkgroup-leave').click();
      $('#checkgroup-keeper-area').find('a').remove();
      $('#checkgroup-member-area').find('a').remove();
   });
});
// Submit @ 'Add Group'
$('#addgroup-submit').click(function(){
   var name = $('#group-name').val();
   if (!name) {
      alertify.alert('請輸入群組名稱');
      return;
   }
   var data = ['g'+createID(), $('#group-name').val()];
   setGroup({ gid: data[0] , gname: data[1] , mode: 'ADD' }, function(){
      $('#addgroup-leave').click();
      $('#addgroup-member-area').find('a').remove();
   });
});

$('#leave-group').click(function(){
   delete localStorage.group_selected;
   sessionEnd();
   logSession();
   Group_Board_showMember();
});

// Generate member list @ 'Add Administers'
$(document).on('click', '#checkgroup a.addkeeper_add', function show_admin_list() {
   var div = '',
      $keepersContainer = $('#checkgroup [level=3]'),
      $keepers = $keepersContainer.children('div'),
      $members = $('#checkgroup-member-area').children('a');

   if ($keepers.length != 0)
      $keepers.remove();

   for (var x = 0, item; item = $members[x]; x++) {
      div += '\
      <div class="checkgroup_members_container_item">\
         <div class="checkgroup_members_container_itemText" role="' + $(item).attr('role') + '">' + $(item).attr('title') + '</div>\
      </div>';
   }
   $keepersContainer.append(div).removeClass('dom_hidden');
   $('#checkgroup-back-keeper').removeClass('dom_hidden');
   $('#checkgroup-submit').addClass('dom_hidden');
});
// Generate friend list @ both 'Add Members'
$(function show_friend_list() {
   var friendsJson = localStorage.getItem('FB_friends');
   var friends = JSON.parse(friendsJson);
   // 依照字母/筆畫排序
   friends.sort(function(a, b) {
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
   });
   $('#checkgroup [level=2] > div').remove();
   var friendsList = '';
   for (var key = 0; key < friends.length; key++) {
      friendsList += '<div class="checkgroup_members_container_item">' +
         '<div class="checkgroup_members_container_itemText" role="' + friends[key][0] + '">' + friends[key][1] + '</div>' +
         '</div>';
   }
   $('#checkgroup [level=2] > form').after(friendsList);
   $('#addgroup [level=2] > form').after(friendsList);
});
// Live search @ 'Add Members'
$(function search_name() {
   $('#live-search-filter1').keyup(function() { // Retrieve the input field text and reset the count to zero

      var filter = $(this).val(),
         count = 0; // Loop through the comment list

      $('#addgroup [level=2] div.checkgroup_members_container_itemText').each(function() { // If the list item does not contain the text phrase fade it out

         if ($(this).text().search(new RegExp(filter, 'i')) < 0) {
            $(this).parent().addClass('dom_hidden'); // Show the list item if the phrase matches and increase the count by 1

         } else {
            $(this).parent().removeClass('dom_hidden');
            count++;
         }
      });
   });

   $('#live-search-filter2').keyup(function() { // Retrieve the input field text and reset the count to zero

      var filter = $(this).val(),
         count = 0; // Loop through the comment list

      $('#checkgroup [level=2] div.checkgroup_members_container_itemText').each(function() { // If the list item does not contain the text phrase fade it out

         if ($(this).text().search(new RegExp(filter, "i")) < 0) {
            $(this).parent().addClass('dom_hidden'); // Show the list item if the phrase matches and increase the count by 1

         } else {
            $(this).parent().removeClass('dom_hidden');
            count++;
         }
      });
   });
});

// Get user's role of a specific group
function groupRoleInfo(groupID) {
   if (groupID) return $.post("db/g_info.php", {
      gID: groupID
   });
}

// select clicked group
$(document).on('click', '#group-user div.group-item', function show_select_group(e) {
   if (e.target.className === 'edit') return;
   var groupID = this.id;
   if (groupID === localStorage.group_selected) {
      alertify.alert('已經選擇此群組了。');
   } else if (groupID){
      $('#group-box_leave').click();
      sessionEnd();
      logSession(groupID); // 開始新的 session log
      var groupName = $(this).find('div.name').text();
      $('div.select_group_notify_wrapper_show').text(groupName);
      $('div.Group_Board_inf_text').text(groupName).attr('g_id', groupID);
      $('#select_group_notify').toggle(400).delay(2400).hide(400);
      localStorage.setItem('group_selected', groupID);
      $('#wrapper').find('div.search_result_inf_field_content').removeClass('dom_hidden');
      $('div.Group_Board_inf_text').text(groupName).attr('g_id', groupID);
      Group_Board_showMember();
      get_topic_relevance();
   }
});

// Select Member in 'Add Members' @ 'Add Group'
$(document).on('click', '#addgroup [level=2] div.checkgroup_members_container_itemText', function choose_member() {
  if (!$(this).hasClass('addgroup_friends_select_on')) {
	 if (!$(this).hasClass('addgroup_friends_select_be_selected')) {
		$(this).addClass('addgroup_friends_select_be_selected').css('background-color', 'rgba(59, 120, 240, 0.87)');
		var fbID = $(this).attr('role');
		var fbNAME = $(this).text();
		addMember(fbID + ',' + fbNAME);
		$('#addgroup-member-area').append('' +
		   '<a class="co_a" role="' + fbID + '"' + 'href="javascript: void(0);" title="' + fbNAME + '">' +
		   '<img class="temp_" src="https://graph.facebook.com/' + fbID + '/picture" width="40px">' +
		   '</a>'
		);
	 } else {
		var fbID = $(this).attr('role');
		$('#' + fbID + '').remove();
		$('#addgroup-member-area [role=' + fbID + ']').remove();
		$(this).css('background-color', '').removeClass('addgroup_friends_select_be_selected');
		removeMember(fbID);
	 }
  }
});

// Select Member in 'Add Members' @ 'Edit Group'
$(document).on('click', '#checkgroup [level=2] div.checkgroup_members_container_itemText', function choose_member() {
  if (!$(this).hasClass('checkgroup_friends_select_on')) {
	 if (!$(this).hasClass('checkgroup_friends_select_be_selected')) {
		$(this).addClass('checkgroup_friends_select_be_selected').css('background-color', 'rgba(59, 120, 240, 0.87)');
		var fbID = $(this).attr('role'); // console.log(fbID);
		var fbNAME = $(this).text(); // console.log(fbNAME);
		addMember(fbID + ',' + fbNAME);
		$('#checkgroup-member-area').append(
		   '<a class="co_a" role="' + fbID + '"' + 'href="javascript:;" title="' + fbNAME + '">' +
		   '<img class="temp_" src="https://graph.facebook.com/' + fbID + '/picture" width="40px">' +
		   '</a>'
		);
	 } else {
		var fbID = $(this).attr('role');
		$('#checkgroup-member-area').children('[role=' + fbID + ']').remove();
		$(this).css('background-color', '').removeClass('checkgroup_friends_select_be_selected');
		removeMember(fbID);
	 }
  }
});

// Select admininsters in 'Add Administers' @ 'Edit Group'
$(document).on('click', '#checkgroup [level=3] div.checkgroup_members_container_itemText', function choose_admin() {
  if (!$(this).hasClass('checkgroup_keepers_select_on')) {
	 var fbID = $(this).attr('role');
	 console.log(fbID);
	 var fbNAME = $(this).text();

	 if (!$(this).hasClass('checkgroup_keepers_select_be_selected')) {
		$(this).addClass('checkgroup_keepers_select_be_selected').css('background-color', 'rgba(59, 120, 240, 0.87)');
		$('#checkgroup-keeper-area').append(
		   '<a class="co_a" role="' + fbID + '"' + 'href="javascript: void(0);" title="' + fbNAME + '">' +
		   '<img class="temp_" src="https://graph.facebook.com/' + fbID + '/picture" width="40px">' +
		   '</a>'
		);
		removeMember(fbID);
		$('#checkgroup-member-area').children('[role=' + fbID + ']').remove();
	 } else {
		$('#checkgroup-keeper-area').children('[role=' + fbID + ']').remove();
		$(this).css('background-color', '').removeClass('checkgroup_keepers_select_be_selected');
		addMember(fbID + ',' + fbNAME);
		$('#checkgroup-member-area').append(
		   '<a class="co_a" id="' + fbID + '" role="' + fbID + '"' + 'href="javascript:;" title="' + fbNAME + '">' +
		   '<img class="temp_" src="https://graph.facebook.com/' + fbID + '/picture" width="40px">' +
		   '</a>'
		);
	 }
  }
});

// leave or delete group @ 'Edit Group'
$(document).on('click','#checkgroup-depart', function () {
	 alertify.confirm('確定要離開這個群組？', function(e){
       if (e) {
   		var groupID = localStorage.editGroup.split('_')[0];
   		var myID = localStorage.FB_id;
   		$.post('db/g_remove.php', {
   		   gid: groupID,
   		   fbid: myID
   		})
   		   .fail(function(x) {
   			  console.log(x.responseText);
   		   })
   		   .done(function(r) {
   			  console.log(r);
   		   });
   		removeGroupDom(groupID);
   		$('#checkgroup [level=2]').addClass('dom_hidden');
   		$('div.checkgroup_footer_right').removeClass('dom_hidden');
   		$('div.checkgroup_members_footer_right').addClass('dom_hidden');
   	 }
    });
});

$('#checkgroup-delete').click(function(){
   alertify.confirm('確定刪除這個群組？\nAre you sure to delete the group?', function(e){
       if (e) {
         var groupID = localStorage.editGroup.split('_')[0];
         $.post('db/g_remove.php', {
            gid: groupID
         })
            .done(function(r) {
              console.log(r);
            });
         removeGroupDom(groupID);
         $('#checkgroup [level=2]').addClass('dom_hidden');
         $('div.checkgroup_footer_right').removeClass('dom_hidden');
         $('div.checkgroup_members_footer_right').addClass('dom_hidden');
       }
      });
});

// Fetch group data and show

function show_groups() {
   getGroupUpdated().success(function(r) {
      var div = '',
         data = updateGroupData(r);

      for (var g_id in data) {
         div += '<div class="group-item" id="' + g_id + '"><div class="name">' + data[g_id].g_name + '</div><div class="edit">&nbsp;</div></div>';
      }

      $('#group-user').find('div.group-item').remove().end().append(div);
   });
}

// 更新最新群組資料
function getGroupUpdated() {
   return $.post('db/g_fetch.php', {
      userid: localStorage.FB_id
   })
      .done(function(r) {
         updateGroupData(r);
         console.log('完成群組資料更新');
      });
}

function updateGroupData(r) {
   // 將群組資料暫存，附上時間戳
   try {
      var data = JSON.parse(r);
      data.timestamp = new Date();
      localStorage.setItem('group_data', JSON.stringify(data));
      delete data.timestamp;
      return data;
   } catch (e) {
      console.err(e);
      return;
   }
}

/** 
 *  Setup group data before sending
 *  @param conf - conf = { gid: ... , gname: ... , mode: ... }
 */

function setGroup(conf, callback) {
   var groupData = {
      ID: conf.gid,
      NAME: conf.gname,
      admins: [],
      members: []
   };

   if (conf.mode === 'ADD') { // 新增群組
      // 新增群組到DOM
      var div = '<div class="group-item" id="' + conf.gid + '"><div class="name">' + conf.gname + '</div><div class="edit">&nbsp;</div></div>';
      $('#group-user').append(div);

      // 新增群組創建者(預設管理員)資料
      groupData.admins.push({
         id: localStorage.FB_id,
         name: localStorage.FB_name
      });
      // 取得成員資料
      groupData = setMemberData(groupData);

      // 傳送群組資料到資料庫
      sendGroup(groupData);

   } else if (conf.mode === 'EDIT') { // 修改群組
      // 修改DOM上的群組名稱
      $('div#' + conf.gid).find('div.name').text(conf.gname);

      // 設定新增的管理員
      var num = $('#checkgroup-keeper-area').children('a').length;
      for (var x = 1; x <= num; x++) {
         var $a = $('#checkgroup-keeper-area > a:nth-child(' + x + ')');
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
   }
   callback && callback();
}

// Sending group data to database

function sendGroup(data) {

   if (data) {
      console.log(JSON.stringify(data));
      $.post('./db/g_setting.php', {
         data: JSON.stringify(data),
         fid: 'f' + createID()
      })
         .fail(function(x) {
            console.log(x.responseText);
         })
         .done(function(r) {
            console.log(r);
            Group_Board_showMember();
            getGroupUpdated();
         });
      removeList();
   }

}

function setMemberData(groupData) {
   var memberList = getMembers();
   memberList.forEach(function(member) {
      var data = member.split(',');
      groupData.members.push({
         id: data[0],
         name: data[1]
      });
   });
   return groupData;
}

// delete clicked member (temp.)
$(document).on('click', 'div.delete-able > a', function detele_member(e) {
   var memberID = $(this).attr('role');
   if (memberID === localStorage.FB_id) {
      // 點自己圖像不刪除
   } else if ($('div.checkgroup_addkeeper_action_add').css('display') === 'none') {
      // 一般成員不能刪除其他成員
   } else alertify.confirm('確定刪除？', function(e){
      if (e) {
         $(this).remove();
         $('div.addgroup_members_container [role=' + memberID + ']')
            .removeClass('addgroup_friends_select_on')
            .removeClass('addgroup_friends_select_be_selected');
         removeMember(memberID);
      }
   });
});
// delete clicked admin (temp.)
$(document).on('click', '#checkgroup-keeper-area > a', function delete_admin(e) {
   var fbID = $(this).attr('role');
   var fbNAME = $(this).attr('title');
   if (fbID == localStorage.FB_id) {
      // 點自己圖像不刪除
   } else if ($('div.checkgroup_addkeeper_action_add').css("display") == "none") {
      // 一般成員不能刪除管理員
   } else alertify.confirm('確定刪除？', function(e){
      if (e) {
         console.log("恢復恢復成員身份: " + fbNAME);
         // 恢復成員身份
         $('#checkgroup [level=2] [role=' + fbID + ']').addClass('addgroup_friends_select_on');
         addMember(fbID + ',' + fbNAME);
         $('#checkgroup-member-area').append('' +
            '<a class="co_a" id="" role="' + fbID + '"' + 'href="javascript: void(0);" title="' + fbNAME + '">' +
            '<img class="temp_" src="https://graph.facebook.com/' + fbID + '/picture" width="40px">' +
            '</a>'
         );
         $(this).remove();
      }
   });
});

// 加入成員 到 memberList

function addMember(id_name) {
   // 紀錄新選成員ID；
   var memberList = getMembers(),
      tmp = memberList,
      id = id_name.split(',')[0];
   tmp.forEach(function(val) {
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

   memberList.forEach(function(val) {
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
      localStorage.setItem('memberList', JSON.stringify(memberList)); //存到localStorage
   } else {
      memberList = JSON.parse(memberList); // 轉成陣列
   }
   return memberList;
}
// 刪除 memberList localStorage

function removeList() {
   localStorage.removeItem('memberList');
}

function removeGroupDom(groupID) {
   if (groupID == localStorage.group_selected) {
      $('div.Group_Board_inf_text').text('尚未選擇群組').attr('g_id', '');
      localStorage.removeItem('group_selected');
      $('.add_workspace').removeClass('cboxElement');
      Group_Board_showMember();
   }
   $('div#' + groupID).remove();
   localStorage.removeItem(groupID);
   $('#checkgroup').removeClass('checkgroup_on').addClass('dom_hidden');
   $('#checkgroup_background').addClass('dom_hidden');
   $('div.checkgroup_container').addClass('dom_hidden');
   $('div.checkgroup_footer').addClass('dom_hidden');
   $('#checkgroup-member-area > a').children('[class=temp_]').remove();
   $('#checkgroup-member-area > a:empty').remove();
   $('#checkgroup-keeper-area > a').children('[class=temp_]').remove();
   $('#checkgroup-keeper-area > a:empty').remove();
   $('div.checkgroup_members_container_itemText').removeClass('checkgroup_friends_select_on').removeClass('checkgroup_keepers_select_on');
   removeList();
}

function Group_Board_showMember() {
   var a = localStorage.group_selected || null;
   if (!a) {
      $('div.Group_Board_inf_text').text('尚未選擇群組').attr('g_id', '');
   } else {
      var name = $('#'+a).find('div.name').text();
      $('div.Group_Board_inf_text').text(name).attr('g_id', a);
      // 取得群組資料
      var groupInfo = groupRoleInfo(a),
         temp = '';
      groupInfo.success(function(r) { //console.log('-->'+r);
         var data = JSON.parse(r),
            role = 'MEMBER',
            data, ADs = '',
            MBs = '';
         // 處理資料
         data.every(function(obj) {
            var id = obj.id,
               name = obj.name,
               _role = obj.role;
            temp += '<a class="co_a"  target="_blank" href="https://www.facebook.com/' + id + '"><img title="' + name + '" src="https://graph.facebook.com/' + id + '/picture" width="35px"></a>';
            return true;
         });
         localStorage.setItem('group_members', r);
         $('#Group_Board_area').html(temp);
      });
   }
}

// show 'Add Group' UI
function showAddGroup(){
	$('#addgroup').removeClass('dom_hidden').attr('style', '');
	$('#addgroup_background').removeClass('dom_hidden').attr('style', '');
	$('div.addgroup_container').removeClass('dom_hidden').attr('style', '');
	$('div.addgroup_footer').removeClass('dom_hidden').attr('style', '');
	// 將自己加到清單中
	var myId = localStorage.FB_id;
	if (!document.getElementById(myId)) {
		var me = '<a class="co_a" id="' + myId + '" role="' + myId + '" href="javascript:;" title="' + localStorage.FB_name + '"><img class="temp_" src="https://graph.facebook.com/' + myId + '/picture" width="40px"></a>';
		$('#addgroup-member-area').find('a').remove().end().append(me);
	}
	$('#group-name').focus().select();
}

// Show 'Edit Group'
function show_checkG(e) {
  $('#checkgroup').addClass('checkgroup_on').removeClass('dom_hidden').attr('style', '');
  $('#checkgroup_background').removeClass('dom_hidden').attr('style', '');
  $('div.checkgroup_container').removeClass('dom_hidden').attr('style', '');
  $('div.checkgroup_footer').removeClass('dom_hidden').attr('style', '');
  $('div.checkgroup_header_text').text($(e.target).next().text());
  var groupID = e.target.parentNode.id,
      groupName = $('#' + groupID).text();
  localStorage.setItem('editGroup', groupID+'_'+groupName);

  // 取得群組資料
  var groupInfo = groupRoleInfo(groupID);
  groupInfo.success(function(r) {
	 var data = JSON.parse(r),
		role = 'MEMBER',
		data, ADs = '',
		MBs = '';
	 // 處理資料
	 data.every(function(obj) {
		var id = obj.id,
		   name = obj.name,
		   _role = obj.role;
		if (id === localStorage.FB_id) {
		   role = _role;
		};
		if (_role === 'ADMIN') {
		   ADs += '\
			  <a class="co_a" id="" role="' + id + '" href="javascript: void(0);" title="' + name + '">\
				 <img class="temp_" src="https://graph.facebook.com/' + id + '/picture" width="40px">\
			  </a>';
		} else {
		   MBs += '<a class="co_a" id="" role="' + id + '" href="javascript: void(0);" title="' + name + '">' +
			  '<img class="temp_" src="https://graph.facebook.com/' + id + '/picture" width="40px">' +
			  '</a>';
		   addMember(id + ',' + name);
		};
		return true;
	 });

	 if (role == 'MEMBER') {
      $('#checkgroup-depart').removeClass('dom_hidden');
      $('#checkgroup-delete').addClass('dom_hidden');
	 } else {
      $('#checkgroup-depart').addClass('dom_hidden');
      $('#checkgroup-delete').removeClass('dom_hidden');
	 }

	 $('#checkgroup-member-area').find('a').remove().end().append(MBs);
	 $('#checkgroup-keeper-area').find('a').remove().end().append(ADs);

  });
}