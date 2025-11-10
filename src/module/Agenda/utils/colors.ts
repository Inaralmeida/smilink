/**
 * Gera uma cor única para cada profissional baseado no ID
 */

const CORES_DISPONIVEIS = [
  "#1976d2", // Azul
  "#d32f2f", // Vermelho
  "#388e3c", // Verde
  "#f57c00", // Laranja
  "#7b1fa2", // Roxo
  "#0097a7", // Ciano
  "#c2185b", // Rosa
  "#5d4037", // Marrom
  "#455a64", // Azul acinzentado
  "#e64a19", // Vermelho alaranjado
  "#00796b", // Verde azulado
  "#303f9f", // Índigo
  "#d81b60", // Magenta
  "#00897b", // Verde água
  "#ff6f00", // Âmbar
];

const coresPorProfissional = new Map<string, string>();

/**
 * Obtém uma cor única para um profissional
 */
export const obterCorProfissional = (profissionalId: string): string => {
  if (coresPorProfissional.has(profissionalId)) {
    return coresPorProfissional.get(profissionalId)!;
  }

  // Gerar índice baseado no ID
  let hash = 0;
  for (let i = 0; i < profissionalId.length; i++) {
    hash = profissionalId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const corIndex = Math.abs(hash) % CORES_DISPONIVEIS.length;
  const cor = CORES_DISPONIVEIS[corIndex];
  coresPorProfissional.set(profissionalId, cor);

  return cor;
};

/**
 * Limpa o cache de cores (útil para testes)
 */
export const limparCacheCores = (): void => {
  coresPorProfissional.clear();
};
