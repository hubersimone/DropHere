/*import { firebase } from './Firebase'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import 'firebase/database'
import { useEffect } from 'react'
import { useList } from 'react-firebase-hooks/database'
import 'firebase/storage'
import { Box, Breadcrumbs, Grid, Link } from '@material-ui/core'
import { Folder } from '@material-ui/icons';

const auth = firebase.auth()
const database = firebase.database()
let root = 'storage', level = 'storage', path = [{ name: 'storage', id: 'storage' }]
const storage = firebase.storage()


function Items() {
    const [user] = useAuthState(auth)
    const [snapshots] = useList(database.ref(`${user.uid}/${root}`))
    useEffect(() => null, [snapshots])
    return (
        <Grid container spacing={5}>
            {snapshots.filter((item) => { return item.val().level === level }).map((item) =>
                <Grid item>
                    <Grid container direction='column'
                        alignItems='center' style={{ cursor: 'pointer' }} onClick={() => EnterInFolder(item.key)}>
                        <Grid item><Folder /></Grid>
                        <Grid item>{item.val().name}</Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    )
}

function EnterInFolder(id) {
    database.ref(`${auth.currentUser.uid}/${root}/${id}`).once('value').then((dataSnapshot) => {
        if (dataSnapshot.val().type === 'folder') {
            level = id
            console.log(`entered in ${id}`)
        }
    })
}

function Path() {
    return (
        <div style={{ position: 'absolute', bottom: '0%', width: '100%' }}>
            <Box
                display='flex'
                justifyContent='center'
            >
                <Breadcrumbs>
                    {path.map((ref) => <Link style={{ cursor: 'pointer' }} onClick={() => backToFolder(ref.id)}><p>{ref.name}</p></Link>)}
                </Breadcrumbs>
            </Box>
        </div>
    )
}

function backOnce() {

}

function backToFolder(id) {
    console.log(`entered in ${id}`)
}

function createFolder(name) {

}

function uploadFile(file) {

}

function trashItem(id) {

}

export {
    Path,
    Items
}*/