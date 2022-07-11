const main = () => {
  const XHR = new XMLHttpRequest();
  const comment = document.getElementById('comment');
  const avatar = document.getElementById('avatar');
  console.log(avatar);
  const path = `/data?comment=${comment.value}&avatar=${avatar.value}`;
  console.log(path);
  XHR.open('GET', path);
  XHR.send();
  XHR.onload = () => {
    console.log(XHR);
    fillTable(XHR.response);
    comment.value = '';
  }
};

const fillTable = (table) => {
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = table;
};

// window.onload = main;
