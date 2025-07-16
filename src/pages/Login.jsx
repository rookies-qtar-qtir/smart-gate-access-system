import { useState } from 'react';
import { Card, message } from 'antd';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../components/LoginHeader';
import LoginForm from '../components/LoginForm';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        setError('');

        try {
            const result = await login(values.email, values.password);

            if (result.success) {
                message.success('Login successful!');
                navigate('/');
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (error) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="w-full max-w-md p-6">
                <Card className="shadow-2xl">
                    <LoginHeader />
                    <LoginForm 
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                    />
                </Card>
            </div>
        </div>
    );
};

export default Login;