
const fillTable = (table) => {
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = table;
};

const parseFormData = (formData) => {
  const parsedForm = [];
  for (const [field, value] of formData) {
    const paramString = field + '=' + value;
    parsedForm.push(paramString);
  }
  return parsedForm;
};

const makeXhrRequest = (cb, method, path, body = '') => {
  const XHR = new XMLHttpRequest();
  XHR.onload = () => {
    if (XHR.status == 200) {
      return cb(XHR);
    }
    console.log('Error in fetching', method, path);
  }
  XHR.open(method, path);
  XHR.send(body);
};

const get = (url, cb) => makeXhrRequest(cb, 'GET', url);

const post = (url, body, cb) => makeXhrRequest(cb, 'POST', url, body);

const getComments = () => {
  const cb = (XHR) => addHtml(JSON.parse(XHR.responseText));
  get('/api', cb);
};

const onload = (XHR) => {
  const comment = document.getElementById('comment');
  console.log(XHR);
  fillTable(XHR.response);
  comment.value = '';
};

const main = () => {
  const formElement = document.querySelector('form');
  const formData = new FormData(formElement);
  const body = parseFormData(formData).join('&');
  const cb = onload;
  post('/comment', body, cb);
};
