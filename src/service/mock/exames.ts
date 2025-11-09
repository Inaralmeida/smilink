/**
 * Lista de exames odontológicos comuns
 * Usado para solicitação durante consultas
 */

export const EXAMES_ODONTOLOGICOS = [
  // Exames radiográficos
  "Radiografia Periapical",
  "Radiografia Interproximal (Bite-wing)",
  "Radiografia Panorâmica",
  "Radiografia Oclusal",
  "Radiografia Cefalométrica",
  "Tomografia Computadorizada (TC)",
  "Ressonância Magnética",

  // Exames laboratoriais
  "Hemograma completo",
  "Glicemia de jejum",
  "Coagulograma",
  "Exame de urina",
  "Teste de glicemia",
  "Teste de coagulação",
  "Biópsia",
  "Citologia esfoliativa",

  // Exames específicos
  "Teste de sensibilidade pulpar",
  "Teste de vitalidade pulpar",
  "Teste de percussão",
  "Teste de mobilidade",
  "Teste de palpação",
  "Sondagem periodontal",
  "Índice de placa",
  "Índice gengival",

  // Exames de imagem avançados
  "CBCT (Tomografia de Feixe Cônico)",
  "Radiografia 3D",
  "Fotografia intraoral",
  "Modelagem 3D",

  // Exames complementares
  "Cultura bacteriana",
  "Antibiograma",
  "Teste de alergia",
  "Exame histopatológico",
  "Imunohistoquímica",

  // Exames sistêmicos relacionados
  "Pressão arterial",
  "Frequência cardíaca",
  "Oximetria",
  "Eletrocardiograma (ECG)",
];

/**
 * Buscar exames por termo de busca
 */
export const buscarExames = (termo: string): string[] => {
  if (!termo.trim()) {
    return EXAMES_ODONTOLOGICOS;
  }
  const termoLower = termo.toLowerCase().trim();
  return EXAMES_ODONTOLOGICOS.filter((exame) =>
    exame.toLowerCase().includes(termoLower)
  );
};
