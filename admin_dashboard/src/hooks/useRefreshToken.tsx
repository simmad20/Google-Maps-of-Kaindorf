import {useContext} from "react";
import {CoachClientContext, CoachClientContextType} from "../context/CoachClientContext.tsx";
import AuthService from "../services/AuthService.tsx";
import {IAuthResponse} from "../models/interfaces.ts";

const useRefreshToken = () => {
    const {setAuth, setAuthLoading} = useContext<CoachClientContextType>(CoachClientContext);

    const refresh = async () => {
        setAuthLoading(true);
        AuthService.refresh()
            .then((auth: IAuthResponse) => {
                setAuth({
                    user: auth.role,
                    username: auth.username,
                    token: auth.accessToken
                })
            })
            .finally(()=>{
                setAuthLoading(false);
            })
    }

    return refresh;
}

export default useRefreshToken;