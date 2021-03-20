/* global Handlebars, Chart, */
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

function generateChart() {
  var ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    // 1
    type: 'bar',
    data: {
      // 2
      labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
      // 3
      datasets: [{
        // 4
        label: 'Signups',
        // 5
        backgroundColor: '#8DBEC8',
        borderColor: '#8DBEC8',
        // 6
        data: [ 52, 51, 41, 94, 26, 6, 72, 9, 21, 88 ],
      },
      {
        label: 'FTD',
        backgroundColor: '#F29E4E',
        borderColor: '#F29E4E',
        data: [ 6, 72, 1, 0, 47, 11, 50, 44, 63, 76 ],
      },
      {
        label: 'Earned',
        backgroundColor: '#71B374',
        borderColor: '#71B374',
        data: [ 59, 49, 68, 90, 67, 41, 13, 38, 48, 48 ],
        // 7
        hidden: true,
      }]
    },
  });

}

let imin = 0;
let imax = 10;
function getDetailsTable(object = {}) {

  let pageNumbers = Math.ceil(tables.details.length/10);
  if (Object.keys(object).length) {
    if (!isNaN(object.id)) {
      imin = (object.id-1)*10;
      imax = imin+10;
    } else if (object.action != 0) {
      imin = (imin/10 + object.action)*10;
      imax = imin+10;
      if (imin < 0) {
        imin = 0;
        imax = 10;
      } else if (imax > tables.details.length) {
        imax = tables.details.length;
        imin = imax - 10;
      }
    }
  }
  console.log(imin, imax);

  let howManyPages = [];
  const slicedObj = {tables: {}};
  slicedObj.tables.details = tables.details.slice(imin,imax);

  for (let j = 1; j <= pageNumbers; j++) {
    const pageNumber = {pageNumber: j};
    howManyPages.push(pageNumber);
  }
  slicedObj.tables.pagesNumber = howManyPages;
  return slicedObj.tables;
}

function addEventListeners() {
  const tablePages = document.querySelector(select.wrapper.tablePage);

  tablePages.addEventListener('click', function(event) {
    const eventTarget = event.target;
    let action = getAction(eventTarget);
    const elem = document.querySelector(select.wrapper.details);
    elem.innerHTML = '';
    generateHandlebars(select.templateOf.details, select.wrapper.details, getDetailsTable(action));
    addEventListeners();
  });
}

function getAction(eventTarget) {
  const idObj = {};
  const id = eventTarget.innerHTML;
  idObj.id = parseInt(id);
  if (!id) {
    let action = 0;
    const checkClass = eventTarget.getAttribute('id');
    if (checkClass == 'one-less') {
      action = -1;
    } else {
      action = +1;
    }  
    idObj.action = action;
  }
  return idObj;
}

function toggleHidden(element, targetElement) {
  const elementToClick = document.querySelector(element);
  elementToClick.addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelector(targetElement).classList.toggle(select.classNames.hidden);
  });
}

function validateForm() {
  document.querySelector('form').addEventListener('submit', function(event) {
    let isFormValidate = true;
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailAddressInput = event.target.querySelector('input[name="email_address"]');

    if (!re.test(emailAddressInput.value)) {
      isFormValidate = false;
      emailAddressInput.classList.add('error');
      window.scrollBy(0, -300);
    }
    const requiredInputs = this.querySelectorAll('.required');
    for (let requiredInput of requiredInputs) {
      isFormValidate = required(requiredInput, isFormValidate);
    }
    
    
    return !isFormValidate ? event.preventDefault() : true;
  });
}

function required(requiredInput, isFormValidate) {
  if (!requiredInput.value) {
    isFormValidate = false;
    requiredInput.classList.add('error');
    window.scrollBy(0, -300);
    return isFormValidate;
  }
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
generateHandlebars(select.templateOf.details, select.wrapper.details, getDetailsTable());
addEventListeners();
generateChart();
validateForm();

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    console.log('eskejp wcisniety', document.querySelector(select.elements.popup));

    document.querySelector(select.elements.popup).classList.add(select.classNames.hidden);
  } 
});


