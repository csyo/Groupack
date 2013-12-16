$(function(){
	Initial(); localStorage.removeItem('task_done');
	$('#_back').click( function(){
		detect();
		window.location.href = '../index.html';
	});
	$(document).on('click', 'div.todo_checkbox_icon', function(){    //點擊 checkbox
		var a = 0;
		var $a = $(this).parent().prevAll('div.todo_target').children('span');
		var b = localStorage.FB_id;
		for( var i=0; i<$a.length; i++ ){
			if( $( $a[i] ).attr('target_role') == b ){
				a = 1;
				break;
			}
		}
		if( a == 1 )    //自己是目標成員才能點選完成該項 list
			Check_Checkebox(this, $a.length);
	});
	$(document).on('click', 'div.todo_actions_edit', function(){    //點擊 修改
		var $a = $(this).parent().prevAll('div.todo_text');
		var a = $a.text();
		$a.attr('original', a).html('');
		$('<input type="text">').val( a ).appendTo( $a );
		$(this).parent().hide().prevAll('div.editTodo').show();
	});
	$(document).on('dblclick', 'div.todo_text', function(event){    //雙擊 修改
		if( $(this).siblings('.todo_creater').find('span[role='+localStorage.FB_id+']').length > 0 ){
			var a = $(this).text();
			$(this).attr('original', a ).html('');
			$('<input type="text">').val( a ).appendTo( $(this) );
			$(this).nextAll('div.todo_actions').hide().end().nextAll('div.editTodo').show();
		} else {
			event.stopPropagation();
		}
	});
	$(document).on('keyup','div.todo_text',function(event) { // 修改完按 enter: 確定(儲存)修改
		if(event.keyCode == 13) {
			var content = $(this).find('input').val();
			$(this).html( content ).siblings('div.editTodo').hide().end().siblings('div.todo_actions').show();
			send( this.parentNode );
		}
	});
	$(document).on('click', 'div.editTodo_save', function(){    //點擊 確定(儲存)修改
		var $a = $(this).parent();
		var a = $a.prevAll('div.todo_text').children('input').val();
		$a.prevAll('div.todo_text').html( a ).end().hide().nextAll('div.todo_actions').show();
		send( this.parentNode.parentNode );
	});
	$(document).on('click', 'div.editTodo_cancel', function(){    //點擊 取消修改
		var $a = $(this).parent();
		var a = $a.prevAll('div.todo_text').attr('original');
		$a.prevAll('div.todo_text').html( a ).end().hide().nextAll('div.todo_actions').show();
	});
	$(document).on('click', 'div.todo_actions_delete', function(){    //點擊 刪除
		$(this).parents('li.todo').remove();
		drop( this.parentNode.parentNode.id, 'delete' );
	});
	$('#_action').click(function(){    //顯示介面 : 新增 to do list
		localStorage.setItem('todo_target', '');
		$('div.select_member_area div.selected').css({'opacity':'', 'font-weight':''}).removeClass('selected');
		$('#select_member_background').removeClass('dom_hidden').css({'top':'', 'left':''});
		$('#select_member_wrapper').removeClass('dom_hidden').css({'top':'', 'left':''});
		$('div.select_member_container').removeClass('dom_hidden').css({'top':'', 'left':''});
		$('div.select_member_header').removeClass('dom_hidden').css({'top':'', 'left':''});
	});
	$('div.select_member_header_cancel').click(function(){    //離開介面 : 新增 to do list
		$('#select_member_background').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
		$('#select_member_wrapper').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
		$('div.select_member_container').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
		$('div.select_member_header').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
	});
	$(document).on('click', 'div.select_member_container_item', function(){    //點擊 目標成員
		if( $(this).hasClass('selected') ){
			$(this).css({'opacity':'', 'font-weight':''}).removeClass('selected');
		}else{
			$(this).css({'opacity':0.25, 'font-weight':'bold'}).addClass('selected');
		}
	});
	$('div.select_member_header_submit').click(function(){    //to do list介面 : 確定新增
		if( $('div.select_member_area > .selected').length > 0 ){
			var time = nowTime().split(' ');
			$('ul.todoList').prepend(
				'<li id="td'+time[0]+'" class="todo" checkebox="none">'+
					'<div class="todo_target"></div>'+
					'<div class="todo_text">待辦事項，雙擊滑鼠後可編輯，編輯完成按 Enter 或點擊右方儲存</div>'+
					'<div class="editTodo">'+
						'<div class="editTodo_save">&nbsp;</div>'+
						'<div class="editTodo_cancel">&nbsp;</div>'+
					'</div>'+
					'<div class="todo_actions">'+
						'<div class="todo_actions_edit">&nbsp;</div>'+
						'<div class="todo_actions_delete">&nbsp;</div>'+
					'</div>'+
					'<div class="todo_checkbox">'+
						'<div class="todo_checkbox_icon">&nbsp;</div>'+
					'</div>'+
					'<div class="todo_creater">'+
						'<span>負責人：</span>'+
						'<span role="'+localStorage.FB_id+'">'+localStorage.FB_name+'</span>'+
					'</div>'+
					'<div class="todo_overlay">&nbsp;</div>'+
				'</li>'
			);
			/* <span target_role="...">...</span> */
			/* 是用來判斷誰點選 checkbox 用的*/
			/* 若是小明點選 checkbox ，代表他完成這項 list 了 */
			/* 則這個 list 的 <span target_role="...">小明</span> 則移除 */
			/* 若是 list 的 <span target_role="..."></span> 的數量為 0 */
			/* 才刪除這個 list */
			var temp = '';
			for( var i=0; i<$('div.select_member_area').find('.selected').length; i++ ){
				temp += '<span target_role="'+$( $('div.select_member_area').find('.selected')[i] ).children('img').attr('role')+'">'+$( $('div.select_member_area').find('.selected')[i] ).text()+'</span>';
			}
			$('ul.todoList > li:nth-child(1) > div.todo_target').prepend( temp );
			// 關閉界面
			$('#select_member_background').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
			$('#select_member_wrapper').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
			$('div.select_member_container').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
			$('div.select_member_header').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
			$('ul.todoList > li:nth-child(1)').show(250);
			//目標成員介面 還原
			$('div.select_member_container_item').css({'opacity':'', 'font-weight':''}).removeClass('selected');
		}else{
			alert('請選擇目標成員!!');
		}
	});
	$('#group_select_column').change(function(){    //改變 使用者選單 觸發
		var a = $('#group_select_column option:selected').attr('role');
		if( a!='all' ){    //選單選到的使用者   負責人 或是 目標使用者與其相同，則顯示
			$('.column__target').removeClass('column__target');
			$('.column__manager').removeClass('column__manager');
			$('li.todo:has( [target_role='+a+'] )').addClass('column__target');
			$('li.todo:has( [role='+a+'] )').addClass('column__manager');
			$('li.todo').not('.column__target').not('.column__manager').addClass('dom_hidden');
			$('li.todo').filter('.column__target').removeClass('dom_hidden');
			$('li.todo').filter('.column__manager').removeClass('dom_hidden');
		}else{    //顯示全部
			$('.column__target').removeClass('column__target');
			$('.column__manager').removeClass('column__manager');
			$('li.todo').removeClass('dom_hidden');
		}
	});
});
function Initial(){
	var a = localStorage.group_selected;
	var b = JSON.parse( localStorage.getItem('group_selected_member') );
	var c = localStorage.FB_id;
	$('#group_select_column').html('');
	$('div.select_member_area').html('');
	var d = '';
	var e = '';
	for( var i=0; i<b.length; i++ ){
		var user = b[i].split('__');
		d += '<option role="'+user[0]+'">'+user[1]+'</option>';
		e += '<div class="select_member_container_item" select="">'+
				'<img role="'+user[0]+'" title="'+user[1]+'" src="https://graph.facebook.com/'+user[0]+'/picture" width="50px">'+
				'<div class="select_member_container_itemText">'+user[1]+'</div>'+
			'</div>';
	}
	$('#group_select_column').append(d);
	$('div.select_member_area').append(e);
	$('#group_select_column').prepend('<option role="all">全部</option>');
	
	/*
		去資料庫抓資料並顯示
		
		若是這筆資料的"負責人"是使用者自己的話 -> $('.todo_actions').show();
		反之 -> $('.todo_actions').hide();
		以上判斷規則適用於剛創立 list 時
		(創立者 = 負責人)
		只有負責人才能  刪除 修改  該list
	*/
	
	$.post('http://chding.es.ncku.edu.tw/Groupack/todolist/get.php',{ gid: a, fbid: c })
	.fail( function(x) {console.log(x);})
	.done( function(r) {
		
		var data = JSON.parse(r); console.log(r);
		
		if ( data.length ) {
			var li = '';
			for (var i = 0, item; item = data[i]; i++) {
				li += '\
					<li id="'+item.tdid+'" class="todo" checkebox="none">\
						<div class="todo_target">';
				for (var j = 0, executor; executor = item.executor[j]; j++) {
					if ( IdToName(executor) ) {
						li += '<span target_role="'+executor+'">'+IdToName(executor)+'</span>';
					} else { // 不在群組的人
						drop(item.tdid,'drop',executor);
					}
				}
				li += '</div>\
						<div class="todo_text">'+item.content+'</div>';
				li += ( item.assigner === c ) ? '\
						<div class="editTodo">\
							<div class="editTodo_save">&nbsp;</div>\
							<div class="editTodo_cancel">&nbsp;</div>\
						</div>\
						<div class="todo_actions">\
							<div class="todo_actions_edit">&nbsp;</div>\
							<div class="todo_actions_delete">&nbsp;</div>\
						</div>' : '';
				li += '\
						<div class="todo_checkbox">\
							<div class="todo_checkbox_icon">&nbsp;</div>\
						</div>\
						<div class="todo_creater">\
							<span>負責人：</span>\
							<span role="'+item.assigner+'">'+IdToName(item.assigner)+'</span>\
						</div>\
						<div class="todo_overlay">&nbsp;</div>\
					</li>';
			}
			$('ul.todoList').prepend( li );
		}
	});
}
function nowTime(){
	var d = new Date(); 
	var month = d.getMonth()+1; 
	var day = d.getDate(); 
	var hour = d.getHours(); 
	var minute = d.getMinutes(); 
	var second = d.getSeconds(); 
	var time = d.getFullYear() + (month<10 ? '0' : '') + month + (day<10 ? '0' : '') + day + '_' + (hour<10 ? '0' : '') + hour + (minute<10 ? '0' : '') + minute + (second<10 ? '0' : '') + second;
	var now_time = d.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + (hour<10 ? '0' : '') + hour + ':' + (minute<10 ? '0' : '') + minute + ':' + (second<10 ? '0' : '') + second;
	return d.getTime()+' '+now_time;
}

