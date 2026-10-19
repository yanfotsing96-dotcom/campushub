import { jsPDF } from 'jspdf';
import type { IFiliereL01, AcademicLevel } from '../types/lab01';

export interface IExportLab01Data {
  filiere: IFiliereL01;
  academicLevel: AcademicLevel;
  studentName: string;
  studentMatricule: string;
  supervisorName?: string;
  tpTitle?: string;
  matrixData: {
    a: number;
    b: number;
    c: number;
    d: number;
    det: number;
    trace: number;
    rank: number;
    isInvertible: boolean;
    eigenvaluesText: string;
  };
  calculusData: {
    functionName: string;
    x0: number;
    fx0: number;
    fPrimeX0: number;
    integralA: number;
    integralB: number;
    simpsonResult: number;
  };
  customLatex?: string;
  studentNotes?: string;
}

export function exportLab01Pdf(data: IExportLab01Data) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 18;
  const contentWidth = pageWidth - 2 * marginX;
  let cursorY = 16;

  // ─── 1. EN-TÊTE OFFICIEL BILINGUE RÉPUBLIQUE DU CAMEROUN ───────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(44, 34, 24); // #2C2218

  // Volet gauche (Français)
  doc.text('RÉPUBLIQUE DU CAMEROUN', marginX, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(92, 64, 51); // #5C4033
  doc.text('Paix - Travail - Patrie', marginX, cursorY + 3.5);
  doc.text('MINISTÈRE DE L’ENSEIGNEMENT SUPÉRIEUR', marginX, cursorY + 7);
  doc.text(data.filiere.universite, marginX, cursorY + 10.5);
  doc.text(data.filiere.faculte, marginX, cursorY + 14);

  // Volet droit (Anglais)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(44, 34, 24);
  doc.text('REPUBLIC OF CAMEROON', pageWidth - marginX, cursorY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(92, 64, 51);
  doc.text('Peace - Work - Fatherland', pageWidth - marginX, cursorY + 3.5, { align: 'right' });
  doc.text('MINISTRY OF HIGHER EDUCATION', pageWidth - marginX, cursorY + 7, { align: 'right' });
  doc.text('NATIONAL ACADEMIC PORTAL · CAMPUSHUB', pageWidth - marginX, cursorY + 10.5, { align: 'right' });
  doc.text(`CERTIFIED DOSSIER FOLIO: PAGE ${data.filiere.pageDossier}`, pageWidth - marginX, cursorY + 14, { align: 'right' });

  cursorY += 20;

  // Ligne de séparation institutionnelle
  doc.setDrawColor(227, 222, 201); // #E3DEC9
  doc.setLineWidth(0.6);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 7;

  // ─── 2. TITRE & BANDEAU DU RAPPORT LAB L01 ─────────────────────────────────
  doc.setFillColor(247, 245, 240); // #F7F5F0
  doc.roundedRect(marginX, cursorY, contentWidth, 18, 3, 3, 'F');
  doc.setDrawColor(92, 64, 51);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, cursorY, contentWidth, 18, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(44, 34, 24);
  doc.text('LAB L01 : MATHÉMATIQUES & STATISTIQUES — COMPTE-RENDU DE TP', marginX + 5, cursorY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(92, 64, 51);
  doc.text(
    `Filière : ${data.filiere.filiere} | Référence Dossier MINESUP : Page ${data.filiere.pageDossier} | Niveau : ${data.academicLevel}`,
    marginX + 5,
    cursorY + 13
  );

  cursorY += 24;

  // ─── 3. IDENTIFICATION DE L'ÉTUDIANT & CADRE ACADÉMIQUE ────────────────────
  doc.setFillColor(239, 236, 230); // #EFECE6
  doc.roundedRect(marginX, cursorY, contentWidth, 22, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 34, 24);

  doc.text(`Étudiant : ${data.studentName || 'Non spécifié'}`, marginX + 4, cursorY + 6);
  doc.text(`Matricule : ${data.studentMatricule || 'Non spécifié'}`, marginX + 4, cursorY + 12);
  doc.text(`Campus : ${data.filiere.campus} (${data.filiere.region})`, marginX + 4, cursorY + 18);

  doc.text(`Date d'exécution : ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - marginX - 4, cursorY + 6, { align: 'right' });
  doc.text(`Établissement : ${data.filiere.sigleUniversite} (${data.filiere.faculteSigle})`, pageWidth - marginX - 4, cursorY + 12, { align: 'right' });
  doc.text(`Enseignant Référent : ${data.supervisorName || 'Département de Mathématiques'}`, pageWidth - marginX - 4, cursorY + 18, { align: 'right' });

  cursorY += 28;

  // ─── 4. SECTION 1 : ALGÈBRE MATRICIELLE & SPECTRE ──────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(92, 64, 51); // #5C4033
  doc.text('I. CALCUL MATRICIEL ET ANALYSE SPECTRALE', marginX, cursorY);
  cursorY += 5;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(227, 222, 201);
  doc.roundedRect(marginX, cursorY, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(44, 34, 24);
  const { a, b, c, d, det, trace, rank, isInvertible, eigenvaluesText } = data.matrixData;
  doc.text(`Matrice M = [ [ ${a}, ${b} ], [ ${c}, ${d} ] ]`, marginX + 5, cursorY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(44, 34, 24);
  doc.text(`• Déterminant det(M) : ${det} (Matrice ${isInvertible ? 'Inversible' : 'Singulière / Non-inversible'})`, marginX + 5, cursorY + 14);
  doc.text(`• Trace Tr(M) : ${trace}`, marginX + 5, cursorY + 20);
  doc.text(`• Rang rg(M) : ${rank} / 2`, marginX + 5, cursorY + 26);
  doc.text(`• Spectre des Valeurs Propres : ${eigenvaluesText}`, marginX + 5, cursorY + 31);

  cursorY += 40;

  // ─── 5. SECTION 2 : ANALYSE NUMÉRIQUE & QUADRATURE ─────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(92, 64, 51);
  doc.text('II. ANALYSE NUMÉRIQUE ET QUADRATURE DE SIMPSON', marginX, cursorY);
  cursorY += 5;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(227, 222, 201);
  doc.roundedRect(marginX, cursorY, contentWidth, 30, 2, 2, 'FD');

  const { functionName, x0, fx0, fPrimeX0, integralA, integralB, simpsonResult } = data.calculusData;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(44, 34, 24);

  doc.text(`• Fonction étudiée : ${functionName}`, marginX + 5, cursorY + 7);
  doc.text(`• Évaluation locale en x0 = ${x0} : f(x0) = ${fx0.toFixed(4)}, f'(x0) ≈ ${fPrimeX0.toFixed(4)}`, marginX + 5, cursorY + 14);
  doc.text(`• Quadrature de Simpson sur l'intervalle [${integralA}, ${integralB}] :`, marginX + 5, cursorY + 21);
  doc.setFont('courier', 'bold');
  doc.text(`  Integrale numérique = ${simpsonResult.toFixed(5)} (100 sous-intervalles)`, marginX + 5, cursorY + 26);

  cursorY += 36;

  // ─── 6. SECTION 3 : FORMULES & MODÈLE MATHÉMATIQUE ────────────────────────
  if (data.customLatex) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(92, 64, 51);
    doc.text('III. EXPRESSION FORMELLE / CODE LATEX VALIDÉ', marginX, cursorY);
    cursorY += 5;

    doc.setFillColor(247, 245, 240);
    doc.roundedRect(marginX, cursorY, contentWidth, 16, 2, 2, 'F');
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(44, 34, 24);
    const splitLatex = doc.splitTextToSize(data.customLatex, contentWidth - 10);
    doc.text(splitLatex, marginX + 5, cursorY + 6);
    cursorY += 22;
  }

  // ─── 7. SECTION 4 : OBSERVATIONS DE L'ÉTUDIANT & THÉORÈMES ────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(92, 64, 51);
  doc.text('IV. SYNTHÈSE MÉTHODOLOGIQUE ET CONCLUSION', marginX, cursorY);
  cursorY += 5;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(227, 222, 201);
  doc.roundedRect(marginX, cursorY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(60, 50, 40);
  const notes = data.studentNotes || 'Les résultats obtenus confirment les propriétés spectrales et la convergence de la quadrature.';
  const splitNotes = doc.splitTextToSize(notes, contentWidth - 10);
  doc.text(splitNotes, marginX + 5, cursorY + 6);

  cursorY += 30;

  // ─── 8. CADRE DE VALIDATION & SIGNATURES ───────────────────────────────────
  doc.setDrawColor(227, 222, 201);
  doc.setLineWidth(0.4);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(44, 34, 24);
  doc.text('Visa de l’Étudiant', marginX + 15, cursorY);
  doc.text('Visa du Tuteur / Responsable de TP', pageWidth - marginX - 55, cursorY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 115, 85);
  doc.text('(Signature)', marginX + 22, cursorY + 12);
  doc.text('(Cachet & Signature)', pageWidth - marginX - 44, cursorY + 12);

  // Pied de page certifié
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 115, 85);
  doc.text(
    `Document généré par la plateforme officielle CampusHub Cameroun · Lab L01 (Page ${data.filiere.pageDossier}) · ${new Date().toISOString()}`,
    marginX,
    pageHeight - 8
  );

  // Sauvegarde / Téléchargement du fichier
  const fileName = `CompteRendu_Lab01_${data.filiere.sigleUniversite}_${data.studentMatricule || 'etudiant'}.pdf`;
  doc.save(fileName);
}
