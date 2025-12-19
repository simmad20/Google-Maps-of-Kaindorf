import { ICard, IObject } from '@/models/interfaces';
import React, { ReactNode, createContext, useContext, useState } from 'react';

const defaultTeacher: IObject = {
	id: '', attributes: {
		title: '', firstname: '', lastname: '',
		abbreviation: '', image_url: ''
	},
	type: 'teacher', assignedRoomId: undefined
};

export interface TeacherContextType {
	selectedTeacher: IObject
	setSelectedTeacher: (teacher: IObject) => void
	teachers: IObject[]
	setTeachers: React.Dispatch<React.SetStateAction<IObject[]>>
	cards: ICard[]
	setCards: React.Dispatch<React.SetStateAction<ICard[]>>
}

export const TeacherContext = createContext<TeacherContextType>({
	selectedTeacher: defaultTeacher,
	setSelectedTeacher: (teacher: IObject) => null,
	teachers: [],
	setTeachers: () => null,
	cards: [],
	setCards: () => null
});

const TeacherProvider = ({ children }: { children: ReactNode }) => {
	const [selectedTeacher, setSelectedTeacher] = useState<IObject>(defaultTeacher);
	const [teachers, setTeachers] = useState<IObject[]>([]);
	const [cards, setCards] = useState<ICard[]>([]);

	return (
		<TeacherContext.Provider value={{ selectedTeacher, setSelectedTeacher, teachers, setTeachers, cards, setCards }}>
			{children}
		</TeacherContext.Provider>
	);
};

export default TeacherProvider;