import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center dark:bg-primary-dark dark:text-white">
      <div>
        <p>Página não encontrada!</p>
        <Link
          to="/"
          className="text-blue-500 dark:text-white underline decoration-2"
        >
          <p>clique aqui</p>
        </Link>
        <p>para voltar à página inicial</p>
      </div>
    </div>
  );
};

export default NotFound;
