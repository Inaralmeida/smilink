import type {
  TItemEstoque,
  TItemEstoqueInput,
  StatusEstoque,
} from "../../domain/types/estoque";
import { MATERIAIS_ODONTOLOGICOS } from "./materiais";
import { storage, STORAGE_KEYS } from "../../shared/utils/localStorage";

/**
 * Mapeia material para tipo de estoque
 */
const mapearMaterialParaTipo = (material: string): TItemEstoque["tipo"] => {
  const materialLower = material.toLowerCase();

  if (
    materialLower.includes("luvas") ||
    materialLower.includes("máscara") ||
    materialLower.includes("gorro") ||
    materialLower.includes("avental") ||
    materialLower.includes("campo") ||
    materialLower.includes("algodão") ||
    materialLower.includes("gaze")
  ) {
    return "material_basico";
  }

  if (
    materialLower.includes("anestésico") ||
    materialLower.includes("carpule")
  ) {
    return "anestesico";
  }

  if (
    materialLower.includes("resina") ||
    materialLower.includes("cimento") ||
    materialLower.includes("amálgama") ||
    materialLower.includes("adesivo") ||
    materialLower.includes("condicionador")
  ) {
    return "restauracao";
  }

  if (
    materialLower.includes("lima") ||
    materialLower.includes("guta") ||
    materialLower.includes("obturador") ||
    materialLower.includes("hipoclorito") ||
    materialLower.includes("edta") ||
    materialLower.includes("cone de papel")
  ) {
    return "endodontico";
  }

  if (
    materialLower.includes("fio cirúrgico") ||
    materialLower.includes("agulha cirúrgica") ||
    materialLower.includes("hemostática") ||
    materialLower.includes("periodontal")
  ) {
    return "periodontal";
  }

  if (
    materialLower.includes("alginato") ||
    materialLower.includes("silicone") ||
    materialLower.includes("cera") ||
    materialLower.includes("gesso")
  ) {
    return "moldagem";
  }

  if (
    materialLower.includes("prótese") ||
    materialLower.includes("acrílico") ||
    materialLower.includes("cerâmica") ||
    materialLower.includes("zircônia")
  ) {
    return "protesico";
  }

  if (
    materialLower.includes("bracket") ||
    materialLower.includes("ortodôntico") ||
    materialLower.includes("liga elástica") ||
    materialLower.includes("banda") ||
    materialLower.includes("aparelho removível")
  ) {
    return "ortodontico";
  }

  if (
    materialLower.includes("profilaxia") ||
    materialLower.includes("flúor") ||
    materialLower.includes("selante")
  ) {
    return "profilaxia";
  }

  if (
    materialLower.includes("bisturi") ||
    materialLower.includes("sutura") ||
    materialLower.includes("bone wax") ||
    materialLower.includes("esponja") ||
    materialLower.includes("membrana")
  ) {
    return "cirurgico";
  }

  if (
    materialLower.includes("radiográfico") ||
    materialLower.includes("película")
  ) {
    return "diagnostico";
  }

  return "outro";
};

/**
 * Calcula status do estoque baseado na quantidade
 */
const calcularStatusEstoque = (quantidade: number): StatusEstoque => {
  if (quantidade < 15) {
    return "emergencia";
  }
  if (quantidade < 30) {
    return "atencao";
  }
  return "normal";
};

/**
 * Gera quantidade aleatória para mock
 * Alguns itens ficam em estado de atenção/emergência
 */
const gerarQuantidadeMock = (index: number): number => {
  // Alguns itens ficam em estado crítico para demonstrar os alertas
  if (index % 7 === 0) {
    // Estado de emergência (< 15)
    return Math.floor(Math.random() * 15);
  }
  if (index % 5 === 0) {
    // Estado de atenção (15-29)
    return Math.floor(Math.random() * 15) + 15;
  }
  // Estado normal (>= 30)
  return Math.floor(Math.random() * 200) + 30;
};

/**
 * Gera mock de itens de estoque baseado nos materiais odontológicos
 */
const gerarItensEstoqueMock = (): TItemEstoque[] => {
  const agora = new Date().toISOString();

  return MATERIAIS_ODONTOLOGICOS.map((material, index) => {
    const quantidade = gerarQuantidadeMock(index);
    const tipo = mapearMaterialParaTipo(material);

    return {
      id: `estoque-${index + 1}`,
      nome: material,
      quantidade,
      tipo,
      unidade: "unidade",
      status: calcularStatusEstoque(quantidade),
      criadoEm: agora,
      atualizadoEm: agora,
    };
  });
};

/**
 * Buscar todos os itens de estoque
 */
export const fetchItensEstoque = async (): Promise<TItemEstoque[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const itensStorage = storage.get<TItemEstoque[]>(STORAGE_KEYS.ESTOQUE, []);

  // Se não houver itens no storage, gerar mock e salvar
  if (itensStorage.length === 0) {
    const itensMock = gerarItensEstoqueMock();
    storage.set(STORAGE_KEYS.ESTOQUE, itensMock);
    return itensMock;
  }

  // Atualizar status dos itens baseado na quantidade atual
  return itensStorage.map((item) => ({
    ...item,
    status: calcularStatusEstoque(item.quantidade),
  }));
};

/**
 * Buscar item de estoque por ID
 */
export const fetchItemEstoqueById = async (
  id: string
): Promise<TItemEstoque | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const itens = await fetchItensEstoque();
  return itens.find((item) => item.id === id) || null;
};

/**
 * Criar novo item de estoque
 */
export const criarItemEstoque = async (
  dados: TItemEstoqueInput
): Promise<TItemEstoque> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const itens = await fetchItensEstoque();
  const agora = new Date().toISOString();

  const novoItem: TItemEstoque = {
    id: `estoque-${Date.now()}`,
    nome: dados.nome,
    quantidade: dados.quantidade,
    tipo: dados.tipo,
    unidade: dados.unidade || "unidade",
    descricao: dados.descricao,
    status: calcularStatusEstoque(dados.quantidade),
    criadoEm: agora,
    atualizadoEm: agora,
  };

  itens.push(novoItem);
  storage.set(STORAGE_KEYS.ESTOQUE, itens);

  return novoItem;
};

/**
 * Atualizar item de estoque
 */
export const atualizarItemEstoque = async (
  id: string,
  dados: Partial<TItemEstoqueInput>
): Promise<TItemEstoque> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const itens = await fetchItensEstoque();
  const itemIndex = itens.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    throw new Error("Item de estoque não encontrado");
  }

  const itemAtualizado: TItemEstoque = {
    ...itens[itemIndex],
    ...dados,
    status: calcularStatusEstoque(
      dados.quantidade !== undefined
        ? dados.quantidade
        : itens[itemIndex].quantidade
    ),
    atualizadoEm: new Date().toISOString(),
  };

  itens[itemIndex] = itemAtualizado;
  storage.set(STORAGE_KEYS.ESTOQUE, itens);

  return itemAtualizado;
};

/**
 * Deletar item de estoque
 */
export const deletarItemEstoque = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const itens = await fetchItensEstoque();
  const itensFiltrados = itens.filter((item) => item.id !== id);

  storage.set(STORAGE_KEYS.ESTOQUE, itensFiltrados);
};
