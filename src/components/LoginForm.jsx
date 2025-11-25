import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginForm = ({ onSubmit, loading, error }) => {
    return (
        <>
            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    className="mb-4"
                />
            )}

            <Form
                name="login"
                onFinish={onSubmit}
                size="large"
                layout="vertical"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Enter your email"
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Enter your password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full h-12 text-lg font-medium"
                        loading={loading}
                    >
                        Sign In
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default LoginForm;