// This is a JavaScript file

// スワイプを検知したあとの処理
function swipeEvent(direction) {
  if (direction == 'right'){
    location.href = "./page/picSelect.html";
  } else if (direction == 'left'){  
    location.href = "./page/camera.html";
  }
}

function loginCheck() {
    // localStorage.setItem(LOGIN_KEY, null);
  var loginKey = localStorage.getItem(LOGIN_KEY);
  if (loginKey == null) {
    $('#picList').hide();
    $('#login').show();
    $("#loading").fadeOut(3500);
  } else {
    var reqParam = {id : loginKey};
    $.ajax({
      type: 'post',
      url: API_DOMAIN + 'Login.php',
      data: JSON.stringify(reqParam),
      contentType: 'application/JSON',
      dataType : 'JSON',
      scriptCharset: 'utf-8'
    }).done(function(data) {
      // 検索成功時
      if (data.result == '0') {
        getPicList(loginKey).done(function(){
          $('#login').hide();
          $('#picList').show();
          $("#loading").fadeOut(3500);
          $("div.modal-body p").text(INDEX_001);
          $("#id-modal").modal();
          
        }).fail(function(){
          // 検索失敗時
          localStorage.setItem(LOGIN_KEY, null);
          $("div.modal-body p").text(INDEX_002);
          $("#id-modal").modal();
        });
      } else {
        // 検索失敗時
        localStorage.setItem(LOGIN_KEY, null);
        $('#picList').hide();
        $('#login').show();
        $("#loading").fadeOut(3000);
      }
    }).fail(function() {
      // 検索失敗時
      localStorage.setItem(LOGIN_KEY, null);
      $('#picList').hide();
      $('#login').show();
      $("#loading").fadeOut(3000);
    });
  }
}
function login() {
  var loginId = $('#formInputId').val();
  var loginPassword = $('#formInputPassword').val();
  var userId = CybozuLabs.MD5.calc(loginId + ":" + loginPassword);
  var reqParam = {id : userId};
  $.ajax({
    type: 'post',
    url: API_DOMAIN + 'Login.php',
    data: JSON.stringify(reqParam),
    contentType: 'application/JSON',
    dataType : 'JSON',
    scriptCharset: 'utf-8'
  }).done(function(data) {
    // 検索成功時
    if (data.result == '0') {
      localStorage.setItem(LOGIN_KEY, userId);
      getPicList(userId).done(function(){
        $('#login').hide();
        $('#picList').show();
        $("div.modal-body p").text(INDEX_001);
        $("#id-modal").modal();
      }).fail(function(){
        // 検索失敗時
        localStorage.setItem(LOGIN_KEY, null);
        $("div.modal-body p").text(INDEX_002);
        $("#id-modal").modal();
      });
    } else {
      // 検索失敗時
      localStorage.setItem(LOGIN_KEY, null);
      $("div.modal-body p").text(INDEX_002);
      $("#id-modal").modal();
    }
  }).fail(function(data) {
    // 検索失敗時
    localStorage.setItem(LOGIN_KEY, null);
    $("div.modal-body p").text(INDEX_002);
    $("#id-modal").modal();
  });
}

function getPicList(userId, page) {
  var reqParam = {userId : userId};
  if (page === undefined) {
    reqParam.page = page;
  }
  var d = new $.Deferred();
  $.ajax({
    type: 'post',
    url: API_DOMAIN + 'GetPhotoInfo.php',
    data: JSON.stringify(reqParam),
    contentType: 'application/JSON',
    dataType : 'JSON',
    scriptCharset: 'utf-8'
  }).done(function(data) {
    // 検索成功時
    if (data.result == '0') {
        var tagArray = [];
        for (var i=0;i < data.array.length; i++) {
          var photoId = data.array[i].photoId;
          var imgSrc = "data:image/png;base64," + data.array[i].photoData;
          var tagIds =  data.array[i].tag1 + "-" +data.array[i].tag2
                      + "-" +data.array[i].tag3 + "-" +data.array[i].tag4
                      + "-" +data.array[i].tag5 + "-" +data.array[i].tag6
                      + "-" +data.array[i].tag7 + "-" +data.array[i].tag8
                      + "-" +data.array[i].tag9 + "-" +data.array[i].tag10;
          var imgTag = '';
          if (i == data.array.length - 1) {
            imgTag = '<div class="col-xs-6 col-md-3" id="pageEnd">';
          } else {
            imgTag = '<div class="col-xs-6 col-md-3">';
          }
          imgTag += '<a class="thumbnail" href="javascript:void(0);" onClick="picTap(this);" data-photoId="' + photoId + '" data-pic="' + data.array[i].photoData + '" data-tagIds="' + tagIds + '" data-tagName="">';
          imgTag += '<img src="' + imgSrc + '" alt="" />';
          imgTag += '</a></div>';
          tagArray.push(imgTag);
        }
        $("div#picList div.row").append(tagArray.join(''));
        $('#login').hide();
        $('#picList').show();
        d.resolve();
    } else {
      // 検索失敗時
      localStorage.setItem(LOGIN_KEY, null);
      $("div.modal-body p").text(INDEX_002);
      $("#id-modal").modal();
    }
  })
  .fail(function() {
    // 検索失敗時
    localStorage.setItem(LOGIN_KEY, null);
    alert(INDEX_002);
    d.reject();
  });
  return d.promise(); 
}

function picTap(e) {
  //TODO picture_binari以外も定数化したい
  localStorage.setItem('selectPic', e.getAttribute("data-photoId"));
  localStorage.setItem('tagNames', e.getAttribute("data-tagName"));
  localStorage.setItem(PICTURE_BINARY, e.getAttribute("data-pic"));
  location.href="./page/picDetail.html";
}

$(function(){
  localStorage.setItem('selectPic', null);
  $('#picList').hide();
  $('#login').hide();
  loginCheck();
  // 引き金となる要素を設定
  var triggerNode = $(".container-fluid .row #pageEnd");
  var ajaxLock = false;
  // 画面スクロール毎に判定を行う
  $(window).scroll(function(){
    // 引き金となる要素の位置を取得
    var triggerNodePosition = $(triggerNode).offset().top - $(window).height();
    console.log(triggerNodePosition);
    // 現在のスクロール位置が引き金要素の位置より下にあれば‥
    if ($(window).scrollTop() > triggerNodePosition) {
      // 写真情報取得APIを実行
      if (!ajaxLock) {
        ajaxLock = true;
        $("#loading").show();
        getPicList(localStorage.getItem(LOGIN_KEY)).done(function(){
          $("#loading").fadeOut(3000);
          ajaxLock = false;
        }).fail(function(){
          // 検索失敗時
        });
      }
    }
  });
});