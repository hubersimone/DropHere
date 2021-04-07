/*import { firebase } from './Firebase'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

const auth = firebase.auth()
auth.signInWithEmailAndPassword('andrea.tetoldini.16@gmail.com', '(qU7AU.Q$R}kY{3').then(() => {
    console.log('signed in')
}).catch((error) => console.log(error))

function signInWithCredentials(email, password) {
    auth.signInWithCredential(email, password)
}

function signInWithAuthProvider(authProvider) {
    switch (authProvider) {
        case "Google":
            auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            break;
        default:
            break;
    }
}

function signUp(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
}

function AuthHook() {
    return useAuthState(auth)
}

function signOut() {
    auth.signOut()
}

export {
    signInWithCredentials,
    signInWithAuthProvider,
    signUp,
    AuthHook,
    signOut
}*/

import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, FormControl, Grid, IconButton, InputAdornment, Paper, TextField } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useContext, useState } from "react";
//import firebase from './Firebase'
import { AuthContext } from './NewApp'
import google from './assets/images/google.png'
import microsoft from './assets/images/microsoft.png'
import apple from './assets/images/apple.png'
import facebook from './assets/images/facebook.png'
import github from './assets/images/github.png'

export function SignIn() {
    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const { signInWithEmailAndPassword, signInError } = useContext(AuthContext)

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="89vh"
        >
            <Paper
                elevation={5} square>
                <Card >
                    <CardHeader title="Accedi"></CardHeader>
                    <CardContent>
                        <form style={{ textTransform: 'none' }}>
                            <Grid container direction='column' spacing={2}>
                                <Grid item>
                                    <FormControl fullWidth={true}>
                                        <TextField
                                            error={!values.email && signInError ? true : null}
                                            autoComplete='on'
                                            label='Email'
                                            id="email"
                                            type='email'
                                            value={values.email}
                                            helperText={!values.email && signInError ? "Inserisci l'email" : null}
                                            variant="outlined"
                                            onChange={handleChange('email')}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth={true}>
                                        <TextField
                                            error={!values.password && signInError ? true : null}
                                            id="password"
                                            value={values.password}
                                            type={values.showPassword ? 'text' : 'password'}
                                            label="Password"
                                            autoComplete='on'
                                            onChange={handleChange('password')}
                                            helperText={!values.password && signInError ? "Inserisci la password" : !signInError && values.password && values.email ? "Credenziali errate" : null}
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Button color='primary' style={{ textTransform: 'none' }} href='/signin'>Recupera password</Button>
                                    <Button color='primary' style={{ textTransform: 'none' }} href='/signup'>Registrati</Button>
                                    <Button onClick={() => {
                                        try {
                                            signInWithEmailAndPassword(values.email, values.password)
                                        }
                                        catch (error) {
                                            console.log(error)
                                        }
                                    }}>Entra</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                    <CardActions>
                        <Box
                            width='100%'
                            display='flex'
                            justifyContent="center"
                        >
                            <IconButton onClick={() => {
                                //auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch((error) => console.log(error))
                            }}><img alt='google' src={google} width="25px" heigth="25px" draggable="false"></img></IconButton>
                            <IconButton onClick={() => {
                                //auth.signInWithPopup(new firebase.auth.()).catch((error) => console.log(error))
                            }}><img alt='microsoft' src={microsoft} width="25px" heigth="25px" draggable="false"></img></IconButton>
                            <IconButton onClick={() => {
                                //auth.signInWithPopup(new firebase.auth.()).catch((error) => console.log(error))
                            }}><img alt='apple' src={apple} width="25px" heigth="25px" draggable="false"></img></IconButton>
                            <IconButton onClick={() => {
                                //auth.signInWithPopup(new firebase.auth.()).catch((error) => console.log(error))
                            }}><img alt='facebook' src={facebook} width="25px" heigth="25px" draggable="false"></img></IconButton>
                            <IconButton onClick={() => {
                                //auth.signInWithPopup(new firebase.auth.()).catch((error) => console.log(error))
                            }}><img alt='github' src={github} width="25px" heigth="25px" draggable="false"></img></IconButton>
                        </Box>
                    </CardActions>
                </Card>
            </Paper>
        </Box>
    )
}

export function SignUp() {

    const { createUserWithEmailAndPassword, signUpError } = useContext(AuthContext)

    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (

        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="75vh"
        >
            <div>
                <Paper elevation={5} square>
                    <Card >
                        <CardHeader title="Registrati"></CardHeader>
                        <CardContent>
                            <form>
                                <Grid container direction='column' spacing={2}>
                                    <Grid item>
                                        <FormControl variant="filled" fullWidth={true}>
                                            <TextField
                                                required={true}
                                                error={!values.email && signUpError ? true : null}
                                                autoComplete='on'
                                                label='Email'
                                                id="email"
                                                type='email'
                                                helperText={!values.email && signUpError ? "Inserisci un'email" : null}
                                                value={values.email}
                                                variant="outlined"
                                                onChange={handleChange('email')}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <FormControl fullWidth={true}>
                                            <TextField
                                                required={true}
                                                error={!values.password && signUpError ? true : null}
                                                id="password"
                                                value={values.password}
                                                type={values.showPassword ? 'text' : 'password'}
                                                label="Password"
                                                autoComplete='on'
                                                onChange={handleChange('password')}
                                                helperText={!values.password && signUpError ? "Inserisci una password" : null}
                                                variant="outlined"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                            >
                                                                {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                        <CardActions>
                            <Button color='primary' style={{ textTransform: 'none' }} href='/signin'>Accedi</Button>
                            <Button onClick={() => {
                                createUserWithEmailAndPassword(values.email, values.password)
                            }} type="submit">Registrati</Button>
                        </CardActions>
                    </Card>
                </Paper>
            </div>
        </Box>
    )
}