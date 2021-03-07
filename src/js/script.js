/* global Handlebars */
'use strict';

import {select} from './settings.js';
import {tables} from './db.js';

function generateHandlebars(template, wrapper, data = {}) {
  const element = document.querySelector(template).innerHTML;
  const sidebar = Handlebars.compile(element);
  let generatedHTML = sidebar(data);
  const targetElement = document.querySelector(wrapper);

  targetElement.insertAdjacentHTML('beforeend', generatedHTML);

}

function getDetailsTable() {
  // const url = db.url + '/' + db.details;

  // const request = fetch(url);
  // const parseServerResponse = request.then(function(rawResponse) {
  //   return rawResponse.json();
  // });
  
  // const details = parseServerResponse.then(function(parsedResponse) {
  //   return JSON.stringify(parsedResponse);
  // });
  let i, j = 0;
  let array = [];
  const slicedObj = {};
  slicedObj.tables = {};
  for (i=0; i<tables.details.length; i+=10) {
    slicedObj.tables.details = tables.details.slice(i,i+10);
    j++;
    const pageNumber = {pageNumber: j};
    array.push(pageNumber);
  }
  slicedObj.tables.pagesNumber = array;
  generateHandlebars(select.templateOf.details, select.wrapper.details, slicedObj.tables);
}

function toggleHidden(element, targetElement) {
  const elementToClick = document.querySelector(element);
  elementToClick.addEventListener('click', function(event) {
    event.preventDefault();
    console.log(event.target);
    document.querySelector(targetElement).classList.toggle(select.classNames.hidden);
  });
}


function activateMenu() {
  document.querySelector(select.elements.menuLinks).addEventListener('click', function(event) {
    event.preventDefault();
    let selector = event.target.parentElement.getAttribute('data-page');
    if (selector === null) {
      selector = event.target.getAttribute('data-page');
    }
    const pages = document.querySelectorAll('.' + selector);
    const allSections = document.querySelectorAll(select.elements.sections);
    const hiddenClass = select.classNames.hidden;
    for (let section of allSections) {
      section.classList.remove(hiddenClass);
      section.classList.add(hiddenClass);
    }
    for (let page of pages) {
      page.classList.remove(hiddenClass);
    }
  });
}

generateHandlebars(select.templateOf.sidebar, select.wrapper.sidebar);
generateHandlebars(select.templateOf.generalStats, select.wrapper.generalStats);
generateHandlebars(select.templateOf.links, select.wrapper.links);
generateHandlebars(select.templateOf.personalData, select.wrapper.personalData);
generateHandlebars(select.templateOf.banners, select.wrapper.banners);
activateMenu();
toggleHidden(select.elements.hamburger, select.elements.sidebarToggle);
toggleHidden(select.elements.manager, select.elements.chat);
toggleHidden(select.elements.close, select.elements.chat);
getDetailsTable();



