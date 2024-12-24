import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className='min-h-screen flex flex-col text-white'>
            <main className='container mx-auto px-16 pt-16 flex-1 text-center'>
                <h1 className='text-3xl md:text-6xl lg:text-8xl uppercase font-black mb-8'>IEEE MESH</h1>
                <p className="text-base md:text-lg lg:text-2xl mb-8">An effort to increase new student retention and maintain alumni connections by creating accessible, centralized profiles of academic and professional involvements.</p>
                <div className='text-lg md:text-2xl lg:text-3xl py-2 px-4 md:py-4 md:px-10 lg:py-6 lg:px-12 bg-white bg-opacity-10 w-fit mx-auto mb-8 rounded-full'>
                    x members
                </div>
                <Link to='/dash/members' className='text-lg md:text-2xl lg:text-3xl py-2 px-4 md:py-4 md:px-10 lg:py-6 lg:px-12 bg-medium hover:bg-opacity-70 duration-150 w-1/2 mx-auto mb-4 rounded-xl block'>
                    View Database
                </Link>
                <Link to='/register' className='text-lg md:text-2xl lg:text-3xl py-2 px-4 md:py-4 md:px-10 lg:py-6 lg:px-12 bg-medium hover:bg-opacity-70 duration-150 w-1/2 mx-auto mb-4 rounded-xl block'>
                    Register
                </Link>
                
            </main>

            <footer className='container mx-auto p-4 flex flex-col md:flex-row items-center justify-between'>
                <p>footer stuff here</p>
                <div className='flex -mx-4'>
                    <a href='#' className='mx-3 hover:opacity-80 duration-150'>About us</a> |
                    <a href='#' className='mx-3 hover:opacity-80 duration-150'>Privacy</a> |
                    <a href='#' className='mx-3 hover:opacity-80 duration-150'>Contact</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;