BPSアプリ開発
====

アプリ開発時のドキュメントの場所、開発ルール等を記載する。

## Document
[設計書等ドキュメント置き場](https://beeps365.sharepoint.com/sites/portal/solution/bps-innovation/DocLib/Forms/AllItems.aspx?RootFolder=%2Fsites%2Fportal%2Fsolution%2Fbps-innovation%2FDocLib%2F%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA%2F%E5%86%99%E7%9C%9F%E5%85%B1%E6%9C%89&FolderCTID=0x012000AFD4E6D3F6F26547A558AC7E0CE3D83B&View=%7BF42BCCD5-E5D7-4F3C-906F-20E74FF8D03A%7D)

## コーディング規約
* インデントは半角スペース2つ  
* 関数名はlowerCamelCase（例：getName）

## ファイル作成ルール
* 1HTMLにつき1jsファイル
* 各画面htmlは、/www/フォルダへ
* 各画面jsファイルは、/www/js/pageフォルダへ
* 各画面共通で使うjsは、/www/js/commonフォルダへ

## HTML bodyタグ内の記載
bodyタグには、以下のようにdivタグを入れてから書いていってください。
``` html:sample  
<body>  
  <div id="contents">  
    <!-- ここに各画面タグ記載 -->  
  </div>  
</body>  
```

## JS スワイプイベントの使い方
スワイプイベントは、共通jsにて拾っています。  
各画面jsには、以下の関数をjsに記載すること右、左スワイプをした時の処理を行えます。

``` javascript
// スワイプを検知したあとの処理  
function swipeEvent(direction) {  
    if (direction == 'right'){  
      alert('右');//右スワイプした時  
    } else if (direction == 'left'){  
       alert('左');//左スワイプした時  
    }  
}  
```
