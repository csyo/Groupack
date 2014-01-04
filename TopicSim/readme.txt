===== PSCWS4 - 說明文檔 =====
$Id: readme.txt,v 1.2 2008/12/21 04:37:59 hightman Exp $

[ 關於 PSCWS4 ]

PSCWS4 是由 hightman 於 2007 年開發的純 PHP 代碼實現的簡易中文分詞系統第四版的簡稱。

PSCWS 是英文 PHP Simple Chinese Words Segmentation 的頭字母縮寫，它是 SCWS 項目的前身。
現 SCWS 已作為 FTPHP 項目的一個子項目繼續發展，現於 2008-12 重新修訂並整理髮布。

SCWS 是一套開源並且免費的中文分詞系統，提供優秀易用的 PHP 接口。
項目主頁：http://www.ftphp.com/scws

PSCWS4 在算法、功能以及詞典/規則文件格式上，完全兼容於 C 編寫 libscws，類庫的方法完全兼容
於 scws 的 php 擴展中的預定義類的方法。

第四版的算法採用N-核心詞路徑最優方案，採用強大的規則引擎識別人名地名數字等專有名詞，C實現
的版本速度和效率均非常高，推薦使用。PSCWS4 是 SCWS(C) 的 PHP 實現，速度較慢。


[ 性能評估 ]

採用 test.php 的分詞命令行調用, 操作系統 FreeBSD 6.2 , CPU 為單至強 3.0G

PSCWS4 - 長度為 80, 535 的文本,  耗時將近 30 秒
         分詞精度 95.60%, 召回率 90.51% (F-1: 0.93)

附：同等長度文本在 scws-1.0 (PHP 擴展方式) 耗時僅需 0.65 秒(C調用則為 0.17秒).
    強烈建議有條件者改用 scws-1.0 (C版)

[ 文件結構 ]

  文件                   描述                      使用必需?
  --------------------------------------------------------------
  dict/dict.xdb        - XDB 格式詞典              (必要文件)
  pscws2.class.php     - PSCWS 第二版核心類庫代碼  (必要文件)
  pscws3.class.php     - PSCWS 第三版核心類庫代碼  (必要文件)   
  dict.class.php       - 詞典操作類庫              (必要文件)
  xdb_r.class.php      - XDB 格式讀取類            (必要文件)

  demo.php             - 演示文件, 支持 web/命令行 (可選)
  readme.txt           - 說明文件                  (可選)


[ 使用說明 ]

PSCWS4 類對應的文件為 pscws4.class.php。在 PHP 代碼中的調用方法如下：

// 加入頭文件
require '/path/to/pscws4.class.php';

// 建立分詞類對像, 參數為字符集, 默認為 gbk, 可在後面調用 set_charset 改變
$pscws = new PSCWS4('utf8');

//
// 接下來, 設定一些分詞參數或選項, set_dict 是必須的, 若想智能識別人名等需要 set_rule 
//
// 包括: set_charset, set_dict, set_rule, set_ignore, set_multi, set_debug, set_duality ... 等方法
// 
$pscws->set_dict('/path/to/etc/dict.xdb');
$pscws->set_rule('/path/to/etc/rules.ini');

// 分詞調用 send_text() 將待分詞的字符串傳入, 緊接著循環調用 get_result() 方法取回一系列分好的詞
// 直到 get_result() 返回 false 為止
// 返回的詞是一個關聯數組, 包含: word 詞本身, idf 逆詞率(重), off 在text中的偏移, len 長度, attr 詞性
//

$pscws->send_text($text);
while ($some = $pscws->get_result())
{
   foreach ($some as $word)
   {
      print_r($word);
   }
}

// 在 send_text 之後可以調用 get_tops() 返回分詞結果的詞語按權重統計的前 N 個詞
// 常用於提取關鍵詞, 參數用法參見下面的詳細介紹.
// 返回的數組元素是一個詞, 它又包含: word 詞本身, weight 詞重, times 次數, attr 詞性
$tops = $pscws->get_tops(10, 'n,v');
print_r($tops);

--- 類方法完全手冊 ---
(注: 構造函數可傳入字符集作為參數, 這與另外調用 set_charset 效果是一樣的)

class PSCWS4 {

  void set_charset(string charset);
  說明：設定分詞詞典、規則集、欲分文本字符串的字符集，系統缺省是 gbk 字集。
  返回：無。
  參數：charset 是設定的字符集，目前只支持 utf8 和 gbk。（注：big5 也可作 gbk 處理）
  注意：輸入要切分的文本，詞典，規則文件這三者的字符集必須統一為該 charset 值。
  
