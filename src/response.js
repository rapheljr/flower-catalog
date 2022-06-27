const EOL = '\r\n';

const statusMessage = {
  200: 'ok',
  404: 'not found',
  301: 'permanent redirect',
  302: 'temporary redirect'
};

class Response {
  #socket;
  #statusCode;
  #headers;

  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#headers = {};
  }

  #statusLine() {
    const message = statusMessage[this.#statusCode];
    return `HTTP/1.1 ${this.#statusCode} ${message} ${EOL}`;
  }

  #write(content) {
    this.#socket.write(content);
  }

  #end() {
    this.#socket.end();
  }

  set statusCode(code) {
    this.#statusCode = code;
  }

  get statusCode() {
    return this.#statusCode;
  }

  setHeader(name, value) {
    this.#headers[name] = value;
  }

  #writeHeaders() {
    Object.entries(this.#headers).forEach(([name, value]) => {
      this.#write(`${name}: ${value}${EOL}`);
    });
  }

  send(body) {
    this.#write(this.#statusLine());
    this.#writeHeaders();
    this.#write(EOL);
    this.#write(body);
    // this.#end();
  }

}

module.exports = { Response };
