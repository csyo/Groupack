//上次數据保存時間
var T_timestamp = 0;
//獲取數据是否有錯誤
var error = false;
//長連接服務器，請求數据
function T_long_connect(){
	$.ajax({
		data : { 'timestamp' : T_timestamp, 'FB_id' : localStorage.FB_id },
		url : 'http://chding.es.ncku.edu.tw/Groupack/T_get.php',
		type : 'get',
		headers: {'cache-control': 'no-cache'},
		timeout : 0,
		success : function(response){
			console.log('LongPolling 有資料回傳'/*+response*/);
			//格式化返回數据
			var data = JSON.parse(response);		
			//設置錯誤信息
			error = false;
			//設置上次數据保存時間
			T_timestamp = data.timestamp;
			//顯示獲取的數据
			T_long_connect_success( response );
		},
		error : function(){
			console.log('LongPolling 連接錯誤');
			//設置錯誤信息
			error = true;
			//5s后再次連接服務器
			setTimeout(function(){ T_long_connect();}, 5000);
		},
		complete : function(){
			if (error){
				//如果有錯，5s后再次連接服務器
				setTimeout(function(){T_long_connect();}, 5000);
				console.log('LongPolling 連接錯誤');
			}
			else{
				//如果獲取信息成功，則再次連接服務器
				T_long_connect();
				console.log('LongPolling 成功獲取數據');
			}
		}
	});
}
//保存數据到服務器
function T_savedata(msg1,msg2,msg3,msg4){
	$.ajax({
		data : { 'FB_id' : localStorage.FB_id,'remove_ID' : msg1,'check_Group': msg2,'check_WFC': msg3,'initial': msg4 },
		type : 'post',
		url : 'http://chding.es.ncku.edu.tw/Groupack/T_put.php',
		success : function(response){    //console.log(response);
			localStorage.setItem('T_savedataTimeout', '');
			localStorage.setItem('Timeline_Selected', 'all_all_all_all');
			$('#timeline_select_column_g').val('全部');
			$('#timeline_select_column_w').val('全部');
			$('#timeline_select_column_f').val('全部');
			$('#timeline_select_column_user').val('全部');
			$('div.timeline_column > div').show();
			$('#timeline_update_temp > div').show();
		}
	});
}
function T_long_connect_success( response ){    //成功獲取 long polling 更新的資料
	var a = JSON.parse( response ).msg.split('+++');
	localStorage.setItem('T_CheckGroup', a[9]);
	localStorage.setItem('T_Check_WFC', a[10]);
	if( JSON.parse( a[6] )['removeID'] == 'none' ){
		T_addData( response );
	}else{
		T_removeData( a[6], a[0] );
	}
}
function T_removeData( a, b ){    //從 timeline 移除資料
	switch( JSON.parse( a )['removeID'][0] ){
		case 'w': 
			var _isHas = 0;
			if( $('div.timeline_workspace').length > 0 ){
				for( var i=0; i<$('div.timeline_workspace').length; i++ ){
					if( $('div.timeline_column > div.timeline_workspace:nth-child('+(i+1)+')').attr('t_sid')==JSON.parse( a )['removeID'] ){
						_isHas = 1;
						break;
					}
					if( $('#timeline_update_temp > div.timeline_workspace:nth-child('+(i+1)+')').attr('t_sid')==JSON.parse( a )['removeID'] ){
						_isHas = 1;
						break;
					}
				}
			}
			if( _isHas == 1 ){
				var update_notify = '<div class="Timeline_NotificationArea_origin isotope">'+
					'<div class="Timeline_NotificationArea_origin_content">'+
						'<span role="timeline_g">'+$('div.timeline_workspace[t_sid='+JSON.parse( a )['removeID']+']').find('[role=timeline_g]').text()+'</span>'+
					'</div>'+
				'</div>'+
				'<div class="Timeline_Notification isotope">'+
					'<div class="Timeline_Notification_icon">'+
						'<img src="Image/workspace_blue.png" width="30px">'+
					'</div>'+
					'<div class="Timeline_Notification_event">'+
						'<span role="'+$('div.timeline_workspace[t_sid='+JSON.parse( a )['removeID']+']').find('div.timeline_workspace_time_user').attr('role')+'">'+$('div.timeline_workspace[t_sid='+JSON.parse( a )['removeID']+']').find('div.timeline_workspace_time_user').text()+'</span>'+
						'<span>刪除了</span>'+
						'<p>'+$('div.timeline_workspace[t_sid='+JSON.parse( a )['removeID']+']').find('h2 > a').text()+'</p>'+
					'</div>'+
				'</div>';
				$('#timeline_update_temp > div.timeline_workspace[t_sid='+JSON.parse( a )['removeID']+']').remove();
				$('#timeline_update_temp > div.timeline_folder:has([T_wID='+JSON.parse( a )['removeID']+'])').remove();
				$('#timeline_update_temp > div.timeline_card:has([T_fID='+JSON.parse( a )['removeID']+'])').remove();
				$('div.timeline_workspace[t_sid='+JSON.parse( a )['removeID']+']').remove();
				$('div.timeline_folder:has([T_wID='+JSON.parse( a )['removeID']+'])').remove();
				$('div.timeline_card:has([T_fID='+JSON.parse( a )['removeID']+'])').remove();
				$('#timeline_select_column_w > [t_wid='+JSON.parse( a )['removeID']+']').remove();
				$('#timeline_select_column_f > [t_wid='+JSON.parse( a )['removeID']+']').remove();
				$('#timeline_select_hideArea_w > [t_wid='+JSON.parse( a )['removeID']+']').remove();
				$('#timeline_select_hideArea_f > [t_wid='+JSON.parse( a )['removeID']+']').remove();
			}
			break;
		case 'f': 
			var _isHas = 0;
			if( $('div.timeline_folder').length > 0 ){
				for( var i=0; i<$('div.timeline_folder').length; i++ ){
					if( $('div.timeline_column > div.timeline_folder:nth-child('+(i+1)+')').attr('t_sid')==JSON.parse( a )['removeID'] ){
						_isHas = 1;
						break;
					}
					if( $('#timeline_update_temp > div.timeline_folder:nth-child('+(i+1)+')').attr('t_sid')==JSON.parse( a )['removeID'] ){
						_isHas = 1;
						break;
					}
				}
			}
			if( _isHas == 1 ){
				var update_notify = '<div class="Timeline_NotificationArea_origin isotope">'+
					'<div class="Timeline_NotificationArea_origin_content">'+
						'<span role="timeline_g">'+$('div.timeline_folder[t_sid='+JSON.parse( a )['removeID']+']').find('[role=timeline_g]').text()+'</span>'+
						'<span role="timeline_w">'+$('div.timeline_folder[t_sid='+JSON.parse( a )['removeID']+']').find('[role=timeline_w]').text()+'</span>'+
					'</div>'+
				'</div>'+
				'<div class="Timeline_Notification isotope">'+
					'<div class="Timeline_Notification_icon">'+
						'<img src="Image/folder_blue.png" width="30px">'+
					'</div>'+
					'<div class="Timeline_Notification_event">'+
						'<span role="'+$('div.timeline_folder[t_sid='+JSON.parse( a )['removeID']+']').find('div.timeline_folder_time_user').attr('role')+'">'+$('div.timeline_folder[t_sid='+JSON.parse( a )['removeID']+']').find('div.timeline_folder_time_user').text()+'</span>'+
						'<span>刪除了</span>'+
						'<p>'+$('div.timeline_folder[t_sid='+JSON.parse( a )['removeID']+']').find('h2 > a').text()+'</p>'+
					'</div>'+
				'</div>';
				$('#timeline_update_temp > div.timeline_folder[t_sid='+JSON.parse( a )['removeID']+']').remove();
				$('#timeline_update_temp > div.timeline_card:has([T_fID='+JSON.parse( a )['removeID']+'])').remove();
				$('div.timeline_folder[t_sid='+JSON.parse( a )['removeID']+']').remove();
				$('div.timeline_card:has([T_fID='+JSON.parse( a )['removeID']+'])').remove();
				$('#timeline_select_column_f > [t_fid='+JSON.parse( a )['removeID']+']').remove();
			}
			break;
		case 'c': 
			var _isHas = 0;
			if( $('div.timeline_card').length > 0 ){
				for( var i=0; i<$('div.timeline_card').length; i++ ){
					if( $('div.timeline_column > div.timeline_card:nth-child('+(i+1)+')').attr('t_sid')==JSON.parse( a )['removeID'] ){
						_isHas = 1;
						break;
					}
					if( $('#timeline_update_temp > div.timeline_card:nth-child('+(i+1)+')').attr('t_sid')==JSON.parse( a )['removeID'] ){
						_isHas = 1;
						break;
					}
				}
			}
			if( _isHas == 1 ){
				var update_notify = '<div class="Timeline_NotificationArea_origin isotope">'+
					'<div class="Timeline_NotificationArea_origin_content">'+
						'<span role="timeline_g">'+$('div.timeline_card[t_sid='+JSON.parse( a )['removeID']+']').find('[role=timeline_g]').text()+'</span>'+
						'<span role="timeline_w">'+$('div.timeline_card[t_sid='+JSON.parse( a )['removeID']+']').find('[role=timeline_w]').text()+'</span>'+
						'<span role="timeline_f">'+$('div.timeline_card[t_sid='+JSON.parse( a )['removeID']+']').find('[role=timeline_f]').text()+'</span>'+
					'</div>'+
				'</div>'+
				'<div class="Timeline_Notification isotope">'+
					'<div class="Timeline_Notification_icon">'+
						'<img src="https://graph.facebook.com/'+$('div.timeline_card[t_sid='+JSON.parse( a )['removeID']+']').find('div.timeline_card_time_user').attr('role')+'/picture" width="30px">'+
					'</div>'+
					'<div class="Timeline_Notification_event">'+
						'<span role="'+$('div.timeline_card[t_sid='+JSON.parse( a )['removeID']+']').find('div.timeline_card_time_user').attr('role')+'">'+$('div.timeline_card[t_sid='+JSON.parse( a )['removeID']+']').find('div.timeline_card_time_user').text()+'</span>'+
						'<span>刪除了</span>'+
						'<p>'+$('div.timeline_card[t_sid='+JSON.parse( a )['removeID']+']').find('h2 > a').text()+'</p>'+
					'</div>'+
				'</div>';
				$('#timeline_update_temp > div.timeline_card[t_sid='+JSON.parse( a )['removeID']+']').remove();
				$('div.timeline_column > div.timeline_card[t_sid='+JSON.parse( a )['removeID']+']').remove();
			}
			break;
		case 'g': 
			var Actioner = JSON.parse( b )['User_FB_ID'];
			var c = JSON.parse( a )['removeID'].split('***');
			var _isHas = 0;
			var g_a = $('#group_update_hideArea').length;
			if( g_a > 0 ){
				for( var i=0; i<g_a; i++ ){
					if( $('#group_update_hideArea > div.timeline_group:nth-child('+(i+1)+')').attr('t_sid')==c[0] ){
						_isHas = 1;
						break;
					}
				}
			}
			if( _isHas == 1 ){
				var update_notify = '<div class="Timeline_Notification isotope" style="border: 0;">'+
						'<div class="Timeline_Notification_icon">'+
								'<img src="Image/group_icon_black.png" width="30px">'+
							'</div>'+
							'<div class="Timeline_Notification_event">'+
								'<span>'+$('div.timeline_group[t_sid='+c[0]+']').find('[t_member='+Actioner+']').text()+'</span>'+
								'<span>刪除了群組</span>'+
								'<p>'+c[2]+'</p>'+
							'</div>'+
						'</div>';
				$('#group_update_temp > div[t_sid='+c[0]+']').remove();
				$('div.timeline_group[t_sid='+c[0]+']').remove();
				$('#addMember> li[id='+c[0]+']').remove();
				$('#timeline_select_column_g > [t_gid='+c[0]+']').remove();
				$('#timeline_select_column_w > [t_gid='+c[0]+']').remove();
				$('#timeline_select_column_f > [t_gid='+c[0]+']').remove();
				$('#timeline_select_hideArea_g > [t_gid='+c[0]+']').remove();
				$('#timeline_select_hideArea_w > [t_gid='+c[0]+']').remove();
				$('#timeline_select_hideArea_f > [t_gid='+c[0]+']').remove();
				var member_ary_temp = 0;
				for( var i=1; i<=$('div.timeline_group[t_sid='+c[0]+'] > span').length; i++ ){
					var timeline_group_temp = $('div.timeline_group[t_sid='+c[0]+'] > span:nth-child('+i+')').attr('t_member');
					var member_ary = $('div.timeline_group').not('[t_sid='+c[0]+']').children('span');
					for( var j=0; j<member_ary.length; j++ ){
						if( $(member_ary[j]).attr('t_member') == timeline_group_temp ){
							member_ary_temp = 1;
							break;
						}
					}
					if( member_ary_temp == 0 ){
						$('#timeline_select_column_user > [role='+timeline_group_temp+']').remove();
					}
				}
				if ( c[0] == localStorage.group_selected ) {
					$('div.Group_Board_inf_text').attr('g_id', '').text('尚未選擇群組');
					localStorage.removeItem('group_selected');
					$('.add_workspace').removeClass('cboxElement');
					T_Group_Board_showMember();
				}
			}
			break;
		default:	
			break;
	}
	if( _isHas == 1 ){
		var T_a = $('#group_update_temp > div').length;
		var T_b = $('#timeline_update_temp > div').length;
	    if( JSON.parse( a )['removeID'][0] == 'g' ){
			if( T_a != 0 ){
				if( T_b == 0 ){
					$('head > title').text( 'Groupack' );
				}else{
					$('head > title').text( '('+T_b+')Groupack' );
				}
			}else{
				$('#group_notificationCountArea').hide(50).children('span').text( 0 );
			}
		}else{
			var test = $('#myWorkspace').hasClass('workspace_on');
			if( T_b != 0 ){
				if( $('body').hasClass('timeline_on') && !test ){ 
					$('div.timeline_show_update_text > span').text( T_b );
				}else{
					$('#timeline_notificationCountArea > span').text( T_b );
				}
				if( T_a == 0 ){
					$('head > title').text( '('+ T_b +')Groupack' );
				}else{
					$('head > title').text( '('+( T_a + T_b )+')Groupack' );
				}
			}else{
				if( $('body').hasClass('timeline_on') && !test ){ 
					$('div.timeline_show_update_text > span').text( 0 );
					$('#timeline_notificationCountArea > span').text( 0 );
					$('#timeline_show_update').hide(50);
				}else{
					$('div.timeline_show_update_text > span').text( 0 );
					$('#timeline_notificationCountArea').hide(50).children('span').text( 0 );
				}
				if( T_a == 0 ){
					$('head > title').text( 'Groupack' );
				}else{
					$('head > title').text( '('+ T_a +')Groupack' );
				}
			}
		}
		if( $('#Timeline_NotificationArea').css('display') == 'none' ){
			$('#Timeline_NotificationArea').html( update_notify ).show().delay(3300).hide(200);
		}else{
			$('#Timeline_NotificationArea').delay(3000).html( update_notify ).show().delay(3300).hide(200);
		}
	}
}
function T_addData( response ){    //新增資料到 timeline 
	var a = JSON.parse( response ).msg.split('+++');
	var User_ID = JSON.parse( a[0] )['User_FB_ID'];
	var Related_FB_ID = new Array();
	for( var i=0; i<JSON.parse( a[1] ).length; i++ ){
		Related_FB_ID[i] = JSON.parse( a[1] )[i]['Related_FB_ID'];
	}
	var check_initial_ary = JSON.parse( a[11] )['check_initial'].split('***');
	if( check_initial_ary[0] != 'none'){    //判斷使用者上線
		if( localStorage.getItem('FB_id') != check_initial_ary[0] ){
			if( check_initial_ary[1] != 'none' ){
				var Usering_FB_notify = '<div class="Timeline_Notification isotope" style="border: 0;">'+
					'<div class="Timeline_Notification_icon">'+
						'<img src="https://graph.facebook.com/'+check_initial_ary[0]+'/picture" width="30px">'+
					'</div>'+
					'<div class="Timeline_Notification_event">'+
						'<span role="'+check_initial_ary[0]+'">'+check_initial_ary[1]+'</span>'+
						'<span></span>'+
						'<p>剛上線</p>'+
					'</div>'+
				'</div>';
				if( $('#Timeline_NotificationArea').css('display') == 'none' ){
					$('#Timeline_NotificationArea').html( Usering_FB_notify ).show().delay(3300).hide(200);
				}else{
					$('#Timeline_NotificationArea').delay(3000).html( Usering_FB_notify ).show().delay(3300).hide(200);
				}
			}
		}
	}
	
	var Group_Information = new Array();  // 一維宣告
	for( var i=0; i<JSON.parse( a[2] ).length; i++ ){
		Group_Information[i] = new Array();  // 二維宣告
		for( var j=0; j< 4; j++ ){
			switch( j ){
				case 0: 
					Group_Information[i]['G_ID'] = JSON.parse( a[2] )[i]['Group_Information']['G_ID'];
					break;
				case 1: 
					Group_Information[i]['G_NAME'] = JSON.parse( a[2] )[i]['Group_Information']['G_NAME'];
					break;
				case 2: 
					Group_Information[i]['FB_ID'] = JSON.parse( a[2] )[i]['Group_Information']['FB_ID'];
					break;
				case 3: 
					Group_Information[i]['FB_NAME'] = JSON.parse( a[2] )[i]['Group_Information']['FB_NAME'];
					break;
				default:	
					break;
			}
		}
	}
	var Workspace_Information = new Array();  // 一維宣告
	for( var i=0; i<JSON.parse( a[3] ).length; i++ ){
		Workspace_Information[i] = new Array();  // 二維宣告
		for( var j=0; j< 6; j++ ){
			switch( j ){
				case 0: 
					Workspace_Information[i]['G_ID'] = JSON.parse( a[3] )[i]['G_ID'];
					break;
				case 1: 
					Workspace_Information[i]['W_ID'] = JSON.parse( a[3] )[i]['Workspace_Information']['W_ID'];
					break;
				case 2: 
					Workspace_Information[i]['W_NAME'] = JSON.parse( a[3] )[i]['Workspace_Information']['W_NAME'];
					break;
				case 3: 
					Workspace_Information[i]['COMMENT'] = JSON.parse( a[3] )[i]['Workspace_Information']['COMMENT'];
					break;
				case 4:  
					Workspace_Information[i]['W_TIMESTAMP'] = JSON.parse( a[3] )[i]['Workspace_Information']['W_TIMESTAMP'];
					break;
				case 5:  
					Workspace_Information[i]['W_CREATOR'] = JSON.parse( a[3] )[i]['Workspace_Information']['W_CREATOR'];
					break;
				default:	
					break;
			}
		}
	}
	var Folder_Information = new Array();  // 一維宣告
	for( var i=0; i<JSON.parse( a[4] ).length; i++ ){
		Folder_Information[i] = new Array();  // 二維宣告
		for( var j=0; j< 6; j++ ){
			switch( j ){
				case 0: 
					Folder_Information[i]['W_ID'] = JSON.parse( a[4] )[i]['W_ID'];
					break;
				case 1: 
					Folder_Information[i]['FOLDER_ID'] = JSON.parse( a[4] )[i]['Folder_Information']['FOLDER_ID'];
					break;
				case 2: 
					Folder_Information[i]['FOLDER_NAME'] = JSON.parse( a[4] )[i]['Folder_Information']['FOLDER_NAME'];
					break;
				case 3: 
					Folder_Information[i]['COMMENT'] = JSON.parse( a[4] )[i]['Folder_Information']['COMMENT'];
					break;
				case 4:  
					Folder_Information[i]['FOLDER_TIMESTAMP'] = JSON.parse( a[4] )[i]['Folder_Information']['FOLDER_TIMESTAMP'];
					break;
				case 5:  
					Folder_Information[i]['FOLDER_CREATOR'] = JSON.parse( a[4] )[i]['Folder_Information']['FOLDER_CREATOR'];
					break;
				default:	
					break;
			}
		}
	}
	var CARD_Information = new Array();  // 一維宣告
	for( var i=0; i<JSON.parse( a[5] ).length; i++ ){
		CARD_Information[i] = new Array();  // 二維宣告
		for( var j=0; j< 7; j++ ){
			switch( j ){
				case 0: 
					CARD_Information[i]['FOLDER_ID'] =  JSON.parse( a[5] )[i]['FOLDER_ID'];
					break;
				case 1: 
					CARD_Information[i]['CARD_ID'] = JSON.parse( a[5] )[i]['CARD_Information']['CARD_ID'];
					break;
				case 2: 
					CARD_Information[i]['TITLE'] = JSON.parse( a[5] )[i]['CARD_Information']['TITLE'];
					break;
				case 3: 
					CARD_Information[i]['CONTENT'] = JSON.parse( a[5] )[i]['CARD_Information']['CONTENT'];
					break;
				case 4:  
					CARD_Information[i]['URL'] = JSON.parse( a[5] )[i]['CARD_Information']['URL'];
					break;
				case 5:  
					CARD_Information[i]['CARD_TIMESTAMP'] = JSON.parse( a[5] )[i]['CARD_Information']['CARD_TIMESTAMP'];
					break;
				case 6:  
					CARD_Information[i]['CARD_CREATOR'] = JSON.parse( a[5] )[i]['CARD_Information']['CARD_CREATOR'];
					break;
				default:	
					break;
			}
		}
	}

	if( $('body').hasClass('Initial_T_savedata') ){
		$('div.timeline_column > div').remove();
		$('#timeline_select_column_w option').remove();
		$('#timeline_select_column_f option').remove();
		$('#timeline_select_hideArea_w option').remove();
		$('#timeline_select_hideArea_f option').remove();
		var All_Group = '';
		for( var i=0; i<JSON.parse( a[7] ).length; i++ ){    //儲存目前使用者自己所擁有的所有 group id
			All_Group += ' '+JSON.parse( a[7] )[i]['Group_ID'];
		}
		localStorage.setItem('UserAllGroup', All_Group.substr(1));
		var All_GroupMember = '';
		for( var i=0; i<JSON.parse( a[1] ).length; i++ ){    //儲存目前使用者自己所擁有的所有 group id
			All_GroupMember += ' '+JSON.parse( a[1] )[i]['Related_FB_ID'];
		}
		localStorage.setItem('UserAllGroupMember', All_GroupMember.substr(1));
		localStorage.setItem('Member_Group', a[8]);
		
		for( var i=0; i<CARD_Information.length; i++ ){    //顯示所有 card
			//檢查 folder
			var b = 0;
			for( var j=0; j<Folder_Information.length; j++ ){
				if( CARD_Information[i]['FOLDER_ID'] == Folder_Information[j]['FOLDER_ID'] ){
					break;
				}else{
					if( (j+1)!=Folder_Information.length )  b++;
				}
			}
			//檢查 Workspace
			var c = 0;
			for( var j=0; j<Workspace_Information.length; j++ ){
				if( Folder_Information[b]['W_ID'] == Workspace_Information[j]['W_ID'] ){
					break;
				}else{
					if( (j+1)!=Workspace_Information.length )  c++;
				}
			}
			//檢查 group
			var d = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( Workspace_Information[c]['G_ID'] == Group_Information[j]['G_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  d++;
				}
			}
			//檢查 fb name
			var e = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( CARD_Information[i]['CARD_CREATOR'] == Group_Information[j]['FB_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  e++;
				}
			}
			var html = '<div class="timeline_card" t_sid="'+CARD_Information[i]['CARD_ID']+'">'+
					'<div class="timeline_card_origin isotope">'+
						'<div class="timeline_card_origin_content">'+
							'<span role="timeline_g" T_gID='+Group_Information[d]['G_ID']+'>'+Group_Information[d]['G_NAME']+'</span>'+
							'<span role="timeline_w" T_wID='+Workspace_Information[c]['W_ID']+'>'+Workspace_Information[c]['W_NAME']+'</span>'+
							'<span role="timeline_f" T_fID='+Folder_Information[b]['FOLDER_ID']+'>'+Folder_Information[b]['FOLDER_NAME']+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="timeline_card_user isotope">'+
						'<img src="https://graph.facebook.com/'+CARD_Information[i]['CARD_CREATOR']+'/picture" width="45px">'+
					'</div>'+
					'<div class="timeline_card_arrow"></div>'+
					'<div class="timeline_card_area isotope">'+
						'<div class="timeline_card_content isotope">'+
							'<div class="timeline_card_inf">'+
								'<h2>'+
									'<a class="co_a fancy_iframe" href="'+CARD_Information[i]['URL']+'" target="_blank">'+CARD_Information[i]['TITLE']+'</a>'+
								'</h2>'+
								'<p>'+CARD_Information[i]['CONTENT']+'</p>'+
								'<div class="post_url">'+CARD_Information[i]['URL']+'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="timeline_card_time isotope">'+
						'<div class="timeline_card_time_user" role="'+CARD_Information[i]['CARD_CREATOR']+'">'+Group_Information[e]['FB_NAME']+'</div>'+
						'<span>-</span>'+
						'<span role="time">'+CARD_Information[i]['CARD_TIMESTAMP']+'</span>'+
					'</div>'+
				'</div>';
			if( i != 0 ){
				var f = CARD_Information[i]['CARD_TIMESTAMP'];
				for( var j=1; j<=i; j++ ){
					var b = $('div.timeline_column > div:nth-child('+j+')').find('[role=time]').text();
					if( b != '' )
						var d = CompareTimestamp(f, b);
					else
						var d = 'greater';	
					if( d == 'greater' || d == 'equal' ){
						if( j==1 ){
							$('div.timeline_column').prepend( html );
							break;
						}
						$('div.timeline_column > div:nth-child('+j+')').before( html );
						break;
					}else{
						if( j==i ){
							$('div.timeline_column').append( html );
						}
					}
				}
			}else{
				$('div.timeline_column').prepend( html );
			}
		}
		for( var i=0; i<Folder_Information.length; i++ ){    //顯示所有 folder
			//檢查 Workspace
			var b = 0;
			for( var j=0; j<Workspace_Information.length; j++ ){
				if( Folder_Information[i]['W_ID'] == Workspace_Information[j]['W_ID'] ){
					break;
				}else{
					if( (j+1)!=Workspace_Information.length )  b++;
				}
			}
			//檢查 group
			var c = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( Workspace_Information[b]['G_ID'] == Group_Information[j]['G_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  c++;
				}
			}
			//檢查 fb name
			var d = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( Folder_Information[i]['FOLDER_CREATOR'] == Group_Information[j]['FB_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  d++;
				}
			}
			var p = Workspace_Information[b]['W_ID'];
			var html = '<div class="timeline_folder" t_sid="'+Folder_Information[i]['FOLDER_ID']+'">'+
				'<div class="timeline_folder_origin isotope">'+
					'<div class="timeline_folder_origin_content">'+
						'<span role="timeline_g" T_gID='+Group_Information[c]['G_ID']+'>'+Group_Information[c]['G_NAME']+'</span>'+
						'<span role="timeline_w" T_wID='+Workspace_Information[b]['W_ID']+'>'+Workspace_Information[b]['W_NAME']+'</span>'+
					'</div>'+
				'</div>'+
				'<div class="timeline_folder_user isotope">'+
					'<img src="Image/folder_blue.png" width="45px">'+
				'</div>'+
				'<div class="timeline_folder_arrow"></div>'+
				'<div class="timeline_folder_area isotope">'+
					'<div class="timeline_folder_content isotope">'+
						'<div class="timeline_folder_inf">'+
							'<h2>'+
							'<a class="co_a">'+Folder_Information[i]['FOLDER_NAME']+'</a>'+
							'</h2>'+
							'<p>'+Folder_Information[i]['COMMENT']+'</p>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="timeline_folder_time isotope">'+
					'<div class="timeline_folder_time_user" role="'+Folder_Information[i]['FOLDER_CREATOR']+'">'+Group_Information[d]['FB_NAME']+'</div>'+
					'<span>-</span>'+
					'<span role="time">'+Folder_Information[i]['FOLDER_TIMESTAMP']+'</span>'+
				'</div>'+
			'</div>';
			var e = Folder_Information[i]['FOLDER_TIMESTAMP'];
			var f = parseInt( i )+parseInt( CARD_Information.length );
			if( f > 0 ){
				for( var j=1; j<=f; j++ ){
					var b = $('div.timeline_column > div:nth-child('+j+')').find('[role=time]').text();
					if( b != '' )
						var d = CompareTimestamp(e, b);
					else
						var d = 'greater';
					if( d == 'greater' || d == 'equal' ){
						if( j==1 ){
							$('div.timeline_column').prepend( html );
							break;
						}
						$('div.timeline_column > div:nth-child('+j+')').before( html );
						break;
					}else{
						if( j==f ){
							$('div.timeline_column').append( html );
						}
					}
				}
			}else{
				$('div.timeline_column').prepend( html );
			}
			var g = '<option T_gID="'+Group_Information[c]['G_ID']+'" T_wID="'+p+'" T_fID="'+Folder_Information[i]['FOLDER_ID']+'" T_time="'+e+'">'+Folder_Information[i]['FOLDER_NAME']+'</option>';
			$('#timeline_select_column_f').prepend( g );
		}
		$('#timeline_select_column_f').prepend( '<option T_fID="all">全部</option>' );
		$('#timeline_select_hideArea_f').html( $('#timeline_select_column_f').html() );
		
		for( var i=0; i<Workspace_Information.length; i++ ){    //顯示所有 workspace
			//檢查 group
			var b = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( Workspace_Information[i]['G_ID'] == Group_Information[j]['G_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  b++;
				}
			}
			//檢查 fb name
			var c = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( Workspace_Information[i]['W_CREATOR'] == Group_Information[j]['FB_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  c++;
				}
			}
			var p = Group_Information[b]['G_ID'];
			var html = '<div class="timeline_workspace" t_sid="'+Workspace_Information[i]['W_ID']+'">'+
				'<div class="timeline_workspace_origin isotope">'+
					'<div class="timeline_workspace_origin_content">'+
						'<span role="timeline_g" T_gID='+Group_Information[b]['G_ID']+'>'+Group_Information[b]['G_NAME']+'</span>'+
					'</div>'+
				'</div>'+
				'<div class="timeline_workspace_user isotope">'+
					'<img src="Image/workspace_blue.png" width="45px">'+
				'</div>'+
				'<div class="timeline_workspace_arrow"></div>'+
				'<div class="timeline_workspace_area isotope">'+
					'<div class="timeline_workspace_content isotope">'+
						'<div class="timeline_workspace_inf">'+
							'<h2>'+
							'<a class="co_a">'+Workspace_Information[i]['W_NAME']+'</a>'+
							'</h2>'+
							'<p>'+Workspace_Information[i]['COMMENT']+'</p>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="timeline_workspace_time isotope">'+
					'<div class="timeline_workspace_time_user" role="'+Workspace_Information[i]['W_CREATOR']+'">'+Group_Information[c]['FB_NAME']+'</div>'+
					'<span>-</span>'+
					'<span role="time">'+Workspace_Information[i]['W_TIMESTAMP']+'</span>'+
				'</div>'+
			'</div>';
			var e = Workspace_Information[i]['W_TIMESTAMP'];
			var f = parseInt( i )+parseInt( CARD_Information.length )+parseInt( Folder_Information.length );
			if( f > 0 ){
				for( var j=1; j<=f; j++ ){
					var k = $('div.timeline_column > div:nth-child('+j+')').find('[role=time]').text();
					if( k != '' )
							var d = CompareTimestamp(e,k);
						else
							var d = 'greater';				
					if( d == 'greater' || d == 'equal' ){
						if( j==1 ){
							$('div.timeline_column').prepend( html );
							break;
						}
						$('div.timeline_column > div:nth-child('+j+')').before( html );
						break;
					}else{
						if( j==f ){
							$('div.timeline_column').append( html );
						}
					}
				}
			}else{
				$('div.timeline_column').append( html );
			}
			var g = '<option T_gID="'+p+'" T_wID="'+Workspace_Information[i]['W_ID']+'" T_time="'+e+'">'+Workspace_Information[i]['W_NAME']+'</option>';
			$('#timeline_select_column_w').prepend( g );
		}
		$('#timeline_select_column_w').prepend( '<option T_wID="all">全部</option>' );
		$('#timeline_select_hideArea_w').html( $('#timeline_select_column_w').html() );
		
		var CurrentAllGroup = localStorage.getItem('UserAllGroup').split(' ');
		for( var i=0; i<CurrentAllGroup.length; i++ ){    //顯示所有 group
			var d = CurrentAllGroup[i];
			//建立 member 
			var member = '';
			for( var j=0; j<Group_Information.length; j++ ){
				if( d == Group_Information[j]['G_ID'] ){
					member += '<span T_member="'+Group_Information[j]['FB_ID']+'">'+Group_Information[j]['FB_NAME']+'</span>';
				}
			}
			var html = '<div class="timeline_group" t_sid="'+d+'">'+member+'</div>';
			$('#group_update_hideArea').prepend( html );
			if( (i+1)==CurrentAllGroup.length ){
				$('body').removeClass('Initial_T_savedata');
				$('#group_update_temp').html('');
			}
		}
		//$('#group_update_hideArea').prepend( '<option T_wID="all">全部</option>' );
		localStorage.setItem( 'T_LatestItemTime', $('div.timeline_column > div:first').find('[role=time]').text() );	
		$('#timeline_select_column_user option').remove();
		for( var i=0; i<Related_FB_ID.length; i++ ){    //顯示所有 使用者選單
			for( var j=0; j<Group_Information.length; j++ ){
				if( Group_Information[j]['FB_ID'] == Related_FB_ID[i] ){
					$('#timeline_select_column_user').prepend( '<option role="'+Related_FB_ID[i]+'">'+Group_Information[j]['FB_NAME']+'</option>' );
					break;
				}
			}
		}
		$('#timeline_select_column_user').prepend( '<option role="all">全部</option>' );
		$('#timeline_select_hideArea_user').html( $('#timeline_select_column_user').html() );
		$('#timeline_select_column_g option').remove();
		$('#timeline_select_hideArea_g option').remove();
		for( var i=0; i<Group_Information.length; i++ ){    //顯示所有 群組選單
			if( i==0 ){
					$('#timeline_select_column_g').prepend( '<option T_gID="'+Group_Information[i]['G_ID']+'">'+Group_Information[i]['G_NAME']+'</option>' );
			}else{
				var temp = 0;
				for( var j=0; j<$('#timeline_select_column_g option').length; j++ ){
					if( Group_Information[i]['G_ID'] == $('#timeline_select_column_g option:nth-child('+(j+1)+')').attr('t_gid') ){
						temp = 1;
						break;
					}
				}
				if( temp == 0 ){
					$('#timeline_select_column_g').prepend( '<option T_gID="'+Group_Information[i]['G_ID']+'">'+Group_Information[i]['G_NAME']+'</option>' );
				}
			}
		}
		$('#timeline_select_column_g').prepend( '<option T_gID="all">全部</option>' );
		$('#timeline_select_hideArea_g').html( $('#timeline_select_column_g').html() );
		T_Group_Board_showMember();
	}else{
/*************************************************************************************************************************************************/
		//檢查 group 更新
		if( JSON.parse( localStorage.getItem('T_CheckGroup') )['checkGroup'] != 'none' ){
			var T_CheckGroup_parse = JSON.parse( localStorage.getItem('T_CheckGroup') )['checkGroup'].split('***');
			var T_CheckGroup_newgroup = 0;
			for( var i=0; i<$('#group_update_hideArea > div.timeline_group').length; i++ ){
				if( $('#group_update_hideArea > div.timeline_group:nth-child('+(i+1)+')').attr('t_sid')== T_CheckGroup_parse[0]){
					T_CheckGroup_newgroup = 1;
					break;
				}
			}
			var T_CheckGroup_isMember = 0;
			for( var j=0; j<Group_Information.length; j++ ){    //防呆： 判斷新增的 group 自己是否為其成員
				if( T_CheckGroup_parse[0] == Group_Information[j]['G_ID'] ){
					if( localStorage.FB_id == Group_Information[j]['FB_ID'] ){
						T_CheckGroup_isMember = 1;    //是成員
						break; 
					}
				}
			}
			if( T_CheckGroup_isMember == 1 ){
				for( var m=1; m<=$('div.timeline_group[t_sid='+T_CheckGroup_parse[0]+'] > span').length; m++ ){
					var timeline_group_temp = $('div.timeline_group[t_sid='+T_CheckGroup_parse[0]+'] > span:nth-child('+m+')').attr('t_member');
					$('#timeline_select_column_user').find('[role='+timeline_group_temp+']').remove();
				}
				var T_CheckGroup_member = '';
				for( var j=0; j<Group_Information.length; j++ ){    //新增 member
					if( T_CheckGroup_parse[0] == Group_Information[j]['G_ID'] ){
						T_CheckGroup_member += '<span T_member="'+Group_Information[j]['FB_ID']+'">'+Group_Information[j]['FB_NAME']+'</span>';
						$('#timeline_select_column_user').append('<option role="'+Group_Information[j]['FB_ID']+'">'+Group_Information[j]['FB_NAME']+'</option>');
					}
				}
				$('#group_update_temp').prepend( '<div class="timeline_group" t_sid="'+T_CheckGroup_parse[0]+'">'+T_CheckGroup_member+'</div>' );
				$('#group_update_hideArea > div.timeline_group[t_sid='+T_CheckGroup_parse[0]+']').remove();
				var navigation_check = $('ul.navigation > li:nth-child(1)').hasClass('on');
				if( !navigation_check ){
					$('#group_notificationCountArea').show(50).children('span').text( $('#group_update_temp > div').length );
					if( $('#timeline_update_temp > div').length == 0 ){
						var head_title_notify = $('#group_update_temp > div').length;						
					}else{
						var head_title_notify = $('#group_update_temp > div').length+$('#timeline_update_temp > div').length;
					}
					$('head > title').text( '('+ head_title_notify +')Groupack' );
				}else{
					$('#group_notificationCountArea > span').text(0);
					$('#group_update_hideArea').prepend( $('#group_update_temp').html() );
					$('#group_update_temp').html('');
				}
				if( T_CheckGroup_newgroup == 1 ){    //group 修改
					var T_CheckGroup_notify = '<div class="Timeline_Notification isotope" style="border: 0;">'+
										'<div class="Timeline_Notification_icon">'+
								'<img src="Image/group_icon_black.png" width="30px">'+
							'</div>'+
							'<div class="Timeline_Notification_event">'+
								'<span role="'+T_CheckGroup_parse[2]+'">'+T_CheckGroup_parse[3]+'</span>'+
								'<span>修改了群組</span>'+
								'<p>'+T_CheckGroup_parse[1]+'</p>'+
							'</div>'+
						'</div>';
					$('#timeline_select_column_g > [t_gid='+T_CheckGroup_parse[0]+']').text( T_CheckGroup_parse[1] );
					$('#timeline_select_hideArea_g > [t_gid='+T_CheckGroup_parse[0]+']').text( T_CheckGroup_parse[1] );
				}else{    //group 新增
					var T_CheckGroup_notify = '<div class="Timeline_Notification isotope" style="border: 0;">'+
						'<div class="Timeline_Notification_icon">'+
								'<img src="Image/group_icon_black.png" width="30px">'+
							'</div>'+
							'<div class="Timeline_Notification_event">'+
								'<span role="'+T_CheckGroup_parse[2]+'">'+T_CheckGroup_parse[3]+'</span>'+
								'<span>新增了群組</span>'+
								'<p>'+T_CheckGroup_parse[1]+'</p>'+
							'</div>'+
						'</div>';
					var myGroup = '\
						<li class="group_select_checkgroup group-item" id="'+ T_CheckGroup_parse[0] +'">\
							<div class="group_select_checkgroup_check">\
								<div class="group_select_checkgroup_check_icon"></div>\
								<div class="group_select_checkgroup_check_inf">編輯群組</div>\
							</div>\
							<a class="co_a" title="'+ T_CheckGroup_parse[1] +'">'+ T_CheckGroup_parse[1] +'</a>\
						</li>';
					$('ul#addMember #'+T_CheckGroup_parse[0]+'').remove();
					$('ul#addMember').prepend( myGroup )
					//儲存目前使用者自己所擁有的所有 group id
					localStorage.setItem('UserAllGroup', localStorage.getItem('UserAllGroup')+' '+T_CheckGroup_parse[0]);
					$('#timeline_select_column_g').append( '<option t_gid="'+T_CheckGroup_parse[0]+'">'+T_CheckGroup_parse[1]+'</option>' );
					$('#timeline_select_hideArea_g').append( '<option t_gid="'+T_CheckGroup_parse[0]+'">'+T_CheckGroup_parse[1]+'</option>' );
				}
				if( $('#Timeline_NotificationArea').css('display') == 'none' ){
					$('#Timeline_NotificationArea').html( T_CheckGroup_notify ).show().delay(3300).hide(200);
				}else{
					$('#Timeline_NotificationArea').delay(3000).html( T_CheckGroup_notify ).show().delay(3300).hide(200);
				}
				T_Group_Board_showMember();
			}
		}else{
switch( JSON.parse( localStorage.getItem('T_Check_WFC') )['check_WFC'][0] ){
	case 'c': 
		//檢查Card更新
		var new_card = 0;var card_update = 0;
		if( $('#timeline_update_temp > div.timeline_card:first').find('[role=time]').text() == '' ){
			var _compare = $('div.timeline_column > div.timeline_card:first').find('[role=time]').text();
		}else{
			var _compare = $('#timeline_update_temp > div.timeline_card:first').find('[role=time]').text();
		}
		//if( _compare == '' ){
			for( var i=0; i<CARD_Information.length; i++ ){
				if( CARD_Information[i]['CARD_ID'] == JSON.parse( localStorage.getItem('T_Check_WFC') )['check_WFC'] ){
					card_update = 1;
					break;
				}else{
					new_card++;
					if( (i+1)==CARD_Information.length )    new_card = -1;
				}
			}
		if( card_update == 1 && new_card != -1 ){    //Card更新
			//檢查 folder
			var b = 0;
			for( var j=0; j<Folder_Information.length; j++ ){
				if( CARD_Information[new_card]['FOLDER_ID'] == Folder_Information[j]['FOLDER_ID'] ){
					break;
				}else{
					if( (j+1)!=Folder_Information.length )  b++;
				}
			}
			//檢查 Workspace
			var c = 0;
			for( var j=0; j<Workspace_Information.length; j++ ){
				if( Folder_Information[b]['W_ID'] == Workspace_Information[j]['W_ID'] ){
					break;
				}else{
					if( (j+1)!=Workspace_Information.length )  c++;
				}
			}
			//檢查 group
			var d = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( Workspace_Information[c]['G_ID'] == Group_Information[j]['G_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  d++;
				}
			}
			//檢查 fb name
			var e = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( CARD_Information[new_card]['CARD_CREATOR'] == Group_Information[j]['FB_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  e++;
				}
			}
			var C_related = 0;
			var C_AllGroup = localStorage.getItem('UserAllGroup').split(' ');
			for( var i=0; i<C_AllGroup.length; i++ ){    //判斷 group 是否和自己有關
				if( C_AllGroup[i] == Group_Information[d]['G_ID'] ){
					C_related = 1;
				}
			}
			if( C_related == 1 ){
				var _update = '<div class="timeline_card" t_sid="'+CARD_Information[new_card]['CARD_ID']+'">'+
					'<div class="timeline_card_origin isotope">'+
						'<div class="timeline_card_origin_content">'+
							'<span role="timeline_g" T_gID='+Group_Information[d]['G_ID']+'>'+Group_Information[d]['G_NAME']+'</span>'+
							'<span role="timeline_w" T_wID='+Workspace_Information[c]['W_ID']+'>'+Workspace_Information[c]['W_NAME']+'</span>'+
							'<span role="timeline_f" T_fID='+Folder_Information[b]['FOLDER_ID']+'>'+Folder_Information[b]['FOLDER_NAME']+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="timeline_card_user isotope">'+
						'<img src="https://graph.facebook.com/'+CARD_Information[new_card]['CARD_CREATOR']+'/picture" width="45px">'+
					'</div>'+
					'<div class="timeline_card_arrow"></div>'+
					'<div class="timeline_card_area isotope">'+
						'<div class="timeline_card_content isotope">'+
							'<div class="timeline_card_inf">'+
								'<h2>'+
									'<a class="co_a fancy_iframe" href="'+CARD_Information[new_card]['URL']+'" target="_blank">'+CARD_Information[new_card]['TITLE']+'</a>'+
								'</h2>'+
								'<p>'+CARD_Information[new_card]['CONTENT']+'</p>'+
								'<div class="post_url">'+CARD_Information[new_card]['URL']+'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="timeline_card_time isotope">'+
						'<div class="timeline_card_time_user" role="'+CARD_Information[new_card]['CARD_CREATOR']+'">'+Group_Information[e]['FB_NAME']+'</div>'+
						'<span>-</span>'+
						'<span role="time">'+CARD_Information[new_card]['CARD_TIMESTAMP']+'</span>'+
					'</div>'+
				'</div>';
				$('#timeline_update_temp > div.timeline_card[t_sid='+CARD_Information[new_card]['CARD_ID']+']').remove();
				if( $('#group_update_temp > div').length == 0 ){
					var head_title_notify_num = $('#timeline_update_temp > div').length+1;
				}else{
					var head_title_notify_num = $('#group_update_temp > div').length+$('#timeline_update_temp > div').length+1;
				}
				var notify_num = $('#timeline_update_temp > div').length+1;
				$('#timeline_update_temp').prepend( _update );
				var update_notify = '<div class="Timeline_NotificationArea_origin isotope" t_sid="'+CARD_Information[new_card]['CARD_ID']+'">'+
					'<div class="Timeline_NotificationArea_origin_content">'+
						'<span role="timeline_g" T_gID='+Group_Information[d]['G_ID']+'>'+Group_Information[d]['G_NAME']+'</span>'+
						'<span role="timeline_w" T_wID='+Workspace_Information[c]['W_ID']+'>'+Workspace_Information[c]['W_NAME']+'</span>'+
						'<span role="timeline_f" T_fID='+Folder_Information[b]['FOLDER_ID']+'>'+Folder_Information[b]['FOLDER_NAME']+'</span>'+
					'</div>'+
				'</div>'+
				'<div class="Timeline_Notification isotope">'+
					'<div class="Timeline_Notification_icon">'+
						'<img src="https://graph.facebook.com/'+CARD_Information[new_card]['CARD_CREATOR']+'/picture" width="30px">'+
					'</div>'+
					'<div class="Timeline_Notification_event">'+
						'<span role="'+CARD_Information[new_card]['CARD_CREATOR']+'">'+Group_Information[e]['FB_NAME']+'</span>'+
						'<span>修改了</span>'+
						'<p>'+CARD_Information[new_card]['TITLE']+'</p>'+
					'</div>'+
				'</div>';
				var test = $('#myWorkspace').hasClass('workspace_on');
				if(  $('#timeline_wrapper').attr('card_remove') != '' ){
					$('#timeline_wrapper').attr( 'card_remove', $('#timeline_wrapper').attr('card_remove')+'***'+CARD_Information[new_card]['CARD_ID'] );
				}else{
					$('#timeline_wrapper').attr( 'card_remove', CARD_Information[new_card]['CARD_ID'] );
				}
				if( $('body').hasClass('timeline_on') && !test ){ 
					$('div.timeline_show_update_text > span').text( notify_num );
					$('#timeline_notificationCountArea > span').text( notify_num );
					$('#timeline_show_update').show(50);
				}else{
					$('div.timeline_show_update_text > span').text( notify_num );
					$('#timeline_notificationCountArea').show(50).children('span').text( notify_num );
				}
				$('head > title').text( '('+ head_title_notify_num +')Groupack' );
				if( $('#Timeline_NotificationArea').css('display') == 'none' ){
					$('#Timeline_NotificationArea').html( update_notify ).show().delay(3300).hide(200);
				}else{
					$('#Timeline_NotificationArea').delay(3000).html( update_notify ).show().delay(3300).hide(200);
				}
			}
		}
		break;
	case 'f': 
		//檢查 Folder 更新
		var new_folder = 0;var folder_update = 0;
		if( $('#timeline_update_temp > div.timeline_folder:first').find('[role=time]').text() == '' ){
			var _compare = $('div.timeline_column > div.timeline_folder:first').find('[role=time]').text();
		}else{
			var _compare = $('#timeline_update_temp > div.timeline_folder:first').find('[role=time]').text();
		}
		//if( _compare == '' ){
			for( var i=0; i<Folder_Information.length; i++ ){
				if( Folder_Information[i]['FOLDER_ID'] == JSON.parse( localStorage.getItem('T_Check_WFC') )['check_WFC'] ){
					folder_update = 1;
					break;
				}else{
					new_folder++;
					if( (i+1)==Folder_Information.length )    new_folder = -1;
				}
			}
		if( folder_update == 1 && new_folder != -1 ){    //Folder更新
			//檢查 Workspace
			var b = 0;
			for( var j=0; j<Workspace_Information.length; j++ ){
				if( Folder_Information[new_folder]['W_ID'] == Workspace_Information[j]['W_ID'] ){
					break;
				}else{
					if( (j+1)!=Workspace_Information.length )  b++;
				}
			}
			//檢查 group
			var c = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( Workspace_Information[b]['G_ID'] == Group_Information[j]['G_ID'] ){
					break;
					}else{
					if( (j+1)!=Group_Information.length )  c++;
				}
			}
			//檢查 fb name
			var d = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( Folder_Information[new_folder]['FOLDER_CREATOR'] == Group_Information[j]['FB_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  d++;
				}
			}
			var F_related = 0;
			var F_AllGroup = localStorage.getItem('UserAllGroup').split(' ');
			for( var i=0; i<F_AllGroup.length; i++ ){    //判斷 group 是否和自己有關
				if( F_AllGroup[i] == Group_Information[c]['G_ID'] ){
					F_related = 1;
				}
			}
			if( F_related == 1 ){
			var _update = '<div class="timeline_folder" t_sid="'+Folder_Information[new_folder]['FOLDER_ID']+'">'+
				'<div class="timeline_folder_origin isotope">'+
					'<div class="timeline_folder_origin_content">'+
						'<span role="timeline_g" T_gID='+Group_Information[c]['G_ID']+'>'+Group_Information[c]['G_NAME']+'</span>'+
						'<span role="timeline_w" T_wID='+Workspace_Information[b]['W_ID']+'>'+Workspace_Information[b]['W_NAME']+'</span>'+
					'</div>'+
				'</div>'+
				'<div class="timeline_folder_user isotope">'+
					'<img src="Image/folder_blue.png" width="45px">'+
				'</div>'+
				'<div class="timeline_folder_arrow"></div>'+
				'<div class="timeline_folder_area isotope">'+
					'<div class="timeline_folder_content isotope">'+
						'<div class="timeline_folder_inf">'+
							'<h2>'+
							'<a class="co_a">'+Folder_Information[new_folder]['FOLDER_NAME']+'</a>'+
							'</h2>'+
							'<p>'+Folder_Information[new_folder]['COMMENT']+'</p>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="timeline_folder_time isotope">'+
					'<div class="timeline_folder_time_user" role="'+Folder_Information[new_folder]['FOLDER_CREATOR']+'">'+
					Group_Information[d]['FB_NAME']+'</div>'+
					'<span>-</span>'+
					'<span role="time">'+Folder_Information[new_folder]['FOLDER_TIMESTAMP']+'</span>'+
				'</div>'+
			'</div>';
			$('#timeline_update_temp > div.timeline_folder[t_sid='+Folder_Information[new_folder]['FOLDER_ID']+']').remove();
			if( typeof($('#timeline_select_column_f > [t_fid='+Folder_Information[new_folder]['FOLDER_ID']+']').attr('t_fid')) == 'undefined' ){
				$('#timeline_select_column_f').append('<option t_gid="'+Group_Information[c]['G_ID']+'" t_wid="'+Workspace_Information[b]['W_ID']+'" t_fid="'+Folder_Information[new_folder]['FOLDER_ID']+'" t_time="'+Folder_Information[new_folder]['FOLDER_TIMESTAMP']+'">'+Folder_Information[new_folder]['FOLDER_NAME']+'</option>');
				$('#timeline_select_hideArea_f').append('<option t_gid="'+Group_Information[c]['G_ID']+'" t_wid="'+Workspace_Information[b]['W_ID']+'" t_fid="'+Folder_Information[new_folder]['FOLDER_ID']+'" t_time="'+Folder_Information[new_folder]['FOLDER_TIMESTAMP']+'">'+Folder_Information[new_folder]['FOLDER_NAME']+'</option>');
			}else{
				$('#timeline_select_column_f > [t_fid='+Folder_Information[new_folder]['FOLDER_ID']+']').text( Folder_Information[new_folder]['FOLDER_NAME'] );
				$('#timeline_select_hideArea_f > [t_fid='+Folder_Information[new_folder]['FOLDER_ID']+']').text( Folder_Information[new_folder]['FOLDER_NAME'] );
			}
			if( $('#group_update_temp > div').length == 0 ){
				var head_title_notify_num = $('#timeline_update_temp > div').length+1;
			}else{
				var head_title_notify_num = $('#group_update_temp > div').length+$('#timeline_update_temp > div').length+1;
			}
			var notify_num = $('#timeline_update_temp > div').length+1;
			$('#timeline_update_temp').prepend( _update );
			var update_notify = '<div class="Timeline_NotificationArea_origin isotope" t_sid="'+Folder_Information[new_folder]['FOLDER_ID']+'">'+
				'<div class="Timeline_NotificationArea_origin_content">'+
					'<span role="timeline_g" T_gID='+Group_Information[c]['G_ID']+'>'+Group_Information[c]['G_NAME']+'</span>'+
					'<span role="timeline_w" T_wID='+Workspace_Information[b]['W_ID']+'>'+Workspace_Information[b]['W_NAME']+'</span>'+
				'</div>'+
			'</div>'+
			'<div class="Timeline_Notification isotope">'+
				'<div class="Timeline_Notification_icon">'+
					'<img src="Image/folder_blue.png" width="30px">'+
				'</div>'+
				'<div class="Timeline_Notification_event">'+
					'<span role="'+Folder_Information[new_folder]['FOLDER_CREATOR']+'">'+Group_Information[d]['FB_NAME']+'</span>'+
					'<span>修改了</span>'+
					'<p>'+Folder_Information[new_folder]['FOLDER_NAME']+'</p>'+
					'</div>'+
			'</div>';
			var test = $('#myWorkspace').hasClass('workspace_on');
			if(  $('#timeline_wrapper').attr('folder_remove') != '' ){
				$('#timeline_wrapper').attr( 'folder_remove',  $('#timeline_wrapper').attr('folder_remove')+'***'+Folder_Information[new_folder]['FOLDER_ID'] );
			}else{
				$('#timeline_wrapper').attr( 'folder_remove', Folder_Information[new_folder]['FOLDER_ID'] );
			}
			if( $('body').hasClass('timeline_on') && !test ){   
				$('div.timeline_show_update_text > span').text( notify_num );
				$('#timeline_notificationCountArea > span').text( notify_num );
				$('#timeline_show_update').show(50);
				$('#timeline_wrapper').attr( 'folder_remove', Folder_Information[new_folder]['FOLDER_ID'] );
			}else{
				$('div.timeline_show_update_text > span').text( notify_num );
				$('#timeline_notificationCountArea').show(50).children('span').text( notify_num );
				$('#timeline_wrapper').attr( 'folder_remove', Folder_Information[new_folder]['FOLDER_ID'] );
			}
			$('head > title').text( '('+ head_title_notify_num +')Groupack' );
			if( $('#Timeline_NotificationArea').css('display') == 'none' ){
				$('#Timeline_NotificationArea').html( update_notify ).show().delay(3300).hide(200);
			}else{
				$('#Timeline_NotificationArea').delay(3000).html( update_notify ).show().delay(3300).hide(200);
			}
			}
		}
		break;
	case 'w': 
		//檢查 Workspace 更新
		var new_workspace = 0;var workspace_update = 0;
		if( $('#timeline_update_temp > div.timeline_workspace:first').find('[role=time]').text() == '' ){
			var _compare = $('div.timeline_column > div.timeline_workspace:first').find('[role=time]').text();
		}else{
			var _compare = $('#timeline_update_temp > div.timeline_workspace:first').find('[role=time]').text();
		}
		//if( _compare == '' ){
			for( var i=0; i<Workspace_Information.length; i++ ){
				if( Workspace_Information[i]['W_ID'] == JSON.parse( localStorage.getItem('T_Check_WFC') )['check_WFC'] ){
					workspace_update = 1;
					new_workspace = i;
					break;
				}else{
					new_workspace++;
					if( (i+1)==Workspace_Information.length )    new_workspace = -1;
				}
			}
		if( workspace_update == 1 && new_workspace != -1 ){    //Workspace更新
			//檢查 group
			var b = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( Workspace_Information[new_workspace]['G_ID'] == Group_Information[j]['G_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  b++;
				}
			}
			//檢查 fb name
			var c = 0;
			for( var j=0; j<Group_Information.length; j++ ){
				if( Workspace_Information[new_workspace]['W_CREATOR'] == Group_Information[j]['FB_ID'] ){
					break;
				}else{
					if( (j+1)!=Group_Information.length )  c++;
				}
			}
			var W_related = 0;
			var W_AllGroup = localStorage.getItem('UserAllGroup').split(' ');
			for( var i=0; i<W_AllGroup.length; i++ ){    //判斷 group 是否和自己有關
				if( W_AllGroup[i] == Group_Information[b]['G_ID'] ){
					W_related = 1;
				}
			}
			if( W_related == 1 ){
			var _update = '<div class="timeline_workspace" t_sid="'+Workspace_Information[new_workspace]['W_ID']+'">'+
				'<div class="timeline_workspace_origin isotope">'+
					'<div class="timeline_workspace_origin_content">'+
						'<span role="timeline_g" T_gID='+Group_Information[b]['G_ID']+'>'+Group_Information[b]['G_NAME']+'</span>'+
					'</div>'+
				'</div>'+
				'<div class="timeline_workspace_user isotope">'+
					'<img src="Image/workspace_blue.png" width="45px">'+
				'</div>'+
				'<div class="timeline_workspace_arrow"></div>'+
				'<div class="timeline_workspace_area isotope">'+
					'<div class="timeline_workspace_content isotope">'+
						'<div class="timeline_workspace_inf">'+
							'<h2>'+
							'<a class="co_a">'+Workspace_Information[new_workspace]['W_NAME']+'</a>'+
							'</h2>'+
							'<p>'+Workspace_Information[new_workspace]['COMMENT']+'</p>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="timeline_workspace_time isotope">'+
					'<div class="timeline_workspace_time_user" role="'+Workspace_Information[new_workspace]['W_CREATOR']+'">'+Group_Information[c]['FB_NAME']+'</div>'+
					'<span>-</span>'+
					'<span role="time">'+Workspace_Information[new_workspace]['W_TIMESTAMP']+'</span>'+
				'</div>'+
			'</div>';
			var update_notify = '<div class="Timeline_NotificationArea_origin isotope" t_sid="'+Workspace_Information[new_workspace]['W_ID']+'">'+
				'<div class="Timeline_NotificationArea_origin_content">'+
					'<span role="timeline_g" T_gID='+Group_Information[b]['G_ID']+'>'+Group_Information[b]['G_NAME']+'</span>'+
				'</div>'+
			'</div>'+
			'<div class="Timeline_Notification isotope">'+
				'<div class="Timeline_Notification_icon">'+
					'<img src="Image/workspace_blue.png" width="30px">'+
				'</div>'+
				'<div class="Timeline_Notification_event">'+
					'<span role="'+Workspace_Information[new_workspace]['W_CREATOR']+'">'+Group_Information[c]['FB_NAME']+'</span>'+
					'<span>修改了</span>'+
					'<p>'+Workspace_Information[new_workspace]['W_NAME']+'</p>'+
				'</div>'+
			'</div>';
			$('#timeline_update_temp > div.timeline_workspace[t_sid='+Workspace_Information[new_workspace]['W_ID']+']').remove();
			if( typeof($('#timeline_select_column_w > [t_wid='+Workspace_Information[new_workspace]['W_ID']+']').attr('t_wid')) == 'undefined' ){
				$('#timeline_select_column_w').append('<option t_gid="'+Group_Information[b]['G_ID']+'" t_wid="'+Workspace_Information[new_workspace]['W_ID']+'" t_time="'+Workspace_Information[new_workspace]['W_TIMESTAMP']+'">'+Workspace_Information[new_workspace]['W_NAME']+'</option>');
				$('#timeline_select_hideArea_w').append('<option t_gid="'+Group_Information[b]['G_ID']+'" t_wid="'+Workspace_Information[new_workspace]['W_ID']+'" t_time="'+Workspace_Information[new_workspace]['W_TIMESTAMP']+'">'+Workspace_Information[new_workspace]['W_NAME']+'</option>');
			}else{
				$('#timeline_select_column_w > [t_wid='+Workspace_Information[new_workspace]['W_ID']+']').text( Workspace_Information[new_workspace]['W_NAME'] );
				$('#timeline_select_hideArea_w > [t_wid='+Workspace_Information[new_workspace]['W_ID']+']').text( Workspace_Information[new_workspace]['W_NAME'] );
			}
			if( $('#group_update_temp > div').length == 0 ){
				var head_title_notify_num = $('#timeline_update_temp > div').length+1;
			}else{
				var head_title_notify_num = $('#group_update_temp > div').length+$('#timeline_update_temp > div').length+1;
			}
			var notify_num = $('#timeline_update_temp > div').length+1;
			$('#timeline_update_temp').prepend( _update );
			var test = $('#myWorkspace').hasClass('workspace_on');
			if(  $('#timeline_wrapper').attr('workspace_remove') != 'none' ){
				var workspace_remove_temp = '';
				var workspace_remove_ary = $('#timeline_wrapper').attr('workspace_remove').split('***');
				for( var i=0; i<workspace_remove_ary.length; i++ ){
					workspace_remove_temp += ( '***'+workspace_remove_ary[i] );
				}
				$('#timeline_wrapper').attr( 'workspace_remove', workspace_remove_temp.substr(3)  );
			}else{
				$('#timeline_wrapper').attr( 'workspace_remove', Workspace_Information[new_workspace]['W_ID'] );
			}
			if(  $('#timeline_wrapper').attr('workspace_remove') != '' ){
				$('#timeline_wrapper').attr( 'workspace_remove', $('#timeline_wrapper').attr('workspace_remove')+'***'+Workspace_Information[new_workspace]['W_ID'] );
			}else{
				$('#timeline_wrapper').attr( 'workspace_remove', Workspace_Information[new_workspace]['W_ID'] );
			}
			if( $('body').hasClass('timeline_on') && !test ){  
				$('div.timeline_show_update_text > span').text( notify_num );
				$('#timeline_notificationCountArea > span').text( notify_num );
				$('#timeline_show_update').show(50);
				$('#timeline_wrapper').attr( 'workspace_remove', Workspace_Information[new_workspace]['W_ID'] );
			}else{
				$('div.timeline_show_update_text > span').text( notify_num );
				$('#timeline_notificationCountArea').show(50).children('span').text( notify_num );
				$('#timeline_wrapper').attr( 'workspace_remove', Workspace_Information[new_workspace]['W_ID'] );
			}
			$('head > title').text( '('+ head_title_notify_num +')Groupack' );
			if( $('#Timeline_NotificationArea').css('display') == 'none' ){
				$('#Timeline_NotificationArea').html( update_notify ).show().delay(3300).hide(200);
			}else{
				$('#Timeline_NotificationArea').delay(3000).html( update_notify ).show().delay(3300).hide(200);
			}
			}
		}
		break;
	default:	
		break;
}}
	}
}
function CompareTimestamp(A,B){    //A跟B比較
	var tempA = A.split(' ');
	var a = tempA[0].split('-');
	var a_query = tempA[1].split(':');
	var a_time = parseInt( a_query[2] ) + parseInt( a_query[1] )*60 + parseInt( a_query[0] )*60*60 + parseInt( a[2] )*24*60*60;
	var tempB = B.split(' ');
	var b = tempB[0].split('-');
	var b_query = tempB[1].split(':');
	var b_time = parseInt( b_query[2] ) + parseInt( b_query[1] )*60 + parseInt( b_query[0] )*60*60 + parseInt( b[2] )*24*60*60;
	if( parseInt( a[0] ) > parseInt( b[0] ) ){    //比 年
		return 'greater';
	}else if( parseInt( a[0] ) == parseInt( b[0] ) ){    //年相同
		if( parseInt( a[1] ) > parseInt( b[1] ) ){    //比 月
			return 'greater';
		}else if( parseInt( a[1] ) == parseInt( b[1] ) ){    //月相同
			if( a_time > b_time )  
				return 'greater'; 
			else if( a_time == b_time ){
				return 'equal';
			}else{
				return 'less';
			}
		}else{
			return 'less';
		}
	}else{
		return 'less';
	}
}
//頁面加載完成，即建立長連接，獲取數据
$(function(){
	//T_long_connect();
	$('div.timeline_show_update_text').click(function(e){
		TimelineSelect_CheckTemp();
		if( $('#timeline_wrapper').attr('card_remove') != '' ){
			var card_remove_ary = $('#timeline_wrapper').attr('card_remove').split('***');
			for( var i=0; i<card_remove_ary.length; i++ ){
				$('div.timeline_column > div.timeline_card[t_sid='+card_remove_ary[i]+']').remove();
			}
			$('#timeline_wrapper').attr('card_remove', '');
		}
		if( $('#timeline_wrapper').attr('folder_remove') != '' ){
			var folder_remove_ary = $('#timeline_wrapper').attr('folder_remove').split('***');
			for( var i=0; i<folder_remove_ary.length; i++ ){
				$('div.timeline_column > div.timeline_folder[t_sid='+folder_remove_ary[i]+']').remove();
			}
			$('#timeline_wrapper').attr('folder_remove', '');
		}
		if( $('#timeline_wrapper').attr('workspace_remove') != '' ){
			var workspace_remove_ary = $('#timeline_wrapper').attr('workspace_remove').split('***');
			for( var i=0; i<workspace_remove_ary.length; i++ ){
				$('div.timeline_column > div.timeline_workspace[t_sid='+workspace_remove_ary[i]+']').remove();
			}
			$('#timeline_wrapper').attr('workspace_remove', '');
		}
		$('#timeline_show_update').hide();
		if( $('#group_update_temp > div').length == 0 ){
			$('head > title').text( 'Groupack' );
		}else{
			$('head > title').text( '('+$('#group_update_temp > div').length+')Groupack' );
		}
		$('div.timeline_column').prepend( $('#timeline_update_temp').html() );
		$('div.timeline_show_update_text > span').text( 0 );
		$('#timeline_notificationCountArea > span').text( 0 );
		$('#timeline_update_temp').html( '' );
		$('html, body').animate( {scrollTop: '0px'}, 400 );
	});
	$('div._timeline').click(function(e){
		$('html, body').animate( {scrollTop: '0px'}, 100 );
		TimelineSelect_CheckTemp();
		var a = $('body').hasClass('timeline_on');
		if( !a ){
			$(this).css('opacity', 0.7);
			if( $('#timeline_update_temp > div').length != 0 ){
				$('#timeline_notificationCountArea').hide().children('span').text( 0 );
				if( $('#timeline_wrapper').attr('card_remove') != '' ){
					var card_remove_ary = $('#timeline_wrapper').attr('card_remove').split('***');
					for( var i=0; i<card_remove_ary.length; i++ ){
						$('div.timeline_column > div.timeline_card[t_sid='+card_remove_ary[i]+']').remove();
					}
					$('#timeline_wrapper').attr('card_remove', '');
				}
				if( $('#timeline_wrapper').attr('folder_remove') != '' ){
					var folder_remove_ary = $('#timeline_wrapper').attr('folder_remove').split('***');
					for( var i=0; i<folder_remove_ary.length; i++ ){
						$('div.timeline_column > div.timeline_folder[t_sid='+folder_remove_ary[i]+']').remove();
					}
					$('#timeline_wrapper').attr('folder_remove', '');
				}
				if( $('#timeline_wrapper').attr('workspace_remove') != '' ){
					var workspace_remove_ary = $('#timeline_wrapper').attr('workspace_remove').split('***');
					for( var i=0; i<workspace_remove_ary.length; i++ ){
						$('div.timeline_column > div.timeline_workspace[t_sid='+workspace_remove_ary[i]+']').remove();
					}
					$('#timeline_wrapper').attr('workspace_remove', '');
				}
				$('#timeline_show_update').hide();
				$('div.timeline_show_update_text > span').text( 0 );
				$('div.timeline_column').prepend( $('#timeline_update_temp').html() );
				$('#timeline_update_temp').html('');
				if( $('#group_update_temp > div').length == 0 ){
					$('head > title').text( 'Groupack' );
				}else{
					$('head > title').text( '('+$('#group_update_temp > div').length+')Groupack' );
				}
			}
			$('div.timeline_column > .dom_hidden').removeClass('dom_hidden');
			$('#timeline_select_column_g').val('全部');
			$('#timeline_select_column_w').val('全部');
			$('#timeline_select_column_f').val('全部');
			$('#timeline_select_column_user').val('全部');
			localStorage.setItem('Timeline_Selected', 'all_all_all_all');
			if( $('#myWorkspace').hasClass('workspace_on') ){
				$('div._timeline').css('opacity', 0.7);
				$('#wrapper').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
				$('#under-footer').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
				$('#timeline_wrapper').attr('style', '').removeClass('dom_hidden');
				$('body').addClass('timeline_on');
				$('#myWorkspace').removeClass('workspace_on').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
				$('div.workspace_on_now').removeClass('workspace_on_now');
			}else{
				$('div._timeline').css('opacity', 0.7);
				$('#wrapper').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
				$('#under-footer').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
				$('#timeline_wrapper').removeClass('dom_hidden').attr('style', '');
				$('body').addClass('timeline_on');
			}
		}else{
			if( $('#myWorkspace').hasClass('workspace_on') ){
				$('body.timeline_on').removeClass('timeline_on');
				$('div._timeline').css('opacity', '');
				$('#timeline_wrapper').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
				$('#wrapper').attr('style', '').removeClass('dom_hidden');
				$('#under-footer').removeClass('dom_hidden').attr('style', '');
				$('#myWorkspace').removeClass('workspace_on').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
				$('div.workspace_on_now').removeClass('workspace_on_now');
			}else{
				$('body.timeline_on').removeClass('timeline_on');
				$('div._timeline').css('opacity', '');
				$('#timeline_wrapper').addClass('dom_hidden').offset({ top: -1000, left: -1000 });
				$('#wrapper').removeClass('dom_hidden').attr('style', '');
				$('#under-footer').removeClass('dom_hidden').attr('style', '');
			}
		}
	});
	$('.nav_main_group').click(function(){ 
		if( $('#group_update_temp > div').length != 0 ){
			$('#group_notificationCountArea').hide(50).children('span').text(0);
			$('#group_update_hideArea').prepend( $('#group_update_temp').html() );
			$('#group_update_temp').html('');
			console.log("*"+$('#timeline_update_temp > div').length );
			if( $('#timeline_update_temp > div').length == 0 ){
				$('head > title').text('Groupack');
			}else{
				$('head > title').text('('+$('#timeline_update_temp > div').length+')Groupack');
			}
		}
	});
	$('#timeline_select_column_g').change(function(){    //timeline 改變 群組選單 觸發
		var a1 = $('#timeline_select_column_g option:selected').attr('T_gID');
		var a2 = $('#timeline_select_column_w option:selected').attr('T_wID');
		var a3 = $('#timeline_select_column_f option:selected').attr('T_fID');
		var a4 = $('#timeline_select_column_user option:selected').attr('role');
		console.log(a1+' '+a2+' '+a3+' '+a4);
		if( a1!='all' ){
			localStorage.setItem( 'Timeline_Selected', a1+'_all_all_all' );
			$('#timeline_select_hideArea_w > option').not('[t_gid='+a1+']').attr('_now', 'hide');
			$('#timeline_select_hideArea_w > option').filter('[t_gid='+a1+']').attr('_now', 'show');
			$('#timeline_select_hideArea_w > option[t_wid=all]').attr('_now', 'show');
			$('#timeline_select_hideArea_f > option').not('[t_gid='+a1+']').attr('_now', 'hide');
			$('#timeline_select_hideArea_f > option').filter('[t_gid='+a1+']').attr('_now', 'show');
			$('#timeline_select_hideArea_f > option[t_fid=all]').attr('_now', 'show');
			$('#timeline_select_hideArea_g > option').removeClass('__g');
			$('#timeline_select_hideArea_g > option[t_gid='+a1+']').addClass('__g');
			$('#timeline_select_hideArea_w > option').removeClass('__g');
			$('#timeline_select_hideArea_w > option').filter('[t_gid='+a1+']').addClass('__g');
			$('#timeline_select_hideArea_w > option[t_wid=all]').addClass('__g');
			$('#timeline_select_hideArea_f > option').removeClass('__g');
			$('#timeline_select_hideArea_f > option').filter('[t_gid='+a1+']').addClass('__g');
			$('#timeline_select_hideArea_f > option[t_fid=all]').addClass('__g');
			$('#timeline_select_hideArea_user > option').removeClass('__g');
			for( var i=1; i<=$('.timeline_group[t_sid='+a1+'] > span').length; i++ ){
				var c = $('.timeline_group[t_sid='+a1+'] > span:nth-child('+i+')').attr('t_member');
				$('#timeline_select_hideArea_user > option[role='+c+']').addClass('__g');
			}
			$('#timeline_select_hideArea_user > option[role=all]').addClass('__g');
			$('#timeline_select_hideArea_user > option').filter('.__g').attr('_now', 'show');
			$('#timeline_select_hideArea_user > option').not('.__g').attr('_now', 'hide');
			//
			$('.timeline_column > .column__g').removeClass('column__g');
			$('.timeline_column > div:has( [t_gid='+a1+'] )').addClass('column__g');
			$('.timeline_column > div').not('.column__g').addClass('dom_hidden');
			$('.timeline_column > div').filter('.column__g').removeClass('dom_hidden');
		}else{
			localStorage.setItem('Timeline_Selected', 'all_all_all_all');
			$('#timeline_select_hideArea_w > option').attr('_now', 'show');
			$('#timeline_select_hideArea_f > option').attr('_now', 'show');
			$('#timeline_select_hideArea_user > option').attr('_now', 'show');
			$('.__g').removeClass('__g');
			$('.__w').removeClass('__w');
			//
			$('.timeline_column > div').removeClass('dom_hidden');
			$('.timeline_column > .column__g').removeClass('column__g');
		}
		$('#timeline_select_column_w').html( $('#timeline_select_hideArea_w > option[_now=show]').clone() );
		$('#timeline_select_column_f').html( $('#timeline_select_hideArea_f > option[_now=show]').clone() );
		$('#timeline_select_column_user').html( $('#timeline_select_hideArea_user > option[_now=show]').clone()  );
		$('#timeline_select_column_w').val('全部');
		$('#timeline_select_column_f').val('全部');
		$('#timeline_select_column_user').val('全部');
	});
	$('#timeline_select_column_w').change(function(){    //timeline 改變 工作空間選單 觸發
		var a1 = $('#timeline_select_column_g option:selected').attr('T_gID');
		var a2 = $('#timeline_select_column_w option:selected').attr('T_wID');
		var a3 = $('#timeline_select_column_f option:selected').attr('T_fID');
		var a4 = $('#timeline_select_column_user option:selected').attr('role');
		//var b = localStorage.getItem('Timeline_Selected').split('_');
		console.log(a1+' '+a2+' '+a3+' '+a4);
		if( a1!='all' ){
			if( a2!='all' ){
				$('#timeline_select_hideArea_f > .__g').not('[t_wid='+a2+']').attr('_now', 'hide');
				$('#timeline_select_hideArea_f > .__g').filter('[t_wid='+a2+']').attr('_now', 'show');
				$('#timeline_select_hideArea_f > option[t_fid=all]').attr('_now', 'show');
				$('#timeline_select_hideArea_w > option').removeClass('__w');
				$('#timeline_select_hideArea_w > option[t_wid='+a2+']').addClass('__w');
				$('#timeline_select_hideArea_f > option').removeClass('__w');
				$('#timeline_select_hideArea_f > option').filter('[t_wid='+a2+']').addClass('__w');
				$('#timeline_select_hideArea_f > option[t_fid=all]').addClass('__w');
				$('#timeline_select_column_f').val('全部');
				//
				$('.timeline_column > .column__w').removeClass('column__w');
				$('.timeline_column > .column__g:has( [t_wid='+a2+'] )').addClass('column__w');
				$('.timeline_column > .column__g[t_sid='+a2+']').addClass('column__w');
				$('.timeline_column > .column__g').not('.column__w').addClass('dom_hidden');
				$('.timeline_column > .column__g').filter('.column__w').removeClass('dom_hidden');
				//**//
				if( a4!='all' ){
					$('.timeline_column > .column__w').not('.column__user').addClass('dom_hidden');
					$('.timeline_column > .column__w').filter('.column__user').removeClass('dom_hidden');	
				}
			}else{
				$('#timeline_select_column_f').val('全部');
				$('#timeline_select_hideArea_w > .__g').attr('_now', 'show');
				$('#timeline_select_hideArea_f > .__g').attr('_now', 'show');
				$('.timeline_column > .__w').removeClass('__w');
				//
				$('.timeline_column > .column__g').removeClass('dom_hidden');
				$('.timeline_column > .column__w').removeClass('column__w');
				//**//
				if( a4!='all' ){
					$('.timeline_column > .column__g').not('.column__user').addClass('dom_hidden');
					$('.timeline_column > .column__g').filter('.column__user').removeClass('dom_hidden');
				}
			}
		}else{
			if( a2!='all' ){
				a1 = $('#timeline_select_column_w option:selected').attr('T_gID');
				$('#timeline_select_hideArea_w > option').not('[t_gid='+a1+']').attr('_now', 'hide');
				$('#timeline_select_hideArea_w > option').filter('[t_gid='+a1+']').attr('_now', 'show');
				$('#timeline_select_hideArea_w > option[t_wid=all]').attr('_now', 'show');
				$('#timeline_select_hideArea_f > option').not('[t_gid='+a1+']').attr('_now', 'hide');
				$('#timeline_select_hideArea_f > option').filter('[t_gid='+a1+']').attr('_now', 'show');
				$('#timeline_select_hideArea_f > option[t_fid=all]').attr('_now', 'show');
				$('#timeline_select_hideArea_g > option').removeClass('__g');
				$('#timeline_select_hideArea_g > option[t_gid='+a1+']').addClass('__g');
				$('#timeline_select_hideArea_w > option').removeClass('__g');
				$('#timeline_select_hideArea_w > option').filter('[t_gid='+a1+']').addClass('__g');
				$('#timeline_select_hideArea_w > option[t_wid=all]').addClass('__g');
				$('#timeline_select_hideArea_f > option').removeClass('__g');
				$('#timeline_select_hideArea_f > option').filter('[t_gid='+a1+']').addClass('__g');
				$('#timeline_select_hideArea_f > option[t_fid=all]').addClass('__g');
				$('#timeline_select_column_g').val( $('#timeline_select_hideArea_g > .__g').text().replace(' ', '') );
				$('#timeline_select_column_f').val('全部');
				$('#timeline_select_column_user').val('全部');
				$('#timeline_select_hideArea_user > option').removeClass('__g');
				for( var i=1; i<=$('.timeline_group[t_sid='+a1+'] > span').length; i++ ){
					var c = $('.timeline_group[t_sid='+a1+'] > span:nth-child('+i+')').attr('t_member');
					$('#timeline_select_hideArea_user > option[role='+c+']').addClass('__g');
				}
				$('#timeline_select_hideArea_user > option[role=all]').addClass('__g');
				$('#timeline_select_hideArea_user > option').filter('.__g').attr('_now', 'show');
				$('#timeline_select_hideArea_user > option').not('.__g').attr('_now', 'hide');
				//
				$('.timeline_column > .column__g').removeClass('column__g');
				$('.timeline_column > div:has( [t_gid='+a1+'] )').addClass('column__g');
				$('.timeline_column > div').not('.column__g').addClass('dom_hidden');
				$('.timeline_column > .column__w').removeClass('column__w');
				$('.timeline_column > .column__g:has( [t_wid='+a2+'] )').addClass('column__w');
				$('.timeline_column > .column__g[t_sid='+a2+']').addClass('column__w');
				$('.timeline_column > .column__g').not('.column__w').addClass('dom_hidden');
				$('.timeline_column > .column__g').filter('.column__w').removeClass('dom_hidden');
				//**//
				if( a4!='all' ){
					$('.timeline_column > .column__w').not('.column__user').addClass('dom_hidden');
					$('.timeline_column > .column__w').filter('.column__user').removeClass('dom_hidden');
				}
			}
		}	
		localStorage.setItem( 'Timeline_Selected', a1+'_'+a2+'_'+a3+'_'+a4 );	
		var temp_g = $('#timeline_select_column_g').val();
		var temp_w = $('#timeline_select_column_w').val();
		var temp_f = $('#timeline_select_column_f').val();
		var temp_user = $('#timeline_select_column_user').val();
		$('#timeline_select_column_w').html( $('#timeline_select_hideArea_w > option[_now=show]').clone() );
		$('#timeline_select_column_f').html( $('#timeline_select_hideArea_f > option[_now=show]').clone() );
		$('#timeline_select_column_user').html( $('#timeline_select_hideArea_user > option[_now=show]').clone() );
		$('#timeline_select_column_w').val( temp_g );
		$('#timeline_select_column_w').val( temp_w );
		$('#timeline_select_column_f').val( temp_f );
		$('#timeline_select_column_user').val( temp_user );
	});
	$('#timeline_select_column_f').change(function(){    //timeline 改變 資料夾選單 觸發
		var a1 = $('#timeline_select_column_g option:selected').attr('T_gID');
		var a2 = $('#timeline_select_column_w option:selected').attr('T_wID');
		var a3 = $('#timeline_select_column_f option:selected').attr('T_fID');
		var a4 = $('#timeline_select_column_user option:selected').attr('role');
		console.log(a1+' '+a2+' '+a3+' '+a4);
		if( a1!='all' ){
			if( a2=='all' ){
				if( a3!='all' ){
					a2 = $('#timeline_select_column_f option:selected').attr('T_wID');
					$('#timeline_select_hideArea_w > option').removeClass('__w');
					$('#timeline_select_hideArea_w > option[t_wid='+a2+']').addClass('__w');
					$('#timeline_select_hideArea_f > option').removeClass('__w');
					$('#timeline_select_hideArea_f > option').filter('[t_wid='+a2+']').addClass('__w');
					$('#timeline_select_hideArea_f > option[t_fid=all]').addClass('__w');
					$('#timeline_select_column_w').val( $('#timeline_select_hideArea_w > .__w').text().replace(' ', '') );
					$('#timeline_select_hideArea_f > option').not('.__w').attr('_now', 'hide');
					$('#timeline_select_hideArea_f > option').filter('.__w').attr('_now', 'show');
					//
					$('.timeline_column > .column__w').removeClass('column__w');
					$('.timeline_column > .column__g:has( [t_wid='+a2+'] )').addClass('column__w');
					$('.timeline_column > .column__g[t_sid='+a2+']').addClass('column__w');
					$('.timeline_column > .column__g').not('.column__w').addClass('dom_hidden');
					$('.timeline_column > .column__f').removeClass('column__f');
					$('.timeline_column > .column__w:has( [t_fid='+a3+'] )').addClass('column__f');
					$('.timeline_column > .column__w[t_sid='+a3+']').addClass('column__f');
					$('.timeline_column > .column__w').not('.column__f').addClass('dom_hidden');
					$('.timeline_column > .column__w').filter('.column__f').removeClass('dom_hidden');
					//**//
					if( a4!='all' ){
						$('.timeline_column > .column__f').not('.column__user').addClass('dom_hidden');
						$('.timeline_column > .column__f').filter('.column__user').removeClass('dom_hidden');
					}
				}else{
					//
					$('.timeline_column > .column__w').removeClass('dom_hidden');
					$('.timeline_column > .column__f').removeClass('column__f');
					//**//
					if( a4!='all' ){
						$('.timeline_column > .column__w').not('.column__user').addClass('dom_hidden');
						$('.timeline_column > .column__w').filter('.column__user').removeClass('dom_hidden');
					}
				}
			}else{
				//
				if( a3!='all' ){
					$('.timeline_column > .column__f').removeClass('column__f');
					$('.timeline_column > .column__w:has( [t_fid='+a3+'] )').addClass('column__f');
					$('.timeline_column > .column__w[t_sid='+a3+']').addClass('column__f');
					$('.timeline_column > .column__w').not('.column__f').addClass('dom_hidden');
					$('.timeline_column > .column__w').filter('.column__f').removeClass('dom_hidden');
					//**//
					if( a4!='all' ){
						$('.timeline_column > .column__f').not('.column__user').addClass('dom_hidden');
						$('.timeline_column > .column__f').filter('.column__user').removeClass('dom_hidden');
					}
				}else{
					$('.timeline_column > .column__w').removeClass('dom_hidden');
					$('.timeline_column > .column__f').removeClass('column__f');
					//**//
					if( a4!='all' ){
						$('.timeline_column > .column__w').not('.column__user').addClass('dom_hidden');
						$('.timeline_column > .column__w').filter('.column__user').removeClass('dom_hidden');
					}
				}
			}
		}else{
			if( a3!='all' ){
				a2 = $('#timeline_select_column_f option:selected').attr('T_wID');
				$('#timeline_select_hideArea_w > option').removeClass('__w');
				$('#timeline_select_hideArea_w > option[t_wid='+a2+']').addClass('__w');
				$('#timeline_select_hideArea_f > option').removeClass('__w');
				$('#timeline_select_hideArea_f > option').filter('[t_wid='+a2+']').addClass('__w');
				$('#timeline_select_hideArea_f > option[t_fid=all]').addClass('__w');
				$('#timeline_select_column_w').val( $('#timeline_select_hideArea_w > .__w').text().replace(' ', '') );
				a1 = $('#timeline_select_hideArea_w > .__w').attr('T_gID');
				$('#timeline_select_hideArea_w > option').not('[t_gid='+a1+']').attr('_now', 'hide');
				$('#timeline_select_hideArea_w > option').filter('[t_gid='+a1+']').attr('_now', 'show');
				$('#timeline_select_hideArea_w > option[t_wid=all]').attr('_now', 'show');
				$('#timeline_select_hideArea_f > option').not('[t_gid='+a1+']').attr('_now', 'hide');
				$('#timeline_select_hideArea_f > option').filter('[t_gid='+a1+']').attr('_now', 'show');
				$('#timeline_select_hideArea_f > option[t_fid=all]').attr('_now', 'show');
				$('#timeline_select_hideArea_g > option').removeClass('__g');
				$('#timeline_select_hideArea_g > option[t_gid='+a1+']').addClass('__g');
				$('#timeline_select_hideArea_w > option').removeClass('__g');
				$('#timeline_select_hideArea_w > option').filter('[t_gid='+a1+']').addClass('__g');
				$('#timeline_select_hideArea_w > option[t_wid=all]').addClass('__g');
				$('#timeline_select_hideArea_f > option').removeClass('__g');
				$('#timeline_select_hideArea_f > option').filter('[t_gid='+a1+']').addClass('__g');
				$('#timeline_select_hideArea_f > option[t_fid=all]').addClass('__g');
				$('#timeline_select_column_g').val( $('#timeline_select_hideArea_g > .__g').text().replace(' ', '') );
				$('#timeline_select_hideArea_f > option').not('.__w').attr('_now', 'hide');
				$('#timeline_select_hideArea_f > option').filter('.__w').attr('_now', 'show');
				$('#timeline_select_column_user').val('全部');
				$('#timeline_select_hideArea_user > option').removeClass('__g');
				for( var i=1; i<=$('.timeline_group[t_sid='+a1+'] > span').length; i++ ){
					var c = $('.timeline_group[t_sid='+a1+'] > span:nth-child('+i+')').attr('t_member');
					$('#timeline_select_hideArea_user > option[role='+c+']').addClass('__g');
				}
				$('#timeline_select_hideArea_user > option[role=all]').addClass('__g');
				$('#timeline_select_hideArea_user > option').filter('.__g').attr('_now', 'show');
				$('#timeline_select_hideArea_user > option').not('.__g').attr('_now', 'hide');
				//
				$('.timeline_column > .column__g').removeClass('column__g');
				$('.timeline_column > div:has( [t_gid='+a1+'] )').addClass('column__g');
				$('.timeline_column > div').not('.column__g').addClass('dom_hidden');
				$('.timeline_column > .column__w').removeClass('column__w');
				$('.timeline_column > .column__g:has( [t_wid='+a2+'] )').addClass('column__w');
				$('.timeline_column > .column__g[t_sid='+a2+']').addClass('column__w');
				$('.timeline_column > .column__g').not('.column__w').addClass('dom_hidden');
				$('.timeline_column > .column__f').removeClass('column__f');
				$('.timeline_column > .column__w:has( [t_fid='+a3+'] )').addClass('column__f');
				$('.timeline_column > .column__w[t_sid='+a3+']').addClass('column__f');
				$('.timeline_column > .column__w').not('.column__f').addClass('dom_hidden');
				$('.timeline_column > .column__w').filter('.column__f').removeClass('dom_hidden');
				//**//
				if( a4!='all' ){
					$('.timeline_column > .column__f').not('.column__user').addClass('dom_hidden');
					$('.timeline_column > .column__f').filter('.column__user').removeClass('dom_hidden');
				}
			}
		}
		localStorage.setItem( 'Timeline_Selected', a1+'_'+a2+'_'+a3+'_'+a4 );
		var temp_g = $('#timeline_select_column_g').val();
		var temp_w = $('#timeline_select_column_w').val();
		var temp_f = $('#timeline_select_column_f').val();
		var temp_user = $('#timeline_select_column_user').val();
		$('#timeline_select_column_w').html( $('#timeline_select_hideArea_w > option[_now=show]').clone() );
		$('#timeline_select_column_f').html( $('#timeline_select_hideArea_f > option[_now=show]').clone() );
		$('#timeline_select_column_user').html( $('#timeline_select_hideArea_user > option[_now=show]').clone() );
		$('#timeline_select_column_w').val( temp_g );
		$('#timeline_select_column_w').val( temp_w );
		$('#timeline_select_column_f').val( temp_f );
		$('#timeline_select_column_user').val( temp_user );
	});
	$('#timeline_select_column_user').change(function(){    //timeline 改變 使用者選單 觸發
		var a1 = $('#timeline_select_column_g option:selected').attr('T_gID');
		var a2 = $('#timeline_select_column_w option:selected').attr('T_wID');
		var a3 = $('#timeline_select_column_f option:selected').attr('T_fID');
		var a4 = $('#timeline_select_column_user option:selected').attr('role');
		console.log(a1+' '+a2+' '+a3+' '+a4);
		if( a1!='all' ){
			if( a2!='all' ){
				if( a3!='all' ){
					if( a4!='all' ){
						$('.timeline_column > .column__user').removeClass('column__user');
						$('.timeline_column [role='+a4+']').parent().parent().addClass('column__user');
						$('.timeline_column > .column__f').not('.column__user').addClass('dom_hidden');
						$('.timeline_column > .column__f').filter('.column__user').removeClass('dom_hidden');
					}else{
						$('.timeline_column > .column__user').removeClass('column__user');
						$('.timeline_column > .column__f').removeClass('dom_hidden');
					}
				}else{
					if( a4!='all' ){
						$('.timeline_column > .column__user').removeClass('column__user');
						$('.timeline_column [role='+a4+']').parent().parent().addClass('column__user');
						$('.timeline_column > .column__w').not('.column__user').addClass('dom_hidden');
						$('.timeline_column > .column__w').filter('.column__user').removeClass('dom_hidden');
					}else{
						$('.timeline_column > .column__user').removeClass('column__user');
						$('.timeline_column > .column__w').removeClass('dom_hidden');
					}
				}
			}else{
				if( a4!='all' ){
					$('.timeline_column > .column__user').removeClass('column__user');
					$('.timeline_column [role='+a4+']').parent().parent().addClass('column__user');
					$('.timeline_column > .column__g').not('.column__user').addClass('dom_hidden');
					$('.timeline_column > .column__g').filter('.column__user').removeClass('dom_hidden');
				}else{
					$('.timeline_column > .column__user').removeClass('column__user');
					$('.timeline_column > .column__g').removeClass('dom_hidden');
				}
			}
		}else{
			if( a4!='all' ){
				$('.timeline_column > .column__user').removeClass('column__user');
				$('.timeline_column [role='+a4+']').parent().parent().addClass('column__user');
				$('.timeline_column > div').not('.column__user').addClass('dom_hidden');
				$('.timeline_column > div').filter('.column__user').removeClass('dom_hidden');
			}else{
				$('.timeline_column > .column__user').removeClass('column__user');
				$('.timeline_column > div').removeClass('dom_hidden');
			}
		}
		localStorage.setItem( 'Timeline_Selected', a1+'_'+a2+'_'+a3+'_'+a4 );
		var temp_user = $('#timeline_select_column_user').val();
		$('#timeline_select_column_user').html( $('#timeline_select_hideArea_user > option[_now=show]').clone() );
		$('#timeline_select_column_user').val( temp_user );
	});
});
function T_Group_Board_showMember(){
	if( localStorage.getItem('group_selected') == null ){
		$('#Group_Board_area').html('none');
	}else{
		var a = localStorage.getItem('group_selected');
		var b = $('div.timeline_group').filter('[t_sid='+a+']');
		$('#Group_Board_area').html('');
		var c = '';
		for( var i=1; i<=$(b).children('span').length; i++ ){
			c += '<a class="co_a"  target="_blank" href="https://www.facebook.com/'+$(b).children('span:nth-child('+i+')').attr('t_member')+'"><img title="'+$(b).children('span:nth-child('+i+')').text()+'" src="https://graph.facebook.com/'+$(b).children('span:nth-child('+i+')').attr('t_member')+'/picture" width="35px"></a>';
		}
		$('#Group_Board_area').append(c);
	}
}
function TimelineSelect_CheckTemp(){
/*
	if( localStorage.Timeline_Selected == null )    localStorage.setItem('Timeline_Selected', 'all_all_all_all');
	var a = localStorage.Timeline_Selected.split('_');
	if( $('#timeline_update_temp > div').length > 0 ){
		if( a[0]!='all' ){
			$('#timeline_update_temp > .column__g').removeClass('column__g');
			$('#timeline_update_temp > div:has( [t_gid='+a[0]+'] )').addClass('column__g');
			$('#timeline_update_temp  > div').not('.column__g').addClass('dom_hidden');
			$('#timeline_update_temp  > div').filter('.column__g').removeClass('dom_hidden');
			if( a[1]!='all' ){
				$('#timeline_update_temp > .column__w').removeClass('column__w');
				$('#timeline_update_temp > .column__g:has( [t_wid='+a[1]+'] )').addClass('column__w');
				$('#timeline_update_temp > .column__g[t_sid='+a[1]+']').addClass('column__w');
				$('#timeline_update_temp > .column__g').not('.column__w').addClass('dom_hidden');
				$('#timeline_update_temp > .column__g').filter('.column__w').removeClass('dom_hidden');
				if( a[2]!='all' ){
					$('#timeline_update_temp > .column__f').removeClass('column__f');
					$('#timeline_update_temp > .column__w:has( [t_fid='+a[2]+'] )').addClass('column__f');
					$('#timeline_update_temp > .column__w[t_sid='+a[2]+']').addClass('column__f');
					$('#timeline_update_temp > .column__w').not('.column__f').addClass('dom_hidden');
					$('#timeline_update_temp > .column__w').filter('.column__f').removeClass('dom_hidden');

					if( a[3]!='all' ){
						$('#timeline_update_temp > .column__f').not('.column__user').addClass('dom_hidden');
						$('#timeline_update_temp > .column__f').filter('.column__user').removeClass('dom_hidden');
					}
				}else{
					$('#timeline_update_temp > .column__w').removeClass('dom_hidden');
					$('#timeline_update_temp > .column__f').removeClass('column__f');

					if( a[3]!='all' ){
						$('#timeline_update_temp > .column__w').not('.column__user').addClass('dom_hidden');
						$('#timeline_update_temp > .column__w').filter('.column__user').removeClass('dom_hidden');
					}
				}
			}else{
				$('#timeline_update_temp > .column__g').removeClass('dom_hidden');
				$('#timeline_update_temp > .column__w').removeClass('column__w');

				if( a[3]!='all' ){
					$('#timeline_update_temp > .column__g').not('.column__user').addClass('dom_hidden');
					$('#timeline_update_temp > .column__g').filter('.column__user').removeClass('dom_hidden');	
				}
			}
		}else{
			$('#timeline_update_temp > div').removeClass('dom_hidden');
			$('#timeline_update_temp > .column__g').removeClass('column__g');

			if( a[3]!='all' ){
				$('#timeline_update_temp > .column__g').not('.column__user').addClass('dom_hidden');
				$('#timeline_update_temp > .column__g').filter('.column__user').removeClass('dom_hidden');	
			}
		}
	}*/
}