function Check_Checkebox(e, b){
	var a = $(e).parents('li.todo').attr('checkebox');
	if( a == 'none' ){    //已完成
		$(e).addClass('todo_checkbox_icon_checked')
				.parents('li.todo').attr('checkebox', 'checked')
			.end()
				.parent().nextAll('.todo_overlay').show()
			.end()
		//暫時隱藏自己的 span ，代表已完成該項 list
				.prevAll('div.todo_target').find('[target_role='+localStorage.FB_id+']').hide();
//		if( b == 1 ){    //要是自己是最後一位該目標成員的完成者時，自動刪除該 list
//			$(e).parents('li.todo').remove();
//			drop(e.parentNode.parentNode);
//		}
	}else{    //(悔改)
		$(e).removeClass('todo_checkbox_icon_checked')
				.parents('li.todo').attr('checkebox', 'none')
			.end()
				.parent().nextAll('.todo_overlay').hide()
			.end()
		//恢復顯示自己的 span ，代表又未完成該項 list
				.prevAll('div.todo_target').find('[target_role='+localStorage.FB_id+']').show();
	}
	/*
		最後使用者關掉 fancybox ，離開to do list 介面後
		才把 所有隱藏的span移除
		然後存一併存到資料庫
	*/
}

// 傳送到資料庫
function send( item ) {
	
	// 資料
	var tdid = $(item).attr('id'); 
	var content = $(item).find('div.todo_text').text();
	var executor = $(item).find('div.todo_target').children();
	var executorList = [];
	for (var i = 0; i < executor.length; i++)
		executorList.push( $(executor[i]).attr('target_role') );
	
	if ( content !== '' ) {
		$.post( "http://chding.es.ncku.edu.tw/Groupack/todolist/send.php" , { tdid: tdid, content: content, assigner: localStorage.FB_id, executor: JSON.stringify( executorList ), gid: localStorage.group_selected })
		.fail( function(xhr) {console.log(xhr);})
		.done( function(res) {console.log(res);});
	} else {
		alert("你沒有輸入任何文字!");
	}
	
}

