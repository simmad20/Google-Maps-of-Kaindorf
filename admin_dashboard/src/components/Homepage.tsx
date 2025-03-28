import React, {useContext, useState} from 'react';
import Map from "./Map.tsx";
import List from "./List.tsx";
import Form from "./Form.tsx";
import {ITeacher} from "../models/interfaces.ts";
import {TeacherContext, TeacherContextType} from "../context/TeacherContext.tsx";

function Homepage() {
    const {teachers, reload} = useContext<TeacherContextType>(TeacherContext);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showEditButton, setShowEditButton] = useState<boolean>(true);
    const [clickedTeacher, setClickedTeacher] = useState<ITeacher | undefined>(undefined);

    const createOrEditTeacher = (teacher: ITeacher, isCreating: boolean) => {
        setShowForm(false);
        setShowEditButton(true);
        fetch('http://localhost:3000/teachers', {
            method: isCreating ? 'POST' : 'PUT', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({teacher: teacher})
        }).then((response) => response.json())
            .then((result: ITeacher) => {
                reload();
                console.log(result);
            })
        setClickedTeacher(undefined);
    }

    const handleClickOfItem = (item: ITeacher) => {
        if (!showEditButton) {
            setClickedTeacher(item);
            setShowForm(true);
        }
    }

    const back = () => {
        setClickedTeacher(undefined);
        setShowForm(false);
        setShowEditButton(true);
    }

    return (
        <React.Fragment>
            {showForm ? <Form createOrEdit={createOrEditTeacher} item={clickedTeacher} goBack={back}/> :
                <div className="mt-5 flex flex-wrap-reverse">
                    <div className="basis-1/4 mx-auto lg:mx-0 flex flex-col items-center">
                        {showEditButton &&
                            <button onClick={() => setShowEditButton(false)}
                                    className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5">
                                Edit
                            </button>}
                        <List items={teachers} handleClick={handleClickOfItem}/>
                        {(!showEditButton) &&
                            <button onClick={() => setShowForm(true)}
                                    className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5">
                                Create
                            </button>}
                    </div>
                    <div className="basis-1/4">
                        <Map/>
                    </div>
                </div>}
        </React.Fragment>
    );
}

export default Homepage;