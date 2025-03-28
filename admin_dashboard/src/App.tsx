import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Homepage from "./components/Homepage.tsx";
import RoomDetails from "./components/RoomDetails.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Homepage/>}/>
                    <Route path="/room/:id" element={<RoomDetails/>}/>
                </Route>
            </Routes>
        </>
    )
}

export default App
