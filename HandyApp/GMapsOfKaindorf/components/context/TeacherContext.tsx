import React, { ReactNode, createContext, useContext, useState } from 'react';

import { ITeacher } from '@/models/interfaces';

const defaultTeacher: ITeacher = {
	id: '', title: '', firstname: '', lastname: '',
	abbreviation: '', image_url: ''
};

export interface TeacherContextType {
	selectedTeacher: ITeacher;
	setSelectedTeacher: (teacher: ITeacher) => void;
}

export const TeacherContext = createContext<TeacherContextType>({
	selectedTeacher: defaultTeacher, 
	setSelectedTeacher: (teacher: ITeacher) => null
});

const TeacherProvider = ({ children }: { children: ReactNode }) => {
	const [selectedTeacher, setSelectedTeacher] = useState<ITeacher>(defaultTeacher);

	return (
		<TeacherContext.Provider value={{ selectedTeacher, setSelectedTeacher }}>
			{children}
		</TeacherContext.Provider>
	);
};

export default TeacherProvider;