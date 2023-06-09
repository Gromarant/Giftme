let availableProductList = [];
let myLists = [
  {
    listName: 'Ropa de Verano',
    items: [
      {
        title: 'Pinguïno',
        price: 15,
        description: 'Un pingüinote',
        id: 87,
        image: '',
        quantity: 2,
        category: 'Animalotes'
      },
      {
        title: 'Jirafota',
        price: 15,
        description: 'Un jirafota',
        id: 87,
        image: '',
        quantity: 2,
        category: 'Animalotes'
      }
    ]
  },
  {
    listName: 'Ropa de invierno',
    items: [
      {
        title: 'Pinguïno',
        price: 15,
        description: 'Un pingüinote',
        id: 87,
        image: '',
        quantity: 2,
        category: 'Animalotes'
      }
    ]
  },
  {
    listName: 'Ropa de entretiempo',
    items: [
      {
        title: 'Pinguïno',
        price: 15,
        description: 'Un pingüinote',
        id: 87,
        image: '',
        quantity: 2,
        category: 'Animalotes'
      }
    ]
  },
  {
    listName: 'Ropa de baño',
    items: [
      {
        title: 'Pinguïno',
        price: 15,
        description: 'Un pingüinote',
        id: 87,
        image: '',
        quantity: 2,
        category: 'Animalotes'
      }
    ]
  }
];
let currentList = {};
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
let currentUserId;

//firebase configuración
//-----> FIREBASE_CONFIGURATION HERE


// //Inicialización de Firebase y variables
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
let curretUserId;

// //Registro de usuario
const userSignUp = async (email, password) => {
  cleanErrorMessage();

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      createUserDocument(user.email, user.uid);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
    userEmail.value = '';
    userPassword.value = '';
};

//Acceso a usuario registrado con correo
const userSignIn = async () => {
  const signInEmail = await userEmail.value;
  const signInPassword = await userPassword.value;
  auth.signInWithEmailAndPassword(signInEmail, signInPassword)
    .then(userCredential => {
      const user = userCredential.user;
      console.log(`Iniciaste sesión como: ${user.email} ID:${user.uid}`);
    })
    .catch(error => {
      console.log("Error iniciando sesión:", error.message);
    })
    userEmail.value = '';
    userPassword.value = '';
};

//Salida de la app
const userSignOut = async () => {
  let user = await firebase.auth().currentUser;

  firebase
    .auth()
    .signOut()
    .then(() => {
    console.log("hata Luego: " + user.email + "!!!")
    location.reload()
  })
  .catch((error) => {
    console.log("Error cerrando sesión: " + error);
  });
};

// -------------------User state
firebase.auth().onAuthStateChanged( user => {
  if (user) {
    setMyListsPage();
    currentUserId = user.uid;
  }
  else {
    console.error('No hay usuario activo');
  }
});

// --------------Datos de registro
const dataToSignUp = () => {

  const email = (userEmail.value ?? '').trim();
  const password = userPassword.value;
  const isValidData = formValidation(email, password);

  if (isValidData) {
    userSignUp(email, password)
  }
}

const setErrorMessage = (errorMessage) => {
  const errorMessageTag =  document.querySelector('.error_message');
  let messageError = `<span>Error:</span>` + errorMessage;
  errorMessageTag.innerHTML = messageError;
}

function cleanErrorMessage() {
  const errorMessageTag =  document.querySelector('.error_message');
  let messageError = '';
  errorMessageTag.innerHTML = messageError;
}

function formValidation(email, password) {

  let validated = true;
  const mailRegex = new RegExp(/^[a-z0-9._%+-]{1,64}@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/);
  const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
  let messageError = [];

  if(!email.match(mailRegex)) {
    validated = false;
    messageError.push('Campo correo:  ingresa una dirección de correo electrónico válida ejempo: ejemplo123@gmail.com');
    document.querySelector('.input__container').focus();
  }
  if(!password.match(passwordRegex)) {
    validated = false;
    messageError.push('Campo contraseña: La contraseña debe tener al menos 8 caracteres de longitud y contener al menos una letra mayúscula, una letra minúscula, un dígito y un carácter especial.');
    document.querySelector('.input__container').focus();
  }
  if (!validated) {
    setErrorMessage( messageError.join(' ') )
  }
  return validated;
}

 //-------------------Request
const getProductsByCategory = async(category) => {
  try {
    return fetch(`https://fakestoreapi.com/products/category/${category}`)
    .then(res => res.json())
  }
  catch(error) {
    console.error(error);
  }
}

function createListAccessBtn(list) {
  const listName = document.createElement('p');
  listName.className = 'list__name';
  listName.innerHTML = list.listName

  const listBntCard = document.createElement('article');
  listBntCard.className = 'List__Card wrapper';
  listBntCard.addEventListener('click', () => {
    setCurrentList(list);
    setMyListPage();
  });

  listBntCard.appendChild(listName);

  return listBntCard;
}

function renderLists(myLists) {
  const listCollection = document.querySelector('.listsColection');
  listCollection.innerHTML = '';
  const listAccessbtns = myLists.map(list => createListAccessBtn(list));
  listAccessbtns.forEach(listElement => listCollection.appendChild(listElement));
}

