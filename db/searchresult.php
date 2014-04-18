<?php error_reporting(E_ERROR | E_PARSE);

// Using Google Custome Search API
$keyword = isset($_POST['sendkeyword']) ? $_POST['sendkeyword'] : "Groupack";
$page = isset($_POST['sendpage']) ? $_POST['sendpage']*10 + 1 : 1;
$api = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyA2oggXqL26GRI09JFM4Gt0BULRjmC4Xwk&cx=013036536707430787589:_pqjad5hr1a&q=%s&googlehost=google.com.tw&alt=json&start=%d&fields=items(title,link,snippet,formattedUrl)';
$url = sprintf($api, urlencode($keyword), $page);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt ($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//禁止直接顯示獲取的内容 
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
$response = curl_exec($ch);
$data = json_decode($response);

foreach( $data->items as $postdata ){
	$arrayTitle['Result_Page'] = $postdata->title;
	$arraySummary['Summary'] = $postdata->snippet;
	$arrayUrl['Url'] = $postdata->formattedUrl;
	$arrayLink['Link'] = $postdata->link;
	$aryTitle[] = implode(" ", array_values($arrayTitle));	    //Result_Page
	$arySummary[] = implode(" ", array_values($arraySummary));	//Summary
	$aryUrl[] = implode(" ", array_values($arrayUrl));	    //Url( 僅顯示用 )
	$aryLink[] = implode(" ", array_values($arrayLink));    //Link( 超連結用 )
}
	
if( isset($aryTitle[0]) ){
	// 印出 google 的搜尋結果
	for( $x=0;$x<10;$x++ ){ 
		$http_length = 0;
		$http_length = strpos($aryUrl[$x], 's://');
		if ( $http_length == 4 ) $my_aryLink = substr_replace($aryUrl[$x], '', 0, 8);    // 去除 https://
		else $my_aryLink = $aryUrl[$x];
		echo	"<div class=\"four columns portfolio-item isotope-item _search_result\">
					<div class=\"search_result_inf\" title=\"選項選單\"></div>
					<div class=\"search_result_inf_field\">
						<div class=\"search_result_inf_field_content\" title=\"群組共享\">
							<div class=\"post_group\">&nbsp;</div>
							<div class=\"post_group_text\">群組共享</div>
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
} else {
	// Using Old Google Search API
	$api = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=%s&rsz=8&start=%d&gl=tw";
	$page = isset($_POST['sendpage']) ? $_POST['sendpage']*8 : 0;
	$url = sprintf($api, urlencode($keyword), $page);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt ($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	$response = curl_exec($ch);
	$data = json_decode($response);
	foreach ( $data->{'responseData'}->{'results'} as $postdata ){
	    $arrayTitle['Result_Page'] = $postdata->{'titleNoFormatting'};
	    $arraySummary['Summary'] = $postdata->{'content'};	    	 
		$arrayUrl['Url'] = urldecode( $postdata->{'unescapedUrl'} );
		$arrayLink['Link'] = $postdata->{'unescapedUrl'}; 
	    $aryTitle[] = implode(" ", array_values($arrayTitle));	    //Result_Page
		$arySummary[] = implode(" ", array_values($arraySummary));	//Summary
		$aryUrl[] = implode(" ", array_values($arrayUrl));	    //Url( 顯示用 )
		$aryLink[] = implode(" ", array_values($arrayLink));    //Link( 超連結用 )
    }	
	// 印出 google 的搜尋結果
	for( $x=0;$x<8;$x++ ){ 
		$snippet[$x] = strip_tags( $arySummary[$x] );    // 去除全部 html 標籤
		$http_length = 3 + strpos($aryUrl[$x], '://');
		$my_aryLink = substr_replace($aryUrl[$x], '', 0, $http_length);    // 去除 http:// and https://
		echo	"<div class=\"four columns portfolio-item isotope-item _search_result\">
					<div class=\"search_result_inf\" title=\"選項選單\"></div>
					<div class=\"search_result_inf_field\">
						<div class=\"search_result_inf_field_content\" title=\"群組共享\">
							<div class=\"post_group\">&nbsp;</div>
							<div class=\"post_group_text\">群組共享</div>
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
?>	