function detect() {
	var done = $('ul.todoList').find('span:hidden'); if(done.length>0) console.log("執行: 完成項目移除工作");
	var doneItems = [], info = {};
	for (var i = 0, item; item = done[i]; i++) {
		item = item.parentNode.parentNode;
		var tdid = $(item).attr('id');
		var assigner = $(item).find('div.todo_creater span[role]').attr('role');
		var doublefacer = $(item).find('div.todo_target span[target_role='+assigner+']').length;
		var mode = 'drop';
		if ( ( assigner === localStorage.FB_id ) && ( doublefacer === 0 ) ){
			mode = 'delete';
		}
		info = { tdid: tdid, mode: mode };
		doneItems.push(info);
	}
	localStorage.setItem("task_done",JSON.stringify(doneItems));
}

function drop( tdid, mode, fbid ) {
	console.log( mode+" 執行中" );
	$.post( "http://chding.es.ncku.edu.tw/Groupack/todolist/drop.php" , { tdid: tdid, fbid: fbid || localStorage.FB_id, mode: mode })
	.fail( function(xhr) {console.log(xhr);})
	.done( function(res) {console.log(res);});
}

function IdToName( fbid ) {
	var memberList = JSON.parse(localStorage.group_selected_member);
	for (var i = 0; i < memberList.length; i++) {
		var idname = memberList[i].split('__');
		if ( idname[0] === fbid ) {
			return idname[1];
		}
	}
}