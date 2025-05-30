
import React, { useState, useEffect, useCallback } from 'react';
import { Paciente } from '../../types';

interface PacienteFormProps {
  onSave: (paciente: Omit<Paciente, 'id' | 'odontograma' | 'anamnese'> | Paciente) => void;
  onCancel: () => void;
  initialData?: Paciente | null;
}

const PacienteForm: React.FC<PacienteFormProps> = ({ onSave, onCancel, initialData }) => {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Paciente, 'id' | 'odontograma' | 'anamnese'>, string>>>({});

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome); setEndereco(initialData.endereco);
      setTelefone(initialData.telefone); setEmail(initialData.email || '');
      setCpf(initialData.cpf); setDataNascimento(initialData.dataNascimento);
    } else {
      setNome(''); setEndereco(''); setTelefone(''); setEmail(''); setCpf(''); setDataNascimento('');
    }
  }, [initialData]);

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof Omit<Paciente, 'id' | 'odontograma' | 'anamnese'>, string>> = {};
    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório.';
    if (!endereco.trim()) newErrors.endereco = 'Endereço é obrigatório.';
    if (!telefone.trim()) newErrors.telefone = 'Telefone é obrigatório.';
    if (!cpf.trim()) newErrors.cpf = 'CPF é obrigatório.';
    else if (!/^\d{11}$/.test(cpf.replace(/\D/g, ''))) newErrors.cpf = 'CPF inválido (11 dígitos).';
    if (!dataNascimento) newErrors.dataNascimento = 'Data de Nascimento é obrigatória.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email inválido.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [nome, endereco, telefone, cpf, dataNascimento, email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const pacienteData = { nome, endereco, telefone, email: email || undefined, cpf: cpf.replace(/\D/g, ''), dataNascimento };
    onSave(initialData && initialData.id ? { ...initialData, ...pacienteData } : pacienteData as Omit<Paciente, 'id' | 'odontograma' | 'anamnese'>);
  };
  
  const formTitle = initialData ? 'Editar Dados do Paciente' : 'Cadastrar Novo Paciente';

  const FormField: React.FC<{label: string, error?: string, children: React.ReactNode}> = ({ label, error, children }) => {
    const firstChild = React.Children.toArray(children)[0];
    const childId = (firstChild as React.ReactElement<any>)?.props?.id;
    return (
      <div>
        <label htmlFor={childId} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        {children}
        {error && childId && <p id={`${childId}-error`} className="mt-1.5 text-xs text-red-600" aria-live="assertive">{error}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 id="form-title" className="text-xl sm:text-2xl font-semibold text-slate-700 mb-6">{formTitle}</h3>
      
      <FormField label="Nome Completo" error={errors.nome}>
        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="input-base" required aria-describedby={errors.nome ? "nome-error" : undefined}/>
      </FormField>
      <FormField label="Endereço" error={errors.endereco}>
        <input type="text" id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="input-base" required aria-describedby={errors.endereco ? "endereco-error" : undefined}/>
      </FormField>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <FormField label="Telefone" error={errors.telefone}>
            <input type="tel" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(XX) XXXXX-XXXX" className="input-base" required aria-describedby={errors.telefone ? "telefone-error" : undefined}/>
        </FormField>
        <FormField label="Email (Opcional)" error={errors.email}>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" aria-describedby={errors.email ? "email-error" : undefined}/>
        </FormField>
        <FormField label="CPF" error={errors.cpf}>
            <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" className="input-base" required aria-describedby={errors.cpf ? "cpf-error" : undefined}/>
        </FormField>
        <FormField label="Data de Nascimento" error={errors.dataNascimento}>
            <input type="date" id="dataNascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="input-base" required aria-describedby={errors.dataNascimento ? "dataNascimento-error" : undefined}/>
        </FormField>
      </div>
      
      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 mt-8">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Salvar Alterações' : 'Cadastrar Paciente'}</button>
      </div>
    </form>
  );
};

export default PacienteForm;
