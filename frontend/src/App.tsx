import React, {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SignIn} from "../Pages/SignIn.tsx";
import {Home} from "../Pages/Home.tsx";
import {CookiesProvider} from "react-cookie";
import 'react-toastify/dist/ReactToastify.css';
function App() {

    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/SignIn"} element={<SignIn/>}/>
                    <Route path={"/"} element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        </CookiesProvider>
    )
}

export default App
