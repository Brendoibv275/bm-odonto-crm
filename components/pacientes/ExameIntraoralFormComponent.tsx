
import React, { useState, useEffect, useCallback } from 'react';
import { ExameIntraoralData } from '../../types';

interface ExameIntraoralFormProps {
  initialData?: ExameIntraoralData | null;
  onSave: (data: ExameIntraoralData) => void;
  onCancel: () => void;
}

type ExameIntraoralFormState = Omit<ExameIntraoralData, 'dataPreenchimento' | 'ultimaAtualizacao'>;

const ExameIntraoralFormComponent: React.FC<ExameIntraoralFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ExameIntraoralFormState>({ /* ... default initial state ... */ } as ExameIntraoralFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof ExameIntraoralFormState, string>>>({});

  useEffect(() => {
     const defaultState: ExameIntraoralFormState = {
        labiosMucosaInternaFornixObs: '', mucosaJugalFundoSacoObs: '', gengivaMucosaAlveolarObs: '',
        sondagemPeriodontalObsGeral: '', palatoDuroMoleObs: '', assoalhoBucalObs: '', linguaObs: '',
        orofaringeTonsilasObs: '', dentesContagemObs: '', dentesCarieObsGeral: '', dentesRestauracoesObsGeral: '',
        dentesProtesesObsGeral: '', dentesDesgastesObsGeral: '', dentesFraturasObsGeral: '',
        dentesAnomaliasObsGeral: '', dentesMobilidadeObsGeral: '', dentesSensibilidadePercussaoObsGeral: '',
        oclusaoRelacaoMolarCanina: '', oclusaoMordidaObs: '', oclusaoTrespasseHorizontalMm: '',
        oclusaoContatosPrematurosInterferenciasObs: '', oclusaoLinhaMediaObs: '', observacoesGeraisIntraoral: '',
    };
    if (initialData) {
      const { dataPreenchimento, ultimaAtualizacao, ...restInitialData } = initialData;
      setFormData({ ...defaultState, ...restInitialData });
    } else {
        setFormData(defaultState);
    }
  }, [initialData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ExameIntraoralFormState]) setErrors(prev => ({...prev, [name]: undefined}));
  }, [errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    const dataToSave: ExameIntraoralData = {
        ...formData,
        dataPreenchimento: initialData?.dataPreenchimento || new Date().toISOString(),
        ultimaAtualizacao: new Date().toISOString(),
    };
    onSave(dataToSave);
  };
  
  const formTitle = initialData && initialData.dataPreenchimento ? 'Editar Exame Intraoral' : 'Preencher Exame Intraoral';

  const FieldWrapper: React.FC<{label: string, name: string, error?: string, children: React.ReactNode}> = 
    ({label, name, error, children}) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );

  const InputField: React.FC<{name: keyof ExameIntraoralFormState, label: string, type?: string, placeholder?: string}> = 
    ({name, label, type = "text", placeholder}) => (
    <FieldWrapper label={label} name={name} error={errors[name]}>
       <input type={type} id={name} name={name} value={formData[name] as string || ''} onChange={handleChange} placeholder={placeholder} className="input-base" aria-describedby={errors[name] ? `${name}-error` : undefined}/>
    </FieldWrapper>
  );

  const TextAreaField: React.FC<{name: keyof ExameIntraoralFormState, label: string, rows?: number, placeholder?: string}> = 
    ({name, label, rows = 2, placeholder}) => (
     <FieldWrapper label={label} name={name} error={errors[name]}>
        <textarea id={name} name={name} value={formData[name] as string || ''} onChange={handleChange} rows={rows} placeholder={placeholder} className="textarea-base" aria-describedby={errors[name] ? `${name}-error` : undefined}/>
    </FieldWrapper>
  );
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h3 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-6">{formTitle}</h3>
      
      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Estruturas Moles</legend>
        <TextAreaField name="labiosMucosaInternaFornixObs" label="Lábios (mucosa interna) e Fórnix Vestibular" placeholder="Cor, textura, umidade, lesões..."/>
        <TextAreaField name="mucosaJugalFundoSacoObs" label="Mucosa Jugal e Fundo de Saco Vestibular" placeholder="Linha alba, ducto parotídeo..."/>
        <TextAreaField name="gengivaMucosaAlveolarObs" label="Gengiva e Mucosa Alveolar" placeholder="Cor, textura, contorno, sangramento..."/>
        <TextAreaField name="sondagemPeriodontalObsGeral" label="Sondagem Periodontal (Obs. Gerais)" />
        <TextAreaField name="palatoDuroMoleObs" label="Palato Duro e Mole" placeholder="Tórus, úvula, lesões..."/>
        <TextAreaField name="assoalhoBucalObs" label="Assoalho Bucal" placeholder="Frênulo, ductos, varicosidades..."/>
        <TextAreaField name="linguaObs" label="Língua (dorso, ventre, bordas)" placeholder="Papilas, saburra, lesões..."/>
        <TextAreaField name="orofaringeTonsilasObs" label="Orofaringe e Tonsilas" placeholder="Pilares, tamanho, cor..."/>
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Dentes (Observações Gerais)</legend>
        <InputField name="dentesContagemObs" label="Contagem" placeholder="Presentes, ausentes..."/>
        <TextAreaField name="dentesCarieObsGeral" label="Cárie (Geral)" />
        <TextAreaField name="dentesRestauracoesObsGeral" label="Restaurações (Geral)" />
        {/* ... mais campos de Dentes ... */}
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Oclusão (Observações Gerais)</legend>
        <InputField name="oclusaoRelacaoMolarCanina" label="Relação Molar e Canina (Angle)" />
        <TextAreaField name="oclusaoMordidaObs" label="Mordida" placeholder="Aberta, cruzada, profunda..."/>
        {/* ... mais campos de Oclusão ... */}
      </fieldset>
      
      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Observações Gerais Adicionais</legend>
        <TextAreaField name="observacoesGeraisIntraoral" label="Outras Observações (Intraoral)" rows={3}/>
      </fieldset>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 mt-10">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Exame Intraoral</button>
      </div>
    </form>
  );
};

export default ExameIntraoralFormComponent;
