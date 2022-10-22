/* 
    {
        id: string | number,
        title: string,
        author: string,
        year: number,
        isCompleted: boolean,
    }
*/

const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const {id, title, author, year, isCompleted} = bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis : " + author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun : " + year;

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const undoCompleteButton = document.createElement("button");
    undoCompleteButton.classList.add("green");
    undoCompleteButton.innerHTML = "Belum Selesai Dibaca";
    undoCompleteButton.addEventListener("click", () => {
      undoCompleteBook(id);
    });

    const removeBookButton = document.createElement("button");
    removeBookButton.innerText = "Hapus Buku";
    removeBookButton.classList.add("red");
    removeBookButton.addEventListener("click", () => {
      removeBook(id);
    });

    actionContainer.append(undoCompleteButton, removeBookButton);
    container.append(actionContainer);
  } else {
    const completeButton = document.createElement("button");
    completeButton.classList.add("green");
    completeButton.innerText = "Selesai Dibaca";
    completeButton.addEventListener("click", () => {
      completeBook(id);
    });

    const removeBookButton = document.createElement("button");
    removeBookButton.innerText = "Hapus Buku";
    removeBookButton.classList.add("red");
    removeBookButton.addEventListener("click", () => {
      removeBook(id);
    });

    actionContainer.append(completeButton, removeBookButton);
    container.append(actionContainer);
  }
  return container;
}

function addBook() {
  const textTitle = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const textYear = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    textTitle,
    textAuthor,
    textYear,
    isCompleted
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function completeBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoCompleteBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  //   clearing list item
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  }
});

const search = document.getElementById("searchBookTitle");
search.addEventListener("keyup", searchBook);

function searchBook(h) {
  const search = h.target.value.toLowerCase();
  let bookList = document.querySelectorAll(".book_item");
  bookList.forEach((bookObject) => {
    const input = bookObject.textContent.toLowerCase();
    if (input.indexOf(search) != -1) {
      bookObject.setAttribute("style", "diplay: block");
    } else {
      bookObject.setAttribute("style", "display: none");
    }
  });
}
