'use strict';

const submitButton = document.querySelector('.submit-btn');
const uploads = document.querySelector('.uploaded-docs');
const nameInput = document.querySelector('.i-name');
const authorInput = document.querySelector('.i-author');
const descriptionInput = document.querySelector('.i-description');
const classInput = document.querySelector('.i-class');

function uploadFiles() { 
    submitButton.addEventListener('click', ()=> {
        const name = nameInput.value;
        const author = authorInput.value;
        const description = descriptionInput.value;
        const classData = classInput.value;

        // Save data to local storage
        localStorage.setItem('name', name);
        localStorage.setItem('author', author);
        localStorage.setItem('description', description);
        localStorage.setItem('class', classData);

        displayUploads();
    })
};

function displayUploads() {
    const name = localStorage.getItem('name');
    const author = localStorage.getItem('author');
    const description = localStorage.getItem('description');
    const classData = localStorage.getItem('class');

    const nameP = document.createElement('p');
    nameP.textContent = `Name: ${name}`;
    const authorP = document.createElement('p');
    authorP.textContent = `Author: ${author}`;
    const descriptionP = document.createElement('p');
    descriptionP.textContent = `Description: ${description}`;
    const classP = document.createElement('p');
    classP.textContent = `Class: ${classData}`;

    uploads.appendChild(nameP);
    uploads.appendChild(authorP);
    uploads.appendChild(descriptionP);
    uploads.appendChild(classP);
};

document.addEventListener('DOMContentLoaded', () => {
    uploadFiles();
    displayUploads();
});
