import Sidebar from './Sidebar';

export default function PageWrapper({ children }) {
    return (
        <div className="min-h-screen bg-bg bg-gradient-mesh">
            <Sidebar />
            <main className="lg:ml-[260px] min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
