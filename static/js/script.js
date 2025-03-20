//static/js/script.js

const hamburguer = document.querySelector('.toggle-btn');
const toggler = document.querySelector('#icon');
const sidebar = document.querySelector('#sidebar');
const mainContent = document.querySelector('.main');

hamburguer.addEventListener('click', function () {
    sidebar.classList.toggle('expand');
    mainContent.classList.toggle('expand');
    toggler.classList.toggle('bx-chevrons-right');
    toggler.classList.toggle('bx-chevrons-left');
});