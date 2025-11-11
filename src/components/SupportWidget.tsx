import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './catalog/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

type FAQ = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
};

type SupportWidgetProps = {
  whatsappNumber?: string; // E.164 format without +, ex: 5585987654321
  supportEmail?: string;
  businessName?: string;
  availableHours?: string;
};

const DEFAULT_WHATSAPP_NUMBER = '5585999999999'; // Substitua pelo número oficial
const DEFAULT_SUPPORT_EMAIL = 'suporte@realceseubrilho.com';
const DEFAULT_BUSINESS_NAME = 'Realce Seu Brilho';
const DEFAULT_AVAILABLE_HOURS = 'Seg - Sex, 09:00 às 18:00';

const faqs: FAQ[] = [
  {
    id: 'pedido-1',
    question: 'Como acompanho o status do meu pedido?',
    answer:
      'Você pode acompanhar o status do seu pedido acessando a sua conta em "Meus Pedidos". Caso tenha comprado como convidado, verifique o link enviado para seu WhatsApp ou email após a confirmação.',
    tags: ['pedido', 'status', 'rastreamento'],
  },
  {
    id: 'pagamento-1',
    question: 'Quais formas de pagamento são aceitas?',
    answer:
      'Aceitamos Pix, cartão de crédito (principais bandeiras) e, em alguns casos, pagamento via link. Durante o checkout, as opções disponíveis serão exibidas.',
    tags: ['pagamento', 'pix', 'cartão'],
  },
  {
    id: 'troca-1',
    question: 'Como funciona a troca ou devolução?',
    answer:
      'Você tem até 7 dias corridos após o recebimento para solicitar devolução por arrependimento e 30 dias para troca por defeito. Entre em contato pelo WhatsApp ou email informando o número do pedido.',
    tags: ['troca', 'devolução', 'suporte'],
  },
  {
    id: 'frete-1',
    question: 'Qual o prazo e custo do frete?',
    answer:
      'O prazo e valor do frete variam conforme o CEP e a modalidade escolhida. No carrinho e no checkout você pode calcular o frete informando seu CEP.',
    tags: ['frete', 'prazo', 'envio'],
  },
  {
    id: 'conta-1',
    question: 'Preciso de uma conta para comprar?',
    answer:
      'Não. Você pode comprar como convidado informando seu nome e WhatsApp. Contudo, recomendamos criar uma conta para acompanhar seus pedidos e agilizar compras futuras.',
    tags: ['conta', 'cadastro', 'convidado'],
  },
];

function buildWhatsAppUrl(number: string, message: string) {
  const base = 'https://wa.me';
  const text = encodeURIComponent(message);
  return `${base}/${number}?text=${text}`;
}

function buildMailtoUrl(email: string, subject: string, body: string) {
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  return `mailto:${email}?subject=${s}&body=${b}`;
}

