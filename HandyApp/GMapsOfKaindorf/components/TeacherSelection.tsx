import { Image, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { Picker } from '@react-native-picker/picker';

interface Teacher {
  name: string;
  img_url: string;
}

export default function TeacherSelection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>({name: '', img_url: ''});
  const [imageError, setImageError] = useState(false);

  const serverIP = '192.168.222.3'; // Ersetze dies durch die IP-Adresse deines Servers
  const serverPort = '27007'; // Der Port, den dein Server verwendet
  const serverRoute = 'getTeachers'; // Die Route, wo die Lehrer abgerufen werden

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`http://${serverIP}:${serverPort}/${serverRoute}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setTeachers(data);
        console.log(data);
      } catch (err) {
        console.log('Failed to fetch teachers.', err);
      }
    };

    fetchTeachers();
  }, []);

  const handleTeacherChange = (itemValue: string) => {
    if (itemValue === 'Select a teacher') {
      setSelectedTeacher({ name: itemValue, img_url: '../assets/images/Teacher.png' });
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
    <View style={styles.container}>
      <Picker selectedValue={selectedTeacher.name} onValueChange={handleTeacherChange} style={{ height: 50, width: 250, color: "black", backgroundColor: "#ffffff" }}>
        <Picker.Item label="Select a teacher" value="Select a teacher" />
        {teachers.map((teacher, index) => (
          <Picker.Item key={index} label={teacher.name} value={teacher.name} />
        ))}
      </Picker>

      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: imageError ? '../assets/images/Teacher.png' : selectedTeacher.img_url }} resizeMode="contain" onError={handleImageError} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
});