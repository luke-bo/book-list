class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create tr element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X<a></td>
    `;

    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    // Add Classes
    div.className = `alert ${className}`;
    // Add Text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // Insert Alert
    container.insertBefore(div, form);

    // Timeout after 3 secs
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000)
  }

  deleteBook(target) {
    if(target.className == 'delete'){
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local Storage Class
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book){
      const ui = new UI;

      // Add Book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    console.log(isbn);
    const books = Store.getBooks();

    books.forEach(function(book, index){
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }


}

// Event Listeners

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event listener for Add Book
document.getElementById('book-form').addEventListener('submit', 
  function(e) {
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value

    // Instantiate Book
    const book = new Book(title, author, isbn);
    console.log(book);

    // Instantiate UI
    const ui = new UI();

    console.log(ui);

    // Validate 
    if (title === '' || author === '' || isbn === '') {
      ui.showAlert('Please fill in all fields', 'error');
    } else {
      // Add book to list
      ui.addBookToList(book);

      // Add book to Local Storage
      Store.addBook(book);

      // Show book successfully added
      ui.showAlert('Book Added!', 'success');

      // Clear Add Book form fields
      ui.clearFields();
    }

    

    console.log(book);
    e.preventDefault();
});

// Event listener for Delete Book
document.getElementById('book-list').addEventListener
  ('click', function(e){

  // Instantiate UI
  const ui = new UI();
  
  // Delete Book
  ui.deleteBook(e.target);

  // Remove from Local Storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Message
  ui.showAlert('Book Removed!', 'success');

  e.preventDefault();
});