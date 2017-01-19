function padZero(number, length) {
  var result = number + '';
  while (result.length < length) {
    result = '0' + result;
  }
  return result;
}

function formDate(year, month, date) {
  month = (month === 0) ? 12 : month;
  month = (month > 12) ? month % 12 : month;
  return year + "-" + padZero(month, 2) + "-" + padZero(date, 2);
}

function removeClass(ele, name) {
  ele.classList.remove(name);
}
