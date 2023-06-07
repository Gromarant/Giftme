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

// getfakestoreData('electronics')

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
setVisibleSection('form_registration')
//Events
document.querySelector('#electronicsBtn').addEventListener('click', () => {
  getfakestoreData('electronics').then(products => setAvailableProductsList(products))
});
document.querySelector('#jeweleryBtn').addEventListener('click', () => {
  getfakestoreData('jewelery').then(products => setAvailableProductsList(products))
});
document.querySelector('#mensClothingBtn').addEventListener('click', () => {
  getfakestoreData("men's clothing").then(products => setAvailableProductsList(products))
});
document.querySelector('#womensClothingBtn').addEventListener('click', () => {
  getfakestoreData("women's clothing").then(products => setAvailableProductsList(products))
});
document.querySelector('#eventsBtn').addEventListener('click', () => {
  getfakestoreData("women's clothing").then(products => setAvailableProductsList(products))
});

document.querySelector('').addEventListener('click', () => {
  setVisibleSection('form_registration');
});

document.querySelector('.tryAgainBtn').addEventListener('click', () => {
  setVisibleSection('lists');
});

document.querySelector('.homeBtn').addEventListener('click', () => {
  setVisibleSection('myList');
});
document.querySelector('search').addEventListener('click', () => {
  document.querySelector('.arrow_up').classList.add('hidden');
  setVisibleSection(targetSectionId);
});   