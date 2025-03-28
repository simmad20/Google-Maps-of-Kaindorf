import * as PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {RiArrowGoBackLine} from "react-icons/ri";
import {ITeacher} from "../models/interfaces.ts";

Form.propTypes = {
    item: PropTypes.object,
    createOrEdit: PropTypes.func,
    goBack: PropTypes.func
}

interface IForm {
    item?: ITeacher
    createOrEdit: (teacher: ITeacher, isCreating: boolean) => void
    goBack: () => void
}

function Form({item, createOrEdit, goBack}: IForm) {
    const isCreating: boolean = typeof item === 'undefined';
    const [teacher, setTeacher] = useState<ITeacher>((typeof item === 'undefined') ? {
        id: 0,
        firstname: '',
        lastname: '',
        abbreviation: '',
        image_url: '',
        title: '',
        room_id: 0
    } : item);

    const updateItem = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedTeacher = {...teacher, [event.target.name]: event.target.value};
        setTeacher(updatedTeacher);
    }

    useEffect(() => {
        console.log(teacher);
    });

    return (
        <div>
            <h2 className="editCreateTitle text-center text-xl mt-3">{isCreating ? 'Create a teacher' : 'Edit a teacher'}</h2>
            <form action="" className="mt-4 ms-3 me-3" onSubmit={event => event.preventDefault()}>
                <div className="flex gap-x-6 mb-6">
                    <div className="w-full relative">
                        <label className="flex  items-center mb-2 text-gray-600 text-sm font-medium" htmlFor="title">Title
                            <svg
                                width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none"
                                xmlns="http://www.w3.org/2000/svg">

                            </svg>
                        </label>
                        <input type="text" id="default-search"
                               className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none "
                               placeholder="" name="title" value={teacher.title} onChange={event => updateItem(event)}/>
                    </div>
                    <div className="w-full relative">
                        <label className="flex  items-center mb-2 text-gray-600 text-sm font-medium"
                               htmlFor="firstname">Firstname
                            <svg
                                width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none"
                                xmlns="http://www.w3.org/2000/svg">

                            </svg>
                        </label>
                        <input type="text" id="default-search"
                               className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
                               placeholder="" name="firstname" value={teacher.firstname}
                               onChange={event => updateItem(event)}/>
                    </div>
                    <div className="w-full relative">
                        <label className="flex  items-center mb-2 text-gray-600 text-sm font-medium" htmlFor="lastname">Lastname
                            <svg
                                width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                            </svg>
                        </label>
                        <input type="text" id="default-search"
                               className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
                               placeholder="" name="lastname" value={teacher.lastname}
                               onChange={event => updateItem(event)}/>
                    </div>
                </div>

                <div className="flex gap-x-6 mb-6">
                    <div className="w-full relative">
                        <label className="flex  items-center mb-2 text-gray-600 text-sm font-medium"
                               htmlFor="abbreviation">Abbreviation
                            <svg
                                width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none"
                                xmlns="http://www.w3.org/2000/svg">

                            </svg>
                        </label>
                        <input type="text" id="default-search"
                               className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
                               placeholder="" name="abbreviation" value={teacher.abbreviation}
                               onChange={event => updateItem(event)}/>
                    </div>
                    <div className="w-full relative">
                        <label className="flex  items-center mb-2 text-gray-600 text-sm font-medium"
                               htmlFor="image_url">Image URL
                            <svg
                                width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none"
                                xmlns="http://www.w3.org/2000/svg">

                            </svg>
                        </label>
                        <input type="text" id="default-search"
                               className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none "
                               placeholder="" name="image_url" value={teacher.image_url}
                               onChange={event => updateItem(event)}/>
                    </div>
                </div>
                <div className="flex gap-4 items-center justify-center">
                    <button onClick={() => goBack()}
                            className="w-16 h-12 flex items-center justify-center shadow-sm rounded-full bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 text-white text-base font-semibold leading-7">
                        <RiArrowGoBackLine/>
                    </button>
                    <button onClick={() => createOrEdit(teacher, isCreating)}
                            className="w-52 h-12 shadow-sm rounded-full bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 text-white text-base font-semibold leading-7">{isCreating ? 'Create' : 'Edit teacher'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Form;