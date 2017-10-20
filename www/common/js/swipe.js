// This is a JavaScript file

$(function() {
  console.log('jquuery OK!');
  $('#contents').on('touchstart', onTouchStart); //指が触れたか検知
  $('#contents').on('touchmove', onTouchMove); //指が動いたか検知
  $('#contents').on('touchend', onTouchEnd); //指が離れたか検知
  var direction, position;

  // スワイプ開始時の横方向の座標を格納
  function onTouchStart(event) {
    position = getPosition(event);
    direction = ''; //一度リセットする
  }

  // スワイプの方向を取得
  function onTouchMove(event) {
    var move = getPosition(event);
    if (position.x - move.x > 70) { // 70px以上移動しなければスワイプと判断しない
      direction = 'left'; //左と検知
    } else if (position.x - move.x < -70){  // 70px以上移動しなければスワイプと判断しない
      direction = 'right'; //右と検知
    } else if (position.y - move.y > 70) { // 70px以上移動しなければスワイプと判断しない
      direction = 'up'; //上と検知
    } else if (position.y - move.y < -70){  // 70px以上移動しなければスワイプと判断しない
      direction = 'down'; //下と検知
    }
  }

  function onTouchEnd(event) {
    swipeEvent(direction);
  }

  // 座標を取得
  function getPosition(event) {
    return {
      x: event.originalEvent.touches[0].pageX,
      y: event.originalEvent.touches[0].pageY
    };
  }
});