export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

//时间戳转年月日YYYY/MM/DD
export function formatDateYMD(date){
  return date.getFullYear()+'/'+(date.getMonth()+1) + '/'+date.getDate();
}

//时间戳转时间HH:mm
export function formatTime(date){
  return date.getHours()+':'+date.getMinutes();
}

//时间转时间戳
export function formatdatetime(date){
  return new Date(date).getTime();
}
