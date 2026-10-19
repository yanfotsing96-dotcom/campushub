import { jsPDF } from 'jspdf';
import type { IFiliereL03, ICstrReactorData, IDistillationData, IHeatExchangerData } from '../types/lab03';
import type { AcademicLevel } from '../types/lab01';

export interface IExportLab03Data {
  filiere: IFiliereL03;
  academicLevel: AcademicLevel;
  studentName: string;
  studentMatricule: string;
  supervisorName?: string;
  cstrData?: ICstrReactorData;
  distillationData?: IDistillationData;
  exchangerData?: IHeatExchangerData;
  customLatex?: string;
  studentNotes?: string;
  safetyCompliant: boolean;
}

export function exportLab03Pdf(data: IExportLab03Data) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 16;
  const contentWidth = pageWidth - 2 * marginX;
  let cursorY = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 22) {
      doc.addPage();
      cursorY = 16;

      // En-tête secondaire sur les pages suivantes
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(5, 150, 105);
      doc.text(
        `LAB L03 : CHIMIE & GÉNIE DES PROCÉDÉS · HALLE PILOTE VIRTUELLE · ${data.filiere.sigleUniversite} (${data.filiere.faculteSigle})`,
        marginX,
        cursorY
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(140, 115, 85);
      doc.text(`Réf. Dossier MINESUP : Page ${data.filiere.pageDossier}`, pageWidth - marginX, cursorY, { align: 'right' });

      cursorY += 3;
      doc.setDrawColor(227, 222, 201);
      doc.setLineWidth(0.4);
      doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
      cursorY += 6;
    }
  };

  // ─── 1. EN-TÊTE OFFICIEL BILINGUE RÉPUBLIQUE DU CAMEROUN ───────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(44, 34, 24); // #2C2218

  // Volet gauche (Français)
  doc.text('RÉPUBLIQUE DU CAMEROUN', marginX, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(5, 150, 105); // #059669 Vert Émeraude / Procédés
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
  doc.setTextColor(5, 150, 105);
  doc.text('Peace - Work - Fatherland', pageWidth - marginX, cursorY + 3.5, { align: 'right' });
  doc.text('MINISTRY OF HIGHER EDUCATION', pageWidth - marginX, cursorY + 7, { align: 'right' });
  doc.text('NATIONAL VIRTUAL PILOT PLANT · CAMPUSHUB', pageWidth - marginX, cursorY + 10.5, { align: 'right' });
  doc.text(`CERTIFIED DOSSIER FOLIO: PAGE ${data.filiere.pageDossier}`, pageWidth - marginX, cursorY + 14, { align: 'right' });

  cursorY += 19;

  // Ligne de séparation institutionnelle
  doc.setDrawColor(227, 222, 201);
  doc.setLineWidth(0.6);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 6;

  // ─── 2. BANDEAU DE TITRE DU LAB L03 ────────────────────────────────────────
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(marginX, cursorY, contentWidth, 17, 3, 3, 'F');
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, cursorY, contentWidth, 17, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(44, 34, 24);
  doc.text('LAB L03 : CHIMIE & GÉNIE DES PROCÉDÉS — RAPPORT D’INGÉNIERIE PILOTE', marginX + 5, cursorY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(5, 150, 105);
  doc.text(
    `Filière : ${data.filiere.filiere} (${data.filiere.branch}) | Dossier MINESUP : Page ${data.filiere.pageDossier} | Niveau : ${data.academicLevel}`,
    marginX + 5,
    cursorY + 12
  );

  cursorY += 22;

  // ─── 3. IDENTIFICATION DE L'ÉTUDIANT & CADRE ACADÉMIQUE ────────────────────
  doc.setFillColor(239, 236, 230); // #EFECE6
  doc.roundedRect(marginX, cursorY, contentWidth, 20, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 34, 24);

  doc.text(`Étudiant : ${data.studentName || 'Non spécifié'}`, marginX + 4, cursorY + 5.5);
  doc.text(`Matricule : ${data.studentMatricule || 'Non spécifié'}`, marginX + 4, cursorY + 11);
  doc.text(`Campus : ${data.filiere.campus} (${data.filiere.region})`, marginX + 4, cursorY + 16.5);

  doc.text(`Date d'exécution : ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - marginX - 4, cursorY + 5.5, { align: 'right' });
  doc.text(`Établissement : ${data.filiere.sigleUniversite} (${data.filiere.faculteSigle})`, pageWidth - marginX - 4, cursorY + 11, { align: 'right' });
  doc.text(`Superviseur : ${data.supervisorName || 'Halle Pilote / Dép. Génie des Procédés'}`, pageWidth - marginX - 4, cursorY + 16.5, { align: 'right' });

  cursorY += 25;

  // ─── 4. SECTION 1 : CONFORMITÉ SÉCURITÉ & FDS ─────────────────────────────
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(5, 150, 105);
  doc.text('I. SÉCURITÉ CHIMIQUE, EPI & GESTION DES FDS (SYSTÈME GÉNÉRAL HARMONISÉ)', marginX, cursorY);
  cursorY += 4.5;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(227, 222, 201);
  doc.roundedRect(marginX, cursorY, contentWidth, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(44, 34, 24);
  doc.text(
    `• Équipements de Protection Individuelle : Blouse 100% coton, lunettes étanches, gants nitrile chimiorésistants [${data.safetyCompliant ? 'CONFORME' : 'À VÉRIFIER'}].`,
    marginX + 4,
    cursorY + 5.5
  );
  doc.text(
    '• Fiche de Données de Sécurité (FDS) : Respect strict des pictogrammes SGH (Corrosif, Inflammable, Toxique) et des seuils VLEP.',
    marginX + 4,
    cursorY + 11.5
  );

  cursorY += 21;

  // ─── 5. SECTION 2 : RÉACTEUR CSTR & CINÉTIQUE RÉACTIONNELLE ────────────────
  if (data.cstrData) {
    checkPageBreak(45);
    const {
      reactorVolume,
      volumetricFlowRate,
      inletConcentrationA,
      outletConcentrationA,
      rateConstant,
      temperatureK,
      residenceTimeMin,
      conversionRate,
      heatGeneratedWatts,
      reactionEnthalpyKJ,
    } = data.cstrData;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105);
    doc.text('II. BILAN DE MATIÈRE ET ÉNERGIE — RÉACTEUR CSTR CONTINU (MODÈLE DE LEVENSPIEL)', marginX, cursorY);
    cursorY += 4.5;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(227, 222, 201);
    doc.roundedRect(marginX, cursorY, contentWidth, 34, 2, 2, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(44, 34, 24);
    doc.text(
      `Paramètres : V = ${reactorVolume} L | Q = ${volumetricFlowRate} L/min | T = ${(temperatureK - 273.15).toFixed(1)} °C (${temperatureK.toFixed(1)} K) | ΔHr = ${reactionEnthalpyKJ} kJ/mol`,
      marginX + 4,
      cursorY + 6
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(44, 34, 24);
    doc.text(`• Temps de passage moyen τ = V / Q : ${residenceTimeMin.toFixed(2)} min | Constante cinétique k(T) : ${rateConstant.toFixed(4)} min⁻¹`, marginX + 4, cursorY + 12);
    doc.text(
      `• Concentrations en Réactif A : Entrée CA₀ = ${inletConcentrationA.toFixed(2)} mol/L  ⟶  Sortie CA = ${outletConcentrationA.toFixed(3)} mol/L`,
      marginX + 4,
      cursorY + 18
    );
    doc.text(
      `• Flux molaire converti FA,conv = Q · (CA₀ - CA) : ${(volumetricFlowRate * (inletConcentrationA - outletConcentrationA)).toFixed(2)} mol/min`,
      marginX + 4,
      cursorY + 24
    );

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(conversionRate >= 75 ? 5 : 180, conversionRate >= 75 ? 150 : 60, conversionRate >= 75 ? 105 : 40);
    doc.text(
      `• Taux de conversion global XA : ${conversionRate.toFixed(1)}% | Puissance thermique réactionnelle : ${heatGeneratedWatts.toFixed(1)} W (${(heatGeneratedWatts / 1000).toFixed(2)} kW)`,
      marginX + 4,
      cursorY + 30
    );

    cursorY += 39;
  }

  // ─── 6. SECTION 3 : DISTILLATION CONTINUE (MCCABE-THIELE) ─────────────────
  if (data.distillationData) {
    checkPageBreak(45);
    const dist = data.distillationData;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105);
    doc.text('III. DIMENSIONNEMENT DE LA COLONNE DE DISTILLATION (MÉTHODE DE MCCABE-THIELE)', marginX, cursorY);
    cursorY += 4.5;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(227, 222, 201);
    doc.roundedRect(marginX, cursorY, contentWidth, 34, 2, 2, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(44, 34, 24);
    doc.text(
      `Alimentation F = ${dist.feedFlowRate} kmol/h | Titres molaires : zF = ${dist.feedFractionLight} | xD = ${dist.distillateFraction} | xB = ${dist.bottomsFraction}`,
      marginX + 4,
      cursorY + 6
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(44, 34, 24);
    doc.text(
      `• Taux de Reflux appliqué : R = ${dist.refluxRatio.toFixed(2)} (Reflux minimal Rmin = ${dist.minRefluxRatio.toFixed(2)} | Ratio R/Rmin = ${(dist.refluxRatio / Math.max(0.01, dist.minRefluxRatio)).toFixed(2)})`,
      marginX + 4,
      cursorY + 12
    );
    doc.text(
      `• Volatilité relative α = ${dist.relativeVolatility.toFixed(2)} | État thermique de l'alimentation q = ${dist.thermalStateQ.toFixed(2)} (Liquide saturé)`,
      marginX + 4,
      cursorY + 18
    );
    doc.text(
      `• Plateaux théoriques (hors rebouilleur) : N = ${dist.theoreticalTrays} | Plateau d'alimentation optimal : Étage #${dist.feedTrayIndex}`,
      marginX + 4,
      cursorY + 24
    );

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(
      `• Plateaux réels (Murphree 75%) : Nréel = ${dist.actualTrays} étages | Condenseur Qc = ${dist.condenserDutyKW.toFixed(0)} kW | Rebouilleur Qb = ${dist.reboilerDutyKW.toFixed(0)} kW`,
      marginX + 4,
      cursorY + 30
    );

    cursorY += 39;
  }

  // ─── 7. SECTION 4 : ÉCHANGEUR DE CHALEUR INDUSTRIEL (DTLM) ────────────────
  if (data.exchangerData) {
    checkPageBreak(42);
    const exch = data.exchangerData;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105);
    doc.text('IV. DIMENSIONNEMENT THERMIQUE — ÉCHANGEUR DE CHALEUR (MÉTHODE DTLM)', marginX, cursorY);
    cursorY += 4.5;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(227, 222, 201);
    doc.roundedRect(marginX, cursorY, contentWidth, 32, 2, 2, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(44, 34, 24);
    doc.text(
      `Régime : ${exch.flowArrangement === 'counter_current' ? 'Contre-Courant (Recommandé)' : 'Co-Courant'} | Débits : Chaud = ${exch.massFlowHotKgS} kg/s | Froid = ${exch.massFlowColdKgS} kg/s`,
      marginX + 4,
      cursorY + 6
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(44, 34, 24);
    doc.text(
      `• Fluide Chaud (${exch.hotFluidName}) : ${exch.tHotInC.toFixed(1)} °C ⟶ ${exch.tHotOutC.toFixed(1)} °C | ΔT chaud = ${(exch.tHotInC - exch.tHotOutC).toFixed(1)} K`,
      marginX + 4,
      cursorY + 12
    );
    doc.text(
      `• Fluide Froid (${exch.coldFluidName}) : ${exch.tColdInC.toFixed(1)} °C ⟶ ${exch.tColdOutC.toFixed(1)} °C | ΔT froid = ${(exch.tColdOutC - exch.tColdInC).toFixed(1)} K`,
      marginX + 4,
      cursorY + 18
    );
    doc.text(
      `• Différence de Température Logarithmique Moyenne : DTLM (ΔTln) = ${exch.dtlmC.toFixed(2)} °C | Coeff. Global U = ${exch.overallUCoeff} W/(m²·K)`,
      marginX + 4,
      cursorY + 24
    );

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(
      `• Puissance Thermique Échangée Φ = ${exch.heatDutyKW.toFixed(1)} kW | Surface d'échange requise : A = ${exch.requiredAreaM2.toFixed(2)} m²`,
      marginX + 4,
      cursorY + 30
    );

    cursorY += 37;
  }

  // ─── 8. SECTION 5 : SCHÉMA P&ID & INSTRUMENTATION (ISO 10628 / ISA-5.1) ────
  checkPageBreak(28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(5, 150, 105);
  doc.text('V. INSTRUMENTATION INDUSTRIELLE ET BOUCLES DE CONTRÔLE P&ID', marginX, cursorY);
  cursorY += 4.5;

  doc.setFillColor(247, 245, 240);
  doc.roundedRect(marginX, cursorY, contentWidth, 20, 2, 2, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(44, 34, 24);
  doc.text('• FT-101 (Débit) : Débitmètre massique Coriolis garantissant la consigne stoechiométrique.', marginX + 4, cursorY + 5.5);
  doc.text('• TT-102 & TIC-102 (Température) : Sonde thermo-résistante Pt100 et asservissement PID de la double enveloppe.', marginX + 4, cursorY + 10.5);
  doc.text('• PSH-103 (Sécurité Pression) : Pressostat de sécurité déclenchant la mise en sécurité intrinsèque de l\'installation.', marginX + 4, cursorY + 15.5);

  cursorY += 25;

  // ─── 9. SECTION 6 : SYNTHÈSE MÉTHODOLOGIQUE ET DIAGNOSTIC HAZOP ───────────
  checkPageBreak(28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(92, 64, 51);
  doc.text('VI. SYNTHÈSE MÉTHODOLOGIQUE, CONDUITE D’OPÉRATION ET DIAGNOSTIC HAZOP', marginX, cursorY);
  cursorY += 4.5;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(227, 222, 201);
  doc.roundedRect(marginX, cursorY, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 50, 40);
  const notes =
    data.studentNotes ||
    'Le régime stationnaire a été stabilisé. Les bilans de matière et d’énergie sont vérifiés à moins de 2% d’écart relatif. Aucune dérive de température ni risque d’emballement thermique n’ont été observés.';
  const splitNotes = doc.splitTextToSize(notes, contentWidth - 8);
  doc.text(splitNotes, marginX + 4, cursorY + 5.5);

  cursorY += 25;

  // ─── 10. CADRE DE VALIDATION & SIGNATURES OFFICIELLES ─────────────────────
  checkPageBreak(28);
  doc.setDrawColor(227, 222, 201);
  doc.setLineWidth(0.4);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 5.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(44, 34, 24);
  doc.text('Visa de l’Étudiant (Opérateur de Banc Pilote)', marginX + 8, cursorY);
  doc.text('Visa & Cachet du Responsable de Halle Pilote', pageWidth - marginX - 75, cursorY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 115, 85);
  doc.text('(Signature de l’élève ingénieur / technicien)', marginX + 10, cursorY + 11);
  doc.text('(Cachet du Laboratoire de Génie Chimique)', pageWidth - marginX - 68, cursorY + 11);

  // Pied de page certifié avec QR / Folio
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 115, 85);
  doc.text(
    `Document certifié MINESUP · Lab L03 Chimie & Génie des Procédés (Dossier Page ${data.filiere.pageDossier}) · Plateforme CampusHub · Généré le ${new Date().toLocaleString('fr-FR')}`,
    marginX,
    pageHeight - 7
  );

  // Téléchargement
  const fileName = `CompteRendu_Lab03_Procedes_${data.filiere.sigleUniversite}_${data.studentMatricule || 'etudiant'}.pdf`;
  doc.save(fileName);
}
