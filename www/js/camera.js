function snapPicture() {
  navigator.camera.getPicture (onSuccess, onFail,
    { quality: 50, destinationType: Camera.DestinationType.DATA_URL});

  //撮影成功
  function onSuccess(imageData) {
    //確認ダイアログ表示
    var isConfTrue = confirm('この写真をアップロードしますか？');

    if(isConfTrue){
      //画像データをローカルストレージに格納
      localStorage.setItem(PICTURE_BINARY, imageData);

      //タグ選択画面に遷移
      window.location.href = './tagRegist.html';

    }else{
      //写真一覧に遷移
      window.location.href = '../index.html';
    }
  }

  //撮影失敗
  function onFail() {
    //写真一覧に遷移
    window.location.href = '../index.html';
  }
}

document.addEventListener ("deviceready", snapPicture);
