import { createContext, useContext, useState, useEffect } from "react";
import {getCurrentUser} from '@/lib/appwrite'

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser()
                if (user) {
                    setUser(user)
                    setisLoggedIn(true)
                }
                else {
                    setisLoggedIn(false)
                    setUser(null)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setisLoading(false)
            }
        }
        fetchUser()
    }, []);
    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setisLoggedIn,
            user,
            setUser,
            isLoading,
            setisLoading
        }}>
            {children}
        </GlobalContext.Provider>
    );
};