<?php
	// 資料庫參數  抓取使用者所輸入過的關鍵字來做比較
	$dbhost = '127.0.0.1';
	$dbuser = 'cosearch';
	$dbpass = '1234567';
	$dbname = 'collaborative_search';
	$arySaveKeyword=array(); $arySaveFBID=array(); $zz=0;
	$user_FB_ID=array(); $user_FBNAME=array();
	$groupid = $_POST['sendgroupid'];
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  mysql_query("SET NAMES 'utf8'"); 
	//$query=mysql_query("SELECT SEARCH_KEYWORD,  `FB_ID` FROM  `search_session` WHERE SEARCH_KEYWORD !=  '' GROUP BY SEARCH_KEYWORD");
	if($_POST['sendgroupid']!=1){
		$query=mysql_query("SELECT SEARCH_KEYWORD,  `FB_ID` FROM  `search_session` WHERE SEARCH_KEYWORD !=  '' AND G_ID='$groupid' ");
	}else{
		$query=mysql_query("SELECT SEARCH_KEYWORD,  `FB_ID` FROM  `search_session` WHERE SEARCH_KEYWORD !=  ''");
	}
	$sqluser=mysql_query("SELECT `FB_NAME`, `FB_ID` FROM `user` ");
	while (list($tFB_NAME,$tFB_ID) = mysql_fetch_row($sqluser) ){
		$user_FBNAME[$zz]=$tFB_NAME;
		$user_FB_ID[$zz]=$tFB_ID;
		$zz++;
	}
	$zz=0;
	while (list($comment,$FBID) = mysql_fetch_row($query) ){
		$arySaveKeyword[$zz]=$comment;
		$arySaveFBID[$zz]=$FBID;
		$zz++;
	}
	for( $i=0; $i<count($arySaveKeyword); $i++){
		if( $i > 0 ){
			foreach( $aryMix as $Mix ){
				if( $Mix == $arySaveFBID[$i].$arySaveKeyword[$i] ){
					$arySaveFBID[$i] = 0;
					$arySaveKeyword[$i] = '';
					break;
				}
			}
		}
		$aryMix[$i] = $arySaveFBID[$i].$arySaveKeyword[$i];
	}
	// Report simple running errors
	error_reporting(E_ERROR | E_PARSE);
	// 取得 JSON 格式的 Google 搜尋結果
	$key_url = array();
    $_POST['sendkeyword']=$_POST['sendkeyword']!=""?$_POST['sendkeyword']:"軟體工程"; 
	$url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCW93_K-h3pXsmWdaQLW4n21OMptnmUl6M&cx=013036536707430787589:_pqjad5hr1a&q=軟體工程&googlehost=google.com.tw&alt=json&start=1&fields=items(title,link,snippet,formattedUrl)';
    $url_arr = parse_url( $url );
    parse_str( $url_arr['query'], $arr );
    $arr['q'] = urlencode( $_POST['sendkeyword'] );
	for( $i = 0; $i < 10; $i++ ){
		$arr['start'] = $i*10+1;
		$key_url[] = urldecode( 'https://'.$url_arr['host'].$url_arr['path'].'?'.http_build_query( $arr ) );
	}
	$page_id = $_POST['sendpage'] - 1;
	$array1=array();$array2=array();$array3=array();$array5=array();
	$ary1=array();$ary2=array();$ary3=array();$ary4=array();$ary5=array();
	$arySameKeyword=array(); $arySameRecord=array(); $arySameFBID=array(); $SameFBNAME;
	$key_url_now = $key_url[$page_id];
	require_once "Services/JSON.php";
	$json = new Services_JSON();
	// JSON to array
	$rss_content = '';//清空變量
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$key_url_now);
	curl_setopt ($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//禁止直接顯示獲取的内容 
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	$key_url_content = curl_exec($ch);//赋值内容
	curl_close($ch);//關閉
	$json_value = $key_url_content;
	$data = $json->decode( $json_value );
	foreach( $data->items as $postdata ){
		$arrayTitle['Result_Page'] = $postdata->title;
		$arraySummary['Summary'] = $postdata->snippet;
		$arrayUrl['Url'] = $postdata->formattedUrl;
		$arrayLink['Link'] = $postdata->link;
		$aryTitle[] = implode(" ", array_values($arrayTitle));	    //Result_Page
		$arySummary[] = implode(" ", array_values($arraySummary));	//Summary
		$aryUrl[] = implode(" ", array_values($arrayUrl));	    //Url( 顯示用 )
		$aryLink[] = implode(" ", array_values($arrayLink));    //Link( 超連結用 )
	}
	
	// 取得台灣時間
	$k_time = date ("Y-m-d H:i:s" , mktime(date('H')+8, date('i'), date('s'), date('m'), date('d'), date('Y'))) ;
if( $aryTitle[0] != null ){
	if( $_POST['sendviewportwidth'] <= 641 ){	//viewportwidth <= 640, 顯示成一排
		// 印出 google 的搜尋結果
		for( $x=0;$x<10;$x++ ){ 
			$http_length = 0;
			$http_length = strpos($aryUrl[$x], 's://');
			if( $http_length == 4 )	$my_aryLink = substr_replace($aryUrl[$x], '', 0, 8);    // 去除 https://
				else $my_aryLink = $aryUrl[$x];
			$snippet[$x] = $arySummary[$x];
			$arySameKeyword[$x]=0;
			$int=0;
			unset($arySameRecord);
			unset($arySameFBID);
			//迴圈去比較每個摘要和關鍵字
			for ($sk=0;$sk<count($arySaveKeyword);$sk++){
				if( $arySaveFBID[$sk] != 0 ){
					$arySameRecord[$sk]="";
					$arySameFBID[$sk]="";
					if(stripos($snippet[$x],$arySaveKeyword[$sk])!==false){
						$arySameKeyword[$x]=$arySameKeyword[$x]+1;  //用來計算比較.$snippet[$x].和資料庫內文字
						$arySameRecord[$int]=$arySaveKeyword[$sk];
						$arySameFBID[$int]=$arySaveFBID[$sk];
						$int=$int+1;
					}
				}
			}
			echo	"<div class=\"four columns portfolio-item isotope-item _search_result\">
					<div class=\"search_result_read\" title=\"".$arySameKeyword[$x]."筆類似的搜尋\">
						<div class=\"search_result_read_number\">".$arySameKeyword[$x]."</div>
					</div>
					<div class=\"search_result_read_field\">";
									for ($j=0;$j<$arySameKeyword[$x];$j++){
										$SameFBNAME = '';
										for ($i=0;$i<count($user_FB_ID);$i++){
											if( $arySameFBID[$j] == $user_FB_ID[$i] ){
												$SameFBNAME = $user_FBNAME[$i];
												break;
											}
											else {
												$SameFBNAME = '';
											}
										}
									echo"										
										<div class=\"search_result_read_content\" title=\"".$arySameFBID[$j]."\">
												<img class=\"_read_content_usericon\" src=\" https://graph.facebook.com/".$arySameFBID[$j]."/picture \">
												<div class=\"_read_content_name\"><span>".$SameFBNAME."</span>&nbsp;搜尋過類似關鍵字\"\"".$arySameRecord[$j]."\"\"</div>
											</div>";
									}
							
					echo"
						</div>
						<div class=\"search_result_inf\" title=\"選項選單\"></div>
						<div class=\"search_result_inf_field\">
							<div class=\"search_result_inf_field_content\" title=\"群組共享\">
								<div class=\"post_group\">&nbsp;</div>
								<div class=\"post_group_text\">群組共享</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"加到標籤\">
								<div class=\"post_tag\">&nbsp;</div>
								<div class=\"post_tag_text\">加到標籤</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"分享\">
								<div class=\"post_share\">&nbsp;</div>
								<div class=\"post_share_text\">分享</div>
							</div>
						</div>
						<div class=\"picture\">
							<a class=\"co_a fancy_iframe\" href=\"".$aryLink[$x]."\" target=\"_self\" >
								<div class=\"search_result_overlay image-overlay-link\" style=\"opacity: 0; display: block;\"></div>
							</a>
							<div class=\"item-description alt\">
								<h2 class=\"co_h2\"><a class=\"co_a fancy_iframe\" href=\"".$aryLink[$x]."\" target=\"_blank\" >".$aryTitle[$x]."</a></h2>
								<p>".$arySummary[$x]."</p>
								<div class=\"post_url\"><span>".$my_aryLink."</span></div>
							</div>
						</div>
					</div>";
		}
	}
	else{	//viewportwidth >= 640, 顯示成兩排
		// 印出 google 的搜尋結果
		echo "<div class=\"two_column\">";
		for( $x=0; $x<5; $x++ ){
			$http_length = 0;
			$http_length = strpos($aryUrl[$x], 's://');
			if( $http_length == 4 )	$my_aryLink = substr_replace($aryUrl[$x], '', 0, 8);    // 去除 https://
				else $my_aryLink = $aryUrl[$x];
			$snippet[$x] = $arySummary[$x];
			$arySameKeyword[$x]=0;
			$int=0;
			unset($arySameRecord);
			unset($arySameFBID);
			//迴圈去比較每個摘要和關鍵字
			for ($sk=0;$sk<count($arySaveKeyword);$sk++){
				if( $arySaveFBID[$sk] != 0 ){
					$arySameRecord[$sk]="";
					$arySameFBID[$sk]="";
					if(stripos($snippet[$x],$arySaveKeyword[$sk])!==false){
						$arySameKeyword[$x]=$arySameKeyword[$x]+1;  //用來計算比較.$snippet[$x].和資料庫內文字
						$arySameRecord[$int]=$arySaveKeyword[$sk];
						$arySameFBID[$int]=$arySaveFBID[$sk];
						$int=$int+1;
					}
				}
			}
					echo	"<div class=\"four columns portfolio-item isotope-item _search_result\">
								<div class=\"search_result_read\" title=\"".$arySameKeyword[$x]."筆類似的搜尋\">
									<div class=\"search_result_read_number\">".$arySameKeyword[$x]."</div>
								</div>
								<div class=\"search_result_read_field\">";
									for ($j=0;$j<$arySameKeyword[$x];$j++){
										$SameFBNAME = '';
										for ($i=0;$i<count($user_FB_ID);$i++){
											if( $arySameFBID[$j] == $user_FB_ID[$i] ){
												$SameFBNAME = $user_FBNAME[$i];
												break;
											}
											else {
												$SameFBNAME = '';
											}
										}
									echo"										
										<div class=\"search_result_read_content\" title=\"".$arySameFBID[$j]."\">
												<img class=\"_read_content_usericon\" src=\" https://graph.facebook.com/".$arySameFBID[$j]."/picture \">
												<div class=\"_read_content_name\"><span>".$SameFBNAME."</span>&nbsp;搜尋過類似關鍵字\"".$arySameRecord[$j]."\"</div>
											</div>";
									}
							
					echo"
						</div>
						<div class=\"search_result_inf\" title=\"選項選單\"></div>
						<div class=\"search_result_inf_field\">
							<div class=\"search_result_inf_field_content\" title=\"群組共享\">
								<div class=\"post_group\">&nbsp;</div>
								<div class=\"post_group_text\">群組共享</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"加到標籤\">
								<div class=\"post_tag\">&nbsp;</div>
								<div class=\"post_tag_text\">加到標籤</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"分享\">
								<div class=\"post_share\">&nbsp;</div>
								<div class=\"post_share_text\">分享</div>
							</div>
						</div>
						<div class=\"picture\">
							<a class=\"co_a fancy_iframe\" href=\"".$aryLink[$x]."\" target=\"_self\" >
								<div class=\"search_result_overlay image-overlay-link\" style=\"opacity: 0; display: block;\"></div>
							</a>
							<div class=\"item-description alt\">
								<h2 class=\"co_h2\"><a class=\"co_a fancy_iframe\" href=\"".$aryLink[$x]."\" target=\"_blank\" >".$aryTitle[$x]."</a></h2>
								<p>".$arySummary[$x]."</p>
								<div class=\"post_url\"><span>".$my_aryLink."</span></div>
							</div>
						</div>
					</div>";
		}
		echo "</div>";
		echo "<div class=\"two_column\">";
		for( $x=5; $x<10; $x++ ){
			$http_length = 0;
			$http_length = strpos($aryUrl[$x], 's://');
			if( $http_length == 4 )	$my_aryLink = substr_replace($aryUrl[$x], '', 0, 8);    // 去除 https://
				else $my_aryLink = $aryUrl[$x];
			$snippet[$x] = $arySummary[$x];
			$arySameKeyword[$x]=0;
			$int=0;
			unset($arySameRecord);
			unset($arySameFBID);
			//迴圈去比較每個摘要和關鍵字
			for ($sk=0;$sk<count($arySaveKeyword);$sk++){
				if( $arySaveFBID[$sk] != 0 ){
					$arySameRecord[$sk]="";
					$arySameFBID[$sk]="";
					if(stripos($snippet[$x],$arySaveKeyword[$sk])!==false){
						$arySameKeyword[$x]=$arySameKeyword[$x]+1;  //用來計算比較.$snippet[$x].和資料庫內文字
						$arySameRecord[$int]=$arySaveKeyword[$sk];
						$arySameFBID[$int]=$arySaveFBID[$sk];
						$int=$int+1;
					}
				}
			}
					echo	"<div class=\"four columns portfolio-item isotope-item _search_result\">
								<div class=\"search_result_read\" title=\"".$arySameKeyword[$x]."筆類似的搜尋\">
									<div class=\"search_result_read_number\">".$arySameKeyword[$x]."</div>
								</div>
								<div class=\"search_result_read_field\">";
									for ($j=0;$j<$arySameKeyword[$x];$j++){
										$SameFBNAME = '';
										for ($i=0;$i<count($user_FB_ID);$i++){
											if( $arySameFBID[$j] == $user_FB_ID[$i] ){
												$SameFBNAME = $user_FBNAME[$i];
												break;
											}
											else {
												$SameFBNAME = '';
											}
										}
									echo"										
										<div class=\"search_result_read_content\" title=\"".$arySameFBID[$j]."\">
												<img class=\"_read_content_usericon\" src=\" https://graph.facebook.com/".$arySameFBID[$j]."/picture \">
												<div class=\"_read_content_name\"><span>".$SameFBNAME."</span>&nbsp;搜尋過類似關鍵字\"".$arySameRecord[$j]."\"</div>
											</div>";
									}
					$arySummary[$x] = htmlspecialchars($arySummary[$x]);		
					echo"
						</div>
						<div class=\"search_result_inf\" title=\"選項選單\"></div>
						<div class=\"search_result_inf_field\">
							<div class=\"search_result_inf_field_content\" title=\"群組共享\">
								<div class=\"post_group\">&nbsp;</div>
								<div class=\"post_group_text\">群組共享</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"加到標籤\">
								<div class=\"post_tag\">&nbsp;</div>
								<div class=\"post_tag_text\">加到標籤</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"分享\">
								<div class=\"post_share\">&nbsp;</div>
								<div class=\"post_share_text\">分享</div>
							</div>
						</div>
						<div class=\"picture\">
							<a class=\"co_a fancy_iframe\" href=\"".$aryLink[$x]."\" target=\"_self\" >
								<div class=\"search_result_overlay image-overlay-link\" style=\"opacity: 0; display: block;\"></div>
							</a>
							<div class=\"item-description alt\">
								<h2 class=\"co_h2\"><a class=\"co_a fancy_iframe\" href=\"".$aryLink[$x]."\" target=\"_blank\" >".$aryTitle[$x]."</a></h2>
								<p>".$arySummary[$x]."</p>
								<div class=\"post_url\"><span>".$my_aryLink."</span></div>
							</div>
						</div>
					</div>";
		}
		echo "</div>";
	}
}
else{
	// 取得 JSON 格式的 Google 搜尋結果 (old)
	$key_old_url = array();
    $old_url = 	"http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=軟體工程&rsz=8&start=0&gl=tw";
    $old_url_arr = parse_url( $old_url );
    parse_str( $old_url_arr['query'], $old_arr );
    $old_arr['q'] = urlencode( $_POST['sendkeyword'] );
	for( $i = 0; $i < 8; $i++ ){
		$old_arr['start'] = $i*8;
		$key_old_url[] = urldecode( 'http://'.$old_url_arr['host'].$old_url_arr['path'].'?'.http_build_query( $old_arr ) );
	}
	$page_id = $_POST['sendpage'] - 1;
	$key_old_url_now = $key_old_url[$page_id];
	$old_json = new Services_JSON();
	$rss_content = '';//清空變量
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $key_old_url_now);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//禁止直接顯示獲取的内容 
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($ch, CURLOPT_USERAGENT, "Google Bot");
	$key_old_url_content = curl_exec($ch);//赋值内容
	curl_close($ch);//關閉
	$old_json_value = $key_old_url_content;
	$old_data = $old_json->decode( $old_json_value );
	$old_data = $old_json->decode( $old_json_value );
	// 宣告陣列變數
	/*
	$arrayTitle=array();$arraySummary=array();$arrayUrl=array();
	$aryTitle=array();$arySummary=array();$aryUrl=array();	
	// 將搜尋結果的標題,摘要,網址依序存入陣列中*/
	foreach ( $old_data->{'responseData'}->{'results'} as $postdata ){
	    $arrayTitle['Result_Page'] = $postdata->{'titleNoFormatting'};
	    $arraySummary['Summary'] = $postdata->{'content'};	    	 
		$arrayUrl['Url'] = urldecode( $postdata->{'unescapedUrl'} );
		$arrayLink['Link'] = $postdata->{'unescapedUrl'}; 
	    $aryTitle[] = implode(" ", array_values($arrayTitle));	    //Result_Page
		$arySummary[] = implode(" ", array_values($arraySummary));	//Summary
		$aryUrl[] = implode(" ", array_values($arrayUrl));	    //Url( 顯示用 )
		$aryLink[] = implode(" ", array_values($arrayLink));    //Link( 超連結用 )
    }	
	if( $_POST['sendviewportwidth'] <= 641 ){	//viewportwidth <= 640, 顯示成一排
		// 印出 google 的搜尋結果
		for( $x=0;$x<8;$x++ ){ 
			$snippet[$x] = strip_tags( $arySummary[$x] );    // 去除全部 html 標籤
			$http_length = 3 + strpos($aryUrl[$x], '://');
			$my_aryLink = substr_replace($aryUrl[$x], '', 0, $http_length);    // 去除 http:// and https://
			$arySameKeyword[$x]=0;
			$int=0;
			unset($arySameRecord);
			unset($arySameFBID);
			//迴圈去比較每個摘要和關鍵字
			for ($sk=0;$sk<count($arySaveKeyword);$sk++){
				if( $arySaveFBID[$sk] != 0 ){
					$arySameRecord[$sk]="";
					$arySameFBID[$sk]="";
					if(stripos($snippet[$x],$arySaveKeyword[$sk])!==false){
						$arySameKeyword[$x]=$arySameKeyword[$x]+1;  //用來計算比較.$snippet[$x].和資料庫內文字
						$arySameRecord[$int]=$arySaveKeyword[$sk];
						$arySameFBID[$int]=$arySaveFBID[$sk];
						$int=$int+1;
					}
				}
			}
			echo	"<div class=\"four columns portfolio-item isotope-item _search_result\">
						<div class=\"search_result_read\" title=\"".$arySameKeyword[$x]."筆類似的搜尋\">
							<div class=\"search_result_read_number\">".$arySameKeyword[$x]."</div>
						</div>
						<div class=\"search_result_read_field\">";
							for ($j=0;$j<$arySameKeyword[$x];$j++){
								$SameFBNAME = '';
								for ($i=0;$i<count($user_FB_ID);$i++){
									if( $arySameFBID[$j] == $user_FB_ID[$i] ){
										$SameFBNAME = $user_FBNAME[$i];
										break;
									}
									else {
										$SameFBNAME = '';
									}
								}
							echo"										
								<div class=\"search_result_read_content\" title=\"".$arySameFBID[$j]."\">
										<img class=\"_read_content_usericon\" src=\" https://graph.facebook.com/".$arySameFBID[$j]."/picture \">
										<div class=\"_read_content_name\"><span>".$SameFBNAME."</span>&nbsp;搜尋過類似關鍵字\"".$arySameRecord[$j]."\"</div>
									</div>";
							}
			$arySummary[$x] = htmlspecialchars($arySummary[$x]);	
			echo"
				</div>
						<div class=\"search_result_inf\" title=\"選項選單\"></div>
						<div class=\"search_result_inf_field\">
							<div class=\"search_result_inf_field_content\" title=\"群組共享\">
								<div class=\"post_group\">&nbsp;</div>
								<div class=\"post_group_text\">群組共享</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"加到標籤\">
								<div class=\"post_tag\">&nbsp;</div>
								<div class=\"post_tag_text\">加到標籤</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"分享\">
								<div class=\"post_share\">&nbsp;</div>
								<div class=\"post_share_text\">分享</div>
							</div>
						</div>
						<div class=\"picture\">
							<a class=\"co_a fancy_iframe\" href=\"".$aryUrl[$x]."\" target=\"_self\">
								<div class=\"search_result_overlay image-overlay-link\" style=\"opacity: 0; display: block;\"></div>
							</a>
							<div class=\"item-description alt\">
								<h2 class=\"co_h2\"><a class=\"co_a fancy_iframe\" href=\"".$aryUrl[$x]."\" target=\"_blank\">".$aryTitle[$x]."</a></h2>
								<p>".$snippet[$x]."</p>
								<div class=\"post_url\"><span>".$my_aryLink."</span></div>
							</div>
						</div>
					</div>";
		}
	}
	else{	//viewportwidth >= 640, 顯示成兩排
	// 印出 google 的搜尋結果
		echo "<div class=\"two_column\">";
		for( $x=0; $x<4; $x++ ){
			$snippet[$x] = strip_tags( $arySummary[$x] );    // 去除全部 html 標籤
			$http_length = 3 + strpos($aryUrl[$x], '://');
			$my_aryLink = substr_replace($aryUrl[$x], '', 0, $http_length);    // 去除 http:// and https://
			$arySameKeyword[$x]=0;
			$int=0;
			unset($arySameRecord);
			unset($arySameFBID);
			//迴圈去比較每個摘要和關鍵字
			for ($sk=0;$sk<count($arySaveKeyword);$sk++){
				if( $arySaveFBID[$sk] != 0 ){
					$arySameRecord[$sk]="";
					$arySameFBID[$sk]="";
					if(stripos($snippet[$x],$arySaveKeyword[$sk])!==false){
						$arySameKeyword[$x]=$arySameKeyword[$x]+1;  //用來計算比較.$snippet[$x].和資料庫內文字
						$arySameRecord[$int]=$arySaveKeyword[$sk];
						$arySameFBID[$int]=$arySaveFBID[$sk];
						$int=$int+1;
					}
				}
			}
					echo	"<div class=\"four columns portfolio-item isotope-item _search_result\">
								<div class=\"search_result_read\" title=\"".$arySameKeyword[$x]."筆類似的搜尋\">
									<div class=\"search_result_read_number\">".$arySameKeyword[$x]."</div>
								</div>
								<div class=\"search_result_read_field\">";
									for ($j=0;$j<$arySameKeyword[$x];$j++){
										$SameFBNAME = '';
										for ($i=0;$i<count($user_FB_ID);$i++){
											if( $arySameFBID[$j] == $user_FB_ID[$i] ){
												$SameFBNAME = $user_FBNAME[$i];
												break;
											}
											else {
												$SameFBNAME = '';
											}
										}
									echo"										
										<div class=\"search_result_read_content\" title=\"".$arySameFBID[$j]."\">
												<img class=\"_read_content_usericon\" src=\" https://graph.facebook.com/".$arySameFBID[$j]."/picture \">
												<div class=\"_read_content_name\"><span>".$SameFBNAME."</span>&nbsp;搜尋過類似關鍵字\"".$arySameRecord[$j]."\"</div>
											</div>";
									}
					$arySummary[$x] = htmlspecialchars($arySummary[$x]);		
					echo"
						</div>
						<div class=\"search_result_inf\" title=\"選項選單\"></div>
						<div class=\"search_result_inf_field\">
							<div class=\"search_result_inf_field_content\" title=\"群組共享\">
								<div class=\"post_group\">&nbsp;</div>
								<div class=\"post_group_text\">群組共享</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"加到標籤\">
								<div class=\"post_tag\">&nbsp;</div>
								<div class=\"post_tag_text\">加到標籤</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"分享\">
								<div class=\"post_share\">&nbsp;</div>
								<div class=\"post_share_text\">分享</div>
							</div>
						</div>
						<div class=\"picture\">
							<a class=\"co_a fancy_iframe\" href=\"".$aryUrl[$x]."\" target=\"_self\">
								<div class=\"search_result_overlay image-overlay-link\" style=\"opacity: 0; display: block;\"></div>
							</a>
							<div class=\"item-description alt\">
								<h2 class=\"co_h2\"><a class=\"co_a fancy_iframe\" href=\"".$aryUrl[$x]."\" target=\"_blank\">".$aryTitle[$x]."</a></h2>
								<p>".$snippet[$x]."</p>
								<div class=\"post_url\"><span>".$my_aryLink."</span></div>
							</div>
						</div>
					</div>";
		}
		echo "</div>";
		echo "<div class=\"two_column\">";
		for( $x=4; $x<8; $x++ ){
			$snippet[$x] = strip_tags( $arySummary[$x] );    // 去除全部 html 標籤
			$http_length = 3 + strpos($aryUrl[$x], '://');
			$my_aryLink = substr_replace($aryUrl[$x], '', 0, $http_length);    // 去除 http:// and https://
			$arySameKeyword[$x]=0;
			$int=0;
			unset($arySameRecord);
			unset($arySameFBID);
			//迴圈去比較每個摘要和關鍵字
			for ($sk=0;$sk<count($arySaveKeyword);$sk++){
				if( $arySaveFBID[$sk] != 0 ){
					$arySameRecord[$sk]="";
					$arySameFBID[$sk]="";
					if(stripos($snippet[$x],$arySaveKeyword[$sk])!==false){
						$arySameKeyword[$x]=$arySameKeyword[$x]+1;  //用來計算比較.$snippet[$x].和資料庫內文字
						$arySameRecord[$int]=$arySaveKeyword[$sk];
						$arySameFBID[$int]=$arySaveFBID[$sk];
						$int=$int+1;
					}
				}
			}
					echo	"<div class=\"four columns portfolio-item isotope-item _search_result\">
								<div class=\"search_result_read\" title=\"".$arySameKeyword[$x]."筆類似的搜尋\">
									<div class=\"search_result_read_number\">".$arySameKeyword[$x]."</div>
								</div>
								<div class=\"search_result_read_field\">";
									for ($j=0;$j<$arySameKeyword[$x];$j++){
										$SameFBNAME = '';
										for ($i=0;$i<count($user_FB_ID);$i++){
											if( $arySameFBID[$j] == $user_FB_ID[$i] ){
												$SameFBNAME = $user_FBNAME[$i];
												break;
											}
											else {
												$SameFBNAME = '';
											}
										}
									echo"										
										<div class=\"search_result_read_content\" title=\"".$arySameFBID[$j]."\">
												<img class=\"_read_content_usericon\" src=\" https://graph.facebook.com/".$arySameFBID[$j]."/picture \">
												<div class=\"_read_content_name\"><span>".$SameFBNAME."</span>&nbsp;搜尋過類似關鍵字\"".$arySameRecord[$j]."\"</div>
											</div>";
									}
					$arySummary[$x] = htmlspecialchars($arySummary[$x]);
					echo"
						</div>
						<div class=\"search_result_inf\" title=\"選項選單\"></div>
						<div class=\"search_result_inf_field\">
							<div class=\"search_result_inf_field_content\" title=\"群組共享\">
								<div class=\"post_group\">&nbsp;</div>
								<div class=\"post_group_text\">群組共享</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"加到標籤\">
								<div class=\"post_tag\">&nbsp;</div>
								<div class=\"post_tag_text\">加到標籤</div>
							</div>
							<div class=\"search_result_inf_field_content\" title=\"分享\">
								<div class=\"post_share\">&nbsp;</div>
								<div class=\"post_share_text\">分享</div>
							</div>
						</div>
						<div class=\"picture\">
							<a class=\"co_a fancy_iframe\" href=\"".$aryUrl[$x]."\" target=\"_self\">
								<div class=\"search_result_overlay image-overlay-link\" style=\"opacity: 0; display: block;\"></div>
							</a>
							<div class=\"item-description alt\">
								<h2 class=\"co_h2\"><a class=\"co_a fancy_iframe\" href=\"".$aryUrl[$x]."\" target=\"_blank\">".$aryTitle[$x]."</a></h2>
								<p>".$snippet[$x]."</p>
								<div class=\"post_url\"><span>".$my_aryLink."</span></div>
							</div>
						</div>
					</div>";
		}
		echo "</div>";
	}
}
	/***************************************************************************************************************/
	$aa = $_POST['sendUserID'];
	$sql = "SELECT `G_ID` FROM `group_member` WHERE `FB_ID`= '$aa';";
    $result = mysql_query($sql) or die('MySQL query error');
	$G_ID_ary=array();
    while( $a = mysql_fetch_array($result) ){    //抓取使用者的所有 group ID，存在 $G_ID_ary 裏
		$G_ID_ary[] = $a['G_ID'];
    }

	$FB_ID_ary_temp=array();
	for( $i=0; $i<count($G_ID_ary); $i++ ){    //抓取使用者的所有 group ID 之所有 member，不重覆，存在 $FB_ID_ary_temp 裏
		$sql = "SELECT `FB_ID` FROM `group_member` WHERE `G_ID`= '$G_ID_ary[$i]';";
		$result = mysql_query($sql) or die('MySQL query error');
		while( $a = mysql_fetch_array($result) ){
			if( $i == 0 ){
				array_push( $FB_ID_ary_temp, $a['FB_ID'] );
			}else{
				for( $j=0; $j<count($FB_ID_ary_temp); $j++ ){
					if( $FB_ID_ary_temp[$j] == $a['FB_ID'] ){
						$temp2 = 0;
						break;
					}else{
						$temp2 = 1;
					}
				}
				if( $temp2 == 1 )
					array_push( $FB_ID_ary_temp, $a['FB_ID'] );
			}
		}
	}
	for( $i=0; $i<count($FB_ID_ary_temp); $i++ ){    //使用者的所有 group ID 之所有 member，不重覆，加上 long polling 之 .txt
		$path = dirname(__FILE__).'/TimelinePolling/'.$FB_ID_ary_temp[$i].'.txt';  //檔案路徑
		if( is_file( $path ) ){    //檔案存在
		}else{    //檔案不存在
			$data = dirname(__FILE__).'/TimelinePolling/'.$FB_ID_ary_temp[$i].'.txt';
			$fp = fopen($data, "w");
			fclose($fp);
		}
	}
	mysql_close($connect);
?>