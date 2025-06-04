import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-green-950 p-4 text-white">
            <ul className="flex space-x-4">
                <li><Link to="/">Home</Link></li>
                {user && (
                    <>
                        <li><Link to="/patients">Patients</Link></li>
                        <li><Link to="/doctors">Doctors</Link></li>
                        <li><Link to="/sections">Sections</Link></li>
                        {user.role === 'registrar' && <li><Link to="/schedules">Schedules</Link></li>}
                        <li><Link to="/visits">Visits</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                )}
                {!user && (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;