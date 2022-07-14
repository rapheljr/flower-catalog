const fs = require('fs');

class GuestBook {
  #file;
  #readFile;
  #writeFile;
  #comments;
  constructor(file, readFile, writeFile) {
    this.#file = file;
    this.#readFile = readFile;
    this.#writeFile = writeFile;
    this.#comments = JSON.parse(this.#readFile(this.#file, 'utf-8'));
  }

  addComment(name, text) {
    const date = new Date();
    const comment = { date: date.toLocaleString(), name, text };
    if (name && text) {
      this.#comments.unshift(comment);
      this.#writeFile(this.#file, JSON.stringify(this.#comments), 'utf-8');
    }
  }

  getComments() {
    return JSON.parse(this.#readFile(this.#file, 'utf-8'));
  }

  toHtmlList() {
    const comments = this.getComments();
    return comments.map(({ date, name, text }) => {
      return `<li>${date + name + text}</li>`;
    }
    ).join('');
  }

  toHtmlTable() {
    const comments = this.getComments();
    const tbody = comments.map(({ date, name, text }) => {
      return `<tr><td>${date}</td><td>${name}</td><td>${text}</td></tr>`;
    });
    return tbody.join('');
  }

}

module.exports = { GuestBook };
