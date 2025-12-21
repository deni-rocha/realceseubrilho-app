import React from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import SaleProducts from '../components/SaleProducts';

/**
 * Página de Exemplo - Vitrine de Produtos
 *
 * Esta página demonstra como usar os componentes FeaturedProducts e SaleProducts
 * para criar uma vitrine atraente de produtos em destaque e em promoção.
 *
 * Você pode usar este exemplo como base para:
 * - Página inicial (Home)
 * - Landing pages de campanhas
 * - Páginas de categorias
 * - Seções de produtos especiais
 */
const ExampleProductsShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header/Banner */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Bem-vindo à Realce Seu Brilho
          </h1>
          <p className="text-xl text-center opacity-90">
            Descubra produtos incríveis com ofertas especiais
          </p>
        </div>
      </section>

      {/* Container Principal */}
      <div className="container mx-auto px-4 py-12">

        {/* Seção de Promoções */}
        <section className="mb-20">
          <SaleProducts
            limit={8}
            className="animate-fade-in"
          />
        </section>

        {/* Divider Decorativo */}
        <div className="my-16 border-t-2 border-gray-200 dark:border-gray-700"></div>

        {/* Seção de Produtos em Destaque */}
        <section className="mb-20">
          <FeaturedProducts
            limit={4}
            className="animate-fade-in"
          />
        </section>

        {/* Call to Action */}
        <section className="bg-green-100 dark:bg-green-900 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Explore nosso catálogo completo com centenas de produtos para você brilhar ainda mais!
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl">
            Ver Todos os Produtos
          </button>
        </section>
      </div>

      {/* Footer Info */}
      <section className="bg-gray-100 dark:bg-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                Frete Grátis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Para compras acima de R$ 150
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                Parcele sem Juros
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Em até 3x no cartão
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                Compra Segura
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seus dados protegidos
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExampleProductsShowcase;

// ============================================
// OUTRAS VARIAÇÕES DE USO
// ============================================

/**
 * Exemplo 1: Página Home Simples
 */
export const HomePageSimple: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Loja Online</h1>

      {/* Apenas produtos em promoção */}
      <SaleProducts />
    </div>
  );
};

/**
 * Exemplo 2: Seção em uma Página Maior
 */
export const ProductsSectionInPage: React.FC = () => {
  return (
    <>
      {/* Outros conteúdos da página... */}

      <section className="my-16">
        <div className="container mx-auto px-4">
          <FeaturedProducts limit={6} />
        </div>
      </section>

      {/* Mais conteúdos... */}
    </>
  );
};

/**
 * Exemplo 3: Grid Lado a Lado (Desktop)
 */
export const SideBySideProducts: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <FeaturedProducts limit={2} />
        </div>
        <div>
          <SaleProducts limit={2} />
        </div>
      </div>
    </div>
  );
};

/**
 * Exemplo 4: Com Tabs (Abas)
 */
export const ProductsWithTabs: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'featured' | 'sale'>('sale');

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Tabs Navigation */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('sale')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'sale'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          🔥 Em Promoção
        </button>
        <button
          onClick={() => setActiveTab('featured')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'featured'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          ⭐ Em Destaque
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'sale' && <SaleProducts />}
        {activeTab === 'featured' && <FeaturedProducts />}
      </div>
    </div>
  );
};

/**
 * Exemplo 5: Com Contador Regressivo (Black Friday Style)
 */
export const BlackFridayStyle: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Banner com Countdown */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 animate-pulse">
            🔥 BLACK FRIDAY 🔥
          </h1>
          <p className="text-2xl mb-4">Até 70% OFF!</p>
          <div className="inline-block bg-red-600 px-6 py-3 rounded-lg text-xl font-bold">
            ⏰ Promoção por tempo limitado!
          </div>
        </div>

        {/* Produtos em Promoção */}
        <SaleProducts className="mb-12" />
      </div>
    </div>
  );
};

/**
 * Exemplo 6: Carousel/Slider (usando biblioteca externa)
 *
 * Para implementar um carrossel, você precisaria instalar uma biblioteca como:
 * - react-slick
 * - swiper
 * - embla-carousel
 *
 * Exemplo conceitual:
 */
export const ProductsCarousel: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Produtos em Destaque
      </h2>

      {/*
        Aqui você envolveria o FeaturedProducts ou SaleProducts
        com um componente de carrossel
      */}
      <div className="relative">
        <FeaturedProducts limit={8} />
      </div>

      <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
        💡 Dica: Considere usar uma biblioteca de carrossel para melhor UX em mobile
      </p>
    </div>
  );
};