  bool set_dict(string dict_fpath);
  說明：設置分詞引擎所採用的詞典文件。
  參數：dict_path 是詞典的路徑，可以是相對路徑或完全路徑。
  返回：成功返回 true 失敗返回 false。
  錯誤：若有錯誤會給出 WARNING 級的錯誤提示。
  
  void set_rule(string rule_path);
  說明：設定分詞所用的新詞識別規則集（用於人名、地名、數字時間年代等識別）。
  返回：無。
  參數：rule_path 是規則集的路徑，可以是相對路徑或完全路徑。
  
  void set_ignore(bool yes)
  說明：設定分詞返回結果時是否去除一些特殊的標點符號之類。
  返回：無。
  參數：yes 設定值，如果為 true 則結果中不返回標點符號，如果為 false 則會返回，缺省為 false。
  
  void set_multi(int mode);
  說明：設定分詞返回結果時是否復合分割，如“中國人”返回“中國＋人＋中國人”三個詞。
  返回：無。
  參數：mode 設定值，1 ~ 15。
        按位與的 1 | 2 | 4 | 8 分別表示: 短詞 | 二元 | 主要單字 | 所有單字
	
  void set_duality(bool yes);
  說明：設定是否將閒散文字自動以二字分詞法聚合。
  返回：無。
  參數：yes 設定值，如果為 true 則結果中多個單字會自動按二分法聚分，如果為 false 則不處理，缺省為 false。

  void set_debug(bool yes);
  說明：設置分詞過程是否輸出N-Path分詞過程的調試信息。
  參數：yes 設定值，如果為 true 則分詞過程中對於多路徑分法分給出提示信息。
  返回：無。
  
  void send_text(string text)
  說明：發送設定分詞所要切割的文本。
  返回：無。
  參數：text 是文本的內容。
  注意：執行本函數時，請先加載詞典和規則集文件並設好相關選項。
  
  mixed get_result(void)
  說明：根據 send_text 設定的文本內容，返回一系列切好的詞彙。
  返回：成功返回切好的詞彙組成的數組， 若無更多詞彙，返回 false。
  參數：無。
  注意：每次切割後本函數應該循環調用，直到返回 false 為止，因為程序每次返回的詞數是不確定的。
        返回的詞彙包含的鍵值有：word (string, 詞本身) idf (folat, 逆文本詞頻) off (int, 在文本中的位置) attr(string, 詞性)
	
  mixed get_tops( [int limit [, string attr]] )
  說明：根據 send_text 設定的文本內容，返回系統計算出來的最關鍵詞彙列表。
  返回：成功返回切好的詞彙組成的數組， 若無更多詞彙，返回 false。
  參數：limit 可選參數，返回的詞的最大數量，缺省是 10；
        attr 可選參數，是一系列詞性組成的字符串，各詞性之間以半角的逗號隔開，
             這表示返回的詞性必須在列表中，如果以~開頭，則表示取反，詞性必須不在列表中，
	     缺省為空，返回全部詞性，不過濾。
	     
  string version(void);
  說明：返回本版號。
  返回：版本號（字符串）。
  參數：無。
  
  void close(void);
  說明：關閉釋放資源，使用結束後可以手工調用該函數或等系統自動回收。
  返回：無。
  參數：無。
};

[ 關於詞典 ]

PSCWS4 使用的是 XDB 格式詞典，與 C 版的 libscws 完全兼容。

我們提供的默認詞典是通用的互聯網信息詞彙集，約 28 萬個詞。如果您需要定制詞典以作特殊用
途，請與我們聯繫，可能會視情況進行收費。

[ 注意事項 ]

PSCWS4 由純 PHP 代碼實現，不需要任何外部擴展支持，但效率一般，建議選用 C 版編寫的擴展。

PSCWS4 可以良好的運行在各種版本的 PHP4 和 PHP5 上，支持 GBK，UTF-8 等寬型字符集，若您的

提供下載的詞典是在 Intel 架構的平台上製作的，放到其它架構的機器中運行可能會存在問題導致
切詞完全錯誤（典型的如：Sparc 架構的 Solaris/SunOS 服務器中），若您發現問題請及時與我們
聯繫尋求解決。

[ 聯繫我們 ]

SCWS 項目網站：http://www.ftphp.com/scws
我的個人 Email：hightman2@yahoo.com.cn   （一般問題請勿直接來信，謝謝）

--

2008.12.21 - hightman
