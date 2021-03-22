import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import firebase from 'firebase/app'
import 'firebase/auth'

/*let ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#auth-container', {
        signInOptions: [
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
          }
        ]
      });*/

      firebase.initializeApp({
        apiKey: "AIzaSyDC9Fkp8M34kZ3leuhZjCV9tHxlB7upyNk",
        authDomain: "drophereclouding.firebaseapp.com",
        databaseURL: "https://drophereclouding-default-rtdb.firebaseio.com",
        projectId: "drophereclouding",
        storageBucket: "drophereclouding.appspot.com",
        messagingSenderId: "880326133221",
        appId: "1:880326133221:web:7db578d4e4366319be9b0c"
    });


      const email = "hayijow322@grokleft.com";
      const password = "hunter2";

function Auth()
{

  const [app, setApp] = useState(null)

  async function logIn()
  {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
    setApp((<App user={userCredential.user} firebase={firebase}/>));  
  }

  async function signUp()
  {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)
    setApp((<App user={userCredential.user} firebase={firebase}/>));  
  }
  return (
    <div>
      {app === null ? (
        <> 
          <button onClick={logIn}>Accedi</button>
          <button onClick={signUp}>Registrati</button>
        </>
      ) : app}
      
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Auth />
  </React.StrictMode>,
  document.getElementById('root')
);

export default firebase;