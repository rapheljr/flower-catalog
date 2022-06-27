const queryParser = (uris) => {
  const query = {};
  const [uri, params] = uris.split('?');
  if (params) {
    params.split('&').forEach(param => {
      const [name, value] = param.split('=');
      query[name] = value;
    });
  }
  return { uri, query };
};

const parseReqLine = line => {
  console.log(new Date(), line);
  const [method, uri, protocol] = line.split(' ');
  const parsedUri = queryParser(uri);
  console.log(parsedUri);
  return { method, ...parsedUri, protocol };
};

const extractField = (line) => {
  const endOfKey = line.indexOf(':');
  const name = line.slice(0, endOfKey).toLowerCase();
  const value = line.slice(endOfKey + 1).trim();
  return { name, value };
};

const parseHeader = (lines) => {
  const headers = {};
  let index = 0;

  while (index < lines.length && lines[index].length > 1) {
    const { name, value } = extractField(lines[index]);
    headers[name] = value;
    index++;
  }

  return headers;
};

const parseRequest = (chunk) => {
  const lines = chunk.split('\r\n');
  const reqLine = parseReqLine(lines[0]);
  const headers = parseHeader(lines.slice(1));
  return { ...reqLine, headers };
};

module.exports = { parseReqLine, parseHeader, parseRequest, extractField };
