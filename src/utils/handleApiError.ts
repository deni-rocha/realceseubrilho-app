export interface ApiError {
  message: string;
  code: string;
  status: number;
}

const handleApiError = (error: unknown): string => {
  const status = (error as ApiError).status;

  switch (status) {
    case 400:
      return 'Requisição inválida. Verifique os dados enviados.';
    case 401:
      return 'Não autorizado. Verifique suas credenciais.';
    case 403:
      return 'Acesso proibido. Você não tem permissão para acessar este recurso.';
    case 404:
      return 'Recurso não encontrado. Verifique a URL ou o recurso solicitado.';
    case 500:
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    case 503:
      return 'Serviço indisponível. Tente novamente mais tarde.';
    default:
      return 'Ocorreu um erro desconhecido. Tente novamente.';
  }
};
export default handleApiError;
