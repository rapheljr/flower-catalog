const fs = require('fs');

class Comments {
  #file;
  constructor(file) {
    this.#file = file;
  }

  #addToFile(comment) {
    const comments = JSON.parse(fs.readFileSync(this.#file, 'utf-8'));
    comments.push(comment);
    fs.writeFileSync(this.#file, JSON.stringify(comments), 'utf-8');
  }

  addComment(name, text) {
    const date = new Date();
    const comment = { date: date.toLocaleString(), name, text };
    if (name && text) {
      this.#addToFile(comment);
    }
  }

  getComments() {
    return JSON.parse(fs.readFileSync(this.#file, 'utf-8'));
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

module.exports = { Comments };
