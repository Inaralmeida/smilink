/**
 * Lista de materiais odontológicos comuns
 * Usado para seleção durante consultas
 */

export const MATERIAIS_ODONTOLOGICOS = [
  // Materiais básicos
  "Luvas descartáveis",
  "Máscara cirúrgica",
  "Gorro descartável",
  "Avental descartável",
  "Campo cirúrgico",
  "Algodão",
  "Gaze",
  
  // Anestésicos
  "Anestésico local (Lidocaína)",
  "Anestésico local (Mepivacaína)",
  "Anestésico local (Articaína)",
  "Carpule de anestésico",
  
  // Materiais de restauração
  "Resina composta",
  "Cimento de ionômero de vidro",
  "Cimento de fosfato de zinco",
  "Amálgama",
  "Cimento provisório",
  "Adesivo dentinário",
  "Condicionador ácido",
  
  // Materiais endodônticos
  "Limas endodônticas",
  "Guta-percha",
  "Cimento obturador",
  "Hipoclorito de sódio",
  "EDTA",
  "Cone de papel",
  
  // Materiais periodontais
  "Fio cirúrgico",
  "Agulha cirúrgica",
  "Gaze hemostática",
  "Cemento periodontal",
  
  // Materiais de moldagem
  "Alginato",
  "Silicone de adição",
  "Silicone de condensação",
  "Cera de modelagem",
  "Gesso",
  
  // Materiais protéticos
  "Cimento para prótese",
  "Acrílico",
  "Cerâmica",
  "Zircônia",
  
  // Materiais ortodônticos
  "Bracket",
  "Fio ortodôntico",
  "Liga elástica",
  "Bandas ortodônticas",
  "Aparelho removível",
  
  // Materiais de profilaxia
  "Pasta de profilaxia",
  "Copo de profilaxia",
  "Tira de polimento",
  "Flúor",
  "Selante de fóssulas e fissuras",
  
  // Materiais cirúrgicos
  "Lâmina de bisturi",
  "Sutura",
  "Bone wax",
  "Esponja de hemostasia",
  "Membrana regenerativa",
  
  // Materiais de diagnóstico
  "Película radiográfica",
  "Sensibilizador radiográfico",
  "Revelador radiográfico",
  "Fixador radiográfico",
  
  // Outros
  "Água destilada",
  "Soro fisiológico",
  "Álcool 70%",
  "Clorexidina",
  "Peróxido de hidrogênio",
];

/**
 * Buscar materiais por termo de busca
 */
export const buscarMateriais = (termo: string): string[] => {
  if (!termo.trim()) {
    return MATERIAIS_ODONTOLOGICOS;
  }
  const termoLower = termo.toLowerCase().trim();
  return MATERIAIS_ODONTOLOGICOS.filter((material) =>
    material.toLowerCase().includes(termoLower)
  );
};

