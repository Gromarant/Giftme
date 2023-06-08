let availableProductList = [];
let myLists = [];
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



showInitialPage();

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

// //-------------------User state
firebase.auth().onAuthStateChanged( user => {
  if (user) {
    showListPage();
    currentUserId = user.uid;
    currentDocId = getDocId(user.uid);
  }
  else {
    console.error('No hay usuario activo');
  }
});

// //--------------Datos de registro
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

// //-------------------Request
const getfakestoreData = async(category) => {
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

  listBntCard.appendChild(listName);

  return listBntCard;
}

function renderLists(myLists) {
  const listCollection = document.querySelector('.listsColection');
  const listAccessbtns = myLists.map(list => createListAccessBtn(list));
  listAccessbtns.forEach(listElement => listCollection.appendChild(listElement));
}
// renderLists([{listName: 'Ropa de Verano'}, {listName: 'Ropa de Verano'}, {listName: 'Ropa de Verano'}, {listName: 'Ropa de Verano'}])


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
  
  spanMenus.addEventListener('click', console.log('quitar uno'))

  const quantityP = document.createElement('p');
  quantityP.className = 'quantity';
  quantityP.innerHTML = item.quantity;

  const spanAdd = document.createElement('span');
  spanAdd.className = 'iconify addBtn';
  spanAdd.setAttribute('data-icon', 'flat-color-icons:plus');

  spanAdd.addEventListener('click', console.log('sumar uno'))
  
  
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

const renderAvailableProducts = (availableProducts) => {
  availableProductList.map((item, i) => {
    let card = createCard(item)
    document.querySelector('#available__container').appendChild(card);
  })
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

function showListPage() {
  document.querySelector('.list__title').innerHTML = 'Mis listas:';
  document.querySelector('#banner').classList.add('hidden');
  document.querySelector('#signUp').classList.add('hidden');
  document.querySelector('#signIn').classList.add('hidden');
  document.querySelector('.myListSearchBtn').classList.add('hidden');
  document.querySelector('.goToListsBtn').classList.add('hidden');
  document.querySelector('.createListBtn').classList.remove('hidden');
  document.querySelector('#logOut').classList.remove('hidden');
  renderLists(myLists);
  setVisibleSection('lists')
}

function myListPage() {
  document.querySelector('.myListSearchBtn').classList.remove('hidden');
  document.querySelector('.goToListsBtn').classList.remove('hidden');
  renderLists(myLists)
  setVisibleSection('myList');
}

function searchPage() {
  document.querySelector('.createListBtn').classList.add('hidden');
  document.querySelector('.myListSearchBtn').classList.remove('hidden');
  document.querySelector('.goToListsBtn').classList.remove('hidden');
  setVisibleSection('search');
}

const handleChangelistName = async(e) => {
  e.preventDefault();
  try {
    let oldTitle = document.querySelector('.myList__title').textContent;
    const inputListName = document.querySelector('.input__newName');
    if (inputListName.value) {
      let newList = createList(inputListName.value, items=[]);
      if (myLists.indexOf(inputListName.value) === -1) {
        updateArrays('lists', newList);
        myLists.push(newList);
        renderLists(myLists);
      }
      else {
        myLists.replace(oldTitle, newList);
      }
      inputListName.value = '';
    };
  }
  catch(error) {
    console.error(error);
  };
};

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

function showInitialPage() {
  document.querySelector('#logOut').classList.add('hidden');
  document.querySelector('.createListBtn').classList.add('hidden');
  document.querySelector('.myListSearchBtn').classList.add('hidden');
  document.querySelector('.goToListsBtn').classList.add('hidden');
  setVisibleSection('form_registration')
}

//events
document.querySelector('#logOut').addEventListener('click', () => {
  userSignOut();
  document.querySelector('#logOut').classList.add('hidden');
  document.querySelector('.createListBtn').classList.add('hidden');
  setVisibleSection('form_registration');
});

document.querySelector('.createListBtn').addEventListener('click', () => {
  let ListName = document.querySelector('.myList__title').textContent;
  let newList = createList(ListName, items=[]);
  let thereIsMoreWithThatName = myLists.some(list => list === newList);
  if (!thereIsMoreWithThatName) {
    myLists.push(newList);
    renderLists(myLists);
  }
  showListPage();
});

document.querySelector('.goToListsBtn').addEventListener('click', showListPage);

document.querySelector('.list__name').addEventListener('click', () => {

  let currentList = document.querySelector('.list__name');
  updateArrays({ listName: currentList.textContent});
  document.querySelector('#form__newListName').classList.add('hidden');
  document.querySelector('.myList__title').innerHTML = currentList.textContent ?? 'Nueva lista';
  myListPage();
});

document.querySelector('.myListSearchBtn').addEventListener('click', searchPage);

document.querySelector('.createListBtn').addEventListener('click', () => {
  document.querySelector('.myList__title').innerHTML = 'Nueva Lista';
  myListPage();
});

document.querySelector('#electronicsBtn').addEventListener('click', async() => {
  try {
    let data = await getfakestoreData('electronics')
    setAvailableProductsList(data)
    renderAvailableProducts(data);
  }
  catch(error) {
    console.error(error);
  }
});

document.querySelector('#jeweleryBtn').addEventListener('click', async() => {
  try {
    let data = await getfakestoreData('jewelery')
    setAvailableProductsList(data)
    renderAvailableProducts(data);
  }
  catch(error) {
    console.error(error);
  }
});

document.querySelector('#mensClothingBtn').addEventListener('click', async() => {
  try {
    let data = await getfakestoreData("men's clothing")
    setAvailableProductsList(data)
    renderAvailableProducts(data);
  }
  catch(error) {
    console.error(error);
  }
});

document.querySelector('#womensClothingBtn').addEventListener('click', async() => {
  try {
    let data = await getfakestoreData("women's clothing")
    setAvailableProductsList(data)
    renderAvailableProducts(data);
  }
  catch(error) {
    console.error(error);
  }
});
// document.querySelector('#jeweleryBtn').addEventListener('click', );
// document.querySelector('#mensClothingBtn').addEventListener('click', );
// document.querySelector('#womensClothingBtn').addEventListener('click', );
document.querySelector('#form__newListName').addEventListener('submit', handleChangelistName);
document.querySelector('#signIn').addEventListener('click', userSignIn);
document.querySelector('#logOut').addEventListener('click', userSignOut);
document.querySelector('#signUp').addEventListener('click', dataToSignUp);