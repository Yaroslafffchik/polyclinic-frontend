import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Добро пожаловать в поликлинику</h1>
            <p className="text-lg">Вы вошли как <span className="font-semibold">{user?.role === 'registrar' ? 'Регистратор' : 'Врач'}</span>.</p>
            {user?.role === 'registrar' ? (
                <p>Используйте навигацию для управления пациентами, врачами и участками.</p>
            ) : (
                <p>Используйте навигацию для просмотра пациентов и врачей.</p>
            )}
        </div>
    );
};

export default Home;