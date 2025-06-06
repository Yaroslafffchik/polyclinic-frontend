import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Sections = () => {
    const { user } = useAuth();
    const [sections, setSections] = useState([]);
    const [form, setForm] = useState({ name: '', address: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/sections', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSections(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Не удалось загрузить участки');
            }
        };
        fetchSections();
    }, []);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/api/sections', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSections([...sections, response.data]);
            setForm({ name: '', address: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Не удалось создать участок');
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/sections/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSections(sections.filter((section) => section.ID !== id));
        } catch (err) {
            setError(err.response?.data?.error || 'Не удалось удалить участок');
        }
    };

    if (user?.role !== 'registrar') {
        return <div className="container mx-auto p-4">Доступ запрещен</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Участки</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Создать участок</h2>
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="Название участка"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleInputChange}
                        placeholder="Адрес"
                        className="p-2 border rounded"
                        required
                    />
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                    >
                        Создать участок
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {sections.map((section) => (
                    <div key={section.ID} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">{section.name}</h3>
                        </div>
                        <button
                            onClick={() => handleDelete(section.ID)}
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                        >
                            Удалить
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sections;