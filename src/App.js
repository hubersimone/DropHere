import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'firebase/database'
import React, {useReducer, useContext, useState, useEffect} from 'react'

const icons = {
    folder: "folder",
    file: "file-earmark"
}
 
function Header()
{
    return(
        <div>
            <h1>DropHere</h1>
        </div>
    );
}

function Item(props)
{
    const [state, dispatch] = useContext(Context);
    const {name, type, id} = props
    return (
        <span onClick={() =>{if (type === "folder") dispatch({type:"enter", payload:{id: id, name: name}});}}>
            <i className={`bi bi-${icons[type]}`}/>
            <h5>{name}</h5>
        </span>
    );
}

function Items()
{
    const [state] = useContext(Context);
    const [items, setItems] = useState([]);
    useEffect(async () => {
        let items = []
        //console.log(state.personal.level)
        let ref = database.ref("uuid_user1/" + state.personal.root + "/items");
        let snapshot = await ref.once("value");
        //console.log('g')
        snapshot.forEach((item) => {
        if (item.val().father === state.personal.level)
             items.push((<Item name={item.val().name} type={item.val().type} id={item.val().id}/>));
         });
        setItems(items)
    })

    return (
        <div>
            {items === undefined ? "Loading..." : (items.length === 0 ? "Empty" : items)}
        </div>
    );
}

function Upload()
{
    return (<div>Upload mode</div>);
}

function Body()
{
    const [state, dispatch] = useContext(Context)
    return(<div>
        <h3>
            {state.personal.path === "/" ? null : <span onClick={() => {dispatch({type: "back"})}}><i className="bi bi-arrow-left-short"></i></span>}
            {state.personal.root + state.personal.path}
        </h3>
        {state.uploading ? <Upload/> : <Items/>}
    </div>);
}

function Footer()
{
    const [state, dispatch] = useContext(Context)
    return(<div>
        <span onClick={() => dispatch({type: 'upload'})}><i className="bi bi-plus-circle"></i></span>
    </div>);
}

const Context = React.createContext(null);

function switchActions(state, action)
{
    let newState = {...state}
    switch (action.type)
    {
        case "upload": newState.uploading = !newState.uploading;
        break;
        //case 'update': newState.personal.content.push(action.payload);
        //break;
        case "enter": newState.personal.level = action.payload.id; newState.personal.path += action.payload.name + "/";
        break;
        case "back": newState.personal.path = newState.personal.path.substr(0, newState.personal.path.substr(0, newState.personal.path.length -1).lastIndexOf("/") + 1);
        database.ref("uuid_user1/" + state.personal.root + "/items/" + state.personal.level)
        .once("value", (snapshot) => {newState.personal.level = snapshot.val().father});
        break;
        default: return;
    }
    return newState;
}

let database

function App(props) {
    const {user, firebase} = props;
    database = firebase.database()
    const [state, dispatch] = useReducer(switchActions, {uploading: false, personal: {root: "storage", level: "null", path:"/"}});
    return (
        <Context.Provider value={[state, dispatch]}>
            <Header/>
            <Body/>
            <Footer/>
        </Context.Provider>
    );
}

export default App;