const SupportWidget: React.FC<SupportWidgetProps> = ({
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
  supportEmail = DEFAULT_SUPPORT_EMAIL,
  businessName = DEFAULT_BUSINESS_NAME,
  availableHours = DEFAULT_AVAILABLE_HOURS,
}) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const [search, setSearch] = useState('');

  // Navigation
  const navigate = useNavigate();

  // Auth
  const { isAuthenticated } = useAuth();
  const { logout } = useAuthStore();

  const filteredFaqs = useMemo(() => {
    if (!search.trim()) return faqs;
    const q = search.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.tags ?? []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [search]);

  const pageInfo = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      return `Página: ${url.pathname}`;
    } catch {
      return 'Página: /support';
    }
  }, []);

  const defaultWaMessage = useMemo(
    () =>
      `Olá, equipe ${businessName}! Preciso de ajuda.\n\n${pageInfo}\nHorário de atendimento informado: ${availableHours}`,
    [businessName, pageInfo, availableHours],
  );

  const whatsappUrl = useMemo(
    () => buildWhatsAppUrl(whatsappNumber, defaultWaMessage),
    [whatsappNumber, defaultWaMessage],
  );

  const mailtoUrl = useMemo(
    () =>
      buildMailtoUrl(
        supportEmail,
        `[Suporte] Ajuda - ${businessName}`,
        `Olá, equipe ${businessName}!\n\nPreciso de suporte. Seguem alguns detalhes:\n- ${pageInfo}\n- Descrição do problema:\n\nObrigado(a)!`,
      ),
    [supportEmail, businessName, pageInfo],
  );

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenEmail = () => {
    window.location.href = mailtoUrl;
  };

  return (
    <div className="flex min-h-screen bg-[#fcfdfd]">
      {/* Sidebar - Desktop */}
      <Sidebar
        isAuthenticated={isAuthenticated}
        cartItemsCount={0}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 py-8 overflow-y-auto pb-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Voltar à página anterior"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar
          </button>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Suporte
          </h1>
          <p className="mt-2 text-gray-600">
            Como podemos te ajudar? Fale com a gente pelo WhatsApp, email ou
            consulte as perguntas frequentes.
          </p>
          <div className="mt-1 text-sm text-gray-500">
            Atendimento: {availableHours}
          </div>
        </header>

        {/* Ações rápidas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <button
            onClick={handleOpenWhatsApp}
            className="flex items-center justify-center gap-3 rounded-lg border border-green-500 bg-green-50 text-green-700 hover:bg-green-100 transition-colors px-5 py-4"
            aria-label="Falar no WhatsApp"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-green-600 flex-shrink-0"
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.62-6.003C.122 5.281 5.403 0 12.06 0 18.72 0 24 5.281 24 11.837c0 6.557-5.28 11.838-11.94 11.838-1.99 0-3.877-.5-5.57-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.591 5.448 0 9.89-4.434 9.89-9.882 0-5.449-4.442-9.883-9.89-9.883-5.447 0-9.881 4.434-9.881 9.883 0 2.225.651 3.891 1.746 5.595l-.999 3.648 3.742-.952zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.009-.372-.011-.571-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.413z" />
            </svg>
            <div className="text-left">
              <div className="text-sm font-medium leading-none">WhatsApp</div>
              <div className="text-xs text-green-700/80">
                Resposta mais rápida
              </div>
            </div>
          </button>

          <button
            onClick={handleOpenEmail}
            className="flex items-center justify-center gap-3 rounded-lg border border-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors px-5 py-4"
            aria-label="Enviar email para o suporte"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-indigo-600 flex-shrink-0"
              aria-hidden="true"
            >
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <div className="text-left">
              <div className="text-sm font-medium leading-none">Email</div>
              <div className="text-xs text-indigo-700/80">
                {supportEmail.replace('mailto:', '')}
              </div>
            </div>
          </button>
        </section>

        {/* Busca em FAQ */}
        <div className="mb-5">
          <label htmlFor="faq-search" className="sr-only">
            Buscar na FAQ
          </label>
          <div className="relative">
            <input
              id="faq-search"
              type="text"
              placeholder="Busque por palavras-chave (ex.: frete, pedido, troca)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Dica: tente "pedido", "frete", "pagamento"...
          </div>
        </div>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="mb-12">
          <h2 id="faq-title" className="text-xl font-semibold mb-4">
            Perguntas Frequentes
          </h2>

          <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
            {filteredFaqs.length === 0 ? (
              <div className="p-6 text-gray-500 text-sm text-center">
                Não encontramos resultados para sua busca. Tente outros termos.
              </div>
            ) : (
              filteredFaqs.map((item) => {
                const open = item.id === openId;
                return (
                  <div key={item.id}>
                    <button
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                      onClick={() => setOpenId(open ? null : item.id)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${item.id}`}
                    >
                      <span className="font-medium text-gray-900 pr-4">
                        {item.question}
                      </span>
                      <span
                        className={`ml-4 transition-transform flex-shrink-0 ${
                          open ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </button>
                    <div
                      id={`faq-panel-${item.id}`}
                      className={`px-4 pb-4 text-gray-700 ${
                        open ? 'block' : 'hidden'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{item.answer}</p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Ajuda adicional */}
        <section className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Ainda precisa de ajuda?
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Nossa equipe do {businessName} está pronta para te atender. Tenha em
            mãos seu número de pedido para agilizar o suporte.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-white text-sm font-medium hover:bg-[#20ba5a] transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.62-6.003C.122 5.281 5.403 0 12.06 0 18.72 0 24 5.281 24 11.837c0 6.557-5.28 11.838-11.94 11.838-1.99 0-3.877-.5-5.57-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.591 5.448 0 9.89-4.434 9.89-9.882 0-5.449-4.442-9.883-9.89-9.883-5.447 0-9.881 4.434-9.881 9.883 0 2.225.651 3.891 1.746 5.595l-.999 3.648 3.742-.952zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.009-.372-.011-.571-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.413z" />
              </svg>
              Falar no WhatsApp
            </button>
            <button
              onClick={handleOpenEmail}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              Enviar Email
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Informe o máximo de detalhes possível. Atendimento: {availableHours}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupportWidget;
