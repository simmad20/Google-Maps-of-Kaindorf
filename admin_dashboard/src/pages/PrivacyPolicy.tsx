const PrivacyPolicy = () => {
    const sections = [
        {
            title: "1. Verantwortliche",
            content: `Diese Website wurde als Diplomarbeit von Franca Harzl (Projektleiterin), Mark Simo und Robert Raminger erstellt. 
        Sie dient ausschließlich Demonstrations- und Präsentationszwecken im schulischen Rahmen und ist nicht kommerziell. 
        Da keine natürliche oder juristische Person im Sinne eines Unternehmens hinter dieser Plattform steht, 
        fungieren die Projektverfasserinnen und -verfasser gemeinsam als Verantwortliche im Sinne der DSGVO.`,
        },
        {
            title: "2. Grundsätze der Datenverarbeitung",
            content: `Wir verarbeiten personenbezogene Daten nur, soweit dies für die Bereitstellung der Plattformfunktionalität 
        notwendig ist. Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung / 
        vorvertragliche Maßnahmen) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb 
        der Plattform). Daten werden nicht an Dritte weitergegeben und nicht für Werbezwecke genutzt.`,
        },
        {
            title: "3. Erhobene Daten und Zweck",
            content: `Beim Anlegen eines Admin-Accounts wird eine E-Mail-Adresse sowie ein Passwort (gespeichert als bcrypt-Hash) 
        erfasst. Diese Daten dienen ausschließlich der Authentifizierung. App-Nutzerinnen und -Nutzer, die per QR-Code 
        beitreten, erhalten ein anonymes JWT ohne Registrierung – es werden dabei keinerlei personenbezogene Daten erhoben. 
        Beim Betrieb des Webservers können technisch bedingt Server-Logs entstehen, die IP-Adresse, Zeitstempel und 
        aufgerufene Ressourcen enthalten. Diese Logs dienen ausschließlich der Fehlerdiagnose.`,
        },
        {
            title: "4. Datenspeicherung und -löschung",
            content: `Admin-Kontodaten werden gespeichert, solange das Konto aktiv ist. Nach Deaktivierung oder auf Anfrage 
        werden die Daten unverzüglich gelöscht. Server-Logs werden nach spätestens 30 Tagen automatisch gelöscht. 
        Da diese Plattform im Rahmen einer Diplomarbeit betrieben wird, kann der gesamte Datenbankinhalt nach 
        Abschluss der Arbeit vollständig gelöscht werden.`,
        },
        {
            title: "5. Weitergabe an Dritte",
            content: `Eine Weitergabe personenbezogener Daten an Dritte findet nicht statt, sofern wir nicht gesetzlich 
        dazu verpflichtet sind. Insbesondere werden keine Daten an Werbetreibende, Analysedienste oder 
        Social-Media-Plattformen übermittelt.`,
        },
        {
            title: "6. Cookies und lokale Speicherung",
            content: `Diese Plattform verwendet für die Authentifizierung JSON Web Tokens (JWT), die im lokalen Speicher 
        des Browsers (localStorage) abgelegt werden. Es werden keine Tracking-Cookies oder Cookies von Drittanbietern 
        eingesetzt. Technisch notwendige Session-Daten werden ausschließlich für die Dauer der Sitzung gespeichert.`,
        },
        {
            title: "7. Ihre Rechte",
            content: `Als betroffene Person haben Sie gemäß DSGVO folgende Rechte: Auskunft (Art. 15), Berichtigung (Art. 16), 
        Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie 
        Widerspruch (Art. 21). Zur Ausübung dieser Rechte wenden Sie sich an die oben genannten Projektverantwortlichen. 
        Darüber hinaus haben Sie das Recht, Beschwerde bei der österreichischen Datenschutzbehörde einzulegen 
        (www.dsb.gv.at).`,
        },
        {
            title: "8. Datensicherheit",
            content: `Die Plattform nutzt HTTPS zur verschlüsselten Übertragung aller Daten. Passwörter werden ausschließlich 
        als bcrypt-Hash gespeichert. Authentifizierung erfolgt über signierte JWTs mit begrenzter Gültigkeitsdauer. 
        Der Zugriff auf die Datenbank ist auf die Serverinfrastruktur beschränkt.`,
        },
        {
            title: "9. Änderungen dieser Datenschutzerklärung",
            content: `Da es sich um eine Diplomarbeit handelt, kann diese Datenschutzerklärung im Laufe des Projekts 
        angepasst werden. Die jeweils aktuelle Version ist auf dieser Seite abrufbar. Das Datum der letzten 
        Aktualisierung ist am Ende der Seite angegeben.`,
        },
    ];

    return (
        <div className="w-full flex flex-col items-center text-gray-800 bg-white min-h-screen">
            {/* Header */}
            <section className="w-full bg-gray-900 text-white">
                <div className="max-w-3xl mx-auto px-6 py-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-purple-400 mb-4 border border-purple-700 px-3 py-1 rounded-full">
            Rechtliche Informationen
          </span>
                    <h1 className="text-4xl font-bold mb-3">Datenschutzerklärung</h1>
                    <p className="text-gray-400 text-sm">
                        Gemäß Datenschutz-Grundverordnung (DSGVO) und Datenschutzgesetz (DSG) Österreich
                    </p>
                </div>
            </section>

            {/* Intro Banner */}
            <div className="w-full bg-purple-50 border-b border-purple-100">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <p className="text-sm text-purple-800 leading-relaxed">
                        Diese Plattform ist ein nicht-kommerzielles Diplomarbeitsprojekt. Die Erhebung personenbezogener Daten
                        ist auf das technisch notwendige Minimum beschränkt.
                    </p>
                </div>
            </div>

            {/* Sections */}
            <section className="w-full max-w-3xl px-6 py-16 space-y-6">
                {sections.map((s) => (
                    <div key={s.title} className="bg-white border border-gray-200 rounded-xl p-8 hover:border-purple-300 transition group">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mb-4 group-hover:scale-125 transition-transform" />
                        <h2 className="text-base font-semibold text-gray-900 mb-3">{s.title}</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
                    </div>
                ))}

                {/* Datenschutzbehörde */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mb-4" />
                    <h2 className="text-base font-semibold text-gray-900 mb-3">Österreichische Datenschutzbehörde</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Barichgasse 40–42, 1030 Wien
                        <br />
                        Telefon: +43 1 52 152-0
                        <br />
                        <a
                            href="https://www.dsb.gv.at"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 underline"
                        >
                            www.dsb.gv.at
                        </a>
                    </p>
                </div>

                <p className="text-xs text-gray-400 text-center pt-2">
                    Stand: {new Date().toLocaleDateString("de-AT", { month: "long", year: "numeric" })}
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;