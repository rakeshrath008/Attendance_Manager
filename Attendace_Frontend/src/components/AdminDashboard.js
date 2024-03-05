import React, { useEffect, useState } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';

function AdminDashboard() {
    const [submissionType, setSubmissionType] = useState('entry');
    const [submissionStatus, setSubmissionStatus] = useState('');
    const userID = Cookies.get('userId');
    const username = Cookies.get('username');
    useEffect(() => {
        const options = {
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };

        async function fetchData() {
            try {
                const token = Cookies.get('token');
                const response = await fetch(`http://localhost:5000/lastData/${userID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.type === 'entry') {
                        setSubmissionType('exit');
                        const entryTime = new Date(responseData.time);
                        const indianTime = entryTime.toLocaleTimeString('en-US', options);
                        setSubmissionStatus(`Entry submitted successfully at ${indianTime}`);
                    } else if (responseData.type === 'exit') {
                        const exitTime = new Date(responseData.time);
                        const indianTime = exitTime.toLocaleTimeString('en-US', options);
                        setSubmissionStatus(`Exit submitted successfully at ${indianTime}`);
                    } else {
                        console.error('No entry or exit time found');
                    }
                } else {
                    console.error('Failed to fetch last data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching last data:', error);
            }
        }

        fetchData();
    }, [userID]);

    const handleSubmission = async () => {
        try {
            if (submissionType === null) {
                return;
            }

            const isEntry = submissionType === 'entry';
            const response = await sendTime(isEntry);
            const data = await response.json();
            displaySubmissionStatus(data, isEntry ? 'Entry' : 'Exit');
        } catch (error) {
            console.error('Error during submission:', error.message);
        }
    };

    const sendTime = async (isEntry) => {
        const response = await fetch(`http://localhost:5000/entry-exit-Time`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userID,
                username: username,
                entry: isEntry,
                exit: !isEntry,
            }),
        });
        return response;
    };

    const displaySubmissionStatus = (data, eventType) => {
        console.log('Received data:', data);

        if (!data || !data[`${eventType.toLowerCase()}Time`]) {
            console.error(`Invalid data received for ${eventType} submission.`);
            return;
        }

        const options = {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };

        const eventTimeIST = new Date(data[`${eventType.toLowerCase()}Time`]).toLocaleTimeString('en-US', options);

        if (eventType === 'Entry') {
            setSubmissionStatus(`${eventType} submitted successfully at ${eventTimeIST}`);
        } if (eventType === 'Exit') {
            setSubmissionStatus(`${eventType} submitted successfully at ${eventTimeIST}`);
        }
    };

    return (
        <div className='flex flex-col items-center text-center justify-center md:mt-[-500px] md:ml-[250px]'>
            <div className=' mt-10 flex flex-col items-center justify-center text-center'>
                <span onClick={() => setSubmissionType(submissionType === 'exit' ? 'entry' : 'exit')}>
                    <FaSignInAlt onClick={handleSubmission} className='size-[150px] mt-5 cursor-pointer' color={submissionType === 'entry' ? "green" : "red"} />
                </span>
                <div><br />
                    {submissionType === 'entry' ? <p className='text-purple-700 font-bold'>{submissionStatus}</p> : <p className='text-purple-700 font-bold'>{submissionStatus}</p>}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
