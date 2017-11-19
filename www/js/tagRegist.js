// This is a JavaScript file
var inputTags = [];
var photoId = "";
var userId = "";
var img = "";

$(function(){
　// 画像ID取得
　if (localStorage.getItem('selectPic') != null) {
    photoId = localStorage.getItem('selectPic');
　}
  
  // ユーザーID取得
  userId = localStorage.getItem(LOGIN_KEY);
  
  // 画像取得
  img = localStorage.getItem(PICTURE_BINARY);
  
  $('.jumbotron').css({
    backgroundImage: 'url("data:image/png;base64, ' + img + '")'
  });
  
  // タグ一覧取得成功時コールバック
  function getTagListSuccessCallBack(response) {
    return new Promise(function(resolve, reject){
      $("#loading").hide();
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
  
  // 画面表示時タグ一覧取得処理
  $("#loading").show();
  $.ajax({
    type: "POST",
    url: API_DOMAIN + "findTag.php",
    timeout: 10000,
    cache: false,
    data: {
      'userId': userId,
      'photoId': photoId
    },
  dataType: 'json'
  }).then(
    function(response, textStatus, jqXHR) {getTagListSuccessCallBack(response)},
    function(jqXHR, textStatus, errorThrown) {
      $("#loading").hide();
      alert("サーバー内でエラーがあったか、サーバーから応答がありませんでした。");
    }
  ); 	
 
  // 登録ボタン押下時処理
  $('#save').on('click', function(){
    $("#loading").show();
    $.ajax({
      type: "POST",
      url: API_DOMAIN + "SavePhoto.php",
      timeout: 10000,
      cache: false,
      data: {
          'userId': userId, 
          'img': img,
          'tag': JSON.stringify($("#tagInput").val().split(',')), 
          'photoId': photoId //新規の場合は空文字をAPIへ送る
      },
	    dataType: 'json'
    }).then(
      function(response, textStatus, jqXHR) {location.href = "../index.html"},
      function(jqXHR, textStatus, errorThrown) {
        $("#loading").hide();
        console.error(JSON.stringify(jqXHR));
        alert("サーバー内でエラーがあったか、サーバーから応答がありませんでした。");
      }
    )
  });  
  
  $('#cancel').on('click', function(){
    location.href = "../index.html";
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


