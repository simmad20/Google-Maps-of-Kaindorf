import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./components/Home.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                </Route>
            </Routes>
        </>
    )
}

export default App
