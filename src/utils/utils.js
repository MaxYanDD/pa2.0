
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

// 改变选中字体大小
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

// 获取计算样式
export function getStyle(element,attr) {
  if(window.getComputedStyle){
      return window.getComputedStyle(element,null)[attr];
  }else {
      return element.currentStyle[attr];
  }
}

// 获取时间戳
export function formatDateTime(inputTime) {    
  var date = new Date(inputTime);  
  var y = date.getFullYear();    
  var m = date.getMonth() + 1;    
  m = m < 10 ? ('0' + m) : m;    
  var d = date.getDate();    
  d = d < 10 ? ('0' + d) : d;    
  var h = date.getHours();  
  h = h < 10 ? ('0' + h) : h;  
  var minute = date.getMinutes();  
  var second = date.getSeconds();  
  minute = minute < 10 ? ('0' + minute) : minute;    
  second = second < 10 ? ('0' + second) : second;   
  return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;    
};  


