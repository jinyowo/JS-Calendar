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
function addClass(ele, name) {
    ele.classList.add(name);
}
function removeClass(ele, name) {
  ele.classList.remove(name);
}

function getTbodyFromThead(headEle, tdEle) {
  var tds = headEle.querySelectorAll("td");

  for (var i = 0; i < tds.length; i++) {
    if(tds[i].isEqualNode(tdEle)) {
      break;
    }
  }
  if (i < tds.length) {
    return headEle.nextElementSibling.firstElementChild.children[i];
  } else {
    return null;
  }
}

function getElementPosition(ele) {
  var i = 0;
  while(ele.nextElementSibling !== null) {
    i++;
    ele = ele.nextElementSibling
  }
  return i;
}

function resetEvent() {
  var eventRow = document.querySelectorAll(".fc-content-skeleton tbody");

  for (var i = 0; i < eventRow.length; i++) {
      eventRow[i].innerHTML = "<tr>"
                            + "\n<td></td>"
                            + "\n<td></td>"
                            + "\n<td></td>"
                            + "\n<td></td>"
                            + "\n<td></td>"
                            + "\n<td></td>"
                            + "\n<td></td>"
                            + "\n</tr>";
  }
}
