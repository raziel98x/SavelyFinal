//Logowanie
function LogIn() {
  var userSIEmail = document.getElementById("userSIEmail").value;
  var userSIPassword = document.getElementById("userSIPassword").value;
  
  firebase
    .auth()
    .signInWithEmailAndPassword(userSIEmail, userSIPassword)
    .then((value) => {
      //Logowanie poszło pomyslnie
      window.location.replace("/main/main.html");
    })
    .catch((error) => {
      // Error podczas logowania
      alert("Sprawdź login i hasło");
    });
}


//Rejestracja
function RegisterAccount() {
  var userEmail = document.getElementById("userEmail").value;
  var userPassword = document.getElementById("userPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  
  var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var userPasswordFormate = /(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  var checkUserEmailValid = userEmail.match(userEmailFormate);
  var checkUserPasswordValid = userPassword.match(userPasswordFormate);

  if (userPassword != confirmPassword) {
    alert("Hasła są różne");
  } else {
    if (checkUserEmailValid == null) {
      alert("Wprowadź poprawny email");
    } else if (checkUserPasswordValid == null) {
      alert("Hasło musi mieć min.6 znaków jedną mała i duża litere");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(userEmail, userPassword)
        .then((value) => {
          var user = firebase.auth().currentUser;
          //Rejestracja poszła pomyslnie
          window.location.replace("/main/main.html");
        })
        .catch((error) => {
          //Error podczas rejestracji
          alert("Cos poszło nie tak podczas rejestracji");
        });
    }
  }
}




//Rejestracja za pomocą Facebooka
function checkLoginState(response) {
  if (response.authResponse) {
    // User is signed-in Facebook.
    window.location.replace("/main/main.html");
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(response.authResponse, firebaseUser)) {
        // Build Firebase credential with the Facebook auth token.
        var credential = firebase.auth.FacebookAuthProvider.credential(
            response.authResponse.accessToken);

        // Sign in with the credential from the Facebook user.
        firebase.auth().signInWithCredential(credential)
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        // User is already signed-in Firebase with the correct user.
      }
    });
  } else {
    // User is signed-out of Facebook.
    firebase.auth().signOut();
  }
}

function isUserEqual(facebookAuthResponse, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
          providerData[i].uid === facebookAuthResponse.userID) {
        // We don't need to re-auth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}


//Wylogowanie
function signOut() {
  firebase.auth().signOut().then(() => {
      // Wylogowanie powiodło się
      window.location.replace("../index.html");
      //alert("wylogowanie powiodło się"); //
      //Ponizej jest wylogowanie z fb
      firebase.auth().signOut();
    })
    .catch((error) => {
      // Error podczas wylogowania
      alert("wylogowanie nie powiodło się");
    });
    
}