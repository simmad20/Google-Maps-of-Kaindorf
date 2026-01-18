import {useContext} from "react";
import {CoachClientContext, CoachClientContextType} from "../context/CoachClientContext.tsx";
import AuthService from "../services/AuthService.tsx";
import {WorkoutEditContext, WorkoutEditContextType} from "../context/WorkoutEditContext.tsx";

const useLogout = () => {
    const {setAuth, setPersist} = useContext<CoachClientContextType>(CoachClientContext);
    const {clear} = useContext<WorkoutEditContextType>(WorkoutEditContext);

    const logout = () => {
        setAuth({user: 'None', username: '', token: ''});

        AuthService.logout()
            .then(() => {
                setPersist(false);
                clear();
                localStorage.removeItem('persist');
            })
            .catch((error: Error) => {
                console.error(error.message);
            })
    }

    return logout;
}

export default useLogout;