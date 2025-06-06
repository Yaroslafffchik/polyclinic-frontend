import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SectionDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [section, setSection] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [nurses, setNurses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editNurseId, setEditNurseId] = useState(null);
    const [nurseForm, setNurseForm] = useState({
        last_name: '',
        first_name: '',
        middle_name: '',
        section_id: parseInt(id),
    });

    useEffect(() => {
        fetchSection();
    }, [id]);

    const fetchSection = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/sections/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSection(response.data.section);
            setDoctors(response.data.doctors);
            setNurses(response.data.nurses);
            setLoading(false);
        } catch (err) {
            setError('Ошибка при загрузке данных участка');
            setLoading(false);
        }
    };

    const handleNurseChange = (e) => {
        const { name, value } = e.target;
        setNurseForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddNurse = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/nurses', nurseForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSection();
            setNurseForm({ last_name: '', first_name: '', middle_name: '', section_id: parseInt(id) });
            alert('Медсестра добавлена успешно');
        } catch (error) {
            setError(`Ошибка при добавлении медсестры: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleEditNurse = (nurse) => {
        setEditNurseId(nurse.ID);
        setNurseForm({
            last_name: nurse.last_name,
            first_name: nurse.first_name,
            middle_name: nurse.middle_name,
            section_id: nurse.section_id,
        });
    };

    const handleUpdateNurse = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/nurses/${editNurseId}`, nurseForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSection();
            setEditNurseId(null);
            setNurseForm({ last_name: '', first_name: '', middle_name: '', section_id: parseInt(id) });
            alert('Медсестра обновлена успешно');
        } catch (error) {
            setError(`Ошибка при обновлении медсестры: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleDeleteNurse = async (nurseId) => {
        if (window.confirm('Вы уверены, что хотите удалить медсестру?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/nurses/${nurseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchSection();
                alert('Медсестра удалена успешно');
            } catch (error) {
                setError(`Ошибка при удалении медсестры: ${error.response?.data?.error || error.message}`);
            }
        }
    };

    if (loading) {
        return <div className="p-4">Загрузка...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!section) {
        return <div className="p-4">Участок не найден</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Информация об участке</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold">{section.name}</h2>
                <p><strong>Адрес:</strong> {section.address}</p>
            </div>

            <h2 className="text-xl font-bold mb-4">Врачи</h2>
            {doctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {doctors.map((doctor) => (
                        <div key={doctor.ID} className="bg-white p-4 rounded-lg shadow-md">
                            <p><strong>ФИО:</strong> {`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name || ''}`.trim()}</p>
                            <p><strong>Специализация:</strong> {doctor.specialization}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Врачи не найдены</p>
            )}

            <h2 className="text-xl font-bold mb-4">Медсестры</h2>
            {user?.role === 'registrar' && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">{editNurseId ? 'Редактировать медсестру' : 'Добавить медсестру'}</h3>
                    <form onSubmit={editNurseId ? handleUpdateNurse : handleAddNurse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="last_name"
                            value={nurseForm.last_name}
                            onChange={handleNurseChange}
                            placeholder="Фамилия"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="first_name"
                            value={nurseForm.first_name}
                            onChange={handleNurseChange}
                            placeholder="Имя"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="middle_name"
                            value={nurseForm.middle_name}
                            onChange={handleNurseChange}
                            placeholder="Отчество"
                            className="border p-2 rounded"
                        />
                        <input
                            name="section_id"
                            value={nurseForm.section_id}
                            readOnly
                            className="border p-2 rounded bg-gray-100"
                        />
                        <div className="col-span-2">
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                {editNurseId ? 'Обновить' : 'Добавить'}
                            </button>
                            {editNurseId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditNurseId(null);
                                        setNurseForm({ last_name: '', first_name: '', middle_name: '', section_id: parseInt(id) });
                                    }}
                                    className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                >
                                    Отмена
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {nurses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nurses.map((nurse) => (
                        <div key={nurse.ID} className="bg-white p-4 rounded-lg shadow-md relative">
                            <p><strong>ФИО:</strong> {`${nurse.last_name} ${nurse.first_name} ${nurse.middle_name || ''}`.trim()}</p>
                            {user?.role === 'registrar' && (
                                <div className="mt-2">
                                    <button
                                        onClick={() => handleEditNurse(nurse)}
                                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDeleteNurse(nurse.ID)}
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Медсестры не найдены</p>
            )}
        </div>
    );
};

export default SectionDetails;