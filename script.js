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
let currentDocId;

const setVisibleSection = (targetSectionId) => {
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

const showInitialPage = () => {
  document.querySelector('#logOut').classList.add('hidden');
  document.querySelector('.createListBtn').classList.add('hidden');
  document.querySelector('.myListSearchBtn').classList.add('hidden');
  document.querySelector('.goToListsBtn').classList.add('hidden');
  setVisibleSection('form_registration')
}
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

//Registro/acceso con Google
const createUserDocumentWithGoogle = () => {
  firebase.auth().getRedirectResult()
  .then(result => {

    if (result.credential) {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;
      const token = credential.accessToken;
      const user = result.user;
      createUserDocument(user.displayName, user.uid, user.photoURL);
    }
  })
}

const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithRedirect(provider)
  .then(result => result)
  .catch(error => {
    let errorCode = error.code;
    let errorMessage = error.message;
    let email = error.email;
    let credential = error.credential;
    console.log("Error al ingresar: ", errorCode, errorMessage);
    console.log("Error usuario o contraseña: ", email, credential);
  });
}

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


// -------------------C.R.U.D
const usersRef = db.collection('users');

// obtener id de un registro/user
function getDocId(userId) {
  usersRef.where('id', '==', userId)
    .get()
    .then( querySnapshot => {
      querySnapshot.forEach((doc) => doc.id);
  });
};



// //-------------------CREATE
function createUserDocument(email, id, image='') {
  try {

    db.collection('users')
      .add( {
        id,
        userName: email,
        imgUrl: image,
        wallet: 10,
        lists: []
      })
  }
  catch(error) {
    console.error("Error creando el documento del usuario: ", error)
  }
};

function setNewList() {
  db.collection('users').where("userId", "==", currentUserId)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    });
  })
  .catch((error) => {
      console.error("Error getting documents: ", error);
  });
};


function createList(name, items=[]) {
  return {
    listName: name,
    items,
  }
}

function createItem(itemProp) {
  let {itemName, id, imageUrl, price, description, type, quantity} = itemProp;

  return {
    itemName,
    id,
    imageUrl,
    price,
    description,
    type,
    quantity,
  }
}

// //-------------------READ
//lee una propiedad particular
async function getEspecificDataUser(idUser, paramName, param) {

  await usersRef.where("userId", "==", idUser)
    .where(paramName, "==", param)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().paramName);
      })
    })
}; 

async function getUserData() {

  await usersRef
    .doc(currentDocId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data();
      }
    }).catch((error) => {
      console.error("Error getting document:", error);
    });
}; 


  
// //--------------------Update
//Actualiza datos de un usuario
async function updateUserProps(docId, newData) {
  try {
    let user = await usersRef.doc(docId);
  
    await user.update(newData)
    console.log("Los datos se han modificado con éxito");
  }
  catch(error) {
      console.error("Error al editar: ", error);
  };
}

async function updateList(docId, dataObj) {
  try {
    let user = await usersRef.doc(docId);
    await user.lists.update(dataObj)
    alert("Se ha modificado con éxito");
  }
  catch(error) {
    console.error("Error al editar: ", error);
  };
};

// //-------------------DELETE
async function DeleteUser(docId) {
  try {
    let user = await usersRef.doc(docId); 
    await user.delete();
    console.log(`Se ha borrado con éxito el usuario con id: ${docId}`);
  } 
  catch (error) {
    console.error("Error al borrar:", error);
  }
}

async function DeleteList(docId, propName) {
  try {
    await usersRef.doc(docId)
      .update({
      propName: firebase.firestore.FieldValue.delete()
    })
  }
  catch(error) {
    console.error("Error al borrar:", error);
  }
}

// //-------------------User state
firebase.auth().onAuthStateChanged( user => {
  if (user) {
    showListPage();
    currentUserId = user.uid;
    currentDocId = getDocId(currentUserId);
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
// getfakestoreData('electronics')


function createListAccessBtn(list) {
  return `<article class="List__Card wrapper">
            <p class="list__name">${list.listName}<p>
          </article>`
}

function renderLists(myLists) {
  const listAccessbtns = myLists.map(list => createListAccessBtn(list))
  document.querySelector('.listsColection').innerHTML = listAccessbtns.join('\n');
}
renderLists([{listName: 'Ropa de Verano'}])


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

//actualiza la variable con los productos filtrados
const setAvailableProductsList = (products) => {
  availableProductList = products;
}

// const renderAvailableProducts = () => {} //leerá de variable availableProductList 

function showListPage() {
  document.querySelector('.list__title').innerHTML = 'Mis listas:';
  document.querySelector('#banner').classList.add('hidden');
  document.querySelector('#signUp').classList.add('hidden');
  document.querySelector('#signIn').classList.add('hidden');
  document.querySelector('.myListSearchBtn').classList.add('hidden');
  document.querySelector('.goToListsBtn').classList.add('hidden');
  document.querySelector('.createListBtn').classList.remove('hidden');
  document.querySelector('#logOut').classList.remove('hidden');
  setVisibleSection('lists')
}

function myListPage() {
  document.querySelector('.createListBtn').classList.add('hidden');
  document.querySelector('.myListSearchBtn').classList.remove('hidden');
  document.querySelector('.goToListsBtn').classList.remove('hidden');
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
    const inputListName = document.querySelector('.input__newName');
    if (inputListName.value) {
      await getUserData().then(data => {
        
        let newList = createList(data, items=[]);
        myLists.push(newList);
        
        myLists.forEach(list => updateList(currentDocId, list))
        document.querySelector('.myList__title').innerHTML = data;
        inputListName.value = '';
      });
    };
  }
  catch(error) {
    console.log(error);
  };
};


//events
document.querySelector('#logOut').addEventListener('click', () => {
  userSignOut();
  document.querySelector('#logOut').classList.add('hidden');
  document.querySelector('.createListBtn').classList.add('hidden');
  setVisibleSection('form_registration');
});
document.querySelector('.createListBtn').addEventListener('click', showListPage);

document.querySelector('.goToListsBtn').addEventListener('click', showListPage);

document.querySelector('.list__name').addEventListener('click', () => {
  document.querySelector('.myList__title').innerHTML = '';
  let currentList = document.querySelector('.list__name');
  updateList( currentDocId, { listName: currentList.textContent});
  document.querySelector('#form__newListName').classList.add('hidden');
  document.querySelector('.myList__title').innerHTML = currentList.textContent;
  myListPage();
});

document.querySelector('.myListSearchBtn').addEventListener('click', searchPage);

document.querySelector('.createListBtn').addEventListener('click', () => {
  document.querySelector('.myList__title').innerHTML = 'Nueva Lista';
  myListPage();
});

document.querySelector('#form__newListName').addEventListener('submit', handleChangelistName);
document.querySelector('#signIn').addEventListener('click', userSignIn);
document.querySelector('#logOut').addEventListener('click', userSignOut);
document.querySelector('#googleBtn').addEventListener('click', signInWithGoogle);
document.querySelector('#signUp').addEventListener('click', dataToSignUp);