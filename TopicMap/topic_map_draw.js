        function draw_map(){
		
			/***************************************************************
			*			     設定layout Force的初始參數                    *
			***************************************************************/	
			
			/**           force : nodes & links              **/
			
			force = d3.layout.force()
						.size([w, h])
						.gravity(1)
						.linkDistance(							
							function(d) { 
							return d.source.radius+d.target.radius+d.weight*1.5;								
						})
						.charge(-3000)
						.linkStrength(1);       
				
			/***************************************************************
			*			           設定nodes得初始位置                     *
			****************************************************************
			*****          沿著正方形的形狀(增快達平衡的速度)          *****
			***************************************************************/
			
			var temp=-1;//用來記錄是否為相同的Node
			var n = nodes.length;
			nodes.forEach(function(d, i) {			
			/*	若有相同的Node,保持原本的位置  */
				for(var j=0;j<nodes_before.length;j++){
					if( d.topic == nodes_before[j].topic ){	
						d.x = nodes_before[j].x;
						d.y = nodes_before[j].y;
						temp = i;
						break;
					}
				}		
				/*	其餘新產生的Node,延正方型排列  */
				if( i==temp ){
					temp=-1;
				}
				else if( i%4==0 ){
					d.x = w / 4 + (w / 2)*(i / n);
					d.y = h / 4;
				}
				else if( i%4==1 ){
					d.x = 3*w / 4;
					d.y = h / 4 + (h / 2)*(i / n);
				}
				else if( i%4==2 ){
					d.x = w / 4 + (w / 2)*(i / n);
					d.y = 3*h /4;
				}
				else if( i%4==3 ){
					d.x = w / 4;
					d.y = h / 4 + (h / 2)*(i / n);
				}									
			});
			var n = labelAnchors.length;
			labelAnchors.forEach(function(d, i) {
				if(i%4==0){
				   d.x = w / 4 + (w / 2)*(i / n);
				   d.y = h / 4;
				}
				else if(i%4==1){
				   d.x = 3*w / 4;
				   d.y = h / 4 + (h / 2)*(i / n);
 				}
				else if(i%4==2){
				   d.x = w / 4 + (w / 2)*(i / n);
				   d.y = 3*h /4;
				}
				else if(i%4==3){
				   d.x = w / 4;
				   d.y = h / 4 + (h / 2)*(i / n);
				}
				
			});
			
			/*---------------------------End------------------------------*/
			
			force.nodes(nodes);
			force.links(links);
			force.start();
			
			
    /************************************************************************************************************************
													資料匯入圖形中           
	************************************************************************************************************************/		
	
			/***************************************************************
			*			              Link(關聯性)                         *
			***************************************************************/
			
			//---------某關鍵字的搜索人數--------
			topic_count=[]; //global
			for(var i=0;i<users_arr.length;i++){
				var count00=0;
				for(var t=0;t<friends.length+1;t++){
					if(users_arr[i][t]==1)
					count00++;
				}
				topic_count.push(count00);
			}
			//---------某關鍵字的搜索人數--------
			
				/**                  匯入 data                      **/			
		
			var link = lineGroup.selectAll(".link")
							.data(links ,function(d) { return d.key; });
				
				link.enter()
					.insert("line")
					.attr("class", "link")
					.style("stroke", function(d,i){
												if(topic_count[d.source.index]==0 || topic_count[d.target.index]==0) 
													return "transparent"; 
												else if( d.relevance < 0.6 && d.relevance >0.5) 
													return "#b3b3b3";
												else if( d.relevance < 0.7 && d.relevance >0.6) 
													return "#8a8a8a";
												else if( d.relevance < 0.75 && d.relevance >0.7) 
													return "#616161";
												else if( d.relevance < 0.85 && d.relevance >0.75) 
													return "#4d4d4d";
												else if( d.relevance <= 1.0 && d.relevance >0.85) 
													return "#000000";	
												});			
	
					link.exit().remove();

			/*---------------------------End------------------------------*/
			
			
			
			/***************************************************************
			*			              Node(關鍵字)                         *
			***************************************************************/
			
				/**                  匯入 data                      **/
			
			var	node = vis.selectAll("g.node1")
							.data( nodes , function(d) { return d.topic; });
							
								
			var	nodeEnter = node.enter()
							.append("svg:g")
							.attr("class", "node1")
							.attr("id", function(d, i) {  return  d.topic.replace(/ /g,'_'); })
							.style("cursor","pointer");
				
					$('.circleGroup').remove();	
						node.append("svg:g")							
							.attr("class", "circleGroup")
							.attr("id", function(d, i) { return "circle-" + d.topic.replace(/ /g,'_'); });
							
					$('.textGroup').remove();	
						node.append("svg:g")
							.attr("class", "textGroup")
							.attr("id", function(d, i) { return "text-" + d.topic.replace(/ /g,'_'); });
							
							
				/**             新增 svg:circle 元素                **/			
				node.exit().remove();
			
			$('circle').remove();	
			
			//console.log(node[0]);
			node[0].forEach(function(data,index){					
					for(var u=0; u<friends.length+1;u++){    //u=>user個
						  d3.select('#circle-'+ data.id)
							.append("svg:circle")
						    .attr("r", function(d){
										var times=0;
										for(var i=0;i<u ;i++){
											if(d.user[i]==1) times++;
										}  
										return 	d.radius+3*	times; 
										})
							.style("fill",function(d){	
											var times=0;
											for(var i=0;i<u ;i++){
												if(d.user[i]==1) 
													times++;
											}  
											if(times== 0)  return "#fff"; 
											else return "transparent"; 
											})
							.style("stroke", color[u] )
							.style("z-index", 1 )
							.style("stroke-width", function(d){
													if(d.user[u]==1) 
														return 3; 
													else return 0; 
													})
							.call(force.drag);
						} 
			});
			
				/**                新增 title 元素                  **/		
	
			$('title').remove();
			
						node.append("title")
							.text(function(d) { 
												var text_array = [] ;
												for(var i=0; i< links.length ;i++){
													if (links[i].source.topic == d.topic || links[i].target.topic == d.topic)
													text_array.push(links[i]);
												}
												var text_area = '" ' + d.topic + ' "' + '的關聯性\n';
												
												for(var k=0; k<topic_importance.length ; k++){
													if(d.topic==topic_importance[k].topic){
														text_area = text_area + '總搜尋時間: ' +topic_importance[k].total_time+ '秒\n' ;
														break;
													}													
												}
												
												//console.log(text_array);
												
												if(text_array.length != 0) {													
													for(var j=0; j<text_array.length;j++){
														if(text_array[j].source.topic==d.topic)
															text_area = text_area + text_array[j].target.topic + ' : ' + text_array[j].relevance.toFixed(2) + '\n';
														else
															text_area = text_area + text_array[j].source.topic + ' : ' + text_array[j].relevance.toFixed(2) + '\n';
													}
												}
													
												return text_area });
												
						node.select('.textGroup')
							.append("text")
							.attr("class", "nodetext")
							.attr("dx", 12)
							.attr("dy", ".15em")
							.style("z-index", 100 )
							.style("fill", "#555")
							.style("font-family", "Arial")
							.style("font-size", 12)
							.text(function(d) {return d.topic});

			
			
			
            /*---------------------------End------------------------------*/
 			
			
    /************************************************************************************************************************
												Force placement          
	************************************************************************************************************************/		
	
			
			var updateLink = function() {
				this.attr("x1", function(d) {
					return d.source.x;
				}).attr("y1", function(d) {
					return d.source.y;
				}).attr("x2", function(d) {
					return d.target.x;
				}).attr("y2", function(d) {
					return d.target.y;
				});
			}
			var updateNode = function() {
				this.attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")";
				});

			}		
			force.on("tick", function() {
				node.call(updateNode);
			    link.call(updateLink);
			});
		
	}  //end draw map	