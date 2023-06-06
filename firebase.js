//firebase configuración
//-----> FIREBASE_CONFIGURATION HERE
const firebaseConfig = {
  apiKey: "AIzaSyDtBWEVL3Wx5TgeZO71wRxwRrwzmwOn614",
  authDomain: "giftme-9137e.firebaseapp.com",
  projectId: "giftme-9137e",
  storageBucket: "giftme-9137e.appspot.com",
  messagingSenderId: "566433645364",
  appId: "1:566433645364:web:de644895b8732101f91b61"
};

// //Inicialización de Firebase y variables
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
// let curretUserId;

// // //Registro de usuario ------------------------------
// const userSignUp = async (email, password) => {
//   cleanErrorMessage();

//   auth
//     .createUserWithEmailAndPassword(email, password)
//     .then(userCredential => {
//       let user = userCredential.user;
//       console.log(`se ha registrado ${user.email} ID:${user.uid}`)
//       createUserDocument(user.email);
//       createDocRef(user.uid);
//       curretUserId = user.uid;
//     })
//     .catch((error) => {
//       let errorCode = error.code;
//       let errorMessage = error.message;
//       console.log(errorCode, errorMessage);
//     });
//     userEmail.value = '';
//     userPassword.value = '';
// };

// //Acceso a usuario registrado con correo
// const userSignIn = async () => {
//   const signInEmail = await userEmail.value;
//   const signInPassword = await userPassword.value;
//   auth.signInWithEmailAndPassword(signInEmail, signInPassword)
//     .then(userCredential => {
//       const user = userCredential.user;
//       console.log(`Iniciaste sesión como: ${user.email} ID:${user.uid}`);
//     })
//     .catch(error => {
//       console.log("Error iniciando sesión:", error.message);
//     })
//     userEmail.value = '';
//     userPassword.value = '';
// };

// //Registro/acceso con Google
// const signInWithGoogle = () => {
//   const provider = new firebase.auth.GoogleAuthProvider();

//   firebase.auth().signInWithRedirect(provider);
//   firebase.auth()
//   .getRedirectResult()
//   .then(result => {
//     if (result.credential) {
//       /** @type {firebase.auth.OAuthCredential} */
//       const credential = result.credential;
//       const token = credential.accessToken;
//       const user = result.user;
//     }
//   })
//   .catch(error => {
//     let errorCode = error.code;
//     let errorMessage = error.message;
//     let email = error.email;
//     let credential = error.credential;
//     console.log("Error al ingresar: ", errorCode, errorMessage);
//     console.log("Error usuario o contraseña: ", email, credential);
//   });
// }

// //Salida de la app
// const userSignOut = async () => {
//   let user = await firebase.auth().currentUser;

//   firebase
//     .auth()
//     .signOut()
//     .then(() => {
//     console.log("hata Luego: " + user.email + "!!!")
//     location.reload()
//   })
//   .catch((error) => {
//     console.log("Error cerrando sesión: " + error);
//   });
// };

// //Estado de usuario
// firebase
//   .auth()
//   .onAuthStateChanged(function (user) {
//   if (user) {
//     console.log('Existe el usuario');
//     console.log(user.email);
      //  curretUserId = user.uid;
//   } 
//   else {
//     console.log('No hay usuario activo');
//   }
// });

// //-------------------C.R.U.D-------------------------

const usersRef = db.collection('users');

// obtener id de un registro/user   *****funciona
function getDocumentId(userId) {

  usersRef.where('id', '==', userId)
    .get()
    .then( querySnapshot => {
      querySnapshot.forEach((doc) => doc.id);
  });
};

// let docId = getDocumentId( curretUserId ); //declaración docId

// //-------------------CREATE
function createUserDocument(email) {
  
  db.collection('users')
    .doc()
    .add( {
      userName: name,
      imgUrl: '',
      wallet: 10,
      lists: []
    })
    .then(user => userId = user.id)
    .catch(error => console.error("Error creando el documento del usuario: ", error))
};
// createUserDocument('lotopisflor_2@hotmail.com')

