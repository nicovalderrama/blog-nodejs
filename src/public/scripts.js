// crear funcionalidad de botonos para agregar tags de html cuando sean presionados

const h1boton = document.getElementById('h1');
const h2boton = document.getElementById('h2');
const olboton = document.getElementById('ol');
const ulboton = document.getElementById('ul');
const liBoton = document.getElementById('li');
const pBoton = document.getElementById('p');
const aBoton = document.getElementById('a');
const imgBoton = document.getElementById('img');
const boldBoton = document.getElementById('b');
const textarea = document.getElementById('markdown');
//capturar todos los botones y sacarles el evento click
const botones = document.querySelectorAll('button');
botones.forEach(boton => {
    boton.addEventListener('click', (e) => {
        e.preventDefault();
    })
})

h1boton.addEventListener('click', () => {
    textarea.value += `<h1>Titulo</h1>`;
});

h2boton.addEventListener('click', () => {
    textarea.value += `<h2>Titulo</h2>`;
});

olboton.addEventListener('click', () => {
    console.log('ol');
    textarea.value +=
    `<ol>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
    <li>item 4</li>
    </ol>`;
});

ulboton.addEventListener('click', () => {
    textarea.value +=
    `<ul>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
    <li>item 4</li>
    </ul>`;
});

liBoton.addEventListener('click', () => {
    textarea.value += `<li>item</li>`;
});

pBoton.addEventListener('click', () => {
    textarea.value += `<p>Parrafo</p>`;
});

aBoton.addEventListener('click', () => {
    textarea.value += `<a href="#">link</a>`;
});

imgBoton.addEventListener('click', () => {
    textarea.value += `<img src="" alt="">`;
});

boldBoton.addEventListener('click', () => {
    textarea.value += `<b>texto</b>`;
});


