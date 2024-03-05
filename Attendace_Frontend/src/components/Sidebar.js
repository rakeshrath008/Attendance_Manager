import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { HiMenu } from 'react-icons/hi';
import { Link} from 'react-router-dom';
const Sidebar = () => {
    const role = Cookies.get('role');      
    const [showAdmin, setShowAdmin] = useState(true);
    const toggleAdmin = () => {
        setShowAdmin(!showAdmin);
    };
    return (
        <div className='font-serif'>
            {showAdmin && (
                <div className='bg-black bg-opacity-100 w-60 h-screen'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-white font-bold mt-4 ml-4 text-xl'>Admin</h3>
                        <div className='text-red cursor-pointer' >
                            <HiMenu className='h-6 w-6 mt-5 mr-2 bg-yellow-200 rounded-md'/>
                        </div>
                    </div>
                    <br />
                    {role === 'admin' && (
                        <div className='text-blue-600 cursor-pointer'>
                            <ul className="list-none space-y-2 ">
                                <li className="flex items-center hover:bg-yellow-900 rounded-md">
                                    <span className="mr-2 text-white">&#8594;</span>
                                    <Link to="/manage-users" className='text-white'>Manage Users</Link>
                                </li>
                                <li className="flex items-center hover:bg-yellow-900 rounded-md">
                                    <span className="mr-2 text-white">&#8594;</span>
                                    <Link to="/attendance" className='text-white'>Attendance</Link>
                                </li>
                                <li className="flex items-center hover:bg-yellow-900 rounded-md">
                                    <span className="mr-2 text-white">&#8594;</span>
                                    <Link to="/holidays" className='text-white cursor-pointer'>Holidays</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Sidebar;
