import { jsPDF } from 'jspdf';
import type { IFiliereL02, IRLCExperimentData, IOpticsExperimentData } from '../types/lab02';
import type { AcademicLevel } from '../types/lab01';

export interface IExportLab02Data {
  filiere: IFiliereL02;
  academicLevel: AcademicLevel;
  studentName: string;
  studentMatricule: string;
  supervisorName?: string;
  tpTitle?: string;
  rlcData?: IRLCExperimentData;
  opticsData?: IOpticsExperimentData;
  customLatex?: string;
  studentNotes?: string;
}

export function exportLab02Pdf(data: IExportLab02Data) {
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
  doc.text('NATIONAL VIRTUAL LAB NETWORK · CAMPUSHUB', pageWidth - marginX, cursorY + 10.5, { align: 'right' });
  doc.text(`CERTIFIED DOSSIER FOLIO: PAGE ${data.filiere.pageDossier}`, pageWidth - marginX, cursorY + 14, { align: 'right' });

  cursorY += 20;

  // Ligne de séparation institutionnelle
  doc.setDrawColor(227, 222, 201); // #E3DEC9
  doc.setLineWidth(0.6);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 7;

  // ─── 2. BANDEAU DE TITRE DU LAB L02 ────────────────────────────────────────
  doc.setFillColor(240, 249, 255); // Fond cyan très doux pour la physique
  doc.roundedRect(marginX, cursorY, contentWidth, 18, 3, 3, 'F');
  doc.setDrawColor(2, 132, 199); // #0284C7 Accent Technique
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, cursorY, contentWidth, 18, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(44, 34, 24);
  doc.text('LAB L02 : PHYSIQUE FONDAMENTALE & APPLIQUÉE — COMPTE-RENDU DE TP', marginX + 5, cursorY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(2, 132, 199);
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
  doc.text(`Enseignant / Tuteur : ${data.supervisorName || 'Département de Physique'}`, pageWidth - marginX - 4, cursorY + 18, { align: 'right' });

  cursorY += 28;

  // ─── 4. SECTION 1 : CIRCUITS RLC & RÉSONANCE ÉLECTRIQUE ───────────────────
  if (data.rlcData) {
    const { resistance, inductance, capacitance, frequency, resonanceFrequency, qualityFactor, bandwidth, impedance, phaseDeg } = data.rlcData;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(2, 132, 199); // Bleu physique
    doc.text('I. ÉLECTROCINÉTIQUE : CIRCUIT RLC SÉRIE & RÉSONANCE', marginX, cursorY);
    cursorY += 5;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(227, 222, 201);
    doc.roundedRect(marginX, cursorY, contentWidth, 34, 2, 2, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(44, 34, 24);
    doc.text(`Paramètres : R = ${resistance} Ω | L = ${inductance} mH | C = ${capacitance} µF | f = ${frequency} Hz`, marginX + 5, cursorY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(44, 34, 24);
    doc.text(`• Fréquence propre de résonance f₀ : ${resonanceFrequency.toFixed(2)} Hz (f₀ = 1 / [2π√(LC)])`, marginX + 5, cursorY + 14);
    doc.text(`• Facteur de qualité Q : ${qualityFactor.toFixed(2)} | Bande passante Δf : ${bandwidth.toFixed(2)} Hz`, marginX + 5, cursorY + 20);
    doc.text(`• Impédance totale Z(ω) : ${impedance.toFixed(2)} Ω | Déphasage φ(u/i) : ${phaseDeg.toFixed(1)}°`, marginX + 5, cursorY + 26);
    const ecart = Math.abs(frequency - resonanceFrequency);
    const isAtResonance = ecart < resonanceFrequency * 0.03;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isAtResonance ? 16 : 140, isAtResonance ? 140 : 50, 40);
    doc.text(
      `• Régime : ${isAtResonance ? 'RÉSONANCE EXACTE (I maximal, Z minimal = R)' : frequency < resonanceFrequency ? 'Régime Capacitif (le courant est en avance)' : 'Régime Inductif (la tension est en avance)'}`,
      marginX + 5,
      cursorY + 31
    );

    cursorY += 40;
  }

  // ─── 5. SECTION 2 : OPTIQUE GÉOMÉTRIQUE & LENTILLES MINCES ─────────────────
  if (data.opticsData) {
    const { lensType, focalLength, objectDistance, objectHeight, imageDistance, magnification, imageHeight, imageNature } = data.opticsData;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(2, 132, 199);
    doc.text('II. OPTIQUE GÉOMÉTRIQUE : FORMULES DE CONJUGAISON DE DESCARTES', marginX, cursorY);
    cursorY += 5;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(227, 222, 201);
    doc.roundedRect(marginX, cursorY, contentWidth, 32, 2, 2, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(44, 34, 24);
    doc.text(
      `Lentille : ${lensType === 'converging' ? 'Convergente (f\' > 0)' : 'Divergente (f\' < 0)'} | f\' = ${focalLength} cm | Objet p = ${objectDistance} cm (h = ${objectHeight} cm)`,
      marginX + 5,
      cursorY + 7
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(44, 34, 24);
    doc.text(`• Relation de conjugaison : 1/p' - 1/p = 1/f'`, marginX + 5, cursorY + 14);
    doc.text(`• Position de l'image p' (OA') : ${imageDistance.toFixed(2)} cm | Grandissement transversal γ : ${magnification.toFixed(2)}`, marginX + 5, cursorY + 20);
    doc.text(`• Hauteur de l'image A'B' : ${imageHeight.toFixed(2)} cm`, marginX + 5, cursorY + 25);
    doc.text(
      `• Nature de l'image : ${imageNature === 'REAL_INVERTED' ? 'Réelle et inversée (recueillable sur écran)' : imageNature === 'VIRTUAL_UPRIGHT' ? 'Virtuelle et droite (visible à travers la lentille)' : 'À l\'infini (faisceau parallèle)'}`,
      marginX + 5,
      cursorY + 29
    );

    cursorY += 38;
  }

  // ─── 6. SECTION 3 : OBSERVATIONS & SYNTHÈSE DE L'ÉTUDIANT ─────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(92, 64, 51);
  doc.text('III. SYNTHÈSE EXPÉRIMENTALE ET INCERTITUDES DE MESURE', marginX, cursorY);
  cursorY += 5;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(227, 222, 201);
  doc.roundedRect(marginX, cursorY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(60, 50, 40);
  const notes = data.studentNotes || 'Les mesures virtuelles confirment avec rigueur les lois de Kirchhoff en régime sinusoïdal forcé et les formules de conjugaison de Descartes.';
  const splitNotes = doc.splitTextToSize(notes, contentWidth - 10);
  doc.text(splitNotes, marginX + 5, cursorY + 6);

  cursorY += 30;

  // ─── 7. CADRE DE VALIDATION & SIGNATURES ───────────────────────────────────
  doc.setDrawColor(227, 222, 201);
  doc.setLineWidth(0.4);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(44, 34, 24);
  doc.text('Visa de l’Étudiant', marginX + 15, cursorY);
  doc.text('Visa & Cachet du Responsable de TP Physique', pageWidth - marginX - 65, cursorY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 115, 85);
  doc.text('(Signature de validation)', marginX + 18, cursorY + 12);
  doc.text('(Laboratoire de Physique - Sceau)', pageWidth - marginX - 52, cursorY + 12);

  // Pied de page certifié
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 115, 85);
  doc.text(
    `Document certifié MINESUP · Lab L02 Physique (Page ${data.filiere.pageDossier} du recueil national) · CampusHub · ${new Date().toISOString()}`,
    marginX,
    pageHeight - 8
  );

  // Téléchargement
  const fileName = `CompteRendu_Lab02_Physique_${data.filiere.sigleUniversite}_${data.studentMatricule || 'etudiant'}.pdf`;
  doc.save(fileName);
}
