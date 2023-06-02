//firebase configuración
//-----> FIREBASE_CONFIGURATION HERE

//Inicialización de Firebase y variables
firebase.initializeApp(firebaseConfig);
// const userEmail = document.querySelector('#email');
// const userPassword = document.querySelector('#password');
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
      initializeUserDocument(user);
      saveUser(user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("System error:" +  errorCode + ' ' + errorMessage);
    });
};
      
const saveUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user.uid));
const getUser = () => JSON.parse(localStorage.getItem('currentUser'));



//Datos de registro
const dataToSignUp = (e) => {
  e.preventDefault();
  let email = e.target.elements.email.value;
  let password = e.target.elements.password.value;

  password ? userSignUp(email, password) : alert("error password");
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
    navigateToHome();
  } 
  else {
    console.log('user');
  }
});