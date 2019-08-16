
// 解析url参数
export function getUrlParams() {
  let ret = {},
    seg = window.location.search.replace(/^\?/, '').split('&'),
    len = seg.length,
    i = 0,
    s;

  for (; i < len; i++) {
    if (!seg[i]) {
      continue;
    }
    s = seg[i].split('=');
    ret[s[0]] = decodeURIComponent(s[1]);
  }

  return ret;
}


export function changeFontSize() {
  document.execCommand("fontSize", false, "7");
  var fontElements = document.getElementsByTagName("font");
  for (var i = 0, len = fontElements.length; i < len; ++i) {
      if (fontElements[i].size == "7") {
          fontElements[i].removeAttribute("size");
          fontElements[i].style.fontSize = "30px";
      }
  }
}

export function getStyle(element,attr) {
  if(window.getComputedStyle){
      return window.getComputedStyle(element,null)[attr];
  }else {
      return element.currentStyle[attr];
  }
}