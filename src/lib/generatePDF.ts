import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  RESPONSE_OPTIONS,
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  getDepressionSeverity,
  getAnxietySeverity,
  ANGOLA_SUPPORT_CONTACTS,
} from "./questionnaires";

interface ReportData {
  userName: string;
  date: string;
  phq9Answers: number[];
  gad7Answers: number[];
}

export function generateReport(data: ReportData) {
  const doc = new jsPDF();
  const pink = [200, 80, 120] as const;
  const pinkLight = [252, 230, 238] as const;
  const pinkDark = [150, 50, 80] as const;

  const phq9Score = data.phq9Answers.reduce((a, b) => a + b, 0);
  const gad7Score = data.gad7Answers.reduce((a, b) => a + b, 0);
  const depResult = getDepressionSeverity(phq9Score);
  const anxResult = getAnxietySeverity(gad7Score);

  // Header
  doc.setFillColor(...pink);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("MenteSã Angola", 105, 18, { align: "center" });
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Relatório de Avaliação Preliminar de Saúde Mental", 105, 28, { align: "center" });

  // Disclaimer
  doc.setFillColor(...pinkLight);
  doc.roundedRect(14, 46, 182, 16, 3, 3, "F");
  doc.setTextColor(120, 40, 60);
  doc.setFontSize(8);
  doc.text("⚠ AVISO IMPORTANTE: Este relatório NÃO constitui diagnóstico médico. Trata-se de uma avaliação", 105, 53, { align: "center" });
  doc.text("preliminar. Consulte sempre um profissional de saúde mental para uma avaliação completa.", 105, 58, { align: "center" });

  // User info
  doc.setTextColor(80, 30, 50);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Dados do Utilizador", 14, 74);
  doc.setDrawColor(...pink);
  doc.setLineWidth(0.5);
  doc.line(14, 76, 196, 76);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Nome: ${data.userName}`, 14, 83);
  doc.text(`Data: ${data.date}`, 14, 89);

  // Depression Results
  let y = 100;
  doc.setTextColor(...pinkDark);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Resultado - Depressão (PHQ-9)", 14, y);
  doc.line(14, y + 2, 196, y + 2);

  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(`Pontuação: ${phq9Score}/27`, 14, y);
  doc.text(`Classificação: ${depResult.label}`, 14, y + 6);
  doc.text(`${depResult.description}`, 14, y + 12, { maxWidth: 180 });

  // PHQ-9 answers table
  y += 22;
  autoTable(doc, {
    startY: y,
    head: [["#", "Pergunta", "Resposta", "Pontos"]],
    body: PHQ9_QUESTIONS.map((q, i) => [
      String(i + 1),
      q.substring(0, 60) + (q.length > 60 ? "..." : ""),
      RESPONSE_OPTIONS[data.phq9Answers[i]]?.label || "-",
      String(data.phq9Answers[i]),
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [200, 80, 120], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [252, 230, 238] },
    margin: { left: 14, right: 14 },
  });

  // Anxiety Results  
  y = (doc as any).lastAutoTable.finalY + 12;
  if (y > 230) { doc.addPage(); y = 20; }

  doc.setTextColor(...pinkDark);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Resultado - Ansiedade (GAD-7)", 14, y);
  doc.line(14, y + 2, 196, y + 2);

  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(`Pontuação: ${gad7Score}/21`, 14, y);
  doc.text(`Classificação: ${anxResult.label}`, 14, y + 6);
  doc.text(`${anxResult.description}`, 14, y + 12, { maxWidth: 180 });

  y += 22;
  autoTable(doc, {
    startY: y,
    head: [["#", "Pergunta", "Resposta", "Pontos"]],
    body: GAD7_QUESTIONS.map((q, i) => [
      String(i + 1),
      q.substring(0, 60) + (q.length > 60 ? "..." : ""),
      RESPONSE_OPTIONS[data.gad7Answers[i]]?.label || "-",
      String(data.gad7Answers[i]),
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [200, 80, 120], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [252, 230, 238] },
    margin: { left: 14, right: 14 },
  });

  // Recommendations
  y = (doc as any).lastAutoTable.finalY + 12;
  if (y > 230) { doc.addPage(); y = 20; }

  doc.setTextColor(...pinkDark);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Recomendações", 14, y);
  doc.line(14, y + 2, 196, y + 2);

  y += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(`• Depressão: ${depResult.recommendation}`, 14, y, { maxWidth: 180 });
  y += 12;
  doc.text(`• Ansiedade: ${anxResult.recommendation}`, 14, y, { maxWidth: 180 });

  // Support contacts
  y += 16;
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setTextColor(...pinkDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Contactos de Apoio em Angola", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  ANGOLA_SUPPORT_CONTACTS.forEach((c) => {
    doc.text(`• ${c.name}${c.phone ? ` - ${c.phone}` : ""} — ${c.description}`, 14, y);
    y += 5;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...pink);
    doc.rect(0, 287, 210, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text("MenteSã Angola — Avaliação Preliminar • Este documento não substitui consulta profissional", 105, 293, { align: "center" });
  }

  doc.save(`MenteSa_Relatorio_${data.date}.pdf`);
}
