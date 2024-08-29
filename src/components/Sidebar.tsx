import { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import logo from '../images/logo.png';
import Image from 'next/image';

const Sidebar = ({ setActiveComponent }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="absolute flex h-screen">
            {/* Toggle Button */}
            <div className="fixed top-4 left-4 z-50">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-tertiary text-white rounded-md focus:outline-none"
                >
                    {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>
            </div>
            <div
                className={`bg-gradient-primary text-white fixed top-0 left-0 h-full flex flex-col items-center justify-center transition-all duration-300 z-40 ${
                    isOpen ? 'w-[25vw] md:w-[18vw]' : 'w-0'
                } overflow-hidden`}
            >
                <div className={`mb-8 ${isOpen ? 'block' : 'hidden'}`}>
                    <Image
                        src={logo}
                        alt="Logo"
                        width={100}
                        height={100}
                        className="animate-bounce w-16 h-16 md:w-20 md:h-20"
                    />
                    <h1 className="text-xl font-medium mt-4 md:text-2xl md:font-bold">
                        My Site
                    </h1>
                </div>

                <div className={`flex flex-col space-y-4 ${isOpen ? 'block' : 'hidden'}`}>
                    <button
                        onClick={() => setActiveComponent('form')}
                        className="px-3 py-1 bg-white text-primary rounded hover:bg-tertiary transition duration-300 text-sm md:text-base md:px-4 md:py-2"
                    >
                        Place Order
                    </button>
                    <button
                        onClick={() => setActiveComponent('history')}
                        className="px-3 py-1 bg-white text-primary rounded hover:bg-tertiary transition duration-300 text-sm md:text-base md:px-4 md:py-2"
                    >
                        Order History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
