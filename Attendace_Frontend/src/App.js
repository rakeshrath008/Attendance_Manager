import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import Layout from './components/Layout';
import Holidays from './components/Holidays';
import Attendance from './components/Attendance'
import Manage_Users from './components/Manage_Users';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/admin' element={<Layout />}>
                    <Route index element={<AdminDashboard />} />
                </Route>
                <Route path='/attendance' element={<Layout />}>
                    <Route index element={<Attendance />} />
                </Route>
                <Route path='/manage-users' element={<Layout />}>
                    <Route index element={<Manage_Users />} />
                </Route>
                <Route path='/holidays' element={<Layout />}>
                    <Route index element={<Holidays />} />
                </Route>
                <Route path='/' element={<Navigate to="/Login" />} />
                <Route path='/login' element={<Login />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
