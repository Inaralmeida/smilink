/**
 * Tipo de item de estoque
 */
export type TipoItemEstoque =
  | "material_basico"
  | "anestesico"
  | "restauracao"
  | "endodontico"
  | "periodontal"
  | "moldagem"
  | "protesico"
  | "ortodontico"
  | "profilaxia"
  | "cirurgico"
  | "diagnostico"
  | "outro";

/**
 * Status do estoque baseado na quantidade
 */
export type StatusEstoque = "normal" | "atencao" | "emergencia";

/**
 * Item de estoque
 */
export type TItemEstoque = {
  id: string;
  nome: string;
  quantidade: number;
  tipo: TipoItemEstoque;
  unidade?: string; // Ex: "unidade", "caixa", "litro", "kg"
  descricao?: string;
  status: StatusEstoque; // Calculado baseado na quantidade
  criadoEm: string; // ISO string
  atualizadoEm: string; // ISO string
};

/**
 * Dados para criar/atualizar item de estoque
 */
export type TItemEstoqueInput = {
  nome: string;
  quantidade: number;
  tipo: TipoItemEstoque;
  unidade?: string;
  descricao?: string;
};

