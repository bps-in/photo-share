// This is a JavaScript file
$(function () {
  createInitHtml();
});

function createInitHtml() {
  console.log("documentReady");
  var selectPic = localStorage.getItem(PICTURE_BINARY);
  var picDataText = '<img src="data:image/png;base64, ' + selectPic + '">';
  $('.picDataText').html(picDataText);
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
  document.addEventListener('deviceready', createFooterForAndroid, false);
  
  $("#loading").hide();
}
  function createFooterForAndroid(){
    var devaiceModel = device.model;
    if(devaiceModel.indexOf('iPhone') === -1){
      var downloadBtn = '<div id =><input class="btn btn-primary btn-block" onclick="download();" value=' + PICDETAIL_003 +'></div>'
      $('.downloadBtn').html(downloadBtn);
    }      
  }  

function deletePic() {
  $('#modal-msg').html(PICDETAIL_004);
  $('#ok-btn').html(PICDETAIL_005);
  $('#cancel-btn').html(PICDETAIL_006);
  $('.modal-body').html();
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
    success: function (msg) {
      // 一覧画面へ自動遷移
      location.href = "../index.html";
    },
    error: function () {
      $("#loading").hide();
      alert(PICDETAIL_007);
    }
  });
}

function swipeEvent(direction) {
  if (direction == 'right') {
    location.href = "../index.html";
  } else if (direction == 'left') {
    location.href = "../index.html";
  } else if (direction == 'up') {
    location.href = "../index.html";
  }
}

function download() {
  resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "Download/", function (dirEntry) {
    createFile(dirEntry, "fileToAppend.png", false);
  });
}

function createFile(dirEntry, fileName, isAppend) {
  dirEntry.getFile(fileName, {
    create: true,
    exclusive: false
  }, function (fileEntry) {
    writeFile(fileEntry, toBlob(localStorage.getItem(PICTURE_BINARY)), isAppend);
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