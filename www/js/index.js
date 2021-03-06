// This is a JavaScript file
var currentPage = 1;

// スワイプを検知したあとの処理
function swipeEvent(direction) {
  if (direction == 'right'){
    location.href = "./page/picSelect.html";
  } else if (direction == 'left'){  
    location.href = "./page/camera.html";
  }
}

function loginCheck() {
  var loginKey = localStorage.getItem(LOGIN_KEY);
  if (loginKey == null) {
    $('#picList').hide();
    $('#searchIcon').hide();
    $('#logoutIcon').hide();
    $('#tagSelectName').hide();
    $('#login').show();
    $("#loading").hide();
  } else {
    // ログイン処理中はローディング画像を表示する
    $("#loading").show();
    $('#tagSelectName').hide();
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
        if(localStorage.getItem("tags") != null) {
          getPicList(loginKey, null, localStorage.getItem("tags")).done(function(){
            $('#login').hide();
            $('#picList').show();
            $('#searchIcon').show();
            $('#logoutIcon').show();
            if(localStorage.getItem("tags") != null && localStorage.getItem("tags").length > 0) {
              $('#tagSelectName').show();
            } else {
              $('#tagSelectName').hide();
            }
            $("#loading").hide();
          }).fail(function(){
            // 検索失敗時
            localStorage.clear();
            $("div.modal-body p").text(INDEX_002);
            $("#id-modal").modal();
          });
        } else {
          getPicList(loginKey).done(function(){
            $('#login').hide();
            $('#picList').show();
            $('#searchIcon').show();
            $('#logoutIcon').show();
            $('#tagSelectName').hide();
            $("#loading").hide();
          }).fail(function(){
            // 検索失敗時
            localStorage.clear();
            $("div.modal-body p").text(INDEX_002);
            $("#id-modal").modal();
          });
        }
      } else {
        // 検索失敗時
        localStorage.clear();
        $('#picList').hide();
        $('#searchIcon').hide();
        $('#logoutIcon').hide();
        $('#tagSelectName').hide();
        $('#login').show();
        $("#loading").hide();
      }
    }).fail(function() {
      // ログイン失敗時
      localStorage.clear();
      $('#picList').hide();
      $('#searchIcon').hide();
      $('#logoutIcon').hide();
      $('#tagSelectName').hide();
      $('#login').show();
      $("#loading").hide();
    });
  }
}
function login() {
  var loginId = $('#formInputId').val();
  var loginPassword = $('#formInputPassword').val();
  var userId = CybozuLabs.MD5.calc(loginId + ":" + loginPassword);
  var reqParam = {id : userId};
  // ログイン処理中はローディング画像を表示する
  $("#loading").show();
  
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
        $("#loading").hide();
        $('#login').hide();
        $('#picList').show();
        $('#searchIcon').show();
        $('#logoutIcon').show();
        $('#tagSelectName').hide();
      }).fail(function(data){
        // 写真一覧失敗時
        localStorage.clear();
        $("#loading").hide();
        $("div.modal-body p").text(INDEX_002);
        $("#id-modal").modal();
      });
    } else {
      // ログイン失敗時
      localStorage.clear();
      $("#loading").hide();
      $("div.modal-body p").text(INDEX_002);
      $("#id-modal").modal();
    }
  }).fail(function(data) {
    // ログイン失敗時
    localStorage.clear();
    $("#loading").hide();
    $("div.modal-body p").text(INDEX_002);
    $("#id-modal").modal();
  });
}

