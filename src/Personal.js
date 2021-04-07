import firebase from './Firebase'
import 'firebase/auth'
import { AuthContext } from './NewApp'
import 'firebase/database'
import React, { createRef, useContext, useEffect, useReducer, useRef, useState } from 'react'
import 'firebase/storage'
import { Box, Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Link, Menu, MenuItem, Snackbar, TextField } from '@material-ui/core'
import { AddCircle, ArrowDropUp, Close } from '@material-ui/icons';
import 'bootstrap-icons/font/bootstrap-icons.css'
import $ from 'jquery';
//import { useList } from 'react-firebase-hooks/database'

const database = firebase.database()
//const storage = firebase.storage()

const CloudContext = React.createContext('CloudContext')

function CloudActions(oldCloud, op) {
    let newCloud = { ...oldCloud }
    switch (op.type) {
        case 'createFolder':
            database.ref(`${newCloud.uid}/${newCloud.root}`).push({
                name: op.name,
                type: 'folder',
                creation: Date.now(),
                level: newCloud.level
            })
            break
        case 'enterInFolder':
            newCloud.path.push({ name: op.name, id: op.id })
            newCloud.level = op.id
            console.log(`entered in ${op.id}`)
            break
        case 'backToFolder':
            if (newCloud.level !== op.id) {
                newCloud.level = op.id
                newCloud.path = newCloud.path.slice(0, newCloud.path.indexOf(newCloud.path.filter((folder) => { return folder.id === op.id })[0]) + 1)
                console.log(`entered in ${op.id}`)
            }
            break
        default:
            break
    }
    return newCloud
}

export default function Personal() {
    const { user } = useContext(AuthContext)
    const [cloud, changeCloud] = useReducer(CloudActions, { uid: user.uid, root: 'storage', level: 'storage', path: [{ name: 'storage', id: 'storage' }] })
    const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
    const toggleCreateFolderDialog = () => setShowCreateFolderDialog(!showCreateFolderDialog)
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
    const toggleSuccessSnackbar = () => setShowSuccessSnackbar(!showSuccessSnackbar)
    const [menu, showMenu] = useState(null)
    const handleOpenMenu = (event) => showMenu(event.currentTarget)
    const handleCloseMenu = () => showMenu(null)
    return (
        <CloudContext.Provider value={{ cloud: cloud, changeCloud: changeCloud }}>
            <Items />
            <Path />
            <Dialog open={showCreateFolderDialog} onClose={toggleCreateFolderDialog}>
                <DialogTitle>Nuova cartella in {cloud.path[cloud.path.length - 1].name}</DialogTitle>
                <DialogContent>
                    <TextField
                        id='newFolderName'
                        autoFocus
                        margin='dense'
                        label='Nome cartella'
                        type='text'
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        changeCloud({ type: 'createFolder', name: document.getElementById('newFolderName').value })
                        toggleCreateFolderDialog()
                        toggleSuccessSnackbar()
                    }} color='primary'> Crea </Button>
                    <Button onClick={toggleCreateFolderDialog} color='primary'> Annulla </Button>
                </DialogActions>
            </Dialog>
            <div style={{ position: 'absolute', bottom: '2%', right: '1%' }}>
                <IconButton onClick={handleOpenMenu}><AddCircle></AddCircle></IconButton>
            </div>
            <Menu
                anchorEl={menu}
                keepMounted
                open={Boolean(menu)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => { toggleCreateFolderDialog(); handleCloseMenu() }}>Nuova cartella</MenuItem>
                <MenuItem onClick={() => { handleCloseMenu() }}>Carica file</MenuItem>
            </Menu>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={showSuccessSnackbar}
                autoHideDuration={4500}
                onClose={toggleSuccessSnackbar}
                message='Operazione completata'
                action={
                    <React.Fragment>
                        <IconButton size='small' color='inherit' onClick={toggleSuccessSnackbar}>
                            <Close fontSize='small' />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </CloudContext.Provider>
    );
}

const icons = {
    folder: 'folder'
}

function Items() {
    const { cloud, changeCloud } = useContext(CloudContext)
    const [items, setItems] = useState()
    /*
        const [snapshots] = useList(database.ref(`${user.uid}/${cloud.root}`))
        useEffect(() => { }, [snapshots])
        return (
        const [snapshots] = useList(database.ref(`${user.uid}/${cloud.root}`))
        <Grid container spacing={5}>
            {snapshots.filter((item) => { return item.val().level === cloud.level }).map((item, i) =>
                <Grid item key={i}>
                    <Grid container direction='column'
                        alignItems='center' style={{ cursor: 'pointer' }} onClick={() => changeCloud({ type: 'enterInFolder', name: item.val().name, id: item.key })}>
                        <Grid item><Folder /></Grid>
                        <Grid item>{item.val().name}</Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
        )
    */
    useEffect(() => {
        database.ref(`${cloud.uid}/${cloud.root}`).once('value', (dataSnapshot) => {
            const items = []
            let i = 0
            dataSnapshot.forEach((item) => {
                if (item.val().level === cloud.level) {
                    items.push(<Grid item key={++i}>
                        <Grid container direction='column'
                            alignItems='center' style={{ cursor: 'pointer' }} onClick={item.val().type === 'folder' ? () => changeCloud({ type: 'enterInFolder', name: item.val().name, id: item.key }) : null}>
                            <Grid item>
                                <i onMouseOver={() => { }} className={`bi bi-${icons[item.val().type.split('/')[0]]}`} style={{ fontSize: '5rem' }}></i>
                            </Grid>
                            <Grid item>{item.val().name}</Grid>
                        </Grid>
                    </Grid >)
                }
            })
            setItems(items)
        })
    }, [cloud, changeCloud, items])
    return (
        <Grid container spacing={5}>
            {items}
        </Grid>
    )
}

function Path() {
    const { cloud, changeCloud } = useContext(CloudContext)
    return (
        <div style={{ position: 'absolute', bottom: '5%', width: '100%' }}>
            <Box
                display='flex'
                justifyContent='center'
            >
                {cloud.level !== cloud.root ? <ArrowDropUp style={{ cursor: 'pointer' }} onClick={() => changeCloud({ type: 'backToFolder', id: cloud.path[cloud.path.length - 2].id })}></ArrowDropUp> : null}
                <Breadcrumbs>
                    {cloud.path.map((ref, i) => <Link key={i} style={{ cursor: 'pointer' }} onClick={() => changeCloud({ type: 'backToFolder', id: ref.id })}>{ref.name}</Link>)}
                </Breadcrumbs>
            </Box>
        </div>
    )
}

/*
function uploadFile(file) {

}

function trashItem(id) {

}*/