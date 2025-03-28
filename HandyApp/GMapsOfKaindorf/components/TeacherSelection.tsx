import {Image, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {TeacherContext, TeacherContextType} from './context/TeacherContext';

import {ITeacher} from "@/models/interfaces";
import {Picker} from '@react-native-picker/picker';
import {serverConfig} from "@/config/server";

export default function TeacherSelection() {
	const defaultTeacher: ITeacher = {
		id: '', title: '', firstname: '', lastname: '',
		abbreviation: '', image_url: ''
	};
	
	const [teachers, setTeachers] = useState<ITeacher[]>([]);
	const { selectedTeacher, setSelectedTeacher } = useContext<TeacherContextType>(TeacherContext); // Context verwenden
	const [imageError, setImageError] = useState(false);

	const fetchTeachers = () => {
		fetch(`http://${serverConfig.ip}:${serverConfig.port}/teachers`)
			.then((res) => res.json())
			.then((teacherList: ITeacher[]) => {
					setTeachers(teacherList);
					console.log(teacherList);
				}
			);
	}

	useEffect(() => {
		fetchTeachers();
	}, []);

	const handleTeacherChange = (itemValue: string) => {
		if (itemValue === 'Select a teacher') {
			setSelectedTeacher(defaultTeacher);
		} else {
			const teacher = teachers.find(t => t.id === itemValue);
			if (teacher) {
				setSelectedTeacher(teacher);
				// fetch(`http://${serverConfig.ip}:${serverConfig.port}/roomOfTeacher`+ teacher.id)
				// .then((res) => res.json())
				// .then((teacherList: ITeacher[]) => {
				// 		setTeachers(teacherList);
				// 		console.log(teacherList);
				// 	}
				// );
			}
		}
	};

	const handleImageError = () => {
		setImageError(true);
	};

	useEffect(() => {
		console.log(teachers);
	});

	return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<View
				style={Platform.OS === 'ios' ? styles.pickerContainerIOS : styles.pickerContainerAndroid}>
				<Picker
					selectedValue={`${selectedTeacher.title??''} ${selectedTeacher.firstname} ${selectedTeacher.lastname}`}
					onValueChange={handleTeacherChange}
					style={styles.picker}
					mode="dialog"
				>
					<Picker.Item label="Select a teacher" value="Select a teacher"/>
					{teachers.map((teacher: ITeacher) => (
						<Picker.Item key={teacher.id}
									 label={`${teacher.title??''} ${teacher.firstname} ${teacher.lastname}`.trim()}
									 value={teacher.id}/>
					))}
				</Picker>
			</View>
			<View style={styles.imageContainer}>
				<Image
					style={styles.image}
					source={(imageError || selectedTeacher.image_url.length < 1)
						? require('@/assets/images/Teacher.png')
						: {uri: selectedTeacher.image_url}}
					resizeMode="contain"
					onError={handleImageError}
				/>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 3
	},
	pickerContainerIOS: {
		height: 170,
		width: 250,
		backgroundColor: '#ffffff',
		color: '#000000'
	},
	pickerContainerAndroid: {
		height: 50,
		width: 250,
		backgroundColor: '#ffffff',
		color: '#000000'
	},
	picker: {
		height: 50,
		width: 250,
		color: 'black',
	},
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
	},
	image: {
		width: 300,
		height: 300,
	},
});
