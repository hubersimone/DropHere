import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/css/style.css'
import 'firebase/database'
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/app'
import 'firebase/auth'
import React, { useReducer, useContext, useState, useEffect } from 'react'

firebase.initializeApp({
  apiKey: "AIzaSyDC9Fkp8M34kZ3leuhZjCV9tHxlB7upyNk",
  authDomain: "drophereclouding.firebaseapp.com",
  databaseURL: "https://drophereclouding-default-rtdb.firebaseio.com",
  projectId: "drophereclouding",
  storageBucket: "drophereclouding.appspot.com",
  messagingSenderId: "880326133221",
  appId: "1:880326133221:web:7db578d4e4366319be9b0c"
});

const auth = firebase.auth();
const database = firebase.database();

function Auth() {

  const [acccess, setAccess] = useState(<SignSwitch />);

  function SignSwitch() {
    return (
      <>
        <button onClick={() => { setAccess(<SignIn />) }}>Sign In</button>
        <button onClick={() => { setAccess(<SignUp />) }}>Sign Up</button>
      </>
    );
  }

  function SignIn() {
    return (
      <form>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" /><br />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" autoComplete="on" /><br /><br />
        <input type="button" onClick={() => {
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
          try {
            auth.signInWithEmailAndPassword(email, password)
          }
          catch (error) {
            console.log(error)
          }
        }} value="Accedi" />
        <input type="button" onClick={() => { setAccess(<SignSwitch />) }} value="Torna indietro" />
      </form>
    );
  }

  function SignUp() {
    return (
      <form>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" /><br />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" autoComplete="on" /><br /><br />
        <input type="button" onClick={() => {
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
          try {
            auth.createUserWithEmailAndPassword(email, password).then((credentialUser) => {
              database.ref(credentialUser.user.uid).set({
                storage: "null",
                trash: "null"
              })
            })
          } catch (error) {
            console.log(error)
          }
        }} value="Registrati" />
        <input type="button" onClick={() => { setAccess(<SignSwitch />) }} value="Torna indietro" />
      </form>
    );
  }

  return (
    <div className="centered">
      {acccess}
    </div>
  );
}

const icons = {
  folder: "folder",
  file: "file-earmark"
}

function Header() {
  return (
    <div>
      <h1>DropHere {auth.currentUser ? <SignOut /> : null}</h1>
    </div>
  );
}

function Item(props) {
  const [state, dispatch] = useContext(Context);
  const { name, type, id } = props
  return (
    <span onClick={() => { if (type === "folder") dispatch({ type: "enter", payload: { id: id, name: name } }); }}>
      <i className={`bi bi-${icons[type]}`} />
      <h5>{name}</h5>
    </span>
  );
}

function Items() {
  const [state] = useContext(Context);
  const [items, setItems] = useState([]);

  async function getData() {
    try {
      let items = []
      //console.log(state.personal.level)
      let ref = database.ref(auth.currentUser.uid + "/" + state.personal.root);
      let snapshot = await ref.once("value");
      //console.log('g')
      snapshot.forEach((item) => {
        if (item.val().father === state.personal.level)
          items.push((<Item name={item.val().name} type={item.val().type} id={item.val().id} />));
      });
      setItems(items)
    }
    catch (err) {
      console.log(err)
    }
  }


  //set up a cleanUp function
  useEffect(() => {
    const AbortCont = new AbortController();
    getData();
    return () => { AbortCont.abort() };
  })

  return (
    <div>
      {items === undefined ? "Loading..." : (items.length === 0 ? "Empty" : items)}
    </div>
  );
}

function Upload() {
  return (<div>Upload mode</div>);
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => { auth.signOut() }}>Sign Out</button>
  )
}

function Body() {
  const [state, dispatch] = useContext(Context)
  return (<div>
    <h3>
      {state.personal.path === "/" ? null : <span onClick={() => { dispatch({ type: "back" }) }}><i className="bi bi-arrow-left-short"></i></span>}
      {state.personal.root + state.personal.path}
    </h3>
    {state.uploading ? <Upload /> : <Items />}
  </div>);
}

function Footer() {
  const [state, dispatch] = useContext(Context)
  return (<div>
    <span onClick={() => dispatch({ type: 'upload' })}><i className="bi bi-plus-circle"></i></span>
  </div>);
}

const Context = React.createContext(null);

function switchActions(state, action) {
  let newState = { ...state }
  switch (action.type) {
    case "upload": newState.uploading = !newState.uploading;
      break;
    //case 'update': newState.personal.content.push(action.payload);
    //break;
    case "enter": newState.personal.level = action.payload.id; newState.personal.path += action.payload.name + "/";
      break;
    case "back": newState.personal.path = newState.personal.path.substr(0, newState.personal.path.substr(0, newState.personal.path.length - 1).lastIndexOf("/") + 1);
      database.ref(auth.uid + "/" + state.personal.root + "/" + state.personal.level)
        .once("value", (snapshot) => { newState.personal.level = snapshot.val().father });
      break;
    default: return;
  }
  return newState;
}

function Personal() {
  const [state, dispatch] = useReducer(switchActions, { uploading: false, personal: { root: "storage", level: "null", path: "/" } });
  return (
    <Context.Provider value={[state, dispatch]}>
      <Body />
      <Footer />
    </Context.Provider>
  );
}

function App() {
  const [user] = useAuthState(auth);
  return (
    <>
      <Header />
      <section>
        {user ? <Personal /> : <Auth />}
      </section>
    </>
  );
}

export default App;
