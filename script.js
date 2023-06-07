let availableProductList = [];
let myLists = [];
let currentList = {};

const getfakestoreData = async(category) => {
  try {
    return fetch(`https://fakestoreapi.com/products/category/${category}`)
    .then(res => res.json())
  }
  catch(error) {
    console.error(error);
  }
}
// getfakestoreData('electronics')
showInitialPage();

const wishListSections = {
  form_registration: {
    id: 'form_registration',
  },
  lists: {
    id: 'lists',
  },
  myList: {
    id: 'myList',
  },
  search: {
    id: 'search',
  }
};

function createListAccessBtn(list) {
  return `<article class="List__Card wrapper">
            <div>${list.listName}<div>
          </article>`
}

function renderLists(myLists) {
  const listAccessbtns = myLists.map(list => createListAccessBtn(list))
  document.querySelector('.listsColection').innerHTML = listAccessbtns.join('\n');
}
renderLists([{listName: 'mi lista'}])


function createCard(item) {
  return ` <article class="Product__Card wrapper">
                <section class="product__img">
                  <img src="${item.image}" alt="${item.title}">
                </section>
                <section class="product__info">
                  <div class="product__text">
                    <h1>${item.title}</h1>
                    <h2>Category: ${item.category}</h2>
                    <p>${item.description}</p>
                  </div>
                  <div class="product__price">
                    <p><span>${item.price}</span>€</p>
                    <div id="${item.id} class="amount__buttos">
                      <span class="iconify sustract" data-icon="iconamoon:sign-minus-circle"></span>
                      <p class="amount">${item.image}</p>
                      <span class="iconify addBtn" data-icon="flat-color-icons:plus"></span>
                    </div>
                  </div>
                </section>
              </article>`
};

const setEventListeners = (containerId) => {
  document.querySelector(containerId).forEach(button => {
    availableProductList.find(product => product.id === button.id)
  })
}
  
const renderAvailableProducts = () => {} //leerá de variable availableProductList 

const setAvailableProductsList = (products) => {
  availableProductList = products;
}

function setVisibleSection(targetSectionId) {
  const sections = document.querySelectorAll('.section');

  sections.forEach(section => {
    if (section.id === targetSectionId) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  })
}
// setVisibleSection('form_registration') debe estar este
function showInitialPage() {
  document.querySelector('#logOut').classList.add('hidden');
  document.querySelector('.createListBtn').classList.add('hidden');
  setVisibleSection('form_registration')
}

function showListPage() {
  document.querySelector('#banner').classList.add('hidden');
  document.querySelector('#signUp').classList.add('hidden');
  document.querySelector('#signIn').classList.add('hidden');
  document.querySelector('.createListBtn').classList.remove('hidden');
  document.querySelector('#logOut').classList.remove('hidden');
  setVisibleSection('lists')
}

//events
document.querySelector('#logOut').addEventListener('click', () => {
  userSignOut();
  document.querySelector('#logOut').classList.add('hidden');
  document.querySelector('.createListBtn').classList.add('hidden');
  setVisibleSection('form_registration');
});
document.querySelector('.createListBtn').addEventListener('click', () => {
  document.querySelector('#banner').classList.add('hidden');
  document.querySelector('#signIn').classList.add('hidden');
  document.querySelector('#signUp').classList.add('hidden');
  setVisibleSection('lists');
});
// document.querySelector('.').addEventListener('click', () => {
//   setVisibleSection('myList');
// });
// document.querySelector('').addEventListener('click', () => {
//   document.querySelector('.arrow_up').classList.add('hidden');
//   setVisibleSection(targetSectionId);
// });