import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import type { GuestCheckoutData } from '../../types/catalog';

interface GuestCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: GuestCheckoutData) => void;
  isLoading?: boolean;
}

const GuestCheckoutModal: React.FC<GuestCheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [guestName, setGuestName] = useState('');
  const [guestWhatsapp, setGuestWhatsapp] = useState('');
  const [errors, setErrors] = useState({ name: '', whatsapp: '' });
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Duração da animação
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  const handleClose = () => {
    if (isLoading) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    // Limita a 11 dígitos (DDD + número)
    const limited = numbers.slice(0, 11);

    // Formata: (xx) 9xxxx-xxxx
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 3) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 11) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }

    return limited;
  };

  const validateForm = (): boolean => {
    const newErrors = { name: '', whatsapp: '' };
    let isValid = true;

    if (guestName.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
      isValid = false;
    }

    const whatsappClean = guestWhatsapp.replace(/\D/g, '');
    if (whatsappClean.length < 10 || whatsappClean.length > 11) {
      newErrors.whatsapp = 'WhatsApp inválido (digite DDD + número)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const whatsappClean = guestWhatsapp.replace(/\D/g, '');
      onConfirm({
        guestName: guestName.trim(),
        guestWhatsapp: whatsappClean,
      });
    }
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setGuestWhatsapp(formatted);
    // Limpa erro ao digitar
    if (errors.whatsapp) {
      setErrors({ ...errors, whatsapp: '' });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestName(e.target.value);
    // Limpa erro ao digitar
    if (errors.name) {
      setErrors({ ...errors, name: '' });
    }
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={!isLoading ? handleClose : undefined}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          aria-label="Fechar"
        >
          <FaTimes className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            Finalizar Pedido
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Precisamos de algumas informações para confirmar seu pedido
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label
              htmlFor="guestName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome Completo *
            </label>
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={handleNameChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#338838] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Seu nome completo"
              autoComplete="name"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.name}
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label
              htmlFor="guestWhatsapp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              WhatsApp *
            </label>
            <input
              id="guestWhatsapp"
              type="tel"
              value={guestWhatsapp}
              onChange={handleWhatsAppChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#338838] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.whatsapp ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(81) 9____-____"
              autoComplete="tel"
              required
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.whatsapp}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Formato: (11) 99999-9999
            </p>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              💬 Após confirmar, você será redirecionado para o WhatsApp para
              finalizar o pedido.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#415444] text-white rounded-xl hover:bg-[#415444]/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5 text-white" />
                  Processando...
                </>
              ) : (
                'Confirmar Pedido'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestCheckoutModal;
