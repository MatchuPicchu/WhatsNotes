'use strict';

const submitButton = document.querySelector('.submit-btn');
const uploads = document.querySelector('.uploaded-docs');
const name = document.querySelector('.i-name');
const author = document.querySelector('.i-author');
const description = document.querySelector('.i-description');
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
    })
};