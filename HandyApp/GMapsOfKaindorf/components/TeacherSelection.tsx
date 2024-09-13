import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

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
    <View>
      <Picker selectedValue={selectedTeacher} onValueChange={(itemValue) => setSelectedTeacher(itemValue)} style={{ height: 50, width: 250, color: "black", backgroundColor: "#ffffff" }}>
        <Picker.Item label="Select a teacher" value="Select a teacher" />
        {teachers.map((teacher, index) => (
          <Picker.Item key={index} label={teacher.name} value={teacher.name} />
        ))}
      </Picker>
    </View>
  );
}