var inputTags = [];
userId = "";

$(function() {
  userId = localStorage.getItem(LOGIN_KEY);
  
  // タグ一覧取得成功時コールバック
  function getTagListSuccessCallBack(response) {
    return new Promise(function(resolve, reject){
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
  
  // タグ一覧取得処理
  $.ajax({
    type: "POST",
    url: API_DOMAIN + "findTag.php",
    timeout: 10000,
    cache: false,
    data: {
      'userId': userId,
      'photoId': ''
    },
    dataType: 'json'
  }).then(
    function(response, textStatus, jqXHR) {getTagListSuccessCallBack(response)},
    function(jqXHR, textStatus, errorThrown) {
       console.error(JSON.stringify(jqXHR));
       alert("サーバー内でエラーがあったか、サーバーから応答がありませんでした。");
    }
  ); 
  
  // 検索処理
  $('#search').on('click', function() {
      // inputTags配列を文字列に変換して送信する
      var tags = inputTags.join(',');
      console.log(111111);
      console.log(tags);
     $.ajax({
       type: "POST",
       url: API_DOMAIN + "GetPhotoInfo.php",
       timeout: 10000,
       cache: false,
       data: {
        'userId': userId,
        'tag': tags
      },
    dataType: 'json'
    }).then(
      function(response, textStatus, jqXHR) {console.log(response)},
      function(jqXHR, textStatus, errorThrown) {
        console.error(JSON.stringify(jqXHR));
        alert("サーバー内でエラーがあったか、サーバーから応答がありませんでした。");
      }
    ); 
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
 