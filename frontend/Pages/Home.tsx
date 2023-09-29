// @flow
import * as React from 'react';
import "../Styles/Home.scss"
import {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {AddDialogBox} from "../Components/AddDialogBox.tsx";

type Props = {};
export const Home = (props: Props) => {
    const [cookie, setCookie] = useCookies(['token'])
    const [isLoading, setIsLoading] = useState(true);
    const [todosList, setTodosList] = useState([])
    const [timeOutState, setTimeOutState] = useState<number>();
    const [OptionalMount , setOptionalMount] = useState<JSX.Element>();
    const navigate = useNavigate()

    useEffect(() => {
        document.getElementsByTagName('title')[0].innerText = "Home";
    }, [])

    const navigateToSignIn = () => {
        navigate("/SignIn")
    }

    useEffect(() => {
        async function start() {
            try {
                const token = await cookie.token
                console.log(token);
                const response = await axios.get("http://localhost:3000/todos", {headers: {Authorization: token}}).then(res => res.data)
                console.log(response)
                if (response && response.status == 200) {
                    setTodosList(response.todos);
                } else {
                    alert(response.message);
                }
                setIsLoading(false);
            } catch (err) {
                navigateToSignIn()
            }
        }

        if (typeof (cookie.token) === "string") {
            clearTimeout(timeOutState)
            start()
        } else {
            const timeOut = setTimeout(() => {
                navigateToSignIn()
            }, 1000);
            setTimeOutState(timeOut);
        }
    }, [cookie])


    const HandleCloseBtn = () =>{
        setOptionalMount(undefined);
    }
    const HandleAddBtnOpen = () =>{
        setOptionalMount(<AddDialogBox close={HandleCloseBtn} />)
    }
    return (
        <div className={'ParentHome'}>
            {OptionalMount}
            <div className={'top'}>
                <input type={'text'} className={'Filter'}/>
                <button className={'addBtn'} onClick={HandleAddBtnOpen}><img src={'/AddWhite.png'} /></button>
            </div>
            <div className={'wrapperHome'}>
                <div className={'container'}>
                    {
                        isLoading ? [
                            <div className={'loading'}>
                                Loading
                            </div>
                        ] : [
                            <div className={'cardHolder'}>
                                {
                                    todosList.map((single, index) => {
                                        return <div className={'cardOuter'}  key={`card_${index}`}>
                                            <div className={'card'}>
                                                <span className={'title'}>{single.Title}</span>
                                                <span className={'desc'}>{single.Description}</span>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        ]
                    }
                </div>
            </div>
        </div>
    );
};
