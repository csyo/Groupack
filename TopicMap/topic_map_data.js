
	/************************************************************************************************************************
													群組成員匯入           
	************************************************************************************************************************/	
		function User_data(){								
			/***************************************************************
			*						 ID對照表                              *
			****************************************************************
			*********註:自己:ID_dic[0]  群組其他成員:ID_dic[1]~[n]**********
			***************************************************************/
			
		    var friendsJson = localStorage.topic_members;    
			friends =[];
            friends= JSON.parse( friendsJson );//global

			ID_dic=[];//global
			ID_dic[0] =  localStorage.FB_id ;
						
			for(var i=0;i<friends.length;i++){ 
                ID_dic[i+1]=friends[i].id;   	 
			}
			
			/**    自己:       localStorage.FB_id
			群組其他成員:	   localStorage.topic_members                **/
			/*---------------------------End------------------------------*/
			
		    /***************************************************************
			*					       color[]                             *
			****************************************************************
			*******************註:成員每個人所代表的顏色********************
			***************************************************************/
			
			color = ['#1f77b4','#ff7f0e','#2ca02c','#00f','#ff0','#f0f','#ab0','#a0b','#a00','#00a','#909'];//global 
			
			for(var i=11;i<friends.length+1;i++){
                color[i] = "hsl(" + Math.random() * 360 + ",100%,50%)";
			}
			
			/*---------------------------End------------------------------*/

            /***************************************************************
			*		   群組使用者欄 div : user_nav_for_topicmap            *
			****************************************************************
			***************************************************************/			
			//自己 
			var me= '<a class="user_pic_for_topicmap" id="' + localStorage.FB_id + '"title="' + localStorage.FB_name +'"><img class="pics_for_fb data_on" style="border-style:solid; border-color:'+color[0]+';" src="https://graph.facebook.com/' + localStorage.FB_id + '/picture" width="40px"></a>';
			$('#user_nav_for_topicmap').append( me );     
			
     	    for (var i=0; i<friends.length ; i++) {                          
		         friends[i] =new Array(2);	
			}
			
			//群組其他成員	
			friends = JSON.parse( friendsJson );    	
			for(var i=0;i<friends.length;i++){
			var friends_pic = '<a class="user_pic_for_topicmap" id="' + friends[i].id + '"title="' + friends[i].name +'"><img class="pics_for_fb data_on" style="border-style:solid; border-color:'+color[i+1]+';" src="https://graph.facebook.com/' + friends[i].id + '/picture" width="40px"></a>';
			$('#user_nav_for_topicmap').append( friends_pic );
			}
		}			
			/*---------------------------End------------------------------*/			
			
						
	/************************************************************************************************************************
													搜尋資料匯入           
	************************************************************************************************************************/

		/*****							Link			        			*****/
			
		function set_Links(){  											
			/***				 關聯性的資料處理 							***/
			
					topic_relevance = JSON.parse(sessionStorage.getItem('topic_relevance_for'+localStorage.group_selected));
					/**		定義函式	**/
					/* 	設定關聯性的顯示門檻  	*/
					function set_threshold_for_relevance(number){
						for (var i = 0; i < topic_relevance.length; i++) {
							if (topic_relevance[i].relevance < number) {
								topic_relevance.splice(i, 1);
								i--;
							}
						}
					}
		
					/* 	將關聯性參數轉成線的長度    */
					var relevance = d3.scale.linear()
								.domain([1, 2])
								.range([0, 60]);
					
					rele_real = [];
					function scales_r(d){
						rele_real.push(d.relevance);
						d.relevance =  1/d.relevance;
						d.relevance =  relevance(d.relevance); 
					}	
					
					/* 	將關聯性資料存入Link    */
					function links_data(){			
						for(var i = 0; i<topic_relevance.length;i++){	 
							links.push({
								source_topic : topic_relevance[i].topic1,
								target_topic : topic_relevance[i].topic2,
								weight : topic_relevance[i].relevance ,
								relevance : rele_real[i]
							});						
						}
						links.forEach(function(d,i){ d.key = i;	});
						for(var i = 0; i < nodes.length; i++) {
							labelAnchorLinks.push({
							source : i *2,
							target : i *2 + 1,
							weight : 1
							});
						}
					}
					
					set_threshold_for_relevance(0.5);
					topic_relevance.forEach(function(d) { scales_r(d);});						
					links_data();
					
			/*** 		  topic_relevance陣列參考測試用資料		    	 ***
			var relavance = [{    
			     topic1: 'gogo',
				 topic2: 'htc one',
				 relavance: 0.5
				 },
				 {    
			     topic1: 'safari',
				 topic2: 'htc one',
				 relavance: 1.2
				 }]
			***															***/
			/*---------------------------End------------------------------*/
		}

		/*****							Nodes			        			*****/
		
		
		//加油啦! 你永遠有抵不完的bug, 不差這一個.
		function get_NodeTopics_from_link(){									
		    /***************************************************************
			/*			                topics[]                           *
			****************************************************************
			*****************註:群組內所有搜尋過的topic*********************
			***************************************************************/
			var topics_object = new Object();
			links.forEach(function(d) {		
				d.source_topic = topics_object[d.source_topic] || (topics_object[d.source_topic] = {keyword: d.source_topic});
				d.target_topic = topics_object[d.target_topic] || (topics_object[d.target_topic] = {keyword: d.target_topic});
			});	
			topics=[];			
			topics=Object.keys(topics_object);
			links.forEach(function(d){
				d.source = topics.indexOf(d.source_topic.keyword);
				d.target = topics.indexOf(d.target_topic.keyword);
			})					
			localStorage.setItem( 'TopicMap_NodesTopic', JSON.stringify(topics));
			/*---------------------------End------------------------------*/			
		}			
		    
		function nodes_TopicImportance(){				
			/***************************************************************
			/*			         topic_importance[]                        *
			****************************************************************
			*****註:每個topic重要性, 由搜尋時間決定, 匯入node的圓圈半徑*****
			***************************************************************/
			topic_importance = JSON.parse( localStorage.topics_importance );
			for(var i=0;i<topics.length;i++){
				for(var j=0;j<topic_importance.length;j++){
					if(topic_importance[j].topic == topics[i]){
						break;
					}
					else if(j==topic_importance.length-1){
						topic_importance.push({
							importance: 8,
							topic: topics[i]
						});
					}		
				}
			}
			/*** 		         將時間參數轉成半徑大小		        	 ***/
			
			var radius = d3.scale.linear()
				             	.domain([0, 250, 250, 500, 500, 1000, 1000, 2000, 2000, 4000, 4000, 8000])
								.range([8, 8, 10, 10, 15, 15, 20, 20, 25, 25, 30, 30]);
			function scales(d){
				d.importance =  radius(d.importance); 
			}	
			topic_importance.forEach(function(d) { 
				d.total_time = d.importance;
				scales(d);
			});
			//console.log(topic_importance);
			
		    /*** 		  topic_importance陣列參考測試用資料		   	 ***
			var topic_importance =[{
					topic:"chenchenbox",
					importance:12
					},
					{
					topic:"你好嗎",
					importance:17
					}
					];
			***															***/
	
			/*---------------------------End------------------------------*/
		}

		function original_users_arr(){
			/***************************************************************
			*					   user_arr[]                              *
			****************************************************************
			**************註:1表示user有下過該topic ;0則相反****************
			***************************************************************/
			
			var user_topicJSON = localStorage.m_topics;      		
            var user_topic= JSON.parse( user_topicJSON );
			console.log(ID_dic);
			users_arr = new Array(topics.length);  //global
			for(var y=0; y< topics.length ; y++){
			    users_arr[y] = new Array(ID_dic.length); 
				for(var x=0; x< ID_dic.length ; x++){
					users_arr[y][x]=0;
				}
			} 
			
			for(var i=0;i<user_topic.length;i++){
			    var user_key=-1,t=-1;
				for(var j=0;j< ID_dic.length;j++){
				    if(user_topic[i].FB_id==ID_dic[j]){
					    user_key=j;
                    }					
				}
				for(var y=0; y < topics.length ; y++){ 
					if(user_topic[i].keyword == topics[y]){
						t=y;
						break;
					}	
			    }
				if( user_key!=-1 && t!=-1)
					users_arr[t][user_key]=1;
			}			
			localStorage.setItem('TopicMap_users_arr', JSON.stringify(users_arr));
			/*** 			user_arr陣列參考測試用資料				 ***
		    var topics = ["白臉","豆皮","阿龍","乖黃","黑狗兄"];
			var users_arr = new Array(topics.length);
			var user =3;
			for (var i=0; i<5 ; i++) {                          
		         users_arr[i] =new Array(user);				//共三個user
			}
			users_arr[0] = [1,0,1];                       //user1&3下過白臉這個topic
			users_arr[1] = [1,1,0];
			users_arr[2] = [1,1,1];
			users_arr[3] = [0,0,1];
			users_arr[4] = [0,1,1];
			var rad =[];
			for(var i=0; i<topics.length;i++){
			    rad[i]=Math.round(Math.random()*30+5);
			}	                                                         
			***															***/
			/*---------------------------End------------------------------*/
		}
    /************************************************************************************************************************
													資料存入js變數          
	************************************************************************************************************************/			
			
			/***************************************************************
			*			              Node(關鍵字)                         *
			***************************************************************/
		function set_Nodes(){	
			nodes=[];
			labelAnchors=[];
			for(var i = 0; i < topics.length; i++) {			        
     		    var node = {                                   //node包含 user 和 topic 的資料
			    	topic : topics[i],
					user  : users_arr[i],		     	       //users00是一個陣列EX:	users00[0] = [1,0,1];  
					radius : topic_importance[i].importance    //半徑的大小由topic的重要性決定
			    };			
				nodes.push(node);                              //可以從外部呼叫node裡的值 ex: nodes[0].topic !
				labelAnchors.push({
					node : node
				});
				labelAnchors.push({
					node : node
				});
			};
			localStorage.setItem( 'TopicMap_nodes', JSON.stringify(nodes) );
		}			
			
