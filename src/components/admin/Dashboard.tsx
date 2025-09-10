const Dashboard = () => {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-900 mb-6 dark:text-white">
        Visão Geral
      </h2>
      <p className="text-gray-700 mb-8 dark:text-white">
        Bem-vindo ao painel administrativo. Aqui você pode gerenciar todas as
        configurações da sua aplicação.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total de Vendas</h3>
          <p className="mt-2 text-2xl font-bold text-gray-600">R$ 15.000,00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Usuários Ativos</h3>
          <p className="mt-2 text-2xl font-bold text-gray-600">1200</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
