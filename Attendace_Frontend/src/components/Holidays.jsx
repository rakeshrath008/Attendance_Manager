import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Holidays = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [details, setDetails] = useState('');
  const [leaveDays, setLeaveDays] = useState([]);
  const [showDetailsInput, setShowDetailsInput] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/leave/')
      .then((response) => response.json())
      .then((data) => {
        setLeaveDays(data.map((item) => ({ ...item, date: new Date(item.date) })));
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const leaveDay = leaveDays.find((day) => day.date.getTime() === date.getTime());
    if (leaveDay) {
      setDetails(leaveDay.details);
    } else {
      setDetails('');
    }
  };

  const handleLeaveDay = () => {
    const leaveDay = leaveDays.find((day) => day.date.getTime() === selectedDate.getTime());
    if (leaveDay) {
      setLeaveDays(leaveDays.filter((day) => day.date.getTime() !== selectedDate.getTime()));

      fetch(`http://localhost:5000/leave/${selectedDate.getTime()}`, {
        method: 'DELETE',
      })
        .then(() => {
          console.log('Leave day removed successfully');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setShowDetailsInput(true);
    }
  };

  const handleSubmitDetails = () => {
    const newLeaveDay = { date: selectedDate, details };
    setLeaveDays([...leaveDays, newLeaveDay]);

    fetch('http://localhost:5000/leave/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLeaveDay),
    })
      .then(() => {
        console.log('Leave day added successfully');
        setShowDetailsInput(false);
        setDetails('');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='items-center justify-center text-center mt-[-470px] ml-[-400px] font-serif'>
      <h1 className='font-bold underline font-serif'>My Calendar</h1><br />
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="Select a date"
        inline
        dayClassName={(date) =>
          leaveDays.find((day) => day.date.getTime() === date.getTime())
            ? 'bg-red-400 text-white rounded'
            : ''
        }
      />
      {showDetailsInput && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Enter details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 mr-2 focus:outline-none focus:border-blue-500"
          />
          <button onClick={handleSubmitDetails} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-md">
            Submit
          </button>
        </div>
      )}
      {!showDetailsInput && (
        <div className="mt-2">
          <button onClick={handleLeaveDay} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {leaveDays.find((day) => day.date.getTime() === selectedDate?.getTime()) ? 'Remove Leave Day' : 'Set Leave Day'}
          </button>
        </div>
      )}
      <div className="mt-[-340px] ml-[1250px] font-serif text-center w-[350px] ">
  <h1 className="underline font-bold mb-4">Holiday List</h1>
  <div className="overflow-x-hidden overflow-scroll h-96">
    <table className="table-auto border-collapse border border-gray-300 ">
      <thead>
        <tr>
          <th className="border border-gray-400 px-4 py-2">Date</th>
          <th className="border border-gray-400 px-4 py-2">Details</th>
        </tr>
      </thead>
      <tbody>
        {leaveDays.map((day, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-yellow-100" : ""}>
            <td className="border border-gray-400 px-4 py-2 font-serif font-medium">
              {day.date.toDateString()}
            </td>
            <td className="border border-gray-400 px-4 py-2">{day.details}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default Holidays;
