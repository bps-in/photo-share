function snapPicture() {
  navigator.camera.getPicture (onSuccess, onFail,
    { quality: 50, destinationType: Camera.DestinationType.DATA_URL,
    sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM});

  // 撮影成功コールバック
  function onSuccess(imageData){
    $("#id-modal").modal();
    // アップロードボタン
    $('#id-modal').off('click', '.modal-footer .btn-primary');
    $('#id-modal').on('click', '.modal-footer .btn-primary', function() {
      // モーダルを閉じる
      $('#id-modal').modal('hide');
      
      // 画像データをローカルストレージに格納
      localStorage.setItem(PICTURE_BINARY, imageData);
      // タグ選択画面に遷移
      window.location.href = './tagRegist.html';
      
    });

    // 閉じるボタン
    $('#id-modal').off('click', '.modal-footer .btn-default');
    $('#id-modal').on('click', '.modal-footer .btn-default', function() {
      // タグ選択画面に遷移
      window.location.href = '../index.html';
      
    });
  }

  // 撮影失敗コールバック
  function onFail(){
    // タグ選択画面に遷移
    window.location.href = '../index.html';
  }
}

document.addEventListener ("deviceready", snapPicture);
