import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Schedules = () => {
    const { user } = useContext(AuthContext);
    const [schedules, setSchedules] = useState([]);
    const [formData, setFormData] = useState({
        doctor_id: '',
        days: '', // Например, "Mon, Wed, Fri" или "2025-04-06, 2025-04-07"
        time: '', // Например, "09:00-17:00"
        room: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/schedules', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Fetched schedules:', response.data);
            setSchedules(response.data);
            setError('');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Error fetching schedules: ${errorMsg}`);
            console.error('Fetch error:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Преобразуем doctor_id в число
        const submitData = {
            ...formData,
            doctor_id: parseInt(formData.doctor_id, 10) || 0 // Преобразуем в int, или 0 при NaN
        };
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/schedules', submitData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSchedules();
            setFormData({
                doctor_id: '',
                days: '',
                time: '',
                room: ''
            });
            setError('');
            showToast('Schedule created successfully');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Error creating schedule: ${errorMsg}`);
            console.error('Post error:', error);
        }
    };

    const showToast = (message) => {
        alert(message);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Schedules</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {user?.role === 'registrar' && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <input
                        name="doctor_id"
                        value={formData.doctor_id}
                        onChange={handleChange}
                        placeholder="Doctor ID"
                        type="number"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="days"
                        value={formData.days}
                        onChange={handleChange}
                        placeholder="Days (e.g., Mon, Wed, Fri or 2025-04-06, 2025-04-07)"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        placeholder="Time (e.g., 09:00-17:00)"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="room"
                        value={formData.room}
                        onChange={handleChange}
                        placeholder="Room"
                        className="border p-2 mr-2"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2">
                        Create
                    </button>
                </form>
            )}
            <ul>
                {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <li key={schedule.ID} className="mb-2">
                            Doctor ID: {schedule.DoctorID} - Days: {schedule.Days} - Time: {schedule.Time} - Room: {schedule.Room}
                        </li>
                    ))
                ) : (
                    <li>No schedules found</li>
                )}
            </ul>
        </div>
    );
};

export default Schedules;