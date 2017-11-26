// This is a JavaScript file
$(function () {
  createInitHtml();
});

function createInitHtml() {
  console.log("documentReady");
  //タグ
  var selectPicTag = localStorage.getItem('tagNames');
  var tagInfo = "";
  if (0 < selectPicTag.length) {
    $('.text-info').html(selectPicTag);
  }
  //ヘッダー
  $('#editTagBtn').val(PICDETAIL_001);
  $('#deletePicBtn').val(PICDETAIL_002);
  //フッダー
  document.addEventListener('deviceready', function(){
    createFooterForAndroid();
    displayPhoto().then(onSuccess, onFail);
    
    function onFail(){
      $("#loading").hide();
    }
    
    function onSuccess(){
      $("#loading").hide();
    }
    
  }, false);
}
function displayPhoto(){
  var deferrd = new $.Deferred;
  
  // 写真詳細情報取得APIを実行
  var param = {
    'userId': localStorage.getItem(LOGIN_KEY),
    'photoId': localStorage.getItem('selectPic')
  };
  $.ajax({
    type: 'post',
    url: API_DOMAIN + 'GetPhotoDetail.php',
    data: JSON.stringify(param),
    contentType: 'application/JSON',
    dataType : 'json',
    scriptCharset: 'utf-8'
  }).done(function(data) {
    var picDataText = '<img src="data:image/png;base64, ' + data.array[0].photoData + '">';
    $('.picDataText').html(picDataText);
    
    // 画像データをローカルストレージに格納
    var selectedImgDataMng = new SelectedImgDataMng();
    selectedImgDataMng.save(data.array[0].photoData);
    
    deferrd.resolve();
  })
  .fail(function() {
    // 検索失敗時
    deferrd.reject();
  });
  
  return deferrd.promise();
}
function createFooterForAndroid(){
  var devaiceModel = device.model;
  if(devaiceModel.indexOf('iPhone') === -1){
    var downloadBtn = '<div><input type="button" class="btn btn-primary btn-block" onclick="download();" value=' + PICDETAIL_003 +'></div>'
    $('.downloadBtn').html(downloadBtn);
  }      
}

function deletePic() {
  $('#modal-msg').html(PICDETAIL_004);
  $('#ok-btn').html(PICDETAIL_005);
  $('#cancel-btn').html(PICDETAIL_006);
  $('.modal-body').html();
  $('#ok-btn').off('click');
  $('#ok-btn').on('click', function(){
    $("#id-modal").on('hidden.bs.modal', function(){
      $("#id-modal").off('hidden.bs.modal');
      executeDelete();
    });
    $("#id-modal").modal('hide');
  });
  $('#cancel').off('click');
　$('#cancel-btn').show();
  $('#cancel-btn').on('click', function(){
    $("#id-modal").modal('hide');
  });
  $("#id-modal").modal();
}

function executeDelete() {
  $("#loading").show();
  var param = {
    'userId': localStorage.getItem(LOGIN_KEY),
    'photoId': localStorage.getItem('selectPic')
  };
  $.ajax({
    type: "POST",
    url: API_DOMAIN + "DeletePhoto.php",
    data: param,
    dataType : 'json',
    timeout: 10000,
    cache: false,
    success: function (data) {
      if (data.result == '0') {
        // 一覧画面へ自動遷移
        location.href = "../index.html";
      } else {
        $("#loading").hide();
        $('#modal-msg').html(PICDETAIL_007);
        $('#ok-btn').html(PICDETAIL_005);
        $('#cancel-btn').hide();
        $('#ok-btn').off('click');
        $('#ok-btn').on('click', function(){
          $("#id-modal").modal('hide');
        });
        $("#id-modal").modal();
      }
    },
    error: function () {
      $("#loading").hide();
      $('#modal-msg').html(PICDETAIL_007);
      $('#ok-btn').html(PICDETAIL_005);
      $('#cancel-btn').hide();
      $('#ok-btn').off('click');
      $('#ok-btn').on('click', function(){
        $("#id-modal").modal('hide');
      });
      $("#id-modal").modal();
    }
  });
}

function swipeEvent(direction) {
  if (direction == 'right') {
    location.href = "../index.html";
  }
}

function download() {
  resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "Download/", function (dirEntry) {
    var photoId = localStorage.getItem('selectPic');
    var fileName = "fileToAppend_" + photoId + ".png";
    createFile(dirEntry, fileName, false);
  });
}

function createFile(dirEntry, fileName, isAppend) {
  dirEntry.getFile(fileName, {
    create: true,
    exclusive: false
  }, function (fileEntry) {
    var selectedImgDataMng = new SelectedImgDataMng();
    selectedImgDataMng.find().done(function(imgData){
      writeFile(fileEntry, toBlob(imgData), isAppend);
    });
  }, function () {
    alert("error")
  });
}

function toBlob(base64) {
  var bin = atob(base64.replace(/^.*,/, ''));
  var buffer = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  // Blobを作成
  try {
    var blob = new Blob([buffer.buffer], {
      type: 'image/png'
    });
  } catch (e) {
    return false;
  }
  return blob;
}

function writeFile(fileEntry, dataObj) {
  fileEntry.createWriter(function (fileWriter) {
    fileWriter.onwriteend = function () {
      readFile(fileEntry);
    };
    fileWriter.onerror = function (e) {
    };
    fileWriter.write(dataObj);
  });
}

function readFile(fileEntry) {
  fileEntry.file(function (file) {
    var reader = new FileReader();
    reader.onloadend = function () {
        alert("ダウンロードに成功しました");
    };
    reader.readAsText(file);
  }, function () {
    alert("error")
  });
}