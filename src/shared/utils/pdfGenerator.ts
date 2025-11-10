import type { TConsulta } from "../../domain/types/consulta";
import type { TProfissional } from "../../domain/types/profissional";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import QRCode from "qrcode";

// Receita padrão (sempre a mesma)
const RECEITA_PADRAO = `Cetoprofeno 100mg - Tomar 1 comprimido de 8 em 8 horas por 7 dias
Dipirona 500mg - Tomar 1 comprimido a cada 6 horas em caso de dor
Dexametasona 4mg - Tomar 1 comprimido de 12 em 12 horas por 5 dias`;

/**
 * Busca outro profissional para receita padrão (mockado)
 */
const buscarOutroProfissionalParaReceita = async (
  excluirId: string
): Promise<TProfissional | null> => {
  try {
    const { fetchProfissionais } = await import(
      "../../service/mock/profissionais"
    );
    const profissionais = await fetchProfissionais();
    // Buscar profissional diferente do que está na consulta
    const outroProfissional = profissionais.find((p) => p.id !== excluirId);
    return outroProfissional || profissionais[0] || null;
  } catch {
    return null;
  }
};

/**
 * Gera QR Code como data URL (base64)
 */
const gerarQRCodeDataURL = async (texto: string): Promise<string> => {
  try {
    const dataURL = await QRCode.toDataURL(texto, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return dataURL;
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    // Retornar uma imagem vazia em caso de erro
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  }
};

/**
 * Gera dados para o QR Code da receita
 */
const gerarDadosQRCodeReceita = (
  consulta: TConsulta,
  profissional: TProfissional
): string => {
  const dados = {
    tipo: "RECEITA",
    consultaId: consulta.id,
    paciente: `${consulta.pacienteNome} ${consulta.pacienteSobrenome}`,
    profissional: `${profissional.nome} ${profissional.sobrenome}`,
    crm: profissional.crm || profissional.registro || "N/A",
    data: consulta.data,
    receita: consulta.receita || RECEITA_PADRAO,
  };
  return JSON.stringify(dados);
};

/**
 * Gera dados para o QR Code do atestado
 */
const gerarDadosQRCodeAtestado = (
  consulta: TConsulta,
  profissional: TProfissional
): string => {
  const dados = {
    tipo: "ATESTADO",
    consultaId: consulta.id,
    paciente: `${consulta.pacienteNome} ${consulta.pacienteSobrenome}`,
    profissional: `${profissional.nome} ${profissional.sobrenome}`,
    crm: profissional.crm || profissional.registro || "N/A",
    data: consulta.data,
    cid: consulta.atestado?.cid || "N/A",
    dias: consulta.atestado?.dias || 0,
  };
  return JSON.stringify(dados);
};

/**
 * Gera PDF de receita médica (mockado)
 * Usa window.print() como método principal, que funciona de forma mais confiável
 */
export const gerarPDFReceita = async (
  consulta: TConsulta,
  profissional: TProfissional
): Promise<void> => {
  console.log("📄 [gerarPDFReceita] Função chamada");
  console.log("📄 [gerarPDFReceita] Consulta:", consulta);
  console.log("📄 [gerarPDFReceita] Profissional:", profissional);

  // Se houver receita customizada, usar o profissional da consulta
  // Se não houver, usar receita padrão com outro médico
  let profissionalReceita = profissional;
  let receitaTexto = consulta.receita;

  if (!receitaTexto) {
    // Usar receita padrão com outro médico
    receitaTexto = RECEITA_PADRAO;
    const outroProf = await buscarOutroProfissionalParaReceita(profissional.id);
    if (outroProf) {
      profissionalReceita = outroProf;
    }
  }

  const dataConsulta = consulta.data
    ? format(new Date(consulta.data), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      })
    : format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Gerar QR Code
  const dadosQRCode = gerarDadosQRCodeReceita(consulta, profissionalReceita);
  const qrCodeDataURL = await gerarQRCodeDataURL(dadosQRCode);

  // Criar HTML do PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Receita Médica</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #000;
            padding: 20mm;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
          }
          .patient-info {
            margin-bottom: 20px;
          }
          .patient-info p {
            margin: 5px 0;
          }
          .prescription {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            white-space: pre-line;
            min-height: 200px;
          }
          .footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .doctor-info {
            text-align: left;
          }
          .doctor-info p {
            margin: 5px 0;
          }
          .qr-code {
            text-align: center;
            margin-left: 20px;
          }
          .qr-code img {
            width: 80px;
            height: 80px;
            border: 1px solid #ccc;
            padding: 5px;
            background: white;
          }
          .date {
            text-align: right;
            margin-top: 20px;
          }
          @media print {
            body {
              margin: 0;
              padding: 20mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RECEITA MÉDICA</h1>
        </div>
        
        <div class="patient-info">
          <p><strong>Paciente:</strong> ${consulta.pacienteNome} ${
    consulta.pacienteSobrenome
  }</p>
          <p><strong>Data:</strong> ${dataConsulta}</p>
        </div>
        
        <div class="prescription">
          ${receitaTexto}
        </div>
        
        <div class="footer">
          <div class="doctor-info">
            <p><strong>Dr(a). ${profissionalReceita.nome} ${
    profissionalReceita.sobrenome
  }</strong></p>
            <p>${
              profissionalReceita.crm ||
              profissionalReceita.registro ||
              "Registro não informado"
            }</p>
          </div>
          <div class="qr-code">
            <img src="${qrCodeDataURL}" alt="QR Code" />
          </div>
        </div>
        
        <div class="date">
          <p>${dataConsulta}</p>
        </div>
        
        <script>
          window.onload = function() {
            // Aguardar um pouco para garantir que a imagem do QR Code foi carregada
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }, 500);
          };
        </script>
      </body>
    </html>
  `;

  // Abrir nova janela e imprimir
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Não foi possível abrir janela para impressão");
  }

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

/**
 * Gera PDF de atestado médico (mockado)
 * Usa window.print() como método principal, que funciona de forma mais confiável
 */
export const gerarPDFAtestado = async (
  consulta: TConsulta,
  profissional: TProfissional
): Promise<void> => {
  console.log("🏥 [gerarPDFAtestado] Função chamada");
  console.log("🏥 [gerarPDFAtestado] Consulta:", consulta);
  console.log("🏥 [gerarPDFAtestado] Profissional:", profissional);

  if (!consulta.atestado?.emitido) {
    throw new Error("Atestado não foi emitido para esta consulta");
  }

  const cid = consulta.atestado.cid || "CID não informado";
  const dias = consulta.atestado.dias || 0;
  const pacienteNome = consulta.pacienteNome || "Paciente";
  const pacienteSobrenome = consulta.pacienteSobrenome || "";

  const dataConsulta = consulta.data
    ? format(new Date(consulta.data), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      })
    : format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Gerar QR Code
  const dadosQRCode = gerarDadosQRCodeAtestado(consulta, profissional);
  const qrCodeDataURL = await gerarQRCodeDataURL(dadosQRCode);

  // Criar HTML do PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Atestado Médico</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.8;
            color: #000;
            padding: 20mm;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .header h1 {
            margin: 0 0 30px 0;
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .content {
            margin: 40px 0;
            text-align: justify;
          }
          .content p {
            margin: 15px 0;
          }
          .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .doctor-info {
            text-align: left;
          }
          .doctor-info p {
            margin: 5px 0;
          }
          .qr-code {
            text-align: center;
            margin-left: 20px;
          }
          .qr-code img {
            width: 80px;
            height: 80px;
            border: 1px solid #ccc;
            padding: 5px;
            background: white;
          }
          .date {
            text-align: right;
            margin-top: 20px;
          }
          @media print {
            body {
              margin: 0;
              padding: 20mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ATESTADO MÉDICO</h1>
        </div>
        
        <div class="content">
          <p>Atesto para os devidos fins que o(a) paciente <strong>${pacienteNome} ${pacienteSobrenome}</strong> 
          esteve sob meus cuidados médicos no dia ${dataConsulta} e necessita de afastamento 
          de suas atividades por período de <strong>${dias} ${
    dias === 1 ? "dia" : "dias"
  }</strong>, 
          a partir da data de emissão deste atestado.</p>
          
          <p><strong>CID:</strong> ${cid}</p>
        </div>
        
        <div class="footer">
          <div class="doctor-info">
            <p><strong>Dr(a). ${profissional.nome} ${
    profissional.sobrenome
  }</strong></p>
            <p>${
              profissional.crm ||
              profissional.registro ||
              "Registro não informado"
            }</p>
          </div>
          <div class="qr-code">
            <img src="${qrCodeDataURL}" alt="QR Code" />
          </div>
        </div>
        
        <div class="date">
          <p>${dataConsulta}</p>
        </div>
        
        <script>
          window.onload = function() {
            // Aguardar um pouco para garantir que a imagem do QR Code foi carregada
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }, 500);
          };
        </script>
      </body>
    </html>
  `;

  // Abrir nova janela e imprimir
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Não foi possível abrir janela para impressão");
  }

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