//Create cards
function createCard(item) {
  //seccion image
  const sectionImg = document.createElement('section');
  sectionImg.className = 'product__img';
  const img = document.createElement('img');
  img.src = item.image;
  sectionImg.appendChild(img);

  //product info
  const sectionProductInfo = document.createElement('section');
  sectionProductInfo.className = 'product__info';
  
  const divProduct = document.createElement('div');
  divProduct.className = 'product__text';
  const titleProduct = document.createElement('h1');
  titleProduct.innerHTML = item.title;
  const categoryProduct = document.createElement('h2');
  categoryProduct.innerHTML = 'Category: ' + item.category;
  const descripProduct = document.createElement('p');
  descripProduct.innerHTML = item.description;
  
  // price
  const divPrice = document.createElement('div');
  divPrice.className = 'product__price';

  const price = document.createElement('p');
  price.innerHTML = item.price + ' €';
  price.className = 'span__price';
  
  //quantity
  const quantity = document.createElement('div');
  quantity.className = 'quantity__buttons';

  //quantity__Buttons
  const spanMenus = document.createElement('span');
  spanMenus.className = 'iconify sustract';
  spanMenus.setAttribute('data-icon', 'iconamoon:sign-minus-circle');
  
  spanMenus.addEventListener('click', () => console.log('quitar uno'))

  const quantityP = document.createElement('p');
  quantityP.className = 'quantity';
  quantityP.innerHTML = item.quantity;

  const spanAdd = document.createElement('span');
  spanAdd.className = 'iconify addBtn';
  spanAdd.setAttribute('data-icon', 'flat-color-icons:plus');

  spanAdd.addEventListener('click', () => console.log('sumar uno'));
  
  
  divProduct.appendChild(titleProduct);
  divProduct.appendChild(categoryProduct);
  divProduct.appendChild(descripProduct);
  sectionProductInfo.appendChild(divProduct);
  sectionProductInfo.appendChild(divPrice);

  divPrice.appendChild(price);
  divPrice.appendChild(quantity);
 
  quantity.appendChild(spanMenus);
  quantity.appendChild(quantityP);
  quantity.appendChild(spanAdd);

  // Cardwrapper
  const wrapper = document.createElement('article');
  wrapper.className = 'Product__Card wrapper';
  wrapper.appendChild(sectionImg);
  wrapper.appendChild(sectionProductInfo);

  return wrapper
};

//actualiza la variable con los productos filtrados
const setAvailableProductsList = (products) => {
  availableProductList = products;
}

function setCurrentList(list) {
  currentList = list;
}

function getCards(items) {
  return items.map(item => createCard(item));
}

function renderListItems(list) {
  const itemsContainer = document.querySelector('#myListItems');
  itemsContainer.innerHTML = '';
  getCards(list.items).forEach(card => itemsContainer.appendChild(card));
}

const renderAvailableProducts = (availableProducts) => {
  const availableContainer = document.querySelector('#available__container');
  availableContainer.innerHTML = '';
  getCards(availableProducts).forEach(card => availableContainer.appendChild(card));
};

async function updateMyLists() {
  try {

    let data = await getUserData(currentDocId)
    let lists = await data
  }
  catch(error) {
    console.error("Error creando el documento del usuario: ", error)
  }
}

function saveNewList(list) {
  myLists.push(list);
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

function showInitialPage() {
  hideElements(['#logOut', '.createListBtn', '.myListSearchBtn', '.goToListsBtn', '#lists', '#newList', '#myList', '#search'])
  displayElements(['#banner', '#form_registration']);
}

function setNewListPage() {
  document.querySelector('#newListName').value = '';
  hideElements(['#banner', '#signUp','#signIn', '#myList', '.myListSearchBtn', '#lists', '.createListBtn'])
  displayElements(['#newList', '#logOut'])
}

function setMyListPage() {
  document.querySelector('#myList__title').innerHTML = 'Lista: ' + currentList.listName;
  renderListItems(currentList);
  hideElements(['#banner', '#signUp','#signIn', '.myListSearchBtn', '#newList', '.createListBtn', '#lists'])
  displayElements(['#myList', '#logOut', '#goToSearchProductsBtn'])
}

function setMyListsPage() {
  hideElements(['#banner', '#form_registration', '#signUp', '#signIn', '#myList', '#newList'])
  displayElements(['#lists', '#logOut', '.createListBtn'])
  renderLists(myLists)
}

function setSearchPage() {
  hideElements(['.createListBtn', '#myList', '#newList'])
  displayElements(['#search','.myListSearchBtn', '#logOut', '.goToListsBtn'])
}

function hideElements(selectors) {
  selectors.forEach(selector => document.querySelector(selector).classList.add('hidden'));
}
function displayElements(selectors) {
  selectors.forEach(selector => document.querySelector(selector).classList.remove('hidden'));
}

async function displayProducts(category) {
  const products = await getProductsByCategory(category);
  renderAvailableProducts(products);
}

document.querySelector('#logOut').addEventListener('click', () => {
  userSignOut();
  showInitialPage();
});
document.querySelector('.createListBtn').addEventListener('click', setNewListPage);
document.querySelector('.goToListsBtn').addEventListener('click', setMyListPage);
document.querySelector('#goToSearchProductsBtn').addEventListener('click', setSearchPage);
document.querySelector('#electronicsBtn').addEventListener('click', async() => displayProducts('electronics'))
document.querySelector('#jeweleryBtn').addEventListener('click', async() => displayProducts('jewelery'));
document.querySelector('#mensClothingBtn').addEventListener('click', async() => displayProducts("men's clothing"));
document.querySelector('#womensClothingBtn').addEventListener('click', async() => displayProducts("women's clothing"));
document.querySelector('#signIn').addEventListener('click', userSignIn);
document.querySelector('#logOut').addEventListener('click', userSignOut);
document.querySelector('#signUp').addEventListener('click', dataToSignUp);
document.querySelectorAll('.backToMyLists').forEach(button => button.addEventListener('click', setMyListsPage));
document.querySelector('#saveNewListButton').addEventListener('click', () => {
  const newListName = document.querySelector('#newListName').value;
  const newList = {
    listName: newListName,
    items: [],
  };

  saveNewList(newList);
  setMyListsPage();
});

showInitialPage();
