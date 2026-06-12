import PDFDocument from 'pdfkit';

interface Pedido {
  id: number;
  medida_horizontal: number;
  medida_vertical: number;
  quantidade_dobras: number;
}

interface Chapa {
  id: number;
  nome: string;
  tipo: string;
  espessura: number;
  desconto_por_dobra: boolean;
}

export const calcularDescontos = (
  medidaH: number,
  medidaV: number,
  quantidadeDobras: number,
  espessura: number,
  temDesconto: boolean
): { desconto_total: number; medida_corte_h: number; medida_corte_v: number } => {
  let desconto_total = 0;

  if (temDesconto && quantidadeDobras > 0) {
    desconto_total = quantidadeDobras * espessura;
  }

  const medida_corte_h = medidaH - desconto_total;
  const medida_corte_v = medidaV - desconto_total;

  return {
    desconto_total,
    medida_corte_h: Math.max(0, medida_corte_h),
    medida_corte_v: Math.max(0, medida_corte_v)
  };
};

export const gerarPDF = async (dados: {
  pedido: Pedido;
  chapa: Chapa;
  quantidade_dobras: number;
  desconto_total: number;
  formato_nome: string;
}): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const { pedido, chapa, quantidade_dobras, desconto_total, formato_nome } = dados;
    const medidaCH = pedido.medida_horizontal - desconto_total;
    const medidaCV = pedido.medida_vertical - desconto_total;

    // Cabeçalho
    doc.fontSize(20).font('Helvetica-Bold').text('FOLHA DE CORTE', 50, 50);
    doc.fontSize(10).font('Helvetica');

    // Informações da chapa
    doc.text(`Formato: ${formato_nome}`, 50, 120);
    doc.text(`Chapa: ${chapa.tipo} - Espessura: ${chapa.espessura}mm`, 50, 140);
    doc.text(`Pedido ID: ${pedido.id}`, 50, 160);

    if (quantidade_dobras > 0) {
      // COM DOBRAS - Mais detalhado
      doc.fontSize(14).font('Helvetica-Bold').text('MEDIDAS COM DESCONTO DE DOBRA', 50, 200);
      doc.fontSize(10).font('Helvetica');

      doc.text(`Quantidade de dobras: ${quantidade_dobras}`, 50, 230);
      doc.text(`Desconto por dobra: ${chapa.espessura}mm`, 50, 250);
      doc.text(`Desconto total: ${desconto_total}mm`, 50, 270);
      doc.text(`Medida Original: ${pedido.medida_horizontal}mm × ${pedido.medida_vertical}mm`, 50, 290);
      doc.text(`Medida de CORTE: ${medidaCH}mm × ${medidaCV}mm`, 50, 310, {
        underline: true
      });

      // Desenho simplificado
      drawDiagrama(doc, medidaCH, medidaCV, quantidade_dobras, chapa.espessura);
    } else {
      // SEM DOBRA - Simples
      doc.fontSize(14).font('Helvetica-Bold').text('MEDIDAS PARA CORTE', 50, 200);
      doc.fontSize(10).font('Helvetica');

      doc.text(`Medida: ${pedido.medida_horizontal}mm × ${pedido.medida_vertical}mm`, 50, 240, {
        underline: true
      });
    }

    doc.end();
  });
};

function drawDiagrama(
  doc: InstanceType<typeof PDFDocument>,
  largura: number,
  altura: number,
  dobras: number,
  espessura: number
) {
  const scale = 0.5;
  const x = 50;
  const y = 380;

  const w = largura * scale;
  const h = altura * scale;

  doc.rect(x, y, w, h).stroke();

  doc.fontSize(9);
  doc.text(`${largura}mm`, x + w / 2 - 20, y + h + 10);
  doc.text(`${altura}mm`, x - 40, y + h / 2);

  if (dobras > 0) {
    const linhaX = x + w / 2;
    doc.strokeColor('red');
    doc.dashedLine(linhaX, y, linhaX, y + h, [5, 5]);
    doc.strokeColor('black');
  }
}
