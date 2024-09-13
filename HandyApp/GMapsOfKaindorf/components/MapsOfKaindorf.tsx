import React, { useEffect, useState } from 'react';

import axios from 'axios';

interface Teacher {
    name: string;
}

export default function MapsOfKaindorf() {
  const [teachers, setTeachers] = useState([] as Teacher[]);

  const serverIP = '192.168.x.x'; // Ersetze dies durch die IP-Adresse deines Servers
  const serverPort = '27007'; // Der Port, den dein Server verwendet
  const serverRoute = "getTeachers"

  return (
    <>
    </>
  );
}