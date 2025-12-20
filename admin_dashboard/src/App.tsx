import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import MapManager from "./components/MapManager.tsx";
import RoomDetails from "./components/RoomDetails.tsx";
import RoomList from "./components/RoomList.tsx";
import Homepage from "./pages/Homepage.tsx";
import ObjectAdminPage from "./pages/ObjectAdminPage.tsx";
import ObjectTypeCreateForm from "./pages/ObjectTypeCreateForm.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Homepage/>}/>
                    <Route path="/map" element={<MapManager/>}/>
                    <Route path="/types" element={<ObjectAdminPage/>}/>
                    <Route path="/createType" element={<ObjectTypeCreateForm/>}/>
                    <Route path="/room/:id" element={<RoomDetails/>}/>
                    <Route path="/rooms" element={<RoomList/>}/>
                </Route>
            </Routes>
        </>
    )
}

export default App
