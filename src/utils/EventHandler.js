// 阻止在colorpicker上的 mousedown事件
bindEventPrevent()
function bindEventPrevent() {
  document.addEventListener('mousedown', preventMouseDown);
}
function destroyed() {
  document.removeEventListener('mousedown', preventMouseDown);
}

function preventMouseDown(e) {
  let isColorPicker = e.target.classList.contains('el-color-picker__panel') || e.target.classList.contains('el-dropdown-menu') || parentHas(e);
  if (isColorPicker) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}

function parentHas(e) {
  var path = e.path || (event.composedPath && event.composedPath()),
    i = 0,
    L = path.length,
    current = null,
    has = false;
  while (++i < L) {
    current = path[i];
    has = current.classList.contains('el-color-picker__panel') || current.classList.contains('el-dropdown-menu');
    if (has) break;
    if (current === document.body) break;
  }
  return has;
}

