import React from 'react';

const BannerCards: React.FC = () => {
  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#e0e5ce] border-0 rounded-[24px] p-6">
        <p className="mb-2 text-sm font-medium uppercase text-[#338838]">
          MELHORES OFERTAS
        </p>
        <h3 className="mb-4 text-2xl font-semibold">
          Coleção de Produtos de Beleza
        </h3>
        <p className="mb-6 text-gray-600">
          Descubra os melhores produtos segundo sua paixão
        </p>
        <button className="bg-[#415444] hover:bg-[#415444]/90 text-white px-6 py-2 rounded-lg transition-colors">
          Ver Mais
        </button>
      </div>
      <div className="bg-[#e7ddd1] border-0 rounded-[24px] p-6 flex items-center justify-between">
        <div>
          <h3 className="mb-4 text-3xl font-semibold">Promoção ✨</h3>
          <p className="mb-6 text-5xl font-bold">50% OFF</p>
          <button className="bg-[#415444] hover:bg-[#415444]/90 text-white px-6 py-2 rounded-lg transition-colors">
            Compre Agora!
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerCards;
