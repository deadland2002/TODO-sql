// @flow
import * as React from 'react';
import "../Styles/NewDialog.scss"
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {useCookies} from "react-cookie";
import {SyntheticEvent} from "react";

type Props = {
    close: () => {}
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


export const AddDialogBox = (props: Props) => {
    const [cookie, setCookie] = useCookies(['token'])
    const HandleClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const divElement = event.target as HTMLDivElement;
        if (divElement.getAttribute("id") == "NewDialog")
            props.close();
    }

    const HandleAddNew = async (event: SyntheticEvent) => {
        event.preventDefault();
        const formElement = event.target as HTMLFormElement;
        const form_data = new FormData(formElement);
        const title = form_data.get('title');
        const description = form_data.get('description');

        const response = await axios.post("http://localhost:3000/Add", {title, description} , {headers:{Authorization:cookie.token}}).then(res => res.data);
        if (response.status == 200) {
            toast.success(response.message, toastOptions);
        } else {
            toast.warn(response.message, toastOptions);
        }
    }

    return (
        <div className={'NewDialog'} onClick={(e) => {
            HandleClose(e)
        }} id={'NewDialog'}>
            <ToastContainer />
            <div className={'wrapper'}>
                <form onSubmit={HandleAddNew}>
                    <span className={'heading'}>Add New Todo</span>
                    <div className={'fields'}>
                        <span className={'subHeading'}>Title</span>
                        <input name={'title'}/>
                    </div>
                    <div className={'fields'}>
                        <span className={'subHeading'}>Description</span>
                        <textarea name={'description'} rows={10}/>
                    </div>
                    <button>Add</button>
                </form>
            </div>
        </div>
    );
};
