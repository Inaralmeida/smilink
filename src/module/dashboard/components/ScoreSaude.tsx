import { Box, Typography } from "@mui/material";
import { useMemo } from "react";

type ScoreSaudeProps = {
  score: number; // 0-900
  size?: number;
};

const ScoreSaude = ({ score, size = 400 }: ScoreSaudeProps) => {
  // Garantir que o score está entre 0 e 900
  const scoreNormalizado = Math.max(0, Math.min(900, score));

  // Calcular porcentagem (0-100%)
  const porcentagem = (scoreNormalizado / 900) * 100;

  // Calcular cor baseada no score
  const cor = useMemo(() => {
    if (scoreNormalizado >= 750) return "#037F8C"; // Azul primário (excelente)
    if (scoreNormalizado >= 600) return "#4CAF50"; // Verde (bom)
    if (scoreNormalizado >= 400) return "#FF9800"; // Laranja (regular)
    return "#F44336"; // Vermelho (ruim)
  }, [scoreNormalizado]);

  // Dimensões do semicírculo
  const width = size;
  const svgHeight = Math.ceil(size / 2) + 10;
  const centroX = width / 2;
  const raio = size / 2 - 40;
  // O centro Y do semicírculo fica na base (altura do SVG)
  const centroY = svgHeight - 10;

  // Calcular pontos do arco (semicírculo: 180° esquerda até 0° direita)
  const anguloInicio = 180;
  const anguloFim = 180 - (porcentagem * 180) / 100;

  const calcularPonto = (angulo: number) => {
    const rad = ((angulo - 90) * Math.PI) / 180;
    return {
      x: centroX + raio * Math.cos(rad),
      y: centroY + raio * Math.sin(rad),
    };
  };

  const inicio = calcularPonto(anguloInicio);
  const fim = calcularPonto(anguloFim);
  const largeArc = porcentagem > 50 ? 1 : 0;

  // Posição do texto: centro do semicírculo (raio/2 acima da base)
  const textoTop = centroY - raio * 0.6;

  return (
    <Box
      sx={{
        width: width,
        height: svgHeight + 50,
        position: "relative",
      }}
    >
      <svg width={width} height={svgHeight} style={{ display: "block" }}>
        {/* Arco de fundo (cinza) - semicírculo completo */}
        <path
          d={`M ${centroX - raio} ${centroY} A ${raio} ${raio} 0 0 1 ${
            centroX + raio
          } ${centroY}`}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Arco do score (colorido) */}
        <path
          d={`M ${inicio.x} ${inicio.y} A ${raio} ${raio} 0 ${largeArc} 1 ${fim.x} ${fim.y}`}
          fill="none"
          stroke={cor}
          strokeWidth="16"
          strokeLinecap="round"
        />
      </svg>

      {/* Número no centro do semicírculo */}
      <Box
        sx={{
          position: "absolute",
          top: textoTop + 50,
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            color: cor,
            lineHeight: 1,
            fontSize: "2.5rem",
          }}
        >
          {scoreNormalizado}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.875rem",
            mt: 0.5,
          }}
        >
          de 900
        </Typography>
      </Box>
    </Box>
  );
};

export default ScoreSaude;
