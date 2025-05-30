
import React, { useState, useEffect, useCallback } from 'react';
import { TransacaoFinanceira, TipoTransacao } from '../../types';

interface TransacaoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TransacaoFinanceira, 'id' | 'pacienteNome'>) => void;
  initialData?: TransacaoFinanceira | null;
}

const METODOS_PAGAMENTO_ENTRADA = ['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Outro'] as const;
const TIPOS_GASTO_SAIDA = ['Fixo', 'Programado', 'Extra', 'N/A'] as const;

const TransacaoFormModal: React.FC<TransacaoFormModalProps> = ({
  isOpen, onClose, onSave, initialData,
}) => {
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.SAIDA);
  const [data, setData] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [valor, setValor] = useState<number>(0);
  const [categoria, setCategoria] = useState<string>('');
  const [metodoPagamento, setMetodoPagamento] = useState<TransacaoFinanceira['metodoPagamento']>();
  const [tipoGasto, setTipoGasto] = useState<TransacaoFinanceira['tipoGasto']>();
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<TransacaoFinanceira, 'id'>, string>>>({});

  const initializeForm = useCallback(() => {
    if (initialData) {
        setTipo(initialData.tipo); setData(initialData.data);
        setDescricao(initialData.descricao); setValor(initialData.valor);
        setCategoria(initialData.categoria || '');
        setMetodoPagamento(initialData.metodoPagamento as TransacaoFinanceira['metodoPagamento']);
        setTipoGasto(initialData.tipoGasto as TransacaoFinanceira['tipoGasto']);
    } else {
        setTipo(TipoTransacao.SAIDA); setData(new Date().toISOString().split('T')[0]);
        setDescricao(''); setValor(0); setCategoria('');
        setMetodoPagamento(undefined); setTipoGasto(TIPOS_GASTO_SAIDA[0]);
    }
    setErrors({});
  }, [initialData]);

  useEffect(() => { if (isOpen) initializeForm(); }, [isOpen, initializeForm]);

  const handleTipoChange = (newTipo: TipoTransacao) => {
    setTipo(newTipo);
    if (newTipo === TipoTransacao.ENTRADA) { setTipoGasto(undefined); setMetodoPagamento(METODOS_PAGAMENTO_ENTRADA[0]); } 
    else { setMetodoPagamento(undefined); setTipoGasto(TIPOS_GASTO_SAIDA[0]); }
  };

  const validate = useCallback(() => { /* ... */ return true; }, [descricao, valor, data, tipo, metodoPagamento, tipoGasto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); if (!validate()) return;
    onSave({
      tipo, data, descricao, valor: Number(valor), categoria,
      metodoPagamento: tipo === TipoTransacao.ENTRADA ? metodoPagamento : undefined,
      tipoGasto: tipo === TipoTransacao.SAIDA ? tipoGasto : undefined,
    });
  };

  if (!isOpen) return null;
  const formTitle = initialData ? 'Editar Transação' : 'Adicionar Nova Transação';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="transacao-form-modal-title">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 id="transacao-form-modal-title" className="text-xl sm:text-2xl font-semibold text-slate-800 mb-5">{formTitle}</h3>
          
          <div>
            <label htmlFor="tipoTransacao" className="block text-sm font-medium text-slate-700 mb-1.5">Tipo</label>
            <select id="tipoTransacao" name="tipo" value={tipo} onChange={(e) => handleTipoChange(e.target.value as TipoTransacao)} className="select-base">
              <option value={TipoTransacao.ENTRADA}>{TipoTransacao.ENTRADA}</option>
              <option value={TipoTransacao.SAIDA}>{TipoTransacao.SAIDA}</option>
            </select>
          </div>

          <div>
            <label htmlFor="dataTransacao" className="block text-sm font-medium text-slate-700 mb-1.5">Data</label>
            <input type="date" id="dataTransacao" name="data" value={data} onChange={(e) => setData(e.target.value)} className="input-base"/>
            {errors.data && <p className="text-xs text-red-500 mt-1.5">{errors.data}</p>}
          </div>

          <div>
            <label htmlFor="descricaoTransacao" className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
            <input type="text" id="descricaoTransacao" name="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="input-base"/>
            {errors.descricao && <p className="text-xs text-red-500 mt-1.5">{errors.descricao}</p>}
          </div>

          <div>
            <label htmlFor="valorTransacao" className="block text-sm font-medium text-slate-700 mb-1.5">Valor (R$)</label>
            <input type="number" id="valorTransacao" name="valor" value={valor} onChange={(e) => setValor(parseFloat(e.target.value) || 0)} min="0.01" step="0.01" className="input-base"/>
            {errors.valor && <p className="text-xs text-red-500 mt-1.5">{errors.valor}</p>}
          </div>
          
          {tipo === TipoTransacao.ENTRADA && (
            <div>
              <label htmlFor="metodoPagamento" className="block text-sm font-medium text-slate-700 mb-1.5">Método de Pagamento</label>
              <select id="metodoPagamento" name="metodoPagamento" value={metodoPagamento || ''} onChange={(e) => setMetodoPagamento(e.target.value as typeof METODOS_PAGAMENTO_ENTRADA[number])} className="select-base">
                <option value="" disabled>Selecione...</option>
                {METODOS_PAGAMENTO_ENTRADA.map(metodo => (<option key={metodo} value={metodo}>{metodo}</option>))}
              </select>
              {errors.metodoPagamento && <p className="text-xs text-red-500 mt-1.5">{errors.metodoPagamento}</p>}
            </div>
          )}

          {tipo === TipoTransacao.SAIDA && (
            <div>
              <label htmlFor="tipoGasto" className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Gasto</label>
              <select id="tipoGasto" name="tipoGasto" value={tipoGasto || ''} onChange={(e) => setTipoGasto(e.target.value as typeof TIPOS_GASTO_SAIDA[number])} className="select-base">
                 <option value="" disabled>Selecione...</option>
                {TIPOS_GASTO_SAIDA.map(gasto => (<option key={gasto} value={gasto}>{gasto}</option>))}
              </select>
              {errors.tipoGasto && <p className="text-xs text-red-500 mt-1.5">{errors.tipoGasto}</p>}
            </div>
          )}

          <div>
            <label htmlFor="categoriaTransacao" className="block text-sm font-medium text-slate-700 mb-1.5">Categoria (Opcional)</label>
            <input type="text" id="categoriaTransacao" name="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input-base" placeholder="Ex: Material, Limpeza, Salário"/>
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t border-slate-200 mt-7">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">{initialData ? 'Salvar Alterações' : 'Adicionar Transação'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransacaoFormModal;
