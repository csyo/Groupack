PTT-BOT
=====================


**Ptt-bot** 是一個開放原始碼的專案，它的目標在於提供開發者在開發批踢踢機器人所需要的底層架構與函式和上層應用程式，解決需要開發時會遇到的各種底層惱人的問題。**Ptt-bot** 由 **JavaScript**[1] 編寫，並需要在 [**node.JS**][package1] 的環境下運行。**Ptt-bot** 使用 **node.JS** 原生的 [**Net**][package2] 套件進行 **Telnet**[2] 的連線，並利用 [**iconv-lite**][package3] 和 [**String.js**][package4] 套件分別解決 **Big5編碼**[3] 與字串解析的問題。加油加油!

Ptt-bot is an open source node.js project for crawling data from **PTT**[4] (a well-known BBS service in Taiwan).

[1]: http://zh.wikipedia.org/wiki/JavaScript
[2]: http://courses.ywdeng.idv.tw/cust/2011/np/PPT/CH08-telnet.ppt
[3]: http://zh.wikipedia.org/zh-tw/%E5%A4%A7%E4%BA%94%E7%A2%BC
[4]: http://en.wikipedia.org/wiki/PTT_Bulletin_Board_System

[package1]: http://nodejs.org/
[package2]: http://nodejs.org/api/net.html
[package3]: https://github.com/ashtuchkin/iconv-lite
[package4]: https://github.com/jprichardson/string.js


Sample code
---------
You can download the sample code in myBot.js
```JavaScript
var myBot = require('./ptt-bot');
    
//create the connection object for your robot. 
var conn = myBot.login('yourID','yourPassword');
conn.on('data', function(data){	
	//main screen listener
	if (myBot.where(data)=='【主功能表】'){
		/**
			put all your robot commands for main screen here.
			please refer to Ptt-bot API.
		**/
		MaintoFavBoard(conn,data); //when entering another screen, add the relative screen listener.    
	}
	//myFavBoards screen listener
	if(myBot.where(data)=='【我的最愛看板列表】'){
		console.log( '您現在位於【我的最愛看板列表】' );
		/**
			put all your robot commands for myFavBoards screen here.
		**/
		conn.end(); //remember to disconnect the connection if robot has done his task.
	}
	//Avoid leave excution code here, since it will be executed everytime when the data comes from ptt-sever.
});
console.log('start the robot.');
```
base-method
----------
 * login( id , ps )
執行登入ptt-sever的功能，登入完後會停留在 【主功能表】的頁面。開發者需要自行輸入機器人的帳號及密碼，並且回傳已連上ptt:23的connection物件。connection物件擁有write()等功能，connection物件詳細內容需參考Net原生套件[b1]。  

 * where ( data )
