import Sidebar from "./Sidebar";
import Header from "./Header";
import React from 'react'
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="bg-slate-200 h-screen ml-[6px] mb-[2px] mt-[3px] mr-[1px]">
            <div className='flex'>
                <div className='h-screen'>
                    <Sidebar />
                </div>
                    <Header />
            </div>
            <Outlet />
        </div>
    )
}

export default Layout
