import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="h-screen w-screen overflow-hidden relative">
            <div className="h-screen overflow-auto bg-transparent relative z-10">
                <Navbar />
                <div className="h-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;