import { useEffect } from 'react';
import { LuSun, LuMoon } from 'react-icons/lu';
import { useThemeStore } from '../../store/themeStore';

const AdmSettings = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const htmlElement = document.documentElement;

    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    // Salva a preferência do usuário
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="mt-8 space-y-8">
      {/* Cabeçalho */}
      <div>
        <h2 className="hidden md:block text-3xl font-semibold text-gray-900 mb-2 dark:text-white">
          Configurações
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Personalize a aparência e preferências do sistema
        </p>
      </div>

      {/* Card de Tema */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          {/* Título da Seção */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Aparência
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Escolha entre o tema claro ou escuro
            </p>
          </div>

          {/* Toggle de Tema */}
          <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${theme === 'light' ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-700'}`}
              >
                <LuSun
                  className={`text-xl ${theme === 'light' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`}
                />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Modo {theme === 'light' ? 'Claro' : 'Escuro'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {theme === 'light'
                    ? 'Interface com fundo claro'
                    : 'Interface com fundo escuro'}
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Alternar tema"
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center transform rounded-full bg-white shadow-lg transition-transform ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`}
              >
                {theme === 'dark' ? (
                  <LuMoon className="text-blue-600 text-sm" />
                ) : (
                  <LuSun className="text-gray-600 text-sm" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Card de Informações Adicionais (Opcional) */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Dica
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              O tema escolhido será salvo automaticamente e aplicado em todas as
              suas sessões.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmSettings;
