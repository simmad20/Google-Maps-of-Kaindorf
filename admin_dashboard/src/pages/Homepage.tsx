function HomePage() {
    return (
        <div className="w-full flex flex-col items-center text-black bg-white">
            <section className="w-full max-w-6xl px-6 py-20 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Next‑generation <span className="text-purple-600">Indoor Navigation</span>
                        <br/> for Smart Buildings
                    </h1>
                    <p className="text-gray-600 mb-6 max-w-md">
                        Our platform enables precise indoor positioning using Bluetooth, WiFi and other modern
                        technologies. Objects and people can be tracked in real time, visualized in an intuitive mobile
                        app, and managed through a powerful admin dashboard.
                    </p>
                    <div className="flex gap-4">
                        <button
                            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">Get
                            Started
                        </button>
                        <button
                            className="px-6 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100 transition">Learn
                            More
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex justify-center">
                    <div className="w-72 h-96 bg-gray-100 rounded-3xl shadow-xl"/>
                </div>
            </section>

            <section className="w-full max-w-5xl px-6 py-20 text-center">
                <h2 className="text-3xl font-bold mb-14">How it works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    <div>
                        <h3 className="text-xl font-semibold mb-3">1. Manage</h3>
                        <p className="text-gray-600">Admins can upload their maps as an image and create rooms on them. All kinds of objects can be created (e.g. teachers, shops) and assigned to the rooms.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-3">2. Visualize</h3>
                        <p className="text-gray-600">Locations are displayed in the mobile app and admin dashboard on
                            scalable floor‑maps.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">3. Detect</h3>
                        <p className="text-gray-600">Indoor signals such as Bluetooth and WiFi are captured to determine
                            precise room‑level positions.</p>
                    </div>
                </div>
            </section>

            <section className="w-full max-w-6xl px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-16">Why our solution stands out</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold">High‑precision indoor tracking</h3>
                            <p className="text-gray-600">More accurate than classic GPS inside buildings.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Cross‑device map scalability</h3>
                            <p className="text-gray-600">Positions stay accurate on screens of any size.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Powerful admin dashboard</h3>
                            <p className="text-gray-600">Easily manage rooms, teachers, devices, or store objects.</p>
                        </div>
                    </div>

                    <div className="w-full h-80 bg-gray-100 rounded-3xl shadow-xl"/>
                </div>
            </section>
        </div>
    );
}

export default HomePage;