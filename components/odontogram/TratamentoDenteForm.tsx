
import React, { useState, useEffect, useCallback } from 'react';
import { TratamentoDente, TratamentoStatus, ProcedimentoDentario } from '../../types';

interface TratamentoDenteFormProps {
  initialData?: TratamentoDente | null;
  procedimentos: ProcedimentoDentario[];
  onSave: (tratamentoData: TratamentoDente) => void;
  onCancel: () => void;
}

const generateTratamentoId = () => `TRAT-${Math.random().toString(36).substr(2, 9)}`;

const TratamentoDenteForm: React.FC<TratamentoDenteFormProps> = ({
  initialData, procedimentos, onSave, onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<TratamentoDente, 'id' | 'procedimentoNome'>>({ /* ... */ } as Omit<TratamentoDente, 'id' | 'procedimentoNome'>);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  useEffect(() => {
    const defaultValues = {
      procedimentoId: (procedimentos.length > 0 ? procedimentos[0].id : ''),
      status: TratamentoStatus.PLANEJADO, valor: 0, isAcaoSocial: false,
      dataPlanejamento: '', dataExecucao: '', dataConclusao: '', observacoes: '',
    };
    if (initialData) {
      const { id, procedimentoNome, ...rest } = initialData;
      setFormData({ ...defaultValues, ...rest });
    } else {
       setFormData(defaultValues);
    }
  }, [initialData, procedimentos]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : (type === 'number' ? (parseFloat(value) || 0) : value),
        ...(name === 'isAcaoSocial' && checked && { valor: 0 }) // Zera valor se Ação Social for marcada
    }));
    if (errors[name as keyof typeof formData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }, [errors]);

  const validate = () => { /* ... */ return true; };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); if (!validate()) return;
    const selectedProcedimento = procedimentos.find(p => p.id === formData.procedimentoId);
    if (!selectedProcedimento) { setErrors(prev => ({...prev, procedimentoId: 'Procedimento inválido.'})); return; }
    onSave({
      id: initialData?.id || generateTratamentoId(), ...formData,
      procedimentoNome: selectedProcedimento.nome,
      valor: formData.isAcaoSocial ? 0 : formData.valor,
    });
  };
  
  const formTitle = initialData ? 'Editar Tratamento' : 'Adicionar Novo Tratamento';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4 bg-slate-50 rounded-lg shadow-md border border-slate-200">
      <h4 className="text-lg font-semibold text-slate-700">{formTitle}</h4>
      
      <div>
        <label htmlFor="procedimentoId" className="block text-sm font-medium text-slate-700 mb-1.5">Procedimento</label>
        <select id="procedimentoId" name="procedimentoId" value={formData.procedimentoId} onChange={handleChange} className="select-base">
          {procedimentos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        {errors.procedimentoId && <p className="mt-1.5 text-xs text-red-600">{errors.procedimentoId}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange} className="select-base">
          {Object.values(TratamentoStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex items-center pt-1">
        <input id="isAcaoSocial" name="isAcaoSocial" type="checkbox" checked={formData.isAcaoSocial} onChange={handleChange} className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"/>
        <label htmlFor="isAcaoSocial" className="ml-2 block text-sm text-slate-700">Ação Social (Gratuito)</label>
      </div>
      
      {!formData.isAcaoSocial && (
        <div>
          <label htmlFor="valor" className="block text-sm font-medium text-slate-700 mb-1.5">Valor (R$)</label>
          <input type="number" id="valor" name="valor" value={formData.valor} onChange={handleChange} min="0" step="0.01" className="input-base"/>
          {errors.valor && <p className="mt-1.5 text-xs text-red-600">{errors.valor}</p>}
        </div>
      )}

      {formData.status === TratamentoStatus.PLANEJADO && (
        <div><label htmlFor="dataPlanejamento" className="block text-sm font-medium text-slate-700 mb-1.5">Data Planejamento</label><input type="date" id="dataPlanejamento" name="dataPlanejamento" value={formData.dataPlanejamento} onChange={handleChange} className="input-base" /></div>
      )}
      {formData.status === TratamentoStatus.EXECUTADO && (
         <div><label htmlFor="dataExecucao" className="block text-sm font-medium text-slate-700 mb-1.5">Data Execução</label><input type="date" id="dataExecucao" name="dataExecucao" value={formData.dataExecucao} onChange={handleChange} className="input-base" /></div>
      )}
      {formData.status === TratamentoStatus.CONCLUIDO && (
         <div><label htmlFor="dataConclusao" className="block text-sm font-medium text-slate-700 mb-1.5">Data Conclusão</label><input type="date" id="dataConclusao" name="dataConclusao" value={formData.dataConclusao} onChange={handleChange} className="input-base" /></div>
      )}
      
      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium text-slate-700 mb-1.5">Observações</label>
        <textarea id="observacoes" name="observacoes" rows={3} value={formData.observacoes} onChange={handleChange} className="textarea-base"></textarea>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Salvar Alterações' : 'Adicionar Tratamento'}</button>
      </div>
    </form>
  );
};

export default TratamentoDenteForm;
