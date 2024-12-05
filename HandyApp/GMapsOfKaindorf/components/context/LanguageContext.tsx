import React, {createContext, useState} from "react";

type Language = 'de' | 'en';

const texts = {
    de: {greeting: 'Willkommen'},
    en: {greeting: 'Welcome'}
}

export interface LanguageContextType {
    language: Language
    texts: typeof texts['de']
    switchLanguage: () => void
}

export const LanguageContext = createContext<LanguageContextType>({
    language: 'de',
    texts: texts['de'],
    switchLanguage: () => null
})

interface ILanguageProvider {
    children?: React.ReactNode
}

const LanguageProvider = ({children}: ILanguageProvider) => {
    const [language, setLanguage] = useState<Language>('de');

    const switchLanguage = () => {
        setLanguage(prevState => prevState === 'de' ? 'en' : 'de');
    }

    return (
        <LanguageContext.Provider value={{language, texts: texts['de'], switchLanguage}}>
            {children}
        </LanguageContext.Provider>
    )
}

export default LanguageProvider;