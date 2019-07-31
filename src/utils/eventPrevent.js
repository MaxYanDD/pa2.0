document.addEventListener('mousedown', function(e) {
  e.target;

  let isColorPicker = e.target.classList.contains('el-color-picker__panel') || parentHas(e);

  if(isColorPicker){
    e.stopImmediatePropagation();
  }
  
});

function parentHas(e) {
  var path = e.path || (event.composedPath && event.composedPath()),
    i = 0,
    L = path.length,
    current = null,
    has = false;
  while (++i < L) {
    current = path[i];
    has = current.classList.contains('el-color-picker__panel');
    if (has) break;
    if (current === document.body) break;
  }
  return has;
}
