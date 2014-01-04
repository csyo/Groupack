<?php
    
    // author: Daniel G Zylberberg 
    // date 11 jul 2012 
    // $res: array with structure 0=>array("url"=>"blah"),1=>array("url"=>"some url") 
    // $options (optional): array with curl options (timeout, postfields, etc) 
    // return the same array that gets, and add "data" to the current row(html content)
    // and "error", with the string description in the case that something fail. 
    // $res = array( "1"=>array("url"=>"http://blog.xuite.net/choubee/blog/46452700-php+-+%E8%A7%A3%E6%B1%BA+Allowed+memory+size+of+134217728+bytes+exhausted+%E5%95%8F%E9%A1%8C") , "2"=>array("url"=>"http://sls.weco.net/blog/ie965119/04-jan-2009/12246") );
    
     function multiCurl($res){ 
    
            if(count($res)<=0) return False; 
    
            $handles = array(); 
    
            // default options 
            $options = array( 
                CURLOPT_HEADER => false,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_USERAGENT => "Google Bot",
                CURLOPT_FOLLOWLOCATION => true ); 
    
            // add curl options to each handle 
            foreach($res as $k=>$row){ 
                $ch{$k} = curl_init(); 
                $options[CURLOPT_URL] = $row['url']; 
                curl_setopt_array($ch{$k}, $options); 
                $handles[$k] = $ch{$k}; 
            } 
    
            $mh = curl_multi_init(); 
    
            foreach($handles as $k => $handle){ 
                curl_multi_add_handle($mh,$handle); 
            } 
    
            $running_handles = null; 
            // execute the handles 
            do { 
                $status_cme = curl_multi_exec($mh, $running_handles); 
            } while ($status_cme == CURLM_CALL_MULTI_PERFORM || $running_handles); 
    
            while ($running_handles && $status_cme == CURLM_OK){
                if (curl_multi_select($mh) != -1) {
                    do {
                        $status_cme = curl_multi_exec($mh, $running_handles);
                    } while ($status_cme == CURLM_CALL_MULTI_PERFORM || $running_handles);
                }
            }
    
            foreach($res as $k=>$row){ 
                $res[$k]['error'] = curl_error($handles[$k]); 
                if(!empty($res[$k]['error'])) 
                    $res[$k]['data']  = ''; 
                else 
                    $res[$k]['data']  = curl_multi_getcontent( $handles[$k] );  // get results 
    
                // close current handler 
                curl_multi_remove_handle($mh, $handles[$k] ); 
            } 
            curl_multi_close($mh); 
             return $res; // return response 
     }
    
?>