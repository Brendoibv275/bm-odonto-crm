import React, { useState, useEffect, useCallback } from 'react';
import { AnamneseClinicaData } from '../../types';

interface AnamneseFormProps {
  initialData?: AnamneseClinicaData | null;
  onSave: (data: AnamneseClinicaData) => void;
  onCancel: () => void;
}

type AnamneseFormState = Omit<AnamneseClinicaData, 'dataPreenchimento' | 'ultimaAtualizacao'>;

const AnamneseFormComponent: React.FC<AnamneseFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<AnamneseFormState>({ /* ... default initial state ... */ } as AnamneseFormState); // Simplified for brevity
  const [errors, setErrors] = useState<Partial<Record<keyof AnamneseFormState, string>>>({});

  useEffect(() => {
    const defaultState: AnamneseFormState = {
      queixaPrincipal: '', historiaDoencaAtual: '', dorLocalizacao: '', dorTipo: '', dorIntensidade: '', dorIrradiacao: '',
      dorAcordaNoite: 'nao', dorMediacao: '', doencasPreexistentes: '', tratamentoMedicoAtual: '', medicacoesUsoContinuo: '',
      alergias: '', cirurgiasAnteriores: '', internacoes: '', febreReumaticaSoproCardiaco: 'nao_sabe',
      problemasSangramentoCicatrizacao: 'nao_sabe', profilaxiaAntibiotica: 'nao_sabe', estaGravidaOuSuspeita: 'nao_aplica',
      estaAmamentando: 'nao_aplica', usaContraceptivoHormonal: 'nao_aplica', ultimaVisitaDentista: '',
      acompanhamentoRegular: 'nao', experienciaNegativaDentista: '', tratamentoCanal: '', extracaoDente: '',
      usaAparelho: 'nao_usou', doencaGengiva: 'talvez', sangramentoGengival: 'nao', sensibilidadeDentes: '',
      problemasATM: '', rangeDentes: 'nao', fezClareamentoDental: 'nao', higieneOralFrequenciaEscovacao: '',
      usaFioDental: 'nao', tipoEscovaCremeDental: '', usaEnxaguanteBucal: '', fuma: 'nao', fumaDetalhes: '',
      consomeAlcool: 'nao', usaOutrasDrogas: '', alimentacaoGeral: '', esportesContatoProtetorBucal: 'nao_pratica',
      avaliacaoSaudeBucalPropria: '', preocupacaoPrincipal: '', expectativaTratamento: '', ansiedadeTratamento: 'nenhuma',
      restricoesTratamento: '',
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
    if (errors[name as keyof AnamneseFormState]) setErrors(prev => ({...prev, [name]: undefined}));
  }, [errors]);

  const validate = () => {
    const newErrors: Partial<Record<keyof AnamneseFormState, string>> = {};
    if (!formData.queixaPrincipal.trim()) newErrors.queixaPrincipal = 'Queixa Principal é obrigatória.';
    setErrors(newErrors); return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); if (!validate()) return;
    const dataToSave: AnamneseClinicaData = {
        ...formData,
        dataPreenchimento: initialData?.dataPreenchimento || new Date().toISOString(),
        ultimaAtualizacao: new Date().toISOString(),
    };
    onSave(dataToSave);
  };
  
  const formTitle = initialData && initialData.dataPreenchimento ? 'Editar Anamnese' : 'Preencher Anamnese Inicial';

  const FieldWrapper: React.FC<{label: string, name: string, error?: string, children: React.ReactNode}> = 
    ({label, name, error, children}) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );

  const InputField: React.FC<{name: keyof AnamneseFormState, label: string, type?: string}> = ({name, label, type = "text"}) => (
    <FieldWrapper label={label} name={name} error={errors[name]}>
       <input type={type} id={name} name={name} value={formData[name] as string || ''} onChange={handleChange} className="input-base" aria-describedby={errors[name] ? `${name}-error` : undefined}/>
    </FieldWrapper>
  );

  const TextAreaField: React.FC<{name: keyof AnamneseFormState, label: string, rows?: number}> = ({name, label, rows = 3}) => (
    <FieldWrapper label={label} name={name} error={errors[name]}>
        <textarea id={name} name={name} value={formData[name] as string || ''} onChange={handleChange} rows={rows} className="textarea-base" aria-describedby={errors[name] ? `${name}-error` : undefined}/>
    </FieldWrapper>
  );
  
  const SelectField: React.FC<{name: keyof AnamneseFormState, label: string, options: {value: string, label: string}[]}> = ({name, label, options}) => (
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
        <legend className="text-lg font-semibold text-slate-800 px-2">1. Queixa Principal e HDA</legend>
        <TextAreaField name="queixaPrincipal" label="Motivo da consulta?" />
        <TextAreaField name="historiaDoencaAtual" label="Como começou? Melhora/piora? Tratamento anterior?" />
         <fieldset className="space-y-4 border p-3 rounded-md mt-3 bg-slate-50">
            <legend className="text-md font-medium text-slate-700 px-1">Se houver dor:</legend>
            <InputField name="dorLocalizacao" label="Onde dói?" />
            <InputField name="dorTipo" label="Como é a dor?" />
            <InputField name="dorIntensidade" label="Intensidade (0-10)?" />
            <InputField name="dorIrradiacao" label="Irradia?" />
            <SelectField name="dorAcordaNoite" label="Acorda à noite?" options={[{value: 'nao', label: 'Não'}, {value: 'sim', label: 'Sim'}, {value: 'as_vezes', label: 'Às vezes'}]}/>
            <InputField name="dorMediacao" label="Medicação para dor?" />
        </fieldset>
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">2. Histórico Médico Geral</legend>
        <TextAreaField 
          name="doencasPreexistentes" 
          label="Doenças Preexistentes" 
          rows={2}
        />
        <TextAreaField 
          name="tratamentoMedicoAtual" 
          label="Tratamento Médico Atual" 
          rows={2}
        />
        <TextAreaField 
          name="medicacoesUsoContinuo" 
          label="Medicações em Uso Contínuo" 
          rows={2}
        />
        <TextAreaField 
          name="alergias" 
          label="Alergias" 
          rows={2}
        />
        <TextAreaField 
          name="cirurgiasAnteriores" 
          label="Cirurgias Anteriores" 
          rows={2}
        />
        <TextAreaField 
          name="internacoes" 
          label="Internações" 
          rows={2}
        />
        <SelectField 
          name="febreReumaticaSoproCardiaco" 
          label="Febre Reumática ou Sopro Cardíaco" 
          options={[
            {value: 'nao_sabe', label: 'Não Sabe'},
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'}
          ]}
        />
        <SelectField 
          name="problemasSangramentoCicatrizacao" 
          label="Problemas de Sangramento ou Cicatrização" 
          options={[
            {value: 'nao_sabe', label: 'Não Sabe'},
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'}
          ]}
        />
        <SelectField 
          name="profilaxiaAntibiotica" 
          label="Necessita Profilaxia Antibiótica" 
          options={[
            {value: 'nao_sabe', label: 'Não Sabe'},
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'}
          ]}
        />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">Para Mulheres</legend>
        <SelectField 
          name="estaGravidaOuSuspeita" 
          label="Está Grávida ou Suspeita?" 
          options={[
            {value: 'nao_aplica', label: 'Não se aplica'},
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'},
            {value: 'suspeita', label: 'Suspeita'}
          ]}
        />
        <SelectField 
          name="estaAmamentando" 
          label="Está Amamentando?" 
          options={[
            {value: 'nao_aplica', label: 'Não se aplica'},
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'}
          ]}
        />
        <SelectField 
          name="usaContraceptivoHormonal" 
          label="Usa Contraceptivo Hormonal?" 
          options={[
            {value: 'nao_aplica', label: 'Não se aplica'},
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'}
          ]}
        />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">3. Histórico Odontológico Pregresso</legend>
        <TextAreaField 
          name="ultimaVisitaDentista" 
          label="Última Visita ao Dentista" 
          rows={2}
        />
        <SelectField 
          name="acompanhamentoRegular" 
          label="Faz Acompanhamento Regular?" 
          options={[
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'},
            {value: 'as_vezes', label: 'Às vezes'}
          ]}
        />
        <TextAreaField 
          name="experienciaNegativaDentista" 
          label="Experiências Negativas com Dentistas" 
          rows={2}
        />
        <TextAreaField 
          name="tratamentoCanal" 
          label="Tratamentos de Canal Realizados" 
          rows={2}
        />
        <TextAreaField 
          name="extracaoDente" 
          label="Extrações Realizadas" 
          rows={2}
        />
        <SelectField 
          name="usaAparelho" 
          label="Usa ou Já Usou Aparelho Ortodôntico?" 
          options={[
            {value: 'nao_usou', label: 'Nunca usou'},
            {value: 'usou', label: 'Já usou'},
            {value: 'usa', label: 'Está usando'}
          ]}
        />
        <SelectField 
          name="doencaGengiva" 
          label="Já Teve Doença na Gengiva?" 
          options={[
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'},
            {value: 'talvez', label: 'Talvez'}
          ]}
        />
        <SelectField 
          name="sangramentoGengival" 
          label="Sangramento na Gengiva" 
          options={[
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'},
            {value: 'as_vezes', label: 'Às vezes'}
          ]}
        />
        <TextAreaField 
          name="sensibilidadeDentes" 
          label="Sensibilidade nos Dentes" 
          rows={2}
        />
        <SelectField 
          name="rangeDentes" 
          label="Range os Dentes" 
          options={[
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'},
            {value: 'as_vezes', label: 'Às vezes'}
          ]}
        />
        <SelectField 
          name="fezClareamentoDental" 
          label="Já Fez Clareamento Dental?" 
          options={[
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'},
            {value: 'planeja', label: 'Planeja fazer'}
          ]}
        />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">4. Hábitos de Higiene Oral</legend>
        <TextAreaField 
          name="higieneOralFrequenciaEscovacao" 
          label="Frequência de Escovação" 
          rows={2}
        />
        <SelectField 
          name="usaFioDental" 
          label="Usa Fio Dental?" 
          options={[
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'},
            {value: 'as_vezes', label: 'Às vezes'}
          ]}
        />
        <TextAreaField 
          name="tipoEscovaCremeDental" 
          label="Tipo de Escova e Creme Dental" 
          rows={2}
        />
        <TextAreaField 
          name="usaEnxaguanteBucal" 
          label="Usa Enxaguante Bucal?" 
          rows={2}
        />
      </fieldset>

      <fieldset className="space-y-5 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">5. Hábitos e Estilo de Vida</legend>
        <SelectField 
          name="fuma" 
          label="Fuma?" 
          options={[
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'},
            {value: 'parou', label: 'Parou'}
          ]}
        />
        <TextAreaField 
          name="fumaDetalhes" 
          label="Detalhes sobre o Fumo" 
          rows={2}
        />
        <SelectField 
          name="consomeAlcool" 
          label="Consome Álcool?" 
          options={[
            {value: 'nao', label: 'Não'},
            {value: 'sim', label: 'Sim'},
            {value: 'socialmente', label: 'Socialmente'}
          ]}
        />
        <TextAreaField 
          name="usaOutrasDrogas" 
          label="Usa Outras Drogas?" 
          rows={2}
        />
        <TextAreaField 
          name="alimentacaoGeral" 
          label="Alimentação Geral" 
          rows={2}
        />
      </fieldset>

      <fieldset className="space-y-4 border p-4 rounded-lg shadow-sm">
        <legend className="text-lg font-semibold text-slate-800 px-2">6. Aspectos Psicossociais e Expectativas</legend>
        <SelectField 
          name="esportesContatoProtetorBucal" 
          label="Pratica esportes de contato?" 
          options={[
            {value: 'sim_usa_protetor', label: 'Sim, usa protetor bucal'},
            {value: 'sim_nao_usa_protetor', label: 'Sim, não usa protetor bucal'},
            {value: 'nao_pratica', label: 'Não pratica'}
          ]}
        />
        <TextAreaField 
          name="avaliacaoSaudeBucalPropria" 
          label="Como avalia sua saúde bucal?" 
          rows={2}
        />
        <TextAreaField 
          name="preocupacaoPrincipal" 
          label="Qual sua principal preocupação com sua saúde bucal?" 
          rows={2}
        />
        <TextAreaField 
          name="expectativaTratamento" 
          label="O que espera do tratamento?" 
          rows={2}
        />
        <SelectField 
          name="ansiedadeTratamento" 
          label="Nível de ansiedade em relação ao tratamento" 
          options={[
            {value: 'nenhuma', label: 'Nenhuma'},
            {value: 'pouca', label: 'Pouca'},
            {value: 'moderada', label: 'Moderada'},
            {value: 'muita', label: 'Muita'}
          ]}
        />
        <TextAreaField 
          name="restricoesTratamento" 
          label="Restrições ou limitações para o tratamento" 
          rows={2}
        />
      </fieldset>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 mt-10">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Anamnese</button>
      </div>
    </form>
  );
};

export default AnamneseFormComponent;
