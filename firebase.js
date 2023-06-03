//firebase configuración
//-----> FIREBASE_CONFIGURATION HERE


//Inicialización de Firebase y variables
firebase.initializeApp(firebaseConfig);
const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
const auth = firebase.auth();
const db = firebase.firestore();

// query para acceder a una referencia
const usersRef = db.collection("users");

//Registro de usuario ------------------------------
const userSignUp = async (email, password) => {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      // initializeUserDocument(user);----> Creación de documento usuario firestore
      saveUser(user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("System error:" +  errorCode + ' ' + errorMessage);
    });
    userEmail.value = '';
    userPassword.value = '';
};

//Datos de registro
const dataToSignUp = (e) => {
  e.preventDefault();

  password ? userSignUp(userEmail.value, userPassword.value) : alert("error password");
}

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
      saveUser(user);
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

const saveUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user.uid));
const getUser = () => JSON.parse(localStorage.getItem('currentUser'));

//Events
document.querySelector('#signIn').addEventListener('click', userSignIn);
// document.querySelector('#logOut').addEventListener('click', userSignOut);
// document.querySelector('#play').addEventListener('click', navigateToQuiz);
document.querySelector('#googleBtn').addEventListener('click', signInWithGoogle);
document.querySelector('#signUp').addEventListener('click', dataToSignUp);