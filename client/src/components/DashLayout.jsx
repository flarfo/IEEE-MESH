import { Outlet } from 'react-router-dom';
import DashHeader from './DashHeader';
import DashFooter from './DashFooter';

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className='p-0.5 flex-grow-1'>
                <Outlet />
            </div>
            <DashFooter />
        </>
    );
};

export default DashLayout;