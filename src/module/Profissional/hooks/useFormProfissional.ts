import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import type { TProfissional } from "../../../domain/types/profissional";

const unmask = (val: string | undefined | null): string => {
  if (!val) return "";
  return val.replace(/[^\d]/g, "");
};

const profissionalSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório"),
  sobrenome: z.string().min(3, "Sobrenome é obrigatório"),
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido")
    .refine(
      (email) => email.includes("@smilink.com"),
      "E-mail deve ser do domínio @smilink.com"
    ),
  data_nascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine(
      (date) => new Date(date) <= new Date(),
      "A data não pode ser no futuro"
    ),
  CPF: z.string().transform(unmask).pipe(z.string().length(11, "CPF inválido")),
  telefone: z
    .string()
    .transform(unmask)
    .pipe(z.string().min(10, "Telefone inválido")),
  especialidades: z
    .array(z.string())
    .min(1, "Pelo menos uma especialidade é obrigatória"),
  bio: z.string().min(10, "Biografia deve ter pelo menos 10 caracteres"),
  fotoPerfil: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, "URL da foto inválida"),
  registro: z
    .string()
    .min(1, "CRO (Conselho Regional de Odontologia) é obrigatório"),
  crm: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 5,
      "CRM deve ter pelo menos 5 caracteres (formato: CRM-SP 123456)"
    ),
  cep: z.string().transform(unmask).pipe(z.string().length(8, "CEP inválido")),
  street: z.string().min(1, "Logradouro é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  neigborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
});

export type IProfissionalFormInputs = z.infer<typeof profissionalSchema>;

type UseFormProfissionalProps = {
  onClose: () => void;
  profissional?: Partial<TProfissional> | null;
  modoEdicao?: boolean;
  somenteLeitura?: boolean;
  onSalvo?: (dados: IProfissionalFormInputs) => void;
};

export const useFormProfissional = ({
  onClose,
  profissional,
  modoEdicao = false,
  somenteLeitura = false,
  onSalvo,
}: UseFormProfissionalProps) => {
  const [loadingCep, setLoadingCep] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const [editando, setEditando] = useState(modoEdicao);

  // Converter TProfissional para IProfissionalFormInputs
  const converterParaFormInputs = (
    prof?: Partial<TProfissional> | null
  ): IProfissionalFormInputs | undefined => {
    if (!prof) return undefined;

    const [nome, ...sobrenomeParts] = (prof.nome || "").split(" ");
    const sobrenome = sobrenomeParts.join(" ") || prof.sobrenome || "";

    return {
      nome: nome || "",
      sobrenome,
      email: prof.email || "",
      data_nascimento:
        prof.data_nascimento || prof.dataNascimento?.split("T")[0] || "",
      CPF: prof.CPF || prof.cpf || "",
      telefone: prof.telefone || prof.celular || "",
      especialidades: prof.especialidades || [],
      bio: prof.bio || "",
      fotoPerfil: prof.fotoPerfil || "",
      registro: prof.registro || "",
      crm: prof.crm || "",
      cep: prof.cep || "",
      street: prof.street || "",
      number: prof.number || "",
      complemento: prof.complemento || "",
      neigborhood: prof.neigborhood || "",
      city: prof.city || "",
      state: prof.state || "",
    };
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
    reset,
  } = useForm<IProfissionalFormInputs>({
    resolver:
      somenteLeitura || !editando ? undefined : zodResolver(profissionalSchema),
    mode: "onBlur",
    defaultValues: converterParaFormInputs(profissional) || {
      nome: "",
      sobrenome: "",
      email: "",
      data_nascimento: "",
      CPF: "",
      telefone: "",
      especialidades: [],
      bio: "",
      fotoPerfil: "",
      registro: "",
      crm: "",
      cep: "",
      street: "",
      number: "",
      complemento: "",
      neigborhood: "",
      city: "",
      state: "",
    },
  });

  const cep = watch("cep");

  // Buscar CEP dentro do hook
  const buscarEnderecoPorCEP = async (rawCep: string) => {
    const cepLimpo = unmask(rawCep);
    if (cepLimpo.length !== 8) return null;

    setLoadingCep(true);
    try {
      const resp = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      if (resp.data?.erro) {
        setError("cep", { message: "CEP não encontrado" });
        return null;
      }
      return resp.data;
    } catch {
      setError("cep", { message: "Erro ao buscar CEP" });
      return null;
    } finally {
      setLoadingCep(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!cep) return;
      const cleaned = unmask(cep);
      if (cleaned.length === 8) {
        const endereco = await buscarEnderecoPorCEP(cleaned);
        if (endereco) {
          setValue("street", endereco.logradouro || "");
          setValue("neigborhood", endereco.bairro || "");
          setValue("city", endereco.localidade || "");
          setValue("state", endereco.uf || "");
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  const onSubmit = async (data: IProfissionalFormInputs) => {
    try {
      if (onSalvo) {
        await onSalvo(data);
      }
      setToast({
        open: true,
        message: profissional
          ? "Profissional atualizado com sucesso!"
          : "Profissional salvo com sucesso!",
        severity: "success",
      });
      if (!profissional) {
        reset();
        onClose();
      } else if (editando) {
        setEditando(false);
      }
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Erro ao salvar profissional.",
        severity: "error",
      });
      throw err;
    }
  };

  const handleEditar = () => {
    setEditando(true);
  };

  const handleCancelarEdicao = () => {
    if (profissional) {
      const formData = converterParaFormInputs(profissional);
      if (formData) {
        reset(formData);
      }
    }
    setEditando(false);
  };

  const onInvalid: SubmitErrorHandler<IProfissionalFormInputs> = (errs) => {
    console.warn("Erros de validação:", errs);
    setToast({
      open: true,
      message: "Por favor, corrija os campos inválidos.",
      severity: "error",
    });
  };

  const handleToastClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setToast((p) => ({ ...p, open: false }));
  };

  const formHandleSubmit = handleSubmit(onSubmit, onInvalid);

  return {
    control,
    errors,
    isSubmitting,
    loadingCep,
    toast,
    handleSubmit: formHandleSubmit,
    handleToastClose,
    editando,
    somenteLeitura: somenteLeitura || (!editando && !!profissional),
    handleEditar,
    handleCancelarEdicao,
  };
};
