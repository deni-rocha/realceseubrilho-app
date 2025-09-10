export default function translateRole(value: string) {
  switch (value) {
    case 'CUSTOMER':
      return 'Cliente';
    case 'ADMIN':
      return 'Administrador';
    default:
      return 'Cliente';
  }
}
