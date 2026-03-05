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
      <div className="text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Voltar para a página inicial
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Redirecionando...
            </h1>
            <p className="text-gray-600">
              Você está sendo redirecionado para o pedido.
            </p>
            <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </>
        )}
      </div>
    </div>
  );
}
