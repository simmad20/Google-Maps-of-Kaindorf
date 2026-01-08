import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import MapManager from "./components/MapManager.tsx";
import RoomDetails from "./components/RoomDetails.tsx";
import RoomList from "./components/RoomList.tsx";
import Homepage from "./pages/Homepage.tsx";
import ObjectTypeCreateEditForm from "./pages/ObjectTypeCreateEditForm.tsx";
import ObjectTypesPage from "./pages/ObjectTypesPage.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Homepage/>}/>
                    <Route path="/map" element={<MapManager/>}/>
                    <Route path="/types" element={<ObjectTypesPage/>}/>
                    <Route path="/createType" element={<ObjectTypeCreateEditForm/>}/>
                    <Route path="/room/:id" element={<RoomDetails/>}/>
                    <Route path="/rooms" element={<RoomList/>}/>
                </Route>
            </Routes>
        </>
    )
}

export default App
