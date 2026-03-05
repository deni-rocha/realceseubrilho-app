import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function UrlRedirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function redirect() {
      try {
        const response = await fetch(`${API_URL}/s/${shortCode}`);

        if (!response.ok) {
          setError('URL inválida ou expirada');
          return;
        }

        const data = await response.json();

        // Extrai o ID do pedido da URL original
        const originalUrl = data.originalUrl;
        const orderId = originalUrl.split('/pedido/')[1];

        if (orderId) {
          // Redireciona para a página de acompanhamento do pedido
          navigate(`/pedido/${orderId}`, { replace: true });
        } else {
          setError('Pedido não encontrado');
        }
      } catch {
        setError('Erro ao carregar informações do pedido');
      }
    }

    if (shortCode) {
      redirect();
    }
  }, [shortCode, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md w-full px-6">
        {error ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Erro</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-[#338838] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d7a32] transition-colors"
            >
              Voltar para a página inicial
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#338838] border-t-transparent"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Redirecionando...
            </h1>
            <p className="text-gray-600">
              Você está sendo redirecionado para o pedido.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
