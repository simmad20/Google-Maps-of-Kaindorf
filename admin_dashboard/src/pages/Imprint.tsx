const Imprint = () => {
    return (
        <div className="w-full flex flex-col items-center text-gray-800 bg-white min-h-screen">
            {/* Header */}
            <section className="w-full bg-gray-900 text-white">
                <div className="max-w-3xl mx-auto px-6 py-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-purple-400 mb-4 border border-purple-700 px-3 py-1 rounded-full">
            Rechtliche Informationen
          </span>
                    <h1 className="text-4xl font-bold mb-3">Impressum</h1>
                    <p className="text-gray-400 text-sm">
                        Angaben gemäß § 25 Mediengesetz (MedienG) und § 5 E-Commerce-Gesetz (ECG)
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="w-full max-w-3xl px-6 py-16 space-y-8">

                <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Projektverantwortliche</h2>
                    <div className="space-y-5 text-sm text-gray-600">
                        {[
                            { name: "Franca Harzl", role: "Projektleiterin" },
                            { name: "Mark Simo", role: "Projektmitglied" },
                            { name: "Robert Raminger", role: "Projektmitglied" },
                        ].map((p) => (
                            <div key={p.name}>
                                <p className="font-semibold text-gray-800">{p.name}</p>
                                <p className="text-purple-500 text-xs font-medium uppercase tracking-wide mt-0.5">{p.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Zweck dieser Website</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Diese Website wurde im Rahmen einer Diplomarbeit an einer österreichischen Höheren Technischen Lehranstalt (HTL)
                        erstellt. Sie dient ausschließlich zu Demonstrations- und Präsentationszwecken und verfolgt keinerlei
                        kommerzielle Absichten. Eine wirtschaftliche Tätigkeit wird über diese Plattform nicht ausgeübt.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Haftungsausschluss</h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        <span className="font-medium text-gray-700">Inhalt: </span>
                        Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit,
                        Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        <span className="font-medium text-gray-700">Externe Links: </span>
                        Diese Website kann Links zu externen Webseiten Dritter enthalten. Auf deren Inhalte haben wir keinen
                        Einfluss und übernehmen dafür keine Gewähr.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-8">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Urheberrecht</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Die durch die Projektverantwortlichen erstellten Inhalte und Werke auf dieser Website unterliegen dem
                        österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
                        außerhalb des Urheberrechtes bedürfen der schriftlichen Zustimmung der jeweiligen Autorinnen und Autoren.
                    </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Online-Streitbeilegung</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Da diese Plattform keinerlei kommerzielle Tätigkeit ausübt, besteht keine Verpflichtung zur Teilnahme
                        an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle. Für Verbraucher besteht
                        die Möglichkeit, Beschwerden an die EU-Plattform zur Online-Streitbeilegung zu richten:{" "}
                        <a
                            href="https://ec.europa.eu/consumers/odr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 underline"
                        >
                            https://ec.europa.eu/consumers/odr
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

export default Imprint;