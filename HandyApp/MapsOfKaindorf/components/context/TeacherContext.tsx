import React, { ReactNode, createContext, useContext, useState } from 'react';

import { IObject } from '@/models/interfaces';

const defaultTeacher: IObject = {
	id: '', attributes: {
		title: '', firstname: '', lastname: '',
		abbreviation: '', image_url: ''
	},
	type: 'teacher', assignedRoomId: undefined
};

export interface TeacherContextType {
	selectedTeacher: IObject;
	setSelectedTeacher: (teacher: IObject) => void;
}

export const TeacherContext = createContext<TeacherContextType>({
	selectedTeacher: defaultTeacher,
	setSelectedTeacher: (teacher: IObject) => null
});

const TeacherProvider = ({ children }: { children: ReactNode }) => {
	const [selectedTeacher, setSelectedTeacher] = useState<IObject>(defaultTeacher);

	return (
		<TeacherContext.Provider value={{ selectedTeacher, setSelectedTeacher }}>
			{children}
		</TeacherContext.Provider>
	);
};

export default TeacherProvider;