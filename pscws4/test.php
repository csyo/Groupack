<?php
    //error_reporting( E_ALL & ~E_STRICT );
    
    // create both cURL resources
    $ch1 = curl_init();
    $ch2 = curl_init();
    
    // set URL and other appropriate options
    $url1 = "https://zh.wikipedia.org/zh-hant/%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B";
    $url2 = "http://irw.ncut.edu.tw/peterju/se.html";
    $options1 = array( CURLOPT_URL => $url1,
                      CURLOPT_HEADER => false,
                      CURLOPT_RETURNTRANSFER => true,
                      CURLOPT_USERAGENT => "Google Bot",
                      CURLOPT_FOLLOWLOCATION => true );
    $options2 = array( CURLOPT_URL => $url2,
                      CURLOPT_HEADER => false,
                      CURLOPT_RETURNTRANSFER => true,
                      CURLOPT_USERAGENT => "Google Bot",
                      CURLOPT_FOLLOWLOCATION => true );
    curl_setopt_array($ch1, $options1);
    curl_setopt_array($ch2, $options2);
    
    //create the multiple cURL handle
    $mh = curl_multi_init();
    
    //add the two handles
    curl_multi_add_handle($mh,$ch1);
    curl_multi_add_handle($mh,$ch2);
    
    $active = null;
    //execute the handles
    do {
        $mrc = curl_multi_exec($mh, $active);
    } while ($mrc == CURLM_CALL_MULTI_PERFORM);
    
    while ($active && $mrc == CURLM_OK) {
        if (curl_multi_select($mh) != -1) {
            do {
                $mrc = curl_multi_exec($mh, $active);
            } while ($mrc == CURLM_CALL_MULTI_PERFORM);
        }
    }
    
    //close the handles
    curl_multi_remove_handle($mh, $ch1);
    curl_multi_remove_handle($mh, $ch2);
    curl_multi_close($mh);
    
    $output = curl_exec($ch);
    curl_close($ch);
    
    $text = $output;
    
    // Get <body> content only
    if (preg_match('~<body[^>]*>(.*?)</body>~si', $text, $body))
    {
        // Strip the naughty stuff
        $text = preg_replace(
            array('~[\r\n]+~', '~<(script|object|embed)[^>]*>(?:.*?)</\1>~si'),
            array(' ', null),
            $body[1]
        );
        // Strip the rest
        $text = strip_tags($text);
    }
    
    // $text = substr($text, 0 , 10001);
    
    echo $text;
    echo "</br>===============================</br>"; 
    echo "長度: ".strlen($text)." , ";
    echo "編碼: ".mb_detect_encoding($text);
    echo "</br>===============================</br>";
    
    // 加入頭文件
    require 'pscws4.class.php';
    
    // 建立分詞類對像, 參數為字符集, 默認為 gbk, 可在後面調用 set_charset 改變
    $pscws = new PSCWS4('utf8');
    
    //
    // 接下來, 設定一些分詞參數或選項, set_dict 是必須的, 若想智能識別人名等需要 set_rule 
    //
    // 包括: set_charset, set_dict, set_rule, set_ignore, set_multi, set_debug, set_duality ... 等方法
    // 
    $pscws->set_dict('etc/dict_cht.utf8.xdb');
    $pscws->set_rule('etc/rules.ini');
    
    // 分詞調用 send_text() 將待分詞的字符串傳入, 緊接著循環調用 get_result() 方法取回一系列分好的詞
    // 直到 get_result() 返回 false 為止
    // 返回的詞是一個關聯數組, 包含: word 詞本身, idf 逆詞率(重), off 在text中的偏移, len 長度, attr 詞性
    //
    
    $pscws->send_text($text);
//    while ($some = $pscws->get_result())
//    {
//       foreach ($some as $word)
//       {
//          print("<pre>".print_r($word,true)."</pre>");
//       }
//    }
    
    // 在 send_text 之後可以調用 get_tops() 返回分詞結果的詞語按權重統計的前 N 個詞
    // 常用於提取關鍵詞, 參數用法參見下面的詳細介紹.
    // 返回的數組元素是一個詞, 它又包含: word 詞本身, weight 詞重, times 次數, attr 詞性
    $tops = $pscws->get_tops(50); // , 'n,v'
    print("<pre>".print_r($tops,true)."</pre>");

?>