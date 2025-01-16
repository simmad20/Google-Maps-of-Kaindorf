import {Image, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import {Picker} from '@react-native-picker/picker';

interface Teacher {
    name: string;
    img_url: string;
}

export default function TeacherSelection() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher>({name: '', img_url: ''});
    const [imageError, setImageError] = useState(false);

    const serverIP = '192.168.84.3'; // Ersetze dies durch die IP-Adresse deines Servers
    const serverPort = '27007'; // Der Port, den dein Server verwendet
    const serverRoute = 'getTeachers'; // Die Route, wo die Lehrer abgerufen werden
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch(`http://${serverIP}:${serverPort}/${serverRoute}`);
                console.log(response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setTeachers(data);

            } catch (err) {
                console.log('Failed to fetch teachers.', err);
            }
        };

        fetchTeachers();
    }, []);

    const handleTeacherChange = (itemValue: string) => {
        if (itemValue === 'Select a teacher') {
            setSelectedTeacher({name: itemValue, img_url: ''});
        } else {
            const teacher = teachers.find(t => t.name === itemValue);
            if (teacher) {
                setSelectedTeacher(teacher);
            }
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View
                style={Platform.OS === 'ios' ? styles.pickerContainerIOS : styles.pickerContainerAndroid}>
                <Picker
                    selectedValue={selectedTeacher.name}
                    onValueChange={handleTeacherChange}
                    style={styles.picker}
                    mode="dialog"
                >
                    <Picker.Item label="Select a teacher" value="Select a teacher"/>
                    {teachers.map((teacher, index) => (
                        <Picker.Item key={index} label={teacher.name} value={teacher.name}/>
                    ))}
                </Picker>
            </View>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={(imageError || selectedTeacher.img_url.length < 1)
                        ? require('@/assets/images/Teacher.png')
                        : {uri: selectedTeacher.img_url}}
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
