import { DesktopOutlined } from '@ant-design/icons';

const LoginHeader = () => {
    return (
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DesktopOutlined className="text-3xl text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Smart Gate</h1>
            <p className="text-gray-600 mt-2">Hello Admin, Ready to Manage?</p>
        </div>
    );
};

export default LoginHeader;