var inputTags = [];
userId = "";

$(() => {
  //TODO  localstrageからuserIdを取得する(key不明のためスタブ)
  this.userId = "c983553fb64ae277301f5cd14cec4f40"; 
  
  // タグ一覧取得成功時コールバック
  function getTagListSuccessCallBack(response) {
    return new Promise((resolve, reject)=>{
      var tags = response['tag'].split(',');
      for(var index in tags) {
        $('#tagGroup').append('<a class="list-group-item" href="#">' + tags[index] + '</a>');
      }
    
      // タグリスト押下時処理
      $('#tagGroup>.list-group-item').on('click', function(){
        var index = $('#tagGroup>.list-group-item').index(this);
        if($('#tagGroup>.list-group-item').eq(index).hasClass('active')) {
          $('#tagGroup>.list-group-item').eq(index).removeClass('active');
          tagRemove(index);
        } else {
          if(inputTags.length >= 10) {
            $("#error-modal").modal(); 
            return;
          }
          $('#tagGroup>.list-group-item').eq(index).addClass('active');
          tagAdd(index);
        }
        setTags();
      });    
      resolve();
    });
  }
  
  // 非同時処理失敗時コールバック
  function errorCallBack(args) {
    var [jqXHR, textStatus, errorThrown] = args;
    console.error(JSON.stringify(jqXHR));
    alert("サーバー内でエラーがあったか、サーバーから応答がありませんでした。");
  }
  
  // タグ一覧取得処理
  $.ajax({
    type: "POST",
    url: API_DOMAIN + "findTag.php",
    timeout: 10000,
    cache: false,
  data: {
      'userId': this.userId,
      'photoId': ''
    },
	dataType: 'json'
  }).then(
    (response, textStatus, jqXHR) => {getTagListSuccessCallBack(response)},
    (...args) => {errorCallBack(args)}
  ); 
  
  // 検索処理
  $('#search').on('click', () => {
      
   //TODO API連携待ち 2017/10/6追記
   //  $.ajax({
   //    type: "POST",
   //    url: API_DOMAIN + "GetPhotoInfo.php",
   //    timeout: 10000,
   //    cache: false,
   //    data: {
   //      'userId': this.userId,
   //      'tag': inputTags
   //    },
	  // dataType: 'json'
   //  }).then(
   //    (response, textStatus, jqXHR) => {console.log(response)},
   //    (...args) => {errorCallBack(args)}
   //  ); 
  }); 
});

// tagを追加する
function tagAdd(index) {
  inputTags.push($('#tagGroup>.list-group-item').eq(index).text());
}

// tagを削除する
function tagRemove(index) {
  var tmpTagArray = [];
  for(var tagIndex in inputTags) {
    if(inputTags[tagIndex] !== $('#tagGroup>.list-group-item').eq(index).text()) {
      tmpTagArray.push(inputTags[tagIndex]);
    }
  }
  inputTags = tmpTagArray;
}

// tagをtextboxに設定する
function setTags() {
  var tags = "";
  for(var tagIndex in inputTags) {
    if(tags === '') {
      tags = inputTags[tagIndex];
    } else {
      tags = tags + ',' + inputTags[tagIndex];  
    }
  }
  $("#tagInput").val(tags);
}
 