import {useEffect, useState} from 'react';
import Map from "./Map.tsx";
import {ITeacher} from "../models/interfaces.ts";
import List from "./List.tsx";

function Homepage() {
    const [teachers, setTeachers] = useState<ITeacher[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/teachers')
            .then((response) => response.json())
            .then((result: ITeacher[]) => {
                setTeachers(result);
                console.log(result);
            })
    }, []);

    return (
        <div className="mt-5 flex flex-wrap-reverse">
            <div className="basis-1/4 mx-auto lg:mx-0">
                <List items={teachers}/>
                <button
                    className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5">Create
                </button>
            </div>
            <div className="basis-1/4">
                <Map/>
            </div>
        </div>
    );
}

export default Homepage;