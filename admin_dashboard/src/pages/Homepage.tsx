function HomePage() {
    return (
        <div className="w-full flex flex-col items-center text-gray-800 bg-white">

            {/* Hero */}
            <section className="w-full bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-purple-400 mb-4 border border-purple-700 px-3 py-1 rounded-full">
                            Indoor Navigation Platform
                        </span>
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Navigate complex buildings
                            <span className="block text-purple-400">floor by floor.</span>
                        </h1>
                        <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
                            A multi-tenant platform for managing indoor floor plans, assigning objects to rooms,
                            and guiding users through buildings via a mobile app with real-time A* pathfinding.
                        </p>
                        <div className="flex gap-4">
                            <a href="/auth" className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                                Get Started
                            </a>
                            <a href="/map" className="px-6 py-3 rounded-lg border border-gray-600 text-white font-semibold hover:bg-gray-800 transition">
                                Open Dashboard
                            </a>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <div className="w-72 h-80 bg-gray-800 rounded-2xl border border-purple-800 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <div className="w-16 h-16 border-2 border-purple-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                                    <div className="w-6 h-6 bg-purple-700 rounded-full" />
                                </div>
                                <p className="text-sm">Floor Plan Preview</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="w-full max-w-5xl px-6 py-20 text-center">
                <h2 className="text-3xl font-bold mb-3">How it works</h2>
                <p className="text-gray-500 mb-14 max-w-xl mx-auto">
                    Three steps from setup to navigation — for admins and end users alike.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            step: "01",
                            title: "Configure",
                            desc: "Upload floor plan images as cards. Create rooms by clicking directly on the map. Define object types and assign objects to rooms per event."
                        },
                        {
                            step: "02",
                            title: "Map navigation",
                            desc: "Place navigation nodes across all floors and connect them. Link staircase nodes across floors and define a single global start node as the user entry point."
                        },
                        {
                            step: "03",
                            title: "Navigate",
                            desc: "Users scan a QR code to join a tenant. The mobile app places them at the start node and calculates the shortest route using A* pathfinding across multiple floors."
                        },
                    ].map((item) => (
                        <div key={item.step} className="text-left p-6 border border-gray-200 rounded-xl hover:border-purple-400 transition group">
                            <div className="text-xs font-bold tracking-widest text-purple-500 mb-3">{item.step}</div>
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="w-full bg-gray-50 border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <h2 className="text-3xl font-bold text-center mb-3">Platform features</h2>
                    <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
                        Everything needed to manage and navigate multi-floor buildings across multiple organizations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Multi-tenant architecture",
                                desc: "Each organization has an isolated tenant with its own floor plans, objects, events and users. Super admins manage their tenant and invite additional admin roles."
                            },
                            {
                                title: "Role-based access control",
                                desc: "Four distinct roles: Super Admin, Admin, Admin Viewer and App User. Permissions are enforced on both the frontend and API level via JWT authentication."
                            },
                            {
                                title: "Event-based room assignments",
                                desc: "Rooms and object assignments are scoped to events. Switch between events to reflect different configurations of the same building."
                            },
                            {
                                title: "A* pathfinding across floors",
                                desc: "The mobile app computes optimal routes using A* with weighted node types. Hallway nodes are preferred; staircase nodes link floors. Step counting and compass data move the user position in real time."
                            },
                            {
                                title: "QR code onboarding",
                                desc: "App users scan a QR code to join a tenant without registration. They receive a JWT and are placed at the configured global start node immediately."
                            },
                            {
                                title: "Visual node editor",
                                desc: "Admins place, connect, and delete navigation nodes directly on the floor plan. Cross-floor staircase connections can be created by selecting nodes on different cards."
                            },
                        ].map((f) => (
                            <div key={f.title} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-300 transition group">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mb-4 group-hover:scale-125 transition-transform" />
                                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <div className="w-1 h-12 bg-purple-500 mx-auto mb-8 rounded-full" />
                    <h2 className="text-3xl font-bold mb-4">Ready to set up your building?</h2>
                    <p className="text-gray-400 mb-8">
                        Register your organization, upload your floor plans, and start navigating in minutes.
                    </p>
                    <a href="/register" className="inline-block px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                        Create an account
                    </a>
                </div>
            </section>
        </div>
    );
}

export default HomePage;