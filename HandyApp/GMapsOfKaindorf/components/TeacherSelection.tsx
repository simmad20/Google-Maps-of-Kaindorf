import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { Picker } from '@react-native-picker/picker';

interface Teacher {
  name: string;
  img_url: string;
}

export default function TeacherSelection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>({ name: '', img_url: '' });
  const [imageError, setImageError] = useState(false);

  const serverIP = '192.168.82.3'; // Ersetze dies durch die IP-Adresse deines Servers
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
      setSelectedTeacher({ name: itemValue, img_url: '' });
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
        {/* Picker container with zIndex to avoid overlap issues */}
        <View style={[Platform.OS === 'ios' ? styles.pickerContainerIOS : styles.pickerContainerAndroid, { zIndex: 1 }]}>
          <Picker
              selectedValue={selectedTeacher.name}
              onValueChange={handleTeacherChange}
              style={Platform.OS === 'ios' ? styles.pickerIOS : styles.pickerAndroid}
          >
            <Picker.Item label="Select a teacher" value="Select a teacher" />
            {teachers.map((teacher, index) => (
                <Picker.Item key={index} label={teacher.name} value={teacher.name} />
            ))}
          </Picker>
        </View>

        <View style={styles.imageContainer}>
          <Image
              style={styles.image}
              source={(imageError || selectedTeacher.img_url.length < 1)
                  ? require('@/assets/images/Teacher.png')
                  : { uri: selectedTeacher.img_url }}
              resizeMode="contain"
              onError={handleImageError}
          />
        </View>

        {teachers.map((teacher, index) => <Text style={styles.text} key={index}>{teacher.name}</Text>)}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // To avoid content being cut off in ScrollView
  },
  pickerContainerIOS: {
    height: 150, // Adjusted height for iOS Picker
    width: 300,
    zIndex: 10, // Ensure the picker is above other elements
  },
  pickerContainerAndroid: {
    height: 50,
    width: 250,
    backgroundColor: '#ffffff',
    elevation: 3, // Ensure the picker appears correctly on Android
  },
  pickerIOS: {
    height: 150,
    width: 300,
    color: 'black',
    zIndex: 10, // Ensure this element is clickable
  },
  pickerAndroid: {
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
  text: {
    color: '#ffffff',
    fontSize: 16,
  }
});
