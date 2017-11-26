function SelectedImgDataMng() {
  var selectedImgDatafileName = 'selectedImgData.txt';

  // 選択画像データ保存
  SelectedImgDataMng.prototype.save = function(base64Data) {
    var deferred = new $.Deferred;
    
    window.requestFileSystem(window.TEMPORARY, 0, onSuccess, onFail);
      
    function onSuccess(fs) {
      createFile(fs.root, selectedImgDatafileName, false)
        .then(function(fileEntry){
          var dataObj = new Blob([base64Data], { type: 'text/plain' });
          writeFile(fileEntry, dataObj)
            .then(function() {
              deferred.resolve();
            }, onFail);
        }, onFail);
    }
    
    function onFail() {
      deferred.reject();
    }
    
    return deferred.promise();
  }
  
  // 選択画像データ読み込み
  SelectedImgDataMng.prototype.find = function() {
    var deferred = new $.Deferred;
    
    window.requestFileSystem(window.TEMPORARY, 0, onSuccess, onFail);
      
    function onSuccess(fs) {
      createFile(fs.root, selectedImgDatafileName, false)
        .then(function(fileEntry){
          readFile(fileEntry)
            .then(function(imgData) {
              deferred.resolve(imgData);
            }, onFail);
        }, onFail);
    }
    
    function onFail() {
      deferred.reject();
    }
    
    return deferred.promise();
  }
  
  // 選択画像データクリア
  SelectedImgDataMng.prototype.delete = function() {
    var deferred = new $.Deferred;
    
    window.requestFileSystem(window.TEMPORARY, 0, onSuccess, onFail);
      
    function onSuccess(fs) {
      createFile(fs.root, selectedImgDatafileName, false)
        .then(function(fileEntry){
          deleteFile(fileEntry)
            .then(function() {
              deferred.resolve();
            }, onFail);
        }, onFail);
    }
    
    function onFail() {
      deferred.reject();
    }
    
    return deferred.promise();
  }
  
  // ファイル作成
  function createFile(dirEntry, fileName, isAppend) {
    var deferred = new $.Deferred;
    
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, {create: true, exclusive: false}, onSuccess, onFail);
    
    function onSuccess(fileEntry) {
      deferred.resolve(fileEntry);
    }
    
    function onFail() {
      deferred.reject();
    }
    
    return deferred.promise();
  }
  
  // ファイル書き込み
  function writeFile(fileEntry, dataObj) {
    var deferred = new $.Deferred;
    
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {
  
        fileWriter.onwriteend = function() {
          deferred.resolve();
        };
  
        fileWriter.onerror = function (e) {
          deferred.reject();
        };
  
        fileWriter.truncate(0);
        fileWriter.write(dataObj);
    });
    
    return deferred.promise();
  }
  
  // ファイル読み込み
  function readFile(fileEntry) {
    var deferred = new $.Deferred;
  
    fileEntry.file(onSuccess, onFail);
    
    function onSuccess(file) {
      var reader = new FileReader();
  
      reader.onloadend = function() {
        deferred.resolve(this.result);
      };
  
      reader.readAsText(file);
    }
    
    function onFail() {
      deferred.reject();
    }
    
    return deferred.promise();
  }
  
  // ファイル削除
  function deleteFile(fileEntry) {
    var deferred = new $.Deferred;
  
    fileEntry.remove(onSuccess, onFail);
    
    function onSuccess() {
      deferred.resolve();
    }
    
    function onFail() {
      deferred.reject();
    }
    
    return deferred.promise();
  }
}