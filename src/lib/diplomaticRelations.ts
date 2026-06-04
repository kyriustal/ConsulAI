export interface DiplomaticRelation {
  status: "excellent" | "good" | "scrutiny" | "critical" | "exemption";
  title: string;
  description: string;
  hasExemption: boolean;
  exemptionDetails?: string;
  consularNotes: string;
}

export function getDiplomaticRelation(nationality: string, destination: string): DiplomaticRelation {
  const nat = nationality.toLowerCase().trim();
  const dest = destination.toLowerCase().trim();

  // 1. Same country scenario
  if (nat === dest || 
     (nat === "portugal" && dest === "portugal") || 
     (nat === "angola" && dest === "angola") ||
     (nat === "brasil" && dest === "brazil") ||
     (nat === "brazil" && dest === "brazil")) {
    return {
      status: "exemption",
      title: "Livre Circulação / Cidadania Nacional",
      description: "O requerente possui a mesma nacionalidade ou jurisdição ativa da região de destino.",
      hasExemption: true,
      exemptionDetails: "Isenção total e direito de residência automática.",
      consularNotes: "Nenhuma barreira de admissibilidade consular aplicável."
    };
  }

  // 2. Schengen & EU Citizens traveling within Schengen or selected EU destinations
  const isNatEU = ["portugal", "spain", "france", "germany", "luxembourg", "poland"].includes(nat);
  const isDestEU = ["schengen", "portugal", "spain", "france", "germany", "luxembourg", "poland"].includes(dest);
  
  if (isNatEU && isDestEU) {
    return {
      status: "exemption",
      title: "Tratado de Schengen / Livre Circulação Europeia",
      description: "Plena isenção consular estipulada pelo Acordo de Schengen e Diretiva de Livre Circulação da UE.",
      hasExemption: true,
      exemptionDetails: "Dispensado de qualquer visto de curta ou longa duração.",
      consularNotes: "Fronteiras internas abertas. Controle limitado apenas a motivos excepcionais de segurança nacional."
    };
  }

  // 3. Brazil to Europe (Schengen/Portugal/Spain etc.)
  if (nat === "brasil" || nat === "brazil") {
    if (isDestEU) {
      return {
        status: "exemption",
        title: "Isenção Schengen para Cidadãos Brasileiros",
        description: "Relações diplomáticas excelentes com o bloco europeu. Isenção mútua de vistos para estadias de turismo ou negócios.",
        hasExemption: true,
        exemptionDetails: "Isenção total para turismo, trânsito ou negócios por até 90 dias a cada período de 180 dias.",
        consularNotes: "Não requer emissão física de visto consular de curta duração. Exige passaporte válido, seguro saúde internacional (Tratado de Schengen) e prova de fundos mínimos no controle de fronteira (SEF/AIMA)."
      };
    }
    if (dest === "usa") {
      return {
        status: "scrutiny",
        title: "Relações Bilaterais Ativas com Elevado Rigor (BR-USA)",
        description: "Relações diplomáticas sólidas, contudo os Estados Unidos mantêm a exigência rigorosa de visto de não-imigrante (B1/B2).",
        hasExemption: false,
        consularNotes: "Exige comprovação firme de laços fortes de retorno no Brasil devido à presunção legal de intenção imigratória sob a Seção 214(b) da Lei de Imigração e Nacionalidade (INA)."
      };
    }
    if (dest === "canada") {
      return {
        status: "good",
        title: "Facilitação de Viagem / Autorização Eletrônica (eTA)",
        description: "Cidadãos brasileiros que já possuem visto americano válido ou tiveram visto canadense nos últimos 10 anos gozam de facilitação de visto eletrônico.",
        hasExemption: false,
        exemptionDetails: "Facilitação através da Autorização Eletrônica de Viagem (eTA) para vias aéreas.",
        consularNotes: "Caso não preencha os requisitos do eTA, exige visto regular completo com auditoria econômica detalhada."
      };
    }
    if (dest === "angola") {
      return {
        status: "good",
        title: "Acordo de Facilitação de Vistos Bilateral",
        description: "Brasil e Angola possuem cooperação diplomática histórica e acordos recentes para simplificação de trâmite de vistos.",
        hasExemption: false,
        exemptionDetails: "Visto consular facilitado de múltiplas entradas para turismo e negócios.",
        consularNotes: "Flexibilização na exigência de documentos complexos para cidadãos brasileiros em turismo."
      };
    }
    if (dest === "uk") {
      return {
        status: "exemption",
        title: "Isenção de Visto de Curta Duração (UK)",
        description: "Cidadãos brasileiros são isentos de visto para estadias de turismo, trânsito ou cursos curtos na Grã-Bretanha.",
        hasExemption: true,
        exemptionDetails: "Dispensado de visto consular para estadias de curta duração de até 6 meses.",
        consularNotes: "Sujeito a entrevista rigorosa na chegada no aeroporto pelo oficial da Border Force. Necessário mostrar passagem de volta e sustento financeiro."
      };
    }
  }

  // 4. Angola to Europe (Portugal/Schengen etc.)
  if (nat === "angola") {
    if (dest === "portugal") {
      return {
        status: "good",
        title: "Acordo de Mobilidade CPLP (Angola-Portugal)",
        description: "Angola possui relações excepcionais com Portugal, reforçadas pelo Acordo de Mobilidade dos Países de Língua Portuguesa (CPLP).",
        hasExemption: false,
        exemptionDetails: "Facilitação de vistos D (Trabalho, Estudo, Estada Temporária). Dispensa de parecer prévio do AIMA e simplificação na comprovação de subsistência.",
        consularNotes: "Embora um visto ainda seja obrigatório, a taxa de rejeição administrativa é substancialmente menor se instruído sob os termos de dispensa e termos de responsabilidade do Acordo CPLP."
      };
    }
    if (isDestEU) {
      return {
        status: "scrutiny",
        title: "Escrutínio Geral do Bloco Schengen (Angola-UE)",
        description: "Relações diplomáticas cordiais, porém sujeitas a controles rígidos de migração ilegal e exigência completa de visto na embaixada de destino.",
        hasExemption: false,
        consularNotes: "Altíssima taxa de verificação sobre garantias patrimoniais de retorno. Exige comprovação estrita de fundos próprios líquidos e laços de emprego fixo na origem."
      };
    }
    if (dest === "usa" || dest === "uk" || dest === "canada") {
      return {
        status: "scrutiny",
        title: "Rigor Máximo na Concessão Consular",
        description: "Sistemas consulares destes países operam com critérios de triagem elevados devido à ausência de acordos especiais de mobilidade com Angola.",
        hasExemption: false,
        consularNotes: "Exige auditoria microscópica na origem dos fundos e declarações de imposto. Perfis com renda abaixo do limite de segurança regional ou solteiros sem dependentes possuem alto risco de indeferimento automático."
      };
    }
    if (dest === "brazil" || dest === "brasil") {
      return {
        status: "good",
        title: "Acordo de Facilitação Consular CPLP",
        description: "Relações diplomáticas facilitadas pelo Tratado de Amizade e Cooperação Bilateral e Diretiva CPLP.",
        hasExemption: false,
        exemptionDetails: "Facilitação na emissão de visto de turismo e estudos no Consulado Geral do Brasil em Luanda.",
        consularNotes: "Exigências de extrato e depósitos são mantidas, mas o agendamento e processamento são priorizados."
      };
    }
  }

  // 5. Portugal/Spain traveling to USA/Canada/UK
  if (nat === "portugal" || nat === "spain" || nat === "france" || nat === "germany" || nat === "luxembourg" || nat === "poland") {
    if (dest === "usa") {
      return {
        status: "exemption",
        title: "Tratado ESTA / Visa Waiver Program",
        description: "Pertence ao restrito grupo de países com isenção plena de visto de não-imigrante para os EUA.",
        hasExemption: true,
        exemptionDetails: "Isenção total de visto regular na embaixada. Apenas requer aprovação online do formulário ESTA.",
        consularNotes: "Autorização de viagem online de baixíssimo atrito. Não passa por entrevista consular tradicional."
      };
    }
    if (dest === "canada") {
      return {
        status: "exemption",
        title: "Autorização eTA de Viagem (Canadá)",
        description: "Tratado mútuo de isenção de vistos consulares presenciais de turismo.",
        hasExemption: true,
        exemptionDetails: "Viagem livre de visto tradicional mediante aprovação instantânea do formulário eletrônico eTA.",
        consularNotes: "Procedimento eletrônico em poucos minutos. Baixo risco de indeferimento."
      };
    }
    if (dest === "uk") {
      return {
        status: "exemption",
        title: "Livre Trânsito para Turismo no Reino Unido",
        description: "Relações geográficas europeias consolidadas pós-Brexit.",
        hasExemption: true,
        exemptionDetails: "Isenção total de visto de turismo por até 180 dias.",
        consularNotes: "Necessita passaporte biométrico válido. Controle simples na alfândega."
      };
    }
  }

  // Default fallback for general countries
  return {
    status: "good",
    title: `Relações Diplomáticas Regulares (${nationality} → ${destination})`,
    description: "Tratados consulares vigentes regulares. Controle consular padrão aplicável de acordo com as leis do país receptor.",
    hasExemption: false,
    consularNotes: "Exige processamento de visto e auditoria formal regular das condições financeiras e laços familiares descritos na ficha cadastral."
  };
}
