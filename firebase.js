//firebase configuración
//-----> FIREBASE_CONFIGURATION HERE
const firebaseConfig = {
  apiKey: "AIzaSyBAF84mZM38GNZjZ4hdE-28FnHDM77F5rg",
  authDomain: "quizeax2.firebaseapp.com",
  projectId: "quizeax2",
  storageBucket: "quizeax2.appspot.com",
  messagingSenderId: "397962594102",
  appId: "1:397962594102:web:5740a7404606e1bcd01597"
};


//Inicialización de Firebase y variables
firebase.initializeApp(firebaseConfig);
const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
const auth = firebase.auth();
const db = firebase.firestore();
let docRef;

// query para acceder a una referencia
const createDocRef = (id) => docRef = db.doc(`users/${id}`);

const readOneUser = (id) => {
  
  db.collection('users')
    .doc(id)
    .get()
    .then( user => console.log(user.data().userName))
    .catch(error => {
      console.log("Error getting contacts:", error);
    });
};
readOneUser(docRef);

function readOne(id) {
  db.collection('users')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        printPhoto(doc.data().title, doc.data().url, doc.id);
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
};
// contactList.forEach(contact => {
//     printContact(contact.id, contact.data().name, contact.data().email, contact.data().message, contact.data().image);
// })
//Registro de usuario ------------------------------
const userSignUp = async (email, password) => {
  cleanErrorMessage();

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      createUserDocument(user.uid, user.email);
      createDocRef(user.uid);
      saveUser(user.uid);
    })
    .catch((error) => {
      let errorCode = error.code;
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
      console.log(`your have login as ${user.email} ID:${user.uid}`);
    })
    .catch(error => {
      console.log("Error login:", error.message);
    })
};

//Registro/acceso con Google
const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithRedirect(provider);
  firebase.auth()
  .getRedirectResult()
  .then((result) => {
    if (result.credential) {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;
      const token = credential.accessToken;
      const user = result.user;
      // saveUser(user);
    }
  })
  .catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;
    let email = error.email;
    let credential = error.credential;
  });
}

//Salida de la app
const userSignOut = async () => {
  let user = await firebase.auth().currentUser;

  firebase.auth().signOut().then(() => {
    console.log("GoodBye: " + user.email)
    locationbar.reload()
  }).catch((error) => {
    console.log("Error with log out: " + error);
  });
};

//Estado de usuario
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // navigateToHome();
  } 
  else {
    console.log('user');
  }
});



//-------------------C.R.U.D-------------------------

const saveUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user.uid));
const getUser = () => JSON.parse(localStorage.getItem('currentUser'));

const createItem = (itemProp) => {
  let item = {
    itemName,
    id,
    imageUrl,
    price,
    description,
    type,
    address,
  }
  return item;
}

const createList = (listProp) => {
  let list =  {
    listName: '',
    items: [],
  }
  return list;
}

const createUserDocument = (id, name) => {
  db.collection('users')
    .add( {
      id: id,
      userName: name,
      imgUrl: '',
      wallet: 10,
      lists: []
    })
    .then(user => user.id)
    .catch(error => console.error("Error adding document: ", error))
}


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
// document.querySelector('#logOut').addEventListener('click', userSignOut);
document.querySelector('#googleBtn').addEventListener('click', signInWithGoogle);
document.querySelector('#signUp').addEventListener('click', dataToSignUp);