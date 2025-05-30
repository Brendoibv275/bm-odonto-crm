import React, { useState, useEffect, useCallback } from 'react';
import { ExameExtraoralData } from '../../types';

interface ExameExtraoralFormProps {
  initialData?: ExameExtraoralData | null;
  onSave: (data: ExameExtraoralData) => void;
  onCancel: () => void;
}

type ExameExtraoralFormState = Omit<ExameExtraoralData, 'dataPreenchimento' | 'ultimaAtualizacao'>;

const ExameExtraoralFormComponent: React.FC<ExameExtraoralFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ExameExtraoralFormState>({ /* ... default initial state ... */ } as ExameExtraoralFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof ExameExtraoralFormState, string>>>({});

  useEffect(() => {
    const defaultState: ExameExtraoralFormState = {
        simetriaFacialObs: '', peleObs: '', perfilFacial: 'nao_avaliado', perfilFacialObs: '', proporcoesFaciaisObs: '',
        atmPalpacaoObs: '', atmAutscultaObs: '', atmDorObs: '', atmAmplitudeAberturaMm: '', atmDesviosDeflexoesObs: '',
        atmLimitacoesMovimentoObs: '', musculosPalpacaoObs: '', musculosDorObs: '', musculosHipertrofiaObs: '',
        linfonodosPalpacaoObs: '', linfonodosCaracteristicasObs: '', glandulasSalivaresPalpacaoObs: '',
        glandulasSalivaresCaracteristicasObs: '', labiosExternoInspecaoObs: '', comissurasLabiaisObs: '',
        pescocoInspecaoPalpacaoObs: '', observacoesGeraisExtraoral: '',
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
    if (errors[name as keyof ExameExtraoralFormState]) setErrors(prev => ({...prev, [name]: undefined}));
  }, [errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    const dataToSave: ExameExtraoralData = {
        ...formData,
        dataPreenchimento: initialData?.dataPreenchimento || new Date().toISOString(),
        ultimaAtualizacao: new Date().toISOString(),
    };
    onSave(dataToSave);
  };
  
  const formTitle = initialData && initialData.dataPreenchimento ? 'Editar Exame Extraoral' : 'Preencher Exame Extraoral';

  const FieldWrapper: React.FC<{label: string, name: string, error?: string, children: React.ReactNode}> = 
    ({label, name, error, children}) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );

  const InputField: React.FC<{name: keyof ExameExtraoralFormState, label: string, type?: string, placeholder?: string}> = 
    ({name, label, type = "text", placeholder}) => (
    <FieldWrapper label={label} name={name} error={errors[name]}>
       <input type={type} id={name} name={name} value={formData[name] as string || ''} onChange={handleChange} placeholder={placeholder} className="input-base" aria-describedby={errors[name] ? `${name}-error` : undefined}/>
    </FieldWrapper>
  );

  const TextAreaField: React.FC<{name: keyof ExameExtraoralFormState, label: string, rows?: number, placeholder?: string}> = 
    ({name, label, rows = 2, placeholder}) => (
    <FieldWrapper label={label} name={name} error={errors[name]}>
        <textarea id={name} name={name} value={formData[name] as string || ''} onChange={handleChange} rows={rows} placeholder={placeholder} className="textarea-base" aria-describedby={errors[name] ? `${name}-error` : undefined}/>
    </FieldWrapper>
  );
  
  const SelectField: React.FC<{name: keyof ExameExtraoralFormState, label: string, options: {value: string, label: string}[]}> = 
    ({name, label, options}) => (
    <FieldWrapper label={label} name={name} error={errors[name]}>
        <select id={name} name={name} value={formData[name] as string || ''} onChange={handleChange} className="select-base" aria-describedby={errors[name] ? `${name}-error` : undefined}>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </FieldWrapper>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h3 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-6">{formTitle}</h3>
      
      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Avaliação Geral da Face e Cabeça</legend>
        <TextAreaField name="simetriaFacialObs" label="Simetria Facial (Observações)" placeholder="Desvios de mandíbula, paralisias..." />
        <TextAreaField name="peleObs" label="Pele (Observações)" placeholder="Cor, textura, lesões..." />
        <SelectField name="perfilFacial" label="Perfil Facial" options={[ {value: 'nao_avaliado', label: 'Não Avaliado'}, {value: 'reto', label: 'Reto'}, {value: 'concavo', label: 'Côncavo'}, {value: 'convexo', label: 'Convexo'} ]}/>
        <TextAreaField name="perfilFacialObs" label="Observações do Perfil" />
        <TextAreaField name="proporcoesFaciaisObs" label="Proporções Faciais (Observações)" />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Articulação Temporomandibular (ATM)</legend>
        <TextAreaField 
          name="atmPalpacaoObs" 
          label="Palpação da ATM" 
          placeholder="Dor, crepitação, deslocamento..."
        />
        <TextAreaField 
          name="atmAutscultaObs" 
          label="Ausculta da ATM" 
          placeholder="Estalidos, crepitação..."
        />
        <TextAreaField 
          name="atmDorObs" 
          label="Dor na ATM" 
          placeholder="Localização, intensidade, fatores desencadeantes..."
        />
        <InputField 
          name="atmAmplitudeAberturaMm" 
          label="Amplitude de Abertura (mm)" 
          type="number"
          placeholder="Ex: 40"
        />
        <TextAreaField 
          name="atmDesviosDeflexoesObs" 
          label="Desvios e Deflexões" 
          placeholder="Desvios na abertura, lateralidade..."
        />
        <TextAreaField 
          name="atmLimitacoesMovimentoObs" 
          label="Limitações de Movimento" 
          placeholder="Restrições na abertura, lateralidade, protrusão..."
        />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Músculos da Mastigação</legend>
        <TextAreaField 
          name="musculosPalpacaoObs" 
          label="Palpação dos Músculos" 
          placeholder="Temporal, masseter, pterigóideos..."
        />
        <TextAreaField 
          name="musculosDorObs" 
          label="Dor Muscular" 
          placeholder="Localização, intensidade, fatores desencadeantes..."
        />
        <TextAreaField 
          name="musculosHipertrofiaObs" 
          label="Hipertrofia Muscular" 
          placeholder="Presença de hipertrofia, localização..."
        />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Cadeias Linfonodais</legend>
        <TextAreaField 
          name="linfonodosPalpacaoObs" 
          label="Palpação dos Linfonodos" 
          placeholder="Submandibulares, cervicais, submentonianos..."
        />
        <TextAreaField 
          name="linfonodosCaracteristicasObs" 
          label="Características dos Linfonodos" 
          placeholder="Tamanho, consistência, mobilidade, dor..."
        />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Glândulas Salivares Maiores</legend>
        <TextAreaField 
          name="glandulasSalivaresPalpacaoObs" 
          label="Palpação das Glândulas" 
          placeholder="Parótidas, submandibulares, sublinguais..."
        />
        <TextAreaField 
          name="glandulasSalivaresCaracteristicasObs" 
          label="Características das Glândulas" 
          placeholder="Tamanho, consistência, dor, fluxo salivar..."
        />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Lábios (externa) e Comissuras</legend>
        <TextAreaField 
          name="labiosExternoInspecaoObs" 
          label="Inspeção dos Lábios" 
          placeholder="Cor, textura, lesões, assimetrias..."
        />
        <TextAreaField 
          name="comissurasLabiaisObs" 
          label="Comissuras Labiais" 
          placeholder="Queilite angular, assimetrias, lesões..."
        />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Pescoço (geral)</legend>
        <TextAreaField 
          name="pescocoInspecaoPalpacaoObs" 
          label="Inspeção e Palpação do Pescoço" 
          placeholder="Simetria, lesões, massas, mobilidade..."
        />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm"><legend className="text-lg font-semibold text-slate-800 px-2">Observações Gerais</legend><TextAreaField name="observacoesGeraisExtraoral" label="Outras Observações Relevantes" rows={3}/></fieldset>


      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 mt-10">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Exame Extraoral</button>
      </div>
    </form>
  );
};

export default ExameExtraoralFormComponent;
