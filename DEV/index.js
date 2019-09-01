import React from 'react';
import { render } from 'react-dom';
import App from './App';

// const fontAwesome = document.createElement('link');
// // fontAwesome.crossorigin = 'anonymous';
// fontAwesome.rel = 'stylesheet';
// // fontAwesome.integrity = 'sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN=';
// fontAwesome.href = 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';

// document.head.appendChild(fontAwesome);

// app
const div = document.createElement('div');

div.id = 'container';
div.style.backgroundColor = 'inherit';
div.style.width = '100vw';
div.style.height = '100vh';
document.body.style.margin = 0;

document.body.appendChild(div);

render(<App />, div);
