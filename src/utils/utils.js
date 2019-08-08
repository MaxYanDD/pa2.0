
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
