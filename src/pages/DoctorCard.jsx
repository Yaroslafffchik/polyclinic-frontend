import React from 'react';
import { Link } from 'react-router-dom';
import doctorPhoto from '../photos/doctor.png';

const DoctorCard = ({ doctor, onDelete, role }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
                <img
                    src={doctorPhoto}
                    alt={`Фото врача ${doctor.full_name}`}
                    className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                    <Link to={`/doctors/${doctor.ID}`} className="text-lg font-semibold hover:underline">
                        {doctor.full_name}
                    </Link>
                    <p className="text-gray-600">{doctor.specialization}</p>
                </div>
            </div>
            {role === 'registrar' && (
                <button
                    onClick={() => onDelete(doctor.ID)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                    Удалить
                </button>
            )}
        </div>
    );
};

export default DoctorCard;