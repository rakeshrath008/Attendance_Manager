import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LoginPage = () => {
    const [form, setForm] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
      };
    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            setError("Username and password are required.");
            return;
        }

        setError(null);

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to log in');
            }

            const { token, userId, username, role } = await response.json();
            Cookies.set('token', token);
            Cookies.set('username', username);
            Cookies.set('role', role);
            Cookies.set('userId', userId);
            setForm({});
            navigate('/attendance');
        } catch (error) {
            console.error('Error logging in:', error.message);
            setError('Invalid credentials');
        }
    };

    return (
        <div className="bg-black min-h-screen  flex items-center justify-center font-serif">
            <div className='items-center justify-center outline outline-offset-3 outline-1 border border-green-800 rounded-2xl p-8'>
                <h1 className='font-bold text-s text-white text-center'>Have an account?</h1><br />
                <h1 className='font-bold text-3xl text-white text-center mt-[-12px]'>Login</h1><br />
                <form className='flex flex-col items-center' onSubmit={handleSubmit}>
                    <div className='flex items-start mb-4'>
                        <div className="relative">
                            <input
                                className='rounded-2xl h-10 pl-6 w-72 outline outline-offset-2 outline-1 border border-blue-500'
                                type="text"
                                name='username'
                                placeholder='Username'
                                value={form.username || ''}
                                onChange={handleForm}
                            />
                        </div>
                    </div>
                    <div className='flex items-start mb-4'>
                        <div className="relative">
                            <input
                                className='border border-blue-500 rounded-2xl h-10 pl-6 w-72 outline outline-offset-2 outline-1'
                                type="password"
                                name='password'
                                placeholder='Password'
                                value={form.password || ''}
                                onChange={handleForm}
                            />
                        </div>
                    </div>
                    <button className='font-bold outline outline-offset-3 outline-1 border border-white bg-purple-400 text-black hover:bg-blue-600 hover:text-white hover:outline-offset-3 px-[86px] py-1 rounded-2xl h-10 w-72' type="submit">Login</button>
                    <div className='mt-1'>
                    <label className='text-white text-sm'>
                    <input type='checkbox'  checked={isChecked} className='mr-2' onChange={handleCheckboxChange}/>{isChecked ? 'Checked' : 'Remember Me'}</label>
                    <label className='text-white text-sm ml-[60px] cursor-pointer'>Forgot password?</label>
                    </div>
                </form><br />
                {error && <p className='text-red-500'>{error}</p>}
            </div>
        </div>
    );
}

export default LoginPage;
