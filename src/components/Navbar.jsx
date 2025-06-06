import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-green-950 p-4 text-white">
            <ul className="flex space-x-4">
                <li><Link to="/">Главная</Link></li>
                {user && (
                    <>
                        <li><Link to="/patients">Пациенты</Link></li>
                        <li><Link to="/doctors">Врачи</Link></li>
                        {user.role === 'registrar' && <li><Link to="/sections">Участки</Link></li>}
                        {user.role === 'registrar' && <li><Link to="/schedules">Расписания</Link></li>}
                        {user.role === 'registrar' && <li><Link to="/schedules/specialization">Расписания по специализации</Link></li>}
                        <li><Link to="/visits">Посещения</Link></li>
                        <li><button onClick={logout}>Выйти</button></li>
                    </>
                )}
                {!user && (
                    <li><Link to="/login">Вход</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;