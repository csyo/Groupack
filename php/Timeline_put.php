<?php
    $dbhost = '127.0.0.1';
    $dbuser = 'cosearch';
    $dbpass = '1234567';
    $dbname = 'collaborative_search';
    $conn = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
    mysql_query("SET NAMES 'utf8'");
    mysql_select_db($dbname);
	$aa = $_POST['FB_id'];
    $sql = "SELECT `G_ID` FROM `group_member` WHERE `FB_ID`= '$aa';";
    $result = mysql_query($sql) or die('MySQL query error');
	$G_ID_ary=array();
	$All_Group_ary=array();
    while( $a = mysql_fetch_array($result) ){    //抓取使用者的所有 group ID，存在 $G_ID_ary 裏
		$G_ID_ary[] = $a['G_ID'];
		$All_Group_ary[] = array(    //抓取使用者的所有 group
			'Group_ID' => $a['G_ID']
		);
    }
	$User_ID = array();
	$User_ID['User_FB_ID'] = $_POST['FB_id'];
	/***************************************************************************************************************/
	$FB_ID_ary_temp=array();$FB_ID_ary=array();
	for( $i=0; $i<count($G_ID_ary); $i++ ){    //抓取使用者的所有 group ID 之所有 member，不重覆，存在 $FB_ID_ary_temp 裏
		$sql = "SELECT * FROM `group_member` WHERE `G_ID`= '$G_ID_ary[$i]';";
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
			$FB_ID_ary[] = array(    //抓取使用者的所有 group 資訊
				'Group_ID' => $G_ID_ary[$i],	
				'Group_Information' => array(
					'G_ID' => $G_ID_ary[$i],
					'G_NAME' => $a['G_NAME'],
					'FB_ID' => $a['FB_ID'],
					'FB_NAME' => $a['FB_NAME'],
					'G_ROLE' => $a['ROLE']
				)
			);
		}
	}
	$Related_FB_ID=array();$All_MemberGroup_ary=array();
	for( $i=0; $i<count($FB_ID_ary_temp); $i++ ){    //抓取使用者的所有 group ID 之所有 member，不重覆，存在 $Related_FB_ID 裏
		$b = $FB_ID_ary_temp[$i];
		$Related_FB_ID[] = array(
			'Related_FB_ID' => $b
		);
		$sql = "SELECT `G_ID` FROM `group_member` WHERE `FB_ID`= '$b';";
		$result = mysql_query($sql) or die('MySQL query error');
		while( $a = mysql_fetch_array($result) ){    
			$All_MemberGroup_ary[] = array(   
				$b => $a['G_ID']
			);
		}
	}
	/***************************************************************************************************************/
	$workspace_ary=array();
	for( $i=0; $i<count($G_ID_ary); $i++ ){    //抓取使用者的所有 workspace，存在 $workspace_ary 裏
		$sql = "SELECT * FROM `workspace` WHERE `G_ID`= '$G_ID_ary[$i]';";
		$result = mysql_query($sql) or die('MySQL query error');
		while( $a = mysql_fetch_array($result) ){
			$workspace_ary[] = array( 
				'G_ID' => $G_ID_ary[$i],	
				'Workspace_Information' => array(
					'W_ID' => $a['W_ID'],
					'W_NAME' => $a['W_NAME'],
					'COMMENT' => $a['COMMENT'],
					'W_TIMESTAMP' => $a['W_TIMESTAMP'],
					'W_CREATOR' => $a['W_CREATOR']
				)
			);
		}
	}
	/***************************************************************************************************************/
	$workspace_folder_ary=array();
	for( $i=0; $i<count($workspace_ary); $i++ ){    //抓取使用者的所有 folder $workspace_folder_ary 裏
		$qq = $workspace_ary[$i]['Workspace_Information']['W_ID'];
		$sql = "SELECT * FROM `workspace_folder` WHERE `W_ID` = '$qq';";
		$result = mysql_query($sql) or die('MySQL query error');
		while( $a = mysql_fetch_array($result) ){
			$workspace_folder_ary[] = array( 
				'W_ID' => $qq,	
				'Folder_Information' => array(
					'FOLDER_ID' => $a['FOLDER_ID'],
					'FOLDER_NAME' => $a['FOLDER_NAME'],
					'COMMENT' => $a['COMMENT'],
					'FOLDER_TIMESTAMP' => $a['FOLDER_TIMESTAMP'],
					'FOLDER_CREATOR' => $a['FOLDER_CREATOR']
				)
			);
		}
	}
	/***************************************************************************************************************/
	$folder_card_ary=array();
	for( $i=0; $i<count($workspace_folder_ary); $i++ ){    //抓取使用者的所有 card，存在 $folder_card_ary 裏
		$qq = $workspace_folder_ary[$i]['Folder_Information']['FOLDER_ID'];
		$sql = "SELECT * FROM `folder_card` WHERE `FOLDER_ID` = '$qq' AND `IS_FILE` = '0' ORDER BY `CARD_ID` DESC Limit 10;";
		$result = mysql_query($sql) or die('MySQL query error');
		while( $a = mysql_fetch_array($result) ){
			$folder_card_ary[] = array( 
				'FOLDER_ID' => $qq,	
				'CARD_Information' => array(
					'CARD_ID' => $a['CARD_ID'],
					'TITLE' => $a['TITLE'],
					'CONTENT' => $a['CONTENT'],
					'URL' => $a['URL'],
					'CARD_TIMESTAMP' => $a['CARD_TIMESTAMP'],
					'CARD_CREATOR' => $a['CARD_CREATOR']
				)
			);
		}
	}
	mysql_close($conn);
	
	$response = array();
	$response['removeID'] = isset($_POST['remove_ID']) ? $_POST['remove_ID'] : 'none';
	$check_Group_ary = array();
	$check_Group_ary['checkGroup'] = isset($_POST['check_Group']) ? $_POST['check_Group'] : 'none';
	$check_WFC_ary = array();
	$check_WFC_ary['check_WFC'] = isset($_POST['check_WFC']) ? $_POST['check_WFC'] : 'none';
	$check_initial_ary = array();
	$check_initial_ary['check_initial'] = isset($_POST['initial']) ? $_POST['initial'] : 'none';
	
	$inf = json_encode($User_ID).'+++'.json_encode($Related_FB_ID).'+++'.json_encode($FB_ID_ary).'+++'.json_encode($workspace_ary).'+++'.json_encode($workspace_folder_ary).'+++'.json_encode($folder_card_ary).'+++'.json_encode($response).'+++'.json_encode($All_Group_ary).'+++'.json_encode($All_MemberGroup_ary).'+++'.json_encode($check_Group_ary).'+++'.json_encode($check_WFC_ary).'+++'.json_encode($check_initial_ary);
	
	for( $i=0; $i<count($FB_ID_ary_temp); $i++ ){    //寫入相關 FB_ID 之文字檔
		//保存數据的文件
		$file_name  = dirname(__FILE__).'/TimelinePolling/'.$FB_ID_ary_temp[$i].'.txt';
				
		// 獲取傳遞的數据
		$msg = isset( $inf ) ? $inf : '';
		//echo $file_name;
				
		//如果保存數据不為空，保存數据，不返回
		if($msg !=''){
			file_put_contents($file_name,$msg);
		}
	}
	echo $inf;
?>