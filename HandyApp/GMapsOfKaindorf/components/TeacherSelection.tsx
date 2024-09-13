import { Image, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { Picker } from '@react-native-picker/picker';

interface Teacher {
  name: string;
}

export default function TeacherSelection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');

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
        const tempTeachers:Teacher[] = [];
        data.forEach((name:string) => {
          tempTeachers.push({name: name});
        });
        
        setTeachers(tempTeachers);
        console.log(tempTeachers);
      } catch (err) {
        console.log('Failed to fetch teachers.', err);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <View style={styles.container}>
      <Picker selectedValue={selectedTeacher} onValueChange={(itemValue) => setSelectedTeacher(itemValue)} style={{ height: 50, width: 250, color: "black", backgroundColor: "#ffffff" }}>
        <Picker.Item label="Select a teacher" value="Select a teacher" />
        {teachers.map((teacher, index) => (
          <Picker.Item key={index} label={teacher.name} value={teacher.name} />
        ))}
      </Picker>

      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: 'https://www.htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-KOHLWEG_Christoph-scaled.jpg&w=1200&q=90' }} resizeMode="contain" />
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
    height: 300, // Die Bildgröße anpassen
  },
});