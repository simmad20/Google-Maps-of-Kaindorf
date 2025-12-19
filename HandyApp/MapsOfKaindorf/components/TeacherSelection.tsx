import { ICard, IObject } from '@/models/interfaces';
import { Image, Platform, ScrollView, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { TeacherContext, TeacherContextType } from './context/TeacherContext';

import { Picker } from '@react-native-picker/picker';
import { serverConfig } from '../config/server';

export default function TeacherSelection() {
    const defaultTeacher: IObject = {
        id: '', attributes: {
            title: '', firstname: '', lastname: '',
            abbreviation: '', image_url: ''
        },
        type: 'teacher', assignedRoomId: undefined
    };

    const { selectedTeacher, setSelectedTeacher, teachers, setTeachers, cards, setCards } = useContext<TeacherContextType>(TeacherContext);
    const [imageError, setImageError] = useState(false);

    // Fetch Room Cards
    useEffect(() => {
        if (teachers.length > 0) return;
        fetch(`https://${serverConfig.dns}/objects/teacher`)
            .then(res => res.json())
            .then((teacherList: IObject[]) => {
                setTeachers(teacherList.filter(teacher => teacher.assignedRoomId !== null));
            }).catch(() => setTeachers([]));
        if (cards.length > 0) return;
        fetch(`https://${serverConfig.dns}/cards`)
            .then(res => res.json())
            .then((cards: ICard[]) => {
                setCards(cards);
            })
            .catch(() => { console.log('Failed to fetch cards'); });
    }, []);

    const handleTeacherChange = (teacherId: string) => {
        if (teacherId === 'Select a teacher') {
            setSelectedTeacher(defaultTeacher);
        } else {
            const teacher = teachers.find(t => t.id === teacherId);
            if (teacher) setSelectedTeacher(teacher);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={Platform.OS === 'ios' ? styles.pickerContainerIOS : styles.pickerContainerAndroid}>
                <Picker
                    selectedValue={selectedTeacher.id || 'Select a teacher'}
                    onValueChange={handleTeacherChange}
                    style={styles.picker}
                    mode="dialog"
                >
                    <Picker.Item label="Select a teacher" value="Select a teacher" />
                    {teachers.map(t => (
                        <Picker.Item
                            key={t.id}
                            label={`${t.attributes.title ?? ''} ${t.attributes.firstname} ${t.attributes.lastname}`.trim()}
                            value={t.id}
                        />
                    ))}
                </Picker>
            </View>

            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={imageError || !selectedTeacher.attributes.image_url
                        ? require('@/assets/images/Teacher.png')
                        : { uri: selectedTeacher.attributes.image_url }}
                    resizeMode="contain"
                    onError={() => setImageError(true)}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pickerContainerIOS: {
        height: 170,
        width: 250,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    pickerContainerAndroid: {
        height: 50,
        width: 250,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: 250,
        color: 'black'
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    image: {
        width: 300,
        height: 300
    },
});