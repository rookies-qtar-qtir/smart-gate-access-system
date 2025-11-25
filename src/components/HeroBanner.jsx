import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaDoorOpen } from 'react-icons/fa';

function HeroBanner() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Smart Gate Access System
        </h1>
        <p className="text-xl opacity-90 mb-6">
          Solusi modern untuk pengelolaan akses gerbang dengan
          teknologi IoT
        </p>
        <Button
          color="primary"
          variant="filled"
          icon={<FaDoorOpen />}
          size='large'
          onClick={() => navigate('/gate-control')}
          className="px-12! py-8! bg-white text-blue-600! rounded-lg font-medium hover:bg-gray-100! transition-colors! shadow-lg! border-none!"
        >
          Akses Kontrol Panel
        </Button>
      </div>
    </div>
  );
}

export default HeroBanner;