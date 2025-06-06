import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Schedules = () => {
    const { user } = useContext(AuthContext);
    const [schedules, setSchedules] = useState([]);
    const [formData, setFormData] = useState({
        doctor_id: '',
        selectedDays: [],
        time: '',
        room: ''
    });
    const [error, setError] = useState('');

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

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
            setError(`Ошибка при загрузке расписаний: ${errorMsg}`);
            console.error('Fetch error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDayChange = (day) => {
        let newSelectedDays = [...formData.selectedDays];
        if (newSelectedDays.includes(day)) {
            newSelectedDays = newSelectedDays.filter(d => d !== day);
        } else {
            if (newSelectedDays.length < 3) {
                newSelectedDays.push(day);
            } else {
                alert('Нельзя выбрать более 3 дней в неделю');
                return;
            }
        }
        setFormData({ ...formData, selectedDays: newSelectedDays });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.selectedDays.length === 0) {
            setError('Выберите хотя бы один день');
            return;
        }
        const submitData = {
            doctor_id: parseInt(formData.doctor_id, 10) || 0,
            days: formData.selectedDays.join(', '),
            time: formData.time,
            room: formData.room
        };
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/schedules', submitData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSchedules();
            setFormData({
                doctor_id: '',
                selectedDays: [],
                time: '',
                room: ''
            });
            setError('');
            showToast('Расписание создано успешно');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Ошибка при создании расписания: ${errorMsg}`);
            console.error('Post error:', error);
        }
    };

    const showToast = (message) => {
        alert(message);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Расписания</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {user?.role === 'registrar' && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Создать расписание</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                        <input
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                            placeholder="ID врача"
                            type="number"
                            className="border p-2 rounded"
                            required
                        />
                        <div>
                            <label className="block text-gray-700 mb-2">Выберите дни (не более 3):</label>
                            <div className="flex flex-wrap gap-2">
                                {daysOfWeek.map((day) => (
                                    <label key={day} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedDays.includes(day)}
                                            onChange={() => handleDayChange(day)}
                                            className="mr-2"
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <input
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            placeholder="Время (например, 09:00-17:00)"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="room"
                            value={formData.room}
                            onChange={handleChange}
                            placeholder="Кабинет"
                            className="border p-2 rounded"
                            required
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            Создать
                        </button>
                    </form>
                </div>
            )}
            <div className="grid grid-cols-1 gap-4">
                {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <div key={schedule.ID} className="bg-white p-4 rounded-lg shadow-md">
                            <p><strong>ID врача:</strong> {schedule.DoctorID}</p>
                            <p><strong>Дни:</strong> {schedule.Days}</p>
                            <p><strong>Время:</strong> {schedule.Time}</p>
                            <p><strong>Кабинет:</strong> {schedule.Room}</p>
                        </div>
                    ))
                ) : (
                    <p>Расписания не найдены</p>
                )}
            </div>
        </div>
    );
};

export default Schedules;