//取得所有的成員搜尋過的Topic
$(document).ready(function(e){
	$('#_back').click( function(){
		window.location.href = '../index.html';
	});		
	// 視窗改變時觸發
	$(window).resize(function(){   
		//testdevice();
		if( !location.pathname.search('index') )
			window.location.reload();
	});
			//使用者欄 點擊使用者
			$('.pics_for_fb').click(function(){   		
				var id = $(this).parent().attr('id'); //取得被點選得成員id
				
				/**			顯示大頭貼				**/
				if( $(this).hasClass('data_on') ){
				/* remove user */
					$(this).removeClass('data_on').css('border-color','#fff');	
				}
				else{                                     
				/* add user */
					$(this).addClass('data_on').css('border-color',color[ID_dic.indexOf(id)]);	
				}
				
				/**		記錄目前該顯示的user 		**/
				user_on = []; //global 定義為目前該顯示的成員 [1,0,1,1,0]; 1表示顯示,0表示不顯示
				for( var i=0, n = ID_dic.length+1 ; ++i<n ;){
					if($('#user_nav_for_topicmap .user_pic_for_topicmap:nth-child('+ i +') img').hasClass('data_on'))
						user_on.push(1);
					else
						user_on.push(0);
				}	
				
				/**		載入資料 		**/
				nodes_before = nodes; //需要記住上一次所顯示的關鍵字node					
				links = JSON.parse( localStorage.TopicMap_links ); //載入所有關聯性link
				nodes = JSON.parse( localStorage.TopicMap_nodes );	//重新載入所有關鍵字node						
				users_arr = JSON.parse( localStorage.TopicMap_users_arr );//載入最原始的users_arr資料
				
				/***			 執行 function  			***/
				/*	定義在下面	*/
				fixed_users_arr();
				var old_UserArr_key=[];
				delete_link_if_null();				
				delete_UserArr_if_null();				
				fixed_the_link();			
				/*	定義在topic_map_data.js	*/
				get_NodeTopics_from_link();
				get_topics_importance();
				nodes_TopicImportance();
				set_Nodes();
				/*	定義在topic_map_draw.js	*/
				draw_map();	
				
				/***			 定義 function  			***/
				function get_intersection(arr1,arr2){
					var output_arr=[];
					for(var i=-1, n=arr1.length ; ++i<n;){
						if(arr1[i]==1 && arr2[i]==1)
							output_arr.push(1);
						else
							output_arr.push(0);
					}
					return output_arr;
				}
				/** get_intersectoin()
					取得兩個陣列的交集
					var a=[1,1,1];	var b=[1,0,1];
					var c =get_intersection(a,b);
					c=[1,0,1]
				**/
				
				function is_null_array(arr){
					for(var i=-1, n=arr.length ; ++i<n;){
						if(arr[i]==1)
							return false;
					}					
					return true;
				}
				/**	is_null_array()
					判斷user_arr是否為空陣列[0,0,0](即通通為0)
					為空則會傳true
				**/

				function fixed_users_arr(){
					for(var i=-1, n=users_arr.length ; ++i<n;){
						users_arr[i] = get_intersection(users_arr[i],user_on);
					}
				}
				/** 
					根據user_on(該顯示的user陣列)來修正目前所有關鍵字的user_arr
				**/
				
				function delete_link_if_null() {
					var output_links =[];
					for(var i=-1, n=links.length ; ++i<n;){
						if( !is_null_array(users_arr[ links[i].source ]) && !is_null_array(users_arr[ links[i].target]) )
							output_links.push(links[i]);
					}		
					links = output_links;
				}
				/**
					去除掉link中source與target有任一users_arr均為0 
					即當某一個link的source或target沒有人搜尋的時候, 拿掉link
				**/
				
				function delete_UserArr_if_null(){
					var output_arr =[];
					for(var i=-1, n=users_arr.length ; ++i<n;){
						if( !is_null_array(	users_arr[i] ) ){
							output_arr.push( users_arr[i] );
							old_UserArr_key.push(i);
						}
					}
					users_arr = output_arr;
				}
				/**
					修正user_arr ,將有沒有人搜尋的user_arr(即[0,0,0])刪掉
					與新增old_UserArr_key
				**/
				
				function fixed_the_link(){
					for(var i=-1, n=links.length; ++i<n;){
						links[i].source = old_UserArr_key.indexOf(links[i].source);
						links[i].target = old_UserArr_key.indexOf(links[i].target);
						links[i].source_topic = links[i].source_topic.keyword;
						links[i].target_topic = links[i].target_topic.keyword;
					}
				}
				/**
					根據新的user_arr修正 "link" 中的Source與Target的key 
					及修正source_topic與target_topic的內容
				**/					
			});
		
});
		//從伺服器取得資料: 所有使用者下過的關鍵字; localStorage.m_topics; Topic_user[]
	    function get_search_topics(){  
	        var group_ID = localStorage.group_selected; 
			$.ajax({         
			url: 'http://chding.es.ncku.edu.tw/Groupack.beta/TopicMap/getSearchTopic.php',         
			cache: false,         
			dataType: 'html',     
			type: 'POST',        
			async: false,
			data: { sendgroup_ID: group_ID },
            statusCode: {
                404: function() {
                alert('Could not contact sever');
                },
                500: function() {
                alert('A server-side error has occurred.');
                }
            },		
			error: function(xhr) {           
				alert('Ajax request 發生錯誤'); 				
			},         
			success: function(response){
				localStorage.setItem( 'm_topics', response );
				//console.log(JSON.parse( response ));
			}     
		});		
	    }   		
        //抓取除了自己以外的群組成員.
		function get_topic_member(){
		    var group_ID = localStorage.group_selected;   //假設groupID 已被存入localstorage G_ID
			var my_ID = localStorage.FB_id;
			$.ajax({         
			url: 'http://chding.es.ncku.edu.tw/Groupack.beta/TopicMap/get_Topicmembers.php',         
			cache: false,         
			dataType: 'html',     
			type: 'POST',         
			async: false,
			data: { sendgroup_ID : group_ID , sendmy_id : my_ID },
            statusCode: {
                404: function() {
                alert('Could not contact sever');
                },
                500: function() {
                alert('A server-side error has occurred.');
                }
            },		
			error: function(xhr) {           
				alert('Ajax request 發生錯誤');         
			},         
			success: function(response){
				localStorage.setItem("topic_members",response);
			}     
		}); 	
		}		
		//家誠加油加油.你已經很努力了.這樣就很棒了.
		function get_topics_importance(){  		
	        var group_ID = localStorage.group_selected;   //假設groupID 已被存入localstorage G_ID
			var Topic = localStorage.TopicMap_NodesTopic;
			$.ajax({         
			url: 'http://chding.es.ncku.edu.tw/Groupack.beta/TopicMap/getTopicsImportance.php',         
			cache: false,         
			dataType: 'html',     
			type: 'POST',       
			async: false,
			data: { sendgroup_ID: group_ID , sendtopic: Topic },
            statusCode: {
                404: function() {
                alert('Could not contact sever');
                },
                500: function() {
                alert('A server-side error has occurred.');
                }
            },		
			error: function(xhr) {           
				alert('Ajax request 發生錯誤'); 				
			},         
			success: function(response){
				localStorage.setItem( 'topics_importance', response );
			}     
		});	
	    }  		
		function get_topic_relevance() {
			/**										***
				在 index.js 與 group.js 有呼叫此函數
				index.js :當使用者更換關鍵字時呼叫;
				group.js :當使用者更換群組時呼叫;
			***										**/
			var group_ID = localStorage.group_selected;
			$.ajax({
				url: 'TopicSim/getSim.php',
				cache: false,
				dataType: 'html',
				type: 'POST',
				data: {
					gid: group_ID
				},
				statusCode: {
					404: function () {
						alert('Could not contact sever');
					},
					500: function () {
						alert('A server-side error has occurred');
					}
				},
				error: function (xhr) {
					console.log('Ajax 錯誤: getSim.php');
				},
				success: function (response) {
					sessionStorage.setItem('topic_relevance_for' + group_ID,response);	 
				}
			});
		}		
		/*
		function testdevice(){
			//測試瀏覽器大小
			var viewportwidth;
			var viewportheight;
			// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
			if (typeof window.innerWidth != 'undefined'){
				viewportwidth = window.innerWidth,
				viewportheight = window.innerHeight
			}
			// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
			else if (typeof document.documentElement != 'undefined'&& typeof document.documentElement.clientWidth !='undefined' && document.documentElement.clientWidth != 0){
				viewportwidth = document.documentElement.clientWidth,
				viewportheight = document.documentElement.clientHeight
			}// older versions of IE
			else{
				viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
				viewportheight = document.getElementsByTagName('body')[0].clientHeight
			}
			localStorage.setItem('viewport_width', viewportwidth);
			localStorage.setItem('viewport_height', viewportheight);
		}
		*/