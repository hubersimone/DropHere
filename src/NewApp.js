import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import firebase from './Firebase'
import { useAuthState, useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { SignIn, SignUp } from './Auth'
import Personal from './Personal'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { AccountCircle, Menu as MenuIcon } from '@material-ui/icons';

const AuthContext = React.createContext('Auth')

export default function App() {
    const auth = firebase.auth()
    const [user] = useAuthState(auth)
    const [signInWithEmailAndPassword, , , signInError] = useSignInWithEmailAndPassword(auth)
    const [createUserWithEmailAndPassword, , , signUpError] = useCreateUserWithEmailAndPassword(auth)
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
        auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user: user, signInWithEmailAndPassword: signInWithEmailAndPassword, createUserWithEmailAndPassword: createUserWithEmailAndPassword, signInError: signInError, signUpError: signUpError }}>
            <AppBar position='static'>
                <Toolbar>
                    {user && (
                        <IconButton edge="start" color="inherit" >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h4" >
                        DropHere
                        </Typography>
                    {user && (
                        <>
                            <IconButton
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>Sign out</MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Router>
                <Switch>
                    <Route path='/welcome'>
                        {user ? <Redirect to={{ pathname: '/personal' }} /> : <Welcome />}
                    </Route>
                    <Route path='/signin'>
                        {user ? <Redirect to={{ pathname: '/personal' }} /> : <SignIn />}
                    </Route>
                    <Route path='/signup'>
                        {user ? <Redirect to={{ pathname: '/personal' }} /> : <SignUp />}
                    </Route>
                    <Route path='/personal'>
                        {user ? <Personal /> : <Redirect to={{ pathname: '/welcome' }} />}
                    </Route>
                    <Route path='/'>
                        {user ? <Redirect to={{ pathname: '/personal' }} /> : <Redirect to={{ pathname: '/welcome' }} />}
                    </Route>
                </Switch>
            </Router>
        </AuthContext.Provider>
    );
}

function Welcome() {
    return (
        <Redirect to={{ pathname: '/signin' }} />
    )
}

export { AuthContext }