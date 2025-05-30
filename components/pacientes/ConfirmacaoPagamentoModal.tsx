
import React, { useState } from 'react';

interface ConfirmacaoPagamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metodoPagamento: string) => void;
  tratamentoNome: string;
  tratamentoValor?: number;
}

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || value === 0) return 'Gratuito (Ação Social)';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const METODOS_PAGAMENTO = ['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Outro'];

const ConfirmacaoPagamentoModal: React.FC<ConfirmacaoPagamentoModalProps> = ({
  isOpen, onClose, onConfirm, tratamentoNome, tratamentoValor,
}) => {
  const [metodoPagamentoSelecionado, setMetodoPagamentoSelecionado] = useState<string>(METODOS_PAGAMENTO[0]);

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (tratamentoValor && tratamentoValor > 0 && !metodoPagamentoSelecionado) {
        alert("Por favor, selecione um método de pagamento."); return;
    }
    onConfirm(tratamentoValor && tratamentoValor > 0 ? metodoPagamentoSelecionado : 'N/A');
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="confirmacao-pagamento-modal-title">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <h3 id="confirmacao-pagamento-modal-title" className="text-xl font-semibold text-slate-800 mb-3">
          Confirmar Conclusão e Pagamento
        </h3>
        <p className="text-sm text-slate-700 mb-1">
          Procedimento: <span className="font-medium">{tratamentoNome}</span>
        </p>
        <p className="text-sm text-slate-700 mb-5">
          Valor: <span className="font-medium">{formatCurrency(tratamentoValor)}</span>
        </p>
        
        {tratamentoValor && tratamentoValor > 0 && (
          <div className="mb-5">
            <label htmlFor="metodoPagamento" className="block text-sm font-medium text-slate-700 mb-1.5">
              Método de Pagamento Recebido:
            </label>
            <select id="metodoPagamento" value={metodoPagamentoSelecionado} onChange={(e) => setMetodoPagamentoSelecionado(e.target.value)} className="select-base">
              {METODOS_PAGAMENTO.map(metodo => (<option key={metodo} value={metodo}>{metodo}</option>))}
            </select>
          </div>
        )}
        
        <p className="text-sm text-slate-600 mb-6">
          O pagamento deste procedimento foi recebido?
        </p>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
          <button type="button" onClick={handleConfirmClick} className="btn btn-primary bg-green-600 hover:bg-green-700">Sim, Pago e Concluído</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoPagamentoModal;
