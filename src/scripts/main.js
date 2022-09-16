import Swal from "sweetalert2";

function main() {
  const baseUrl = 'https://books-api.dicoding.dev';

  const getBook = () => {
    //membuat instance dari XMLHttpReq
    const xhr = new XMLHttpRequest();

    //callback response sukses dan gagal
    xhr.onload = function() {
      const responseJson = JSON.parse(this.responseText);

      if (responseJson.error) {
        showResponseMessage(responseJson.message);
      } else {
        renderAllBooks(responseJson.books);
      }
    };

    xhr.onerror = function()  {
      showResponseMessage();
    };

    //get request api dicoding books
    xhr.open('GET', `${baseUrl}/list`);

    //send request
    xhr.send();
  };


  const insertBook = (book) => {
    //membuat instance dari XMLHttpRequest
    const xhr = new XMLHttpRequest();

    //callback jika response sukses atau gagal
    xhr.onload = function() {
      const responseJson = JSON.parse(this.responseText);
      showResponseMessage(responseJson.message);
      getBook();
    };

    xhr.onerror = function() {
      showResponseMessage();
    };

    //post request api dicoding book
    xhr.open('POST', `${baseUrl}/add`);

    //menetapkan properti Content-type dan X-Auth Token pada header request
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Auth-Token', '12345');

    //send request dan JSON.stringify(book) pada body
    xhr.send(JSON.stringify(book));
  };

  const updateBook = (book) => {
    //membuat instance dari XMLHttpRequest
    const xhr = new XMLHttpRequest();

    //callback jika response sukses dan gagal
    xhr.onload = function() {
      const responseJson = JSON.parse(this.responseText);
      showResponseMessage(responseJson.message);
      getBook();
    };

    xhr.onerror = function() {
      showResponseMessage();
    };

    //put request api dicoding book
    xhr.open('PUT', `${baseUrl}/edit/${book.id}`);

    //menetapkan properti Content-type dan X-Auth Token pada header request
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Auth-Token', '12345');

    //send request dan JSON.stringify(book) pada body
    xhr.send(JSON.stringify(book));
  };

  const removeBook = (bookId) => {
    //membuat instance dari XMLHttpRequest
    const xhr = new XMLHttpRequest();

    //callback jika sukses dan gagal
    xhr.onload = function() {
      const responseJson = JSON.parse(this.responseText);
      showUpdateMessage(responseJson.message);
      getBook();
    };

    xhr.onerror = function() {
      showUpdateMessage();
    };

    //delete request api dicoding book
    xhr.open('DELETE', `${baseUrl}/delete/${bookId}`);

    ////menetapkan properti X-Auth-Token
    xhr.setRequestHeader('X-Auth-Token', '12345');

    //send request
    xhr.send();
    
  };

  const renderAllBooks = (books) => {
    const listBookElement = document.querySelector('#listBook');
    listBookElement.innerHTML = '';

    books.forEach(book => {
      listBookElement.innerHTML += `
        <div class="col-lg-4 col-md-6 col-sm-12" style="margin-top: 12px;">
          <div class="card">
            <div class="card-body">
              <h5>(${book.id}) ${book.title}</h5>
              <p>${book.author}</p>
              <button type="button" class="btn btn-danger button-delete" id="${book.id}">Hapus</button>
            </div>
          </div>
        </div>
      `;
    });

    const buttons = document.querySelectorAll('.button-delete');
    buttons.forEach(button => {
      button.addEventListener('click', event => {
        const bookId = event.target.id;
        
        removeBook(bookId);
      });
    });
  };

  const showResponseMessage = (message = 'Check your internet connection') => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      showConfirmButton: false,
      timer: 2000
    }) 
  };

  const showUpdateMessage = (message = 'sukses') => {
    Swal.fire({
      title: 'Apakah kamu yakin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, yakin!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          message,
          'success'
        )
      }
    })
  }


  document.addEventListener('DOMContentLoaded', () => {

    const inputBookId = document.querySelector('#inputBookId');
    const inputBookTitle = document.querySelector('#inputBookTitle');
    const inputBookAuthor = document.querySelector('#inputBookAuthor');
    const buttonSave = document.querySelector('#buttonSave');
    const buttonUpdate = document.querySelector('#buttonUpdate');

    buttonSave.addEventListener('click', function () {
      const book = {
        id: Number.parseInt(inputBookId.value),
        title: inputBookTitle.value,
        author: inputBookAuthor.value
      };
      
      insertBook(book);
    });

    buttonUpdate.addEventListener('click', function () {
      const book = {
        id: Number.parseInt(inputBookId.value),
        title: inputBookTitle.value,
        author: inputBookAuthor.value
      };

      updateBook(book);
    });
    getBook();
  });
}

export default main;