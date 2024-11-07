import {useEffect, useState} from 'react';
import Map from "./Map.tsx";
import {ITeacher} from "../models/interfaces.ts";
import List from "./List.tsx";

function Home() {
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
            </div>
            <div className="basis-1/4">
                <Map/>
            </div>
        </div>
    );
}

export default Home;