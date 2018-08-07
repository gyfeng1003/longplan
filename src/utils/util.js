function CPos(x, y) {
  this.x = x;
  this.y = y;
}
export function GetObjPos(ATarget) {
  var target = ATarget;
  var pos = new CPos(target.offsetLeft, target.offsetTop);

  var target = target.offsetParent;
  while (target)
  {
    pos.x += target.offsetLeft;
    pos.y += target.offsetTop;

    target = target.offsetParent
  }
  return pos;
}
