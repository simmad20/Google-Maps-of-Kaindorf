import React, { useEffect, useState } from 'react';

interface MapsOfKaindorf {
    OG: Object;
    UG: Object;
}

export default function MapsOfKaindorf() {
  const [maps, setMaps] = useState([] as MapsOfKaindorf[]);

  const serverIP = '192.168.x.x'; // Ersetze dies durch die IP-Adresse deines Servers
  const serverPort = '27007'; // Der Port, den dein Server verwendet
  const serverRoute = "getRoomOfTeacher"

  return (
    <>
    </>
  );
}