<?php set_time_limit(0); error_reporting(E_ERROR);

require "../db/connect.php";

$gid = isset($_POST['gid']) ? $_POST['gid'] : die("No data transmitted");

// 選取所有成員
$sql = "SELECT UserID FROM belongsto WHERE GroupID = '$gid' ";
$result = mysql_query($sql) or die('Invalid belongsto query: '.mysql_error()); 

$members = array();
while ($row = mysql_fetch_assoc($result)) {
    $members[] = $row['UserID'];
}

$keywords = array();
for ($i = 0; $i < count($members); $i++) {
    // 選取 topics
    $sql = "SELECT DISTINCT QueryKeyword FROM sessionlog WHERE UserID = '$members[$i]' AND GroupID = '$gid'";
    $result = mysql_query($sql) or die('Invalid sessionlog query : '.mysql_error().' '.$sql);
    while ($row = mysql_fetch_assoc($result)) {
        $keywords[] = $row['QueryKeyword'];    
    }
}

$keywords = array_unique($keywords);

$topics = array();
foreach ($keywords as $value) {
    
    // 隨機選擇網址
    $query = "SELECT count(*) FROM browsinglog, sessionlog
        WHERE sessionlog.QueryKeyword = '$value'
        AND sessionlog.GroupID = '$gid'
        AND sessionlog.SID = browsinglog.SID";
    $r = mysql_query($query) or die('Invalid query : '. mysql_error()."\n". $query);
    $d = mysql_fetch_row($r);
    $rand = $d[0] == 0 ? 1 : mt_rand(0,$d[0] - 1); // 防止 0 row 
    $query = "SELECT browsinglog.URL, sessionlog.QueryKeyword, searchresult.LongURL
        FROM browsinglog, sessionlog, searchresult
        WHERE sessionlog.SID = browsinglog.SID
        AND browsinglog.URL = searchresult.URL
        AND sessionlog.QueryKeyword = '$value'
        AND sessionlog.GroupID = '$gid'
        LIMIT $rand, 1";
    $r = mysql_query($query) or die('Invalid query : '.mysql_error() . "\n". $query);
    while ($row = mysql_fetch_assoc($r)) {
        if( $row['LongURL'] == null )
         $topics[] = array( 'url' => $row['URL'] , 'topic' => $row['QueryKeyword'] );
        else
         $topics[] = array( 'url' => $row['LongURL'] , 'topic' => $row['QueryKeyword'] );

    }    
}

require "multi_curl.php";

// 使用cURL取得「所有」網址內容
$output = multiCurl($topics);

// 儲存分析結果
$result = array();

// 取出文章內容並分析
foreach ( $output as $value) {
    $text = $value['data'];

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
    
    require_once 'pscws4.class.php';
    
    $pscws = new PSCWS4('utf8');
    $pscws->set_dict('etc/dict_cht.utf8.xdb');
    $pscws->set_rule('etc/rules.ini');
    $pscws->send_text($text);
    $tops = $pscws->get_tops(50);     
    $result[] = array( 'topic' => $value['topic'] , $tops );
}

// 產生每個 topic 的 URL pair
$pair = array();
foreach ($result as $num => $content) {
    for ( $num ; $num < count($result) ; $num++ ) {
        if (isset($result[$num+1])) {
            $pair[] = array( 
                array( 'topic' => $content['topic'] , 'data' => $content[0] ) , 
                array( 'topic' => $result[$num+1]['topic'] ,  'data' => $result[$num+1][0] )
            );
        }
    }
}

$topic_sim = array();

foreach ($pair as $num => &$data_array) {

    // 兩組資料合併
    $data = array_merge($data_array[0]['data'],$data_array[1]['data']); // print("<pre>".print_r($data,true)."</pre>");
    
    // 取得全部詞彙
    $words = array();
    foreach ($data as $array)
        $words[] = $array['word'];
    $words = array_unique($words);   // print("<pre>".print_r($words,true)."</pre>");
    
    $idf = array();
    // 找出詞彙的權重
    foreach ($words as $value) {
        foreach ($data as $array) {
            if ( $value == $array['word']) {
                if ( isset($idf[$value]) )
                    $idf[$value][] = $array['weight']; 
                else
                    $idf[$value] = array( $array['weight']);
            }
        }
    }

    /*******************************************
    
                 cosine similarity 計算
                 
    *******************************************/
    
    $weight = 0.0;
    // 計算分子
    foreach ($idf as $key => $value) 
        if ( count($value) > 1 )
            $weight = $weight + $value[0]*$value[1];
    
    
    $distance1 = 0.0;
    $distance2 = 0.0;
    // 計算分母
    foreach ($idf as $key => $array) {
        $distance1 = $distance1 + $array[0]*$array[0];
        if ( count($array) > 1 )
            $distance2 = $distance2 + $array[1]*$array[1];
    }
    
    // 分母取平方根
    $sim = sqrt($distance1)*sqrt($distance2);
    
    // 計算結果
    if ( $weight != 0 )
        $sim = $weight/$sim;
    else
        $sim = 0;
    
    // 回傳關聯性
    $topic_sim[] = array( 'topic1'=> $data_array[0]['topic'] , 'topic2'=> $data_array[1]['topic'] , 'relevance' => $sim );
}

echo json_encode($topic_sim);

?> 