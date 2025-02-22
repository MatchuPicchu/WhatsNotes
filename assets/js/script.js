'use strict';

const submitButton = document.querySelector('.submit-btn');
const nameInput = document.querySelector('.i-name');
const authorInput = document.querySelector('.i-author');
const descriptionInput = document.querySelector('.i-description');
const classInput = document.querySelector('.i-class');
const fileInput = document.querySelector('#fileInput'); // Ensure ID is set in HTML
const uploads = document.querySelector('.uploaded-docs');

let db;

// Open (or create) IndexedDB database
let request = indexedDB.open("NotesDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("IndexedDB initialized successfully.");
    loadPDFs(); // Load saved PDFs after DB is ready
};

request.onerror = function () {
    console.error("Error opening IndexedDB.");
};

// Function to save a PDF file into IndexedDB along with metadata
function savePDF(file, metadata) {
    let reader = new FileReader();

    reader.onload = function (event) {
        let transaction = db.transaction(["notes"], "readwrite");
        let store = transaction.objectStore("notes");

        let noteData = {
            name: metadata.name,
            author: metadata.author,
            description: metadata.description,
            class: metadata.classData,
            filename: file.name,  // Store filename
            data: event.target.result // File content
        };

        store.add(noteData);

        transaction.oncomplete = function () {
            console.log(`Saved ${file.name} to IndexedDB.`);
            loadPDFs(); // Refresh notes feed after saving
        };
    };

    reader.readAsArrayBuffer(file); // Read file as binary data
}

// Handle form submission
submitButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const author = authorInput.value.trim();
    const description = descriptionInput.value.trim();
    const classData = classInput.value.trim();
    const file = fileInput.files[0]; // Get the selected file

    if (!name || !author || !description || !classData || !file) {
        alert("Please fill in all fields and upload a file.");
        return;
    }

    savePDF(file, { name, author, description, classData });

    // Clear form fields
    nameInput.value = "";
    authorInput.value = "";
    descriptionInput.value = "";
    classInput.value = "";
    fileInput.value = "";
});

// Function to load PDFs and display them
function loadPDFs() {
    if (!db) return; // Prevent running before DB is initialized

    let transaction = db.transaction(["notes"], "readonly");
    let store = transaction.objectStore("notes");
    let request = store.getAll();

    request.onsuccess = function (event) {
        let notes = event.target.result;
        let notesFeed = document.querySelector(".uploaded-docs");
        notesFeed.innerHTML = "";

        notes.forEach(note => {
            let blob = new Blob([note.data], { type: "application/pdf" });
            let url = URL.createObjectURL(blob);

            let noteContainer = document.createElement("div");
            noteContainer.classList.add("note-entry");

            noteContainer.innerHTML = `
                <p><strong>Title:</strong> ${note.name}</p>
                <p><strong>Author:</strong> ${note.author}</p>
                <p><strong>Description:</strong> ${note.description}</p>
                <a href="${url}" download="${note.filename}">Download PDF</a>
                <hr>
                <div class="reaction-button-wrapper">
                    <button>
                        <i class="fa-solid fa-thumbs-up"></i>
                    </button>
                    <button>
                        <i class="fa-solid fa-thumbs-down"></i>
                    </button>
                </div>
            `;

            notesFeed.appendChild(noteContainer);
        });
    };

    request.onerror = function () {
        console.error("Error loading notes from IndexedDB.");
    };
}

window.onload = function () {
    if (db) loadPDFs();
};