回傳目前所在的頁面，供判斷頁面用(screen listener)。 需將從ptt-sever上接收到的內容傳入函式內。目前支援的頁面為:【主功能表】、【文章列表】、【文章內】、【我的最愛看板列表】、【熱門看板列表】、【分類看板】。

 * where_indetail ( data )
    在cmd上輸出目前所在的詳細位置，供開發者除蟲測試。需將從ptt-sever上接收到的內容傳入函式內，並不會回傳任何東西。

 * back() //目前不支援
    類似回上頁的功能，目前已定義的5個畫面分別為【主功能表】、【看板列表】、【我的最愛看板列表】、【文章列表】、【文章內】。使用順序為【文章內】=> back() => 【文章列表】=> back() => 【看板列表】=> back() => 【主功能表】。

 * toBoard( connection,data,BoardName )  別名: toArticlesList()
   前往某板的【文章列表】，需要輸入connection物件與頁面原始資料(Buffer)與板名(字串)，不會回傳任何東西，執行完後停留在該板的【文章列表】。在【主功能表】、【文章列表】、【文章內】皆可使用，【我的最愛看板列表】、【熱門看板列表】並不支援。

 * MaintoFavBoard( connection,data )
    進入機器人自己的【我的最愛看板列表】，僅能從【主功能表】進入。需要輸入connection物件與頁面原始資料(Buffer)，並不會回傳任何東西。

 * MaintoHotBoard( connection,data )
    進入【熱門看板列表】，僅能從【主功能表】進入。需要輸入connection物件與頁面原始資料(Buffer)，並不會回傳任何東西。

 * PageUp( connection,data ) //尚未完成
    僅能在【文章列表】頁面使用。取得上一頁的【文章列表】。

 * PageDown( connection,data ) //尚未完成
 
 * fetchArticle() //尚未完成

 * fetchArticlesList() //尚未完成


 * fetchBoardsList() //尚未完成

 * decode_asBig5(data) 
    將原始資料(Buffer)轉為Big5編碼。在各頁面皆可以使用。需將原始資料(Buffer)傳入，將回傳該頁面 **保留色碼** 的內容(Big5編碼) 。    

 * escapeANSI_big5(dataBig5) 
    在各頁面皆可以使用。需將想去除色碼的資料(Big5編碼)傳入，將回傳該頁面除去色碼後的內容(Big5編碼) 。

 * escapeANSI_buffer(data) 
    在各頁面皆可以使用。需將想去除色碼的頁面原始資料(Buffer)傳入，將回傳該頁面除去色碼後的內容(Big5編碼) 。

 * fetchBoardHeader(data)
    在【文章列表】頁面使用。需將頁面的原始資料(Buffer)傳入，將回傳該板的標題(Big5編碼)，例: 【八卦-公民議題可洽PublicIssue板】。

 * fetchArticleList_withoutANSI(data)
    在【文章列表】頁面使用。需將頁面的原始資料(Buffer)傳入，將回傳該頁面內 **除去色碼** 後的所有文章標題(Big5編碼)，標題內容包含文章編號、作者、日期等。

 * fetchArticleList_withANSI(data)
    在【文章列表】頁面使用。需將頁面的原始資料(Buffer)傳入，將回傳該頁面內 **保留色碼** 的所有文章標題(Big5編碼)，標題內容包含文章編號、作者、日期等。

 * fetchArticleList_withANSI_inArr(data)
     在【文章列表】頁面使用。需將頁面的原始資料(Buffer)傳入，將以 **陣列** 的方式回傳該頁面內的所有文章標題(Big5編碼)，標題內容包含文章編號、作者、日期等。



[b1]: http://nodejs.org/api/net.html


applied-method
----------
 * filter( factor1, factor2, factor3 )

 * getPopularArticleTitles( board, #push, #article )
  


References
---------

* [實作 **Telnet Client 理論**][R1]
* [利用純 JavaScript 寫 **PCman火狐外掛** 的原始碼][R2]
* [node.js 參考教學: **node入門**][R3]
* [**ptt-bot in Ruby**][R4]
* [**Learning Advanced JavaScript** by John Resig][R5]
* [**Telnet通訊協定簡易介紹** Powerpoint][R6]

[R1]: http://dspace.lib.fcu.edu.tw/handle/2377/4110 
[R2]: https://code.google.com/p/pcmanfx/
[R3]: http://www.nodebeginner.org/index-zh-tw.html
[R4]: https://github.com/chenchenbox/backup-dog-ptt
[R5]: http://ejohn.org/apps/learn/#1 
[R6]: http://courses.ywdeng.idv.tw/cust/2011/np/PPT/CH08-telnet.pptx

Tools
---------
* [**Online Regex Tester**][T1] - an online regex tester for javascript, php, pcre and python.
* [**StackEdit**][T2] - markdown editor.
[T1]: http://regex101.com/#pcre
[T2]: https://stackedit.io/#

Issues
---------
1. Buffer comparison should be fixed. Stringing it to JSON code is not a good solution.
buffer-comparison-in-node-js  [IS-1a]
buffer.js in Node [IS-1b]
[IS-1a]: http://stackoverflow.com/questions/13790259/buffer-comparison-in-node-js 
[IS-1b]: https://github.com/joyent/node/blob/51f128d64b250dfeb128aab5117b5bbcd2cc51b5/lib/buffer.js#L283
