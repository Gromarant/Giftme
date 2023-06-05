//firebase configuración
//-----> FIREBASE_CONFIGURATION HERE


//Inicialización de Firebase y variables
firebase.initializeApp(firebaseConfig);
const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
const auth = firebase.auth();
const db = firebase.firestore();


// //Registro de usuario ------------------------------
const userSignUp = async (email, password) => {
  cleanErrorMessage();

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      createUserDocument(user.email, user.email);
      createDocRef(user.uid);
      saveCurrentUserId(user.uid);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage);
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
const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithRedirect(provider);
  firebase.auth()
  .getRedirectResult()
  .then(result => {
    if (result.credential) {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;
      const token = credential.accessToken;
      const user = result.user;
    }
  })
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

//Estado de usuario
firebase
  .auth()
  .onAuthStateChanged(function (user) {
  if (user) {
    console.log('Existe el usuario');
    console.log(user.email);
  } 
  else {
    console.log('No hay usuario activo');
  }
});

// //-------------------C.R.U.D-------------------------
const usersRef = db.collection('users');

// obtener id de un registro/user   *****funciona
const getDocumentId = (userId) => {

  db.collection('users').where('id', '==', userId)
    .get()
    .then( querySnapshot => {
      querySnapshot.forEach((doc) => console.log('document_id', doc.id));
  })
}
let docId = getDocumentId('vauUj4ghIlZWixIZaIU0VLxWnMz2');


//------------accede a el array de listas, datos en tiempo real ***** 
//lee una propiedad particular-----> listas
const getCurrentData = async(docId, prop) => {

  let data = await usersRef.doc(docId)
    .onSnapshot((doc) => `${doc.data()}.${prop}`);
  return data;
}
getCurrentData("FOR5QDG8FqLU71BG55Ou", 'lists');


//Actualiza datos de un usuario
const updateUser = async(docId, newData) => {
  let user = await usersRef.doc(docId);

  return user.update(newData)
  .then(() => {
      console.log("Document successfully updated!");
  })
  .catch((error) => {
      console.error("Error updating document: ", error);
  });
}


function saveCurrentUserId(user) {
  localStorage.setItem('currentUser', JSON.stringify(user.uid));
};

function getCurrentUserId() {
  return JSON.parse(localStorage.getItem('currentUser'));
};


//-------------------funciones auxiliares-------------------------
//Datos de registro
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




//Events
document.querySelector('#signIn').addEventListener('click', userSignIn);
document.querySelector('#logOut').addEventListener('click', userSignOut);
document.querySelector('#googleLabelBtn').addEventListener('click', signInWithGoogle);
document.querySelector('#signUp').addEventListener('click', dataToSignUp);