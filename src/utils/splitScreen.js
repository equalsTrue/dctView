class DragController {
  constructor(splitDragObj) {
    this.splitDragResize = splitDragObj.splitDragResize;   //  上下分屏拖动 中间的div的id
    this.splitDragTop = splitDragObj.splitDragTop;          //  上下分屏  上半屏的div的id
    this.splitDragDown = splitDragObj.splitDragDown;         //  上下分屏 下半屏的div的id
    this.splitDragBox = splitDragObj.splitDragBox;           //  上下分屏  最外层容器的div的id
  }

  dragControllerDiv() {
    var splitDragResize = document.getElementById(this.splitDragResize);
    var splitDragTop = document.getElementById(this.splitDragTop);
    var splitDragDown = document.getElementById(this.splitDragDown);
    var h = window.innerHeight;
    var splitDragBox = document.getElementById(this.splitDragBox);
    splitDragBox.style.height = h + "px";
    splitDragResize.onmousedown = function (e) {
      var startY = e.clientY;
      splitDragResize.top = splitDragResize.offsetTop;
      document.onmousemove = function (e) {
        var endY = e.clientY;
        var moveLen;
        if (splitDragResize.top + (endY - startY) <= 160) {
          moveLen = 160;
        } else if (splitDragResize.top + (endY - startY) >= splitDragBox.clientHeight - 165) {
          moveLen = splitDragBox.clientHeight - 165;
        } else {
          moveLen = splitDragResize.top + (endY - startY);
        }
        var maxT = splitDragBox.clientHeight - splitDragResize.offsetHeight;
        if (moveLen < 30) moveLen = 30;
        if (moveLen > maxT - 30) moveLen = maxT - 30;
        splitDragResize.style.top = moveLen;
        splitDragTop.style.height = moveLen + "px";
        splitDragDown.style.height = (splitDragBox.clientHeight - moveLen - 5) + "px";
      }
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
        splitDragResize.releaseCapture && splitDragResize.releaseCapture();
      }
      splitDragResize.setCapture && splitDragResize.setCapture();
      return false;
    }
  }
}

export default DragController;