// updateUser('FOR5QDG8FqLU71BG55Ou', { wallet: 50 })

function createList(name, items=[]) {
  return {
    listName: name,
    items,
  }
}

function createItem(itemProp) {
  let {itemName, id, imageUrl, price, description, type, address} = itemProp;

  return {
    itemName,
    id,
    imageUrl,
    price,
    description,
    type,
    address,
  }
}


// //-------------------READ
//------------accede a el array de listas, datos en tiempo real ***** 
//lee una propiedad particular-----> listas

async function getCurrentDataLists(docId, prop) {

  let data = await usersRef.doc(docId)
    .onSnapshot((doc) => `${doc.data()}.${prop}`);
  return data;
}
// getCurrentData("FOR5QDG8FqLU71BG55Ou", 'lists'); 

async function getCurrentDataUser(docId, prop) {

  let data = await usersRef.doc(docId)
    .onSnapshot((doc) => doc.data());
  return data;
}; //return a promise 


// //------------------------Update
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
// updateUserProps('FOR5QDG8FqLU71BG55Ou', { userName: "Marian" })
// updateUserProps('FOR5QDG8FqLU71BG55Ou', { userName: 2500 })
// updateUser('FOR5QDG8FqLU71BG55Ou', createList('Quiero')) ---> crea una lista

async function updateList(docId, dataObj) {
  try {
    
    let user = await usersRef.doc(docId);
  
    await user.update(dataObj)
    console.log("Se ha modificado con éxito");
  }
  catch(error) {
      console.error("Error al editar: ", error);
  };
};
updateList('jq7t6tvho3ZjtupwEyga', { listName: 'Lo deseo'})

// //-------------------READ
// async function DeleteUser(docId) {
//   let user = await usersRef.doc(docId);


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

// agregar y pintar elementos en tiempo real
// function ReadAndPrint(prop) {
//   let userId = getCurrentUserId()
//   let property = createDocPropertysRef(userId, prop)

//   db.collection('users').Snapshot( querySnapshot => {
//     querySnapshot.forEach(doc => {
//       console.log(doc.data());
//     });
//   });
// }

//-------------------funciones auxiliares-------------------------
//Datos de registro
// const dataToSignUp = () => {

//   const email = (userEmail.value ?? '').trim();
//   const password = userPassword.value;
//   const isValidData = formValidation(email, password);

//   if (isValidData) {
//     userSignUp(email, password)
//   }
// }

// const setErrorMessage = (errorMessage) => {
//   const errorMessageTag =  document.querySelector('.error_message');
//   let messageError = `<span>Error:</span>` + errorMessage;
//   errorMessageTag.innerHTML = messageError;
// }

// function cleanErrorMessage() {
//   const errorMessageTag =  document.querySelector('.error_message');
//   let messageError = '';
//   errorMessageTag.innerHTML = messageError;
// }

// function formValidation(email, password) {

//   let validated = true;
//   const mailRegex = new RegExp(/^[a-z0-9._%+-]{1,64}@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/);
//   const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
//   let messageError = [];

//   if(!email.match(mailRegex)) {
//     validated = false;
//     messageError.push('Campo correo:  ingresa una dirección de correo electrónico válida ejempo: ejemplo123@gmail.com');
//     document.querySelector('.input__container').focus();
//   }
//   if(!password.match(passwordRegex)) {
//     validated = false;
//     messageError.push('Campo contraseña: La contraseña debe tener al menos 8 caracteres de longitud y contener al menos una letra mayúscula, una letra minúscula, un dígito y un carácter especial.');
//     document.querySelector('.input__container').focus();
//   }
//   if (!validated) {
//     setErrorMessage( messageError.join(' ') )
//   }
//   return validated;
// }




// //Events
// document.querySelector('#signIn').addEventListener('click', userSignIn);
// document.querySelector('#logOut').addEventListener('click', userSignOut);
// document.querySelector('#googleLabelBtn').addEventListener('click', signInWithGoogle);
// document.querySelector('#signUp').addEventListener('click', dataToSignUp);