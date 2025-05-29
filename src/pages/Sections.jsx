import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Sections = () => {
    const { user } = useAuth();
    const [sections, setSections] = useState([]);
    const [form, setForm] = useState({ name: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/sections');
                setSections(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch sections');
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
            const response = await axios.post('http://localhost:8080/api/sections', form);
            setSections([...sections, response.data]);
            setForm({ name: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create section');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/sections/${id}`);
            setSections(sections.filter((section) => section.ID !== id));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete section');
        }
    };

    if (user?.role !== 'registrar') {
        return <div className="container mx-auto p-4">Access Denied</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Sections</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Create Section</h2>
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="Section Name"
                        className="p-2 border rounded"
                    />
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                    >
                        Create Section
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {sections.map((section) => (
                    <div key={section.ID} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">{section.Name}</h3>
                        </div>
                        <button
                            onClick={() => handleDelete(section.ID)}
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sections;