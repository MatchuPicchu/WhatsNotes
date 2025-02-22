'use strict';

const submitButton = document.querySelector('.submit-btn');
const nameInput = document.querySelector('.i-name');
const authorInput = document.querySelector('.i-author');
const descriptionInput = document.querySelector('.i-description');
const classInput = document.querySelector('.i-class');
const uploadsDiv = document.querySelector('.uploaded-docs');

// Function to initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('WhatsNotesDB', 1);

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject(event.target.errorCode);
        };

        request.onsuccess = (event) => {
            console.log('Database opened successfully');
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('author', 'author', { unique: false });
            objectStore.createIndex('description', 'description', { unique: false });
            objectStore.createIndex('class', 'class', { unique: false });
        };
    });
}

// Function to add data to IndexedDB
function addData(db, data) {
    const transaction = db.transaction(['notes'], 'readwrite');
    const objectStore = transaction.objectStore('notes');
    const request = objectStore.add(data);

    request.onsuccess = () => {
        console.log('Data added to the database:', data);
        displayUploads(db); // Call to display uploads after adding data
    };

    request.onerror = (event) => {
        console.error('Error adding data:', event.target.errorCode);
    };
}

// Function to handle form submission
function handleSubmit() {
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent the form from submitting

        const name = nameInput.value;
        const author = authorInput.value;
        const description = descriptionInput.value;
        const classData = classInput.value;

        const data = { name, author, description, class: classData };

        console.log('Form data:', data); // Log the form data for debugging

        try {
            const db = await initDB();
            addData(db, data);
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Function to display uploaded data
function displayUploads(db) {
    const transaction = db.transaction(['notes'], 'readonly');
    const objectStore = transaction.objectStore('notes');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const notes = event.target.result;
        uploadsDiv.innerHTML = ''; // Clear the div before adding new content

        notes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('note');

            const nameP = document.createElement('p');
            nameP.textContent = `Name: ${note.name}`;
            const authorP = document.createElement('p');
            authorP.textContent = `Author: ${note.author}`;
            const descriptionP = document.createElement('p');
            descriptionP.textContent = `Description: ${note.description}`;
            const classP = document.createElement('p');
            classP.textContent = `Class: ${note.class}`;

            noteDiv.appendChild(nameP);
            noteDiv.appendChild(authorP);
            noteDiv.appendChild(descriptionP);
            noteDiv.appendChild(classP);

            uploadsDiv.appendChild(noteDiv);
        });

        console.log('Displayed notes:', notes); // Log the displayed notes for debugging
    };

    request.onerror = (event) => {
        console.error('Error retrieving data:', event.target.errorCode);
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const db = await initDB();
        displayUploads(db); // Display existing uploads on page load
    } catch (error) {
        console.error('Error:', error);
    }

    handleSubmit();
});
