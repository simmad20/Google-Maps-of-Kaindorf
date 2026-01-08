import React, { createContext, useState } from "react";

type Language = 'de' | 'en';

const oldTexts = {
    de: {
        greeting: 'Willkommen',
        otherLanguage: 'Englisch',
        step1: {
            title: 'Schritt 1: Code abändern',
            desc: {
                normal1: 'Bearbeite ',
                bold1: 'app/(tabs)/index.tsx',
                normal2: ', um Änderungen zu sehen.\nDrücke ',
                bold2: 'cmd + m',
                normal3: ', um die DevTools zu öffnen.'
            }
        },
        step2: {
            title: 'Schritt 2: Erkunden',
            desc: {
                normal1: 'Navigiere durch die Tabs, um mehr über diese Version der App zu erfahren.'
            }
        },
        step3: {
            title: 'Schritt 3: Projekt zurücksetzen',
            desc: {
                normal1: 'Sobald alle Tests abgeschlossen sind, führe ',
                bold1: 'npm run reset-project',
                normal2: ' aus, um einen frischen ',
                bold2: 'app',
                normal3: '-Ordner zu bekommen. Der aktuelle ',
                bold3: 'app',
                normal4: '-Ordner wird zu ',
                bold4: 'app-example',
                normal5: ' verschoben.'
            }
        }
    },
    en: {
        greeting: 'Welcome',
        otherLanguage: 'German',
        step1: {
            title: 'Step 1: Try it',
            desc: {
                normal1: 'Edit ',
                bold1: 'app/(tabs)/index.tsx',
                normal2: ' to see changes.\nPress ',
                bold2: 'cmd + m',
                normal3: ' to open developer tools.'
            }
        },
        step2: {
            title: 'Step 2: Explore',
            desc: {
                normal1: 'Explore the tabs to learn more about what\'s included in this starter app'
            }
        },
        step3: {
            title: 'Step 3: Get a fresh start',
            desc: {
                normal1: 'When you\'re ready, run ',
                bold1: 'npm run reset-project',
                normal2: ' to get a fresh ',
                bold2: 'app',
                normal3: ' directory. This will move the current ',
                bold3: 'app',
                normal4: ' to ',
                bold4: 'app-example',
                normal5: '.'
            }
        }
    }
}

const texts = {
    de: {
        language: 'Deutsch',
        feedback: 'Feedback abgeben',
        greeting: 'Willkommen bei Maps of Kaindorf',
        selectText: 'Lehrer auswählen',
        mapTitle: 'Weg-Finder',
        otherLanguage: 'Englisch',
        changeLanguageButton: 'Change to English',
        desc: {
            changeLanguage: 'Sprache: Deutsch',
            tutorial1: 'Wie funktioniert diese App?',
            tutorial2: 'Maps of Kaindorf ist eine App, mit der Sie Lehrpersonen in der HTL Kaindorf finden können. Dabei wird Ihnen Ihr Standort, der Standort der Lehrperson sowie ein Weg dorthin angezeigt.',
            tutorial3: 'Sie können unten zwischen den Tabs Home, Select und Map wählen. Wählen Sie die gewünschte Lehrperson im Tab Select aus, und lassen Sie sich den Weg im Tab Map zeigen.',
            tutorial4: 'Im Tab Map können Sie ihren aktuellen Standort über das Scannen von QR-Codes festlegen.',
            tutorial5: 'Oben rechts finden Sie zudem die Einstellungen.'
        },
        settings: 'Einstellungen',
    },
    en: {
        language: 'English',
        feedback: 'Provide feedback',
        greeting: 'Welcome to Maps of Kaindorf',
        selectText: 'Choose a Teacher',
        mapTitle: 'Find your Way',
        otherLanguage: 'German',
        changeLanguageButton: 'Zu Deutsch wechseln',
        desc: {
            changeLanguage: 'Language: English',
            tutorial1: 'How does this application work?',
            tutorial2: 'Maps of Kaindorf is an application used to find teachers of HTL Kaindorf. Your location, the location of the teacher as well as the path to it will be shown.',
            tutorial3: 'You can select the tabs Home, Select and Map down below. Select the desired teacher in tab Select, and view the path to it in tab Map.',
            tutorial4: 'In tab Map, you can set your current location through scanning of QR codes.',
            tutorial5: 'The settings are found on the upper right corner.'
        },
        settings: 'Settings'
    }
}

export interface LanguageContextType {
    language: Language
    oldTexts: typeof oldTexts['de']
    texts: typeof texts['de']
    switchLanguage: () => void
}

export const LanguageContext = createContext<LanguageContextType>({
    language: 'de',
    oldTexts: oldTexts['de'],
    texts: texts['de'],
    switchLanguage: () => null,
})

interface ILanguageProvider {
    children?: React.ReactNode
}

const LanguageProvider = ({ children }: ILanguageProvider) => {
    const [language, setLanguage] = useState<Language>('de');

    const switchLanguage = () => {
        console.log(language);
        setLanguage(prevState => prevState === 'de' ? 'en' : 'de');
    }

    return (
        <LanguageContext.Provider value={{ language, oldTexts: oldTexts[language], texts: texts[language], switchLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export default LanguageProvider;