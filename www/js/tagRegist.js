// This is a JavaScript file
var inputTags = [];
var photoId = "";
var userId = "";
var img = "";

$(function(){
  $("#loading").show();
  
　// 画像ID取得
　if (localStorage.getItem('selectPic') != null) {
    photoId = localStorage.getItem('selectPic');
　}
  
  // ユーザーID取得
  userId = localStorage.getItem(LOGIN_KEY);
  
  // 画像取得
  document.addEventListener ("deviceready", function(){
    var selectedImgDataMng = new SelectedImgDataMng();
    selectedImgDataMng.find().done(function(imgData){
      img = imgData;
      $('.jumbotron').css({
        backgroundImage: 'url("data:image/png;base64, ' + img + '")'
      });
    });
  });
  
  // 自分のタグ取得
  findOwnTag()
   .then(function(findOwnTagRes){
     findTagList()
     .then(function(findTagListRes){
       dispTagList(findTagListRes['tag']);
       dispOwnTag(findOwnTagRes['tag']);
       $("#loading").hide();
     })
     .catch(function(){
       $("#loading").hide();
       alert("サーバー内でエラーがあったか、サーバーから応答がありませんでした。");
     });
   })
   .catch(function(){
     $("#loading").hide();
     alert("サーバー内でエラーがあったか、サーバーから応答がありませんでした。");
   });
 
  // 登録ボタン押下時イベント設定
  $('#save').on('click', function(){
    $("#loading").show();
    
    // リクエストデータ作成
    var param = {};
    param.userId = userId;
    // タグ編集の場合は写真データはアップデートしない
    if (!photoId) {
      param.img = img; 
    }
    param.tag = JSON.stringify($("#tagInput").val().split(','));
    param.photoId = photoId; //新規の場合は空文字をAPIへ送る
    
    $.ajax({
      type: "POST",
      url: API_DOMAIN + "SavePhoto.php",
      timeout: 30000,
      cache: false,
      data: param,
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

// 自分のタグ取得
function findOwnTag() {
  return new Promise(function(resolve, reject){
    if (photoId) {
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
        function(response, textStatus, jqXHR) {
          resolve(response);
        },
        function(jqXHR, textStatus, errorThrown) {
          reject();
        }
      );
    } else {
      resolve();
    }
  });
}

// 自分のタグ設定
function dispOwnTag(ownTag) {
  // 入力欄設定
  $("#tagInput").val(ownTag);

  // タグリスト設定
  $('#tagGroup .list-group-item').each(function(){
    var thisTag = $(this).attr('data-tag-name');
    var tags = ownTag.split(',');
    console.log(thisTag);
    for(var index in tags) {
      if (tags[index] === '') {
        continue;
      }
      
      if (thisTag === tags[index]) {
        $(this).addClass('active');
      }
    }
  });
}

// 画面表示時タグ一覧取得処理
function findTagList() {
  return new Promise(function(resolve, reject){
    $.ajax({
      type: "POST",
      url: API_DOMAIN + "findTag.php",
      timeout: 10000,
      cache: false,
      data: {
        'userId': userId
      },
    dataType: 'json'
    }).then(
      function(response, textStatus, jqXHR) {
        resolve(response);
      },
      function(jqXHR, textStatus, errorThrown) {
        reject();
      }
    );
  });
}

// タグ一覧設定
function dispTagList(tagsStr) {
  var tagsArr = tagsStr.split(',');
  for(var index in tagsArr) {
    if (tagsArr[index] === '') {
      continue;
    }
    $('#tagGroup').append('<a class="list-group-item" data-tag-name="' 
      + escapeHtml(tagsArr[index]) + '" href="javascript:void(0)">' + tagsArr[index] + '</a>');
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
}

// HTMLエスケープ
function escapeHtml(text) {
    return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
    }

