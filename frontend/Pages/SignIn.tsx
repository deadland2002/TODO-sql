// @flow
import * as React from 'react';
import {SyntheticEvent} from "react";
import '../../../TODO/frontend/Styles/SignIn.scss'
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {ToastContainer , toast} from "react-toastify";
type Props = {

};

const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
}
export const SignIn = (props: Props) => {

    const [cookie,setCookie] = useCookies(['token'])
    const navigate = useNavigate()
    const HandleSubmit = async (event:SyntheticEvent) =>{
        event.preventDefault()
        const formElement = event.target as HTMLFormElement;
        const form_data = new FormData(formElement);
        const username = form_data.get('username');
        const password = form_data.get('password');

        const response = await axios.post("http://localhost:3000/SignIn",{username,password}).then(res=>res.data);
        if(response.status == 200){
            setCookie('token',response.token);
            toast.success("Signing In...", toastOptions);
            setTimeout(()=>{
                navigate("/");
            },2000)
        }else{
            toast.warn(response.message, toastOptions);
        }
    }
    return (
        <div className={'SignInParent'}>
            <ToastContainer />
            <div className={'wrapper'}>
                <form onSubmit={HandleSubmit}>
                    <span>Sign In</span>
                    <input type={'text'} name={'username'} placeholder={'Username'} required={true}/>
                    <input type={'password'} name={'password'} placeholder={'Password'} required={true}/>
                    <button type={'submit'}>Submit</button>
                </form>
            </div>
        </div>
    );
};
