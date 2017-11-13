function snapPicture() {
  navigator.camera.getPicture (onSuccess, onFail,
    { quality: 50, destinationType: Camera.DestinationType.DATA_URL,
    sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM});

  // 撮影成功コールバック
  function onSuccess(imageData){      
    // 画像データをローカルストレージに格納
    localStorage.setItem(PICTURE_BINARY, imageData);
    // タグ選択画面に遷移
    window.location.href = './tagRegist.html';
  }

  // 撮影失敗コールバック
  function onFail(){
    // タグ選択画面に遷移
    window.location.href = '../index.html';
  }
}

document.addEventListener ("deviceready", snapPicture);
