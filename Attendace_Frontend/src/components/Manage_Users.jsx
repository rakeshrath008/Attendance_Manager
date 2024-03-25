import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Manage_Users = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    empId: '',
    role: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const [userData, setData] = useState([]);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const token = Cookies.get('token')
      const response = await fetch('http://localhost:5000/users/allusers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      console.log(result);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message);
        throw new Error('Failed to submit form');
      }

      setForm({});
      setSubmitted(true);
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!form.role) {
      errors.role = "Please select a role";
    }

    if (!form.username.trim()) {
      errors.username = 'Username is required';
    } else if (form.username.length < 4 || form.username.length > 20) {
      errors.username = 'Username must be between 4 and 20 characters';
    } else if (!/^[A-Za-z0-9@]+$/.test(form.username)) {
      errors.username = 'Username can only contain letters,at the rate of and numbers';
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      errors.email = 'Invalid email format';
    }

    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 8 || form.password.length > 20) {
      errors.password = 'Password must be between 8 and 20 characters';
    }
    else if (!/^[a-zA-Z0-9@#%]+$/.test(form.password)) {
      errors.password = 'password can only contain letters, numbers, and dollar, hash and percentage';
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (form.confirmPassword !== form.password) {
      errors.confirmPassword = 'Password and Confirm Password do not match';
    }

    if (!form.empId.trim()) {
      errors.empId = 'Employee ID is required';
    } else if (!/^[0-9]+$/.test(form.empId)) {
      errors.empId = 'Employee ID can only contain only numbers';
    }

    return errors;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleToggle = async (userId, index) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:5000/users/${userId}/toggleStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to toggle user status');
      }
      fetchData();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleLogout = () => {
    const cookies = Cookies.get();
    for (const cookie in cookies) {
      Cookies.remove(cookie);
    }
    navigate('/login');
  };

  return (
    <div className='flex items-center justify-center text-center font-serif md:mt-[-530px] md:ml-[240px]'>
      <div className='text-center items-center '>
        <div className="flex justify-center items-center">
          <div className='mt-1  '>
            <h1 className='md:text-2xl text-l font-bold underline text-yellow-100'>Create a new user</h1><br />
            {submitted ? (
              <p>Your details submitted successfully!</p>
            ) : (
              <form className='flex flex-col' onSubmit={handleSubmit}>
                <div className='flex space-x-52'>
                  <div>
                    <label className="block text-left mb-1" htmlFor="username">Username</label>
                    <input type="text" id="username" className='rounded-md h-6 w-auto outline outline-offset-2 outline-1' name="username" value={form.username || ''} onChange={handleForm} />
                    {validationErrors.username && (<p className='text-start' style={{ color: 'red' }}>{validationErrors.username}</p>)}
                  </div>
                  <div>
                    <label className="block text-left mb-1" htmlFor="email">Email</label>
                    <input type="email" id="email" className='rounded-md h-6 w-auto outline outline-offset-2 outline-1' name="email" value={form.email || ''} onChange={handleForm} />
                    {validationErrors.email && (<p className='text-start' style={{ color: 'red' }}>{validationErrors.email}</p>)}
                  </div>
                </div><br />
                <div className='flex space-x-52'>
                  <div>
                    <label className="block text-left mb-1" htmlFor="password">Password</label>
                    <input type="password" id="password" className='rounded-md h-6 w-auto outline outline-offset-2 outline-1' name='password' value={form.password || ''} onChange={handleForm} />
                    {validationErrors.password && (<p className='text-start' style={{ color: 'red' }}>{validationErrors.password}</p>)}
                  </div>
                  <div>
                    <label className="block text-left mb-1" htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" className='rounded-md h-6 w-auto outline outline-offset-2 outline-1' name="confirmPassword" value={form.confirmPassword || ''} onChange={handleForm} />
                    {validationErrors.confirmPassword && (<p className='text-start' style={{ color: 'red' }}>{validationErrors.confirmPassword}</p>)}
                  </div>
                </div><br />
                <div className='flex space-x-52'>
                  <div>
                    <label className="block text-left mb-1" htmlFor="empId">Employee-ID</label>
                    <input type="text" id="empId" className='rounded-md h-6 w-auto outline outline-offset-2 outline-1' name="empId" value={form.empId || ''} onChange={handleForm} />
                    {validationErrors.empId && (<p className='text-start' style={{ color: 'red' }}>{validationErrors.empId}</p>)}
                  </div>
                  <div>
                    <label className="block text-left mb-1" htmlFor="role">Role</label>
                    <select id="role" name="role" className='rounded-md h-6 w-44 outline outline-offset-2 outline-1' value={form.role || ''} onChange={handleForm}>
                      <option value="">-Select Role-</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    {validationErrors.role && (<p className='text-start' style={{ color: 'red' }}>{validationErrors.role}</p>)}
                  </div>
                </div>
                <div><br />
                  <button type="submit" className='outline outline-offset-3 outline-1 text-red-600 font-bold bg-green-500 hover:bg-blue-600 hover:text-white hover:outline-offset-3 px-4 py-1 rounded-md'>Submit</button>
                </div>
                {message && <p className="text-red-500">{message}</p>}
              </form>
            )}
          </div>
        </div>
        <div><br />
          <p className='underline cursor-pointer text-blue-800 hover:scale-110 mt-[-40px] ml-[50pc]' onClick={handleLogout}>Click here for the login page</p>
        </div><br />
        <div className='outline outline-offset-2 outline-1 overflow-scroll overflow-x-hidden h-44 bg-white'>
          <table className="border-collapse border border-gray-400">
            <thead>
              <tr className="bg-blue-400">
                <th className="border border-black py-2 px-[70px]">Employee_ID</th>
                <th className="border border-black py-2 px-[70px]">Username</th>
                <th className="border border-black py-2 px-[70px]">Email</th>
                <th className="border border-black py-2 px-[70px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 py-2 px-[70px]">{user.Employee_ID}</td>
                  <td className="border border-gray-400 py-2 px-[70px]">{user.Username}</td>
                  <td className="border border-gray-400 py-2 px-[70px]">{user.Email}</td>
                  <td className="border border-gray-400 py-2 px-[70px]">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={user.Status === 'Active'}
                        onChange={(e) => { handleToggle(user.userId, index) }}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {user.Status === 'Active' ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Manage_Users;