function getPicList(userId, page, tags) {
  var reqParam = {userId : userId};
  if (typeof page !== undefined && page != null) {
    reqParam.page = page;
  }
  if (typeof tags !== undefined && tags != null) {
    var selectTags = tags;
    if (selectTags.length > 20) {
      selectTags = selectTags.slice(0, 19) + "…";
    }
    $('.tagNameDisp input').val(selectTags);
    reqParam.tag = tags;
  }
  var d = new $.Deferred();
  $.ajax({
    type: 'post',
    url: API_DOMAIN + 'GetPhotoInfo.php',
    data: JSON.stringify(reqParam),
    contentType: 'application/JSON',
    dataType : 'json',
    scriptCharset: 'utf-8'
  }).done(function(data) {
    // 検索成功時
    if (data.result == '0') {
        currentPage++;
        var tagArray = [];
        if (data.array.length > 0) {
          $("div#picList div.row div.pageEnd").removeClass("pageEnd");
          for (var i=0;i < data.array.length; i++) {
            var photoId = data.array[i].photoId;
            var imgSrc = "data:image/png;base64," + data.array[i].photoData;
            var tagNames = "";
            if (data.array[i].tag1 != null) {
              tagNames += "#" + escapeHtml(data.array[i].tag1) + " ";
            }
            if (data.array[i].tag2 != null) {
              tagNames += "#" + escapeHtml(data.array[i].tag2) + " ";
            }
            if (data.array[i].tag3 != null) {
              tagNames += "#" + escapeHtml(data.array[i].tag3) + " ";
            }
            if (data.array[i].tag4 != null) {
              tagNames += "#" + escapeHtml(data.array[i].tag4) + " ";
            }
            if (data.array[i].tag5 != null) {
              tagNames += "#" + escapeHtml(data.array[i].tag5) + " ";
            }
            if (data.array[i].tag6 != null) {
              tagNames += "#" + escapeHtml(data.array[i].tag6) + " ";
            }
            if (data.array[i].tag7 != null) {
              tagNames += "#" + escapeHtml(data.array[i].tag7) + " ";
            }
            if (data.array[i].tag8 != null) {
              tagNames += "#" + escapeHtml(data.array[i].tag8) + " ";
            }
            if (data.array[i].tag9 != null) {
              tagNames += "#" + escapeHtml(data.array[i].tag9) + " ";
            }
            if (data.array[i].tag10 != null) {
              tagNames += "#" + escapeHtml(data.array[i].tag10) + " ";
            }
            if (tagNames.length > 2) {
              tagNames = tagNames.slice(0, -1);
            }
            var imgTag = '';
            if (i == data.array.length - 1) {
              imgTag = '<div class="col-xs-6 col-md-3 pageEnd">';
            } else {
              imgTag = '<div class="col-xs-6 col-md-3">';
            }
            imgTag += '<a class="thumbnail" href="javascript:void(0);" onClick="picTap(this);" data-photoId="' + photoId + '" data-pic="' + data.array[i].photoData + '" data-tagName="' + tagNames + '" page="' + currentPage + '">';
            imgTag += '<img src="' + imgSrc + '" alt="" />';
            imgTag += '</a></div>';
            tagArray.push(imgTag);
          }
          $("div#picList div.row").append(tagArray.join(''));
        }
        if(localStorage.getItem("windowsHeight")){
          $("body").scrollTop(localStorage.getItem("windowsHeight"));
          if(currentPage == localStorage.getItem("page")){
            localStorage.removeItem('windowsHeight');
            localStorage.removeItem('page');
            $('#login').hide();
            $('#picList').show();
            $('#searchIcon').show();
            $('#logoutIcon').show();
            if(localStorage.getItem("tags") != null && localStorage.getItem("tags").length > 0) {
              $('#tagSelectName').show();
            } else {
              $('#tagSelectName').hide();
            }
            $("#loading").hide();
          }
          d.resolve();
        }else{
          $('#login').hide();
          $('#picList').show();
          $('#searchIcon').show();
          $('#logoutIcon').show();
          if(localStorage.getItem("tags") != null && localStorage.getItem("tags").length > 0) {
            $('#tagSelectName').show();
          } else {
            $('#tagSelectName').hide();
          }
          d.resolve();
        }
    } else {
      // 検索失敗時
      $("div.modal-body p").text(INDEX_002);
      $("#id-modal").modal();
      d.reject();
    }
  })
  .fail(function() {
    // 検索失敗時
    $("div.modal-body p").text(INDEX_002);
    $("#id-modal").modal();
    d.reject();
  });
  return d.promise(); 
}

function picTap(e) {
  //TODO picture_binari以外も定数化したい
  localStorage.setItem('selectPic', e.getAttribute("data-photoId"));
  localStorage.setItem('tagNames', e.getAttribute("data-tagName"));
  localStorage.setItem('page', e.getAttribute("page"));
  var triggerNodePosition = $(e).offset().top;
　localStorage.setItem('windowsHeight',triggerNodePosition);
  location.href="./page/picDetail.html";
}

function logout() {
  // ログアウト処理実行、ログイン画面表示
  localStorage.clear();
  $("div#picList div.row").empty();
  $("#formInputId").val("");
  $("#formInputPassword").val("");
  $('#searchIcon').hide();
  $('#logoutIcon').hide();
  $('#tagSelectName').hide();
  $('#picList').hide();
  $('#login').show();
}

$(function(){
  var selectedImgDataMng = new SelectedImgDataMng();
  document.addEventListener ("deviceready", function(){
    selectedImgDataMng.delete();
  });
  localStorage.removeItem('selectPic');
  localStorage.removeItem('tagNames');
  $('#searchIcon').hide();
  $('#logoutIcon').hide();
  $('#tagSelectName').hide();
  $('#picList').hide();
  $('#login').hide();
  loginCheck();
  // 引き金となる要素を設定
  var triggerNode = "div#picList div.row div.pageEnd";
  var ajaxLock = false;
  
  if(localStorage.getItem("tags") != null) {
     // 画面スクロール毎に判定を行う
    $(window).scroll(function(){
    // 引き金となる要素の位置を取得
      if ($(triggerNode).length) {
        var triggerNodePosition = $(triggerNode).offset().top - $(window).height();
        // 現在のスクロール位置が引き金要素の位置より下にあれば‥
        if ($(window).scrollTop() > triggerNodePosition) {
          // 写真情報取得APIを実行
          if (!ajaxLock) {
            ajaxLock = true;
            $("#loading").show();
            getPicList(localStorage.getItem(LOGIN_KEY), currentPage, localStorage.getItem("tags")).done(function(){
              $("#loading").hide();
              ajaxLock = false;
            }).fail(function(){
              // 検索失敗時
            });
          }
        }
      }
    });
  } else {
    // 画面スクロール毎に判定を行う
    $(window).scroll(function(){
      // 引き金となる要素の位置を取得
      if ($(triggerNode).length) {
        var triggerNodePosition = $(triggerNode).offset().top - $(window).height();
        // 現在のスクロール位置が引き金要素の位置より下にあれば‥
        if ($(window).scrollTop() > triggerNodePosition) {
          // 写真情報取得APIを実行
          if (!ajaxLock) {
            ajaxLock = true;
            $("#loading").show();
            getPicList(localStorage.getItem(LOGIN_KEY), currentPage).done(function(){
              $("#loading").hide();
              ajaxLock = false;
            }).fail(function(){
              // 検索失敗時
            });
          }
        }
      }
    });
  }
});
