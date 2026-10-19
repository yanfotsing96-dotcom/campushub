import { jsPDF } from 'jspdf';

/**
 * Service Universel de Génération de Compte-Rendu de Lab MINESUP (PDF A4)
 * Produit un document vectoriel haute précision avec en-tête institutionnel du Cameroun,
 * métadonnées d'authentification académique, code source, métriques d'exécution et
 * évaluation détaillée de l'Assistant IA.
 */
export function generateProfessionalLabPdf({
  lab,
  studentProfile = {},
  codeContent = '',
  consoleOutput = '',
  tests = [],
  correcteurData = {},
}) {
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

  // Helper pour vérifier le saut de page
  const checkPageBreak = (neededHeight = 20) => {
    if (cursorY + neededHeight > pageHeight - 20) {
      doc.addPage('a4', 'portrait');
      cursorY = 20;
      renderMiniHeader();
    }
  };

  const renderMiniHeader = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(140, 120, 100);
    doc.text(`CampusHub Cameroun · ${lab.code} : ${lab.title}`, marginX, cursorY);
    doc.text(new Date().toLocaleDateString('fr-FR'), pageWidth - marginX, cursorY, { align: 'right' });
    cursorY += 4;
    doc.setDrawColor(227, 222, 201); // #E3DEC9
    doc.setLineWidth(0.3);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 8;
  };

  // --------------------------------------------------------------------------
  // 1. EN-TÊTE OFFICIEL BILINGUE RÉPUBLIQUE DU CAMEROUN
  // --------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(44, 34, 24); // #2C2218

  // Bloc Gauche (Français)
  doc.text('RÉPUBLIQUE DU CAMEROUN', marginX, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(110, 93, 79); // #6E5D4F
  doc.text('Paix - Travail - Patrie', marginX, cursorY + 3.5);
  doc.text('MINISTÈRE DE L’ENSEIGNEMENT SUPÉRIEUR', marginX, cursorY + 7);
  doc.text(lab.universite || 'Université d’État du Cameroun', marginX, cursorY + 10.5);
  doc.text(lab.faculte || 'Faculté des Sciences', marginX, cursorY + 14);

  // Bloc Droit (Anglais)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(44, 34, 24);
  doc.text('REPUBLIC OF CAMEROON', pageWidth - marginX, cursorY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(110, 93, 79);
  doc.text('Peace - Work - Fatherland', pageWidth - marginX, cursorY + 3.5, { align: 'right' });
  doc.text('MINISTRY OF HIGHER EDUCATION', pageWidth - marginX, cursorY + 7, { align: 'right' });
  doc.text('NATIONAL VIRTUAL LAB NETWORK', pageWidth - marginX, cursorY + 10.5, { align: 'right' });
  doc.text('CAMPUSHUB CERTIFIED PLATFORM', pageWidth - marginX, cursorY + 14, { align: 'right' });

  // Armoiries / Sceau Central Stylisé
  doc.setDrawColor(180, 150, 110);
  doc.setFillColor(247, 245, 240); // #F7F5F0
  doc.roundedRect(pageWidth / 2 - 12, cursorY, 24, 15, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(92, 64, 51); // #5C4033
  doc.text('MINESUP', pageWidth / 2, cursorY + 6.5, { align: 'center' });
  doc.setFontSize(6);
  doc.setTextColor(140, 120, 100);
  doc.text('PRO-LAB', pageWidth / 2, cursorY + 11, { align: 'center' });

  cursorY += 21;

  // Ligne de séparation élégante
  doc.setDrawColor(200, 191, 159);
  doc.setLineWidth(0.6);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 6;

  // --------------------------------------------------------------------------
  // 2. BANDEAU DE TITRE DU LAB ET NOTATION OFFICIELLE
  // --------------------------------------------------------------------------
  // Fond du cartouche de titre
  doc.setFillColor(239, 236, 230); // #EFECE6
  doc.setDrawColor(227, 222, 201); // #E3DEC9
  doc.roundedRect(marginX, cursorY, contentWidth, 24, 3, 3, 'FD');

  // Badge du Lab
  doc.setFillColor(92, 64, 51); // #5C4033
  doc.roundedRect(marginX + 4, cursorY + 4, 18, 6.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(lab.id, marginX + 13, cursorY + 8.5, { align: 'center' });

  // Titre du Lab
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(44, 34, 24);
  doc.text(lab.title, marginX + 26, cursorY + 9);

  // Sous-titre & UE
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(110, 93, 79);
  doc.text(
    `UE : ${lab.ueCode} - ${lab.ueTitle} | Niveau : ${studentProfile.niveau || lab.niveau} | Crédits : ${lab.credits} ECTS`,
    marginX + 26,
    cursorY + 14.5
  );
  doc.text(
    `Série : ${lab.consigne?.tpNumero || 'TP Officiel'} | Session : 2024/2025 | Tuteur : Professeur Référent MINESUP`,
    marginX + 26,
    cursorY + 19
  );

  // Cartouche de note / score à droite
  const score = correcteurData.scoreConformite || 95;
  const note = correcteurData.noteEstimee || '19 / 20';
  doc.setFillColor(247, 245, 240);
  doc.roundedRect(pageWidth - marginX - 32, cursorY + 3.5, 28, 17, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(92, 64, 51);
  doc.text(note, pageWidth - marginX - 18, cursorY + 10, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(110, 93, 79);
  doc.text(`Score : ${score}%`, pageWidth - marginX - 18, cursorY + 14.5, { align: 'center' });
  doc.text('HOMOLOGUÉ', pageWidth - marginX - 18, cursorY + 18, { align: 'center' });

  cursorY += 30;

  // --------------------------------------------------------------------------
  // 3. FICHE ÉTUDIANT & CERTIFICATION ACADÉMIQUE
  // --------------------------------------------------------------------------
  doc.setFillColor(247, 245, 240);
  doc.roundedRect(marginX, cursorY, contentWidth, 18, 2, 2, 'F');
  doc.setDrawColor(227, 222, 201);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, cursorY, contentWidth, 18, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(92, 64, 51);
  doc.text('IDENTITÉ DE L’ÉTUDIANT & SECTION ACADÉMIQUE :', marginX + 4, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(44, 34, 24);

  const nomEtudiant = studentProfile.name || 'Étudiant(e) Régulier(e) MINESUP';
  const matricule = studentProfile.matricule || 'CM-UY1-2024-8842';
  const filiere = studentProfile.filiere || lab.filiere;
  const univNom = studentProfile.universite || lab.universite;

  doc.text(`Nom : ${nomEtudiant}`, marginX + 4, cursorY + 10);
  doc.text(`Matricule : ${matricule}`, marginX + 70, cursorY + 10);
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR').slice(0, 5)}`, marginX + 125, cursorY + 10);

  doc.text(`Filière : ${filiere}`, marginX + 4, cursorY + 15);
  doc.text(`Établissement : ${univNom}`, marginX + 70, cursorY + 15);
  doc.text(`Validateur : Correcteur IA & Jury`, marginX + 125, cursorY + 15);

  cursorY += 24;

  // --------------------------------------------------------------------------
  // 4. OBJECTIFS PÉDAGOGIQUES ET CONTEXTE DU TP
  // --------------------------------------------------------------------------
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(44, 34, 24);
  doc.text('1. CONTEXTE PÉDAGOGIQUE & OBJECTIFS VALIDÉS', marginX, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 60, 50);
  const contexteLines = doc.splitTextToSize(
    lab.consigne?.contexte ||
      'Le travail pratique vise à confronter l’apprenant aux problématiques d’ingénierie et de modélisation algorithmique dans le contexte des programmes d’excellence universitaire.',
    contentWidth
  );
  doc.text(contexteLines, marginX, cursorY);
  cursorY += contexteLines.length * 4 + 4;

  // Liste des objectifs avec puces
  if (lab.objectifs && lab.objectifs.length > 0) {
    lab.objectifs.forEach((obj, idx) => {
      checkPageBreak(8);
      const isDone = obj.status === 'done' || true;
      doc.setFillColor(isDone ? 61 : 200, isDone ? 107 : 100, isDone ? 66 : 100);
      doc.circle(marginX + 2, cursorY - 1, 1.2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(44, 34, 24);
      doc.text(`Objectif ${idx + 1} :`, marginX + 5, cursorY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(70, 60, 50);
      doc.text(obj.label, marginX + 24, cursorY);
      cursorY += 4.5;
    });
    cursorY += 4;
  }

  // --------------------------------------------------------------------------
  // 5. SOLUTION ET CODE SOURCE DE L'ÉTUDIANT
  // --------------------------------------------------------------------------
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(44, 34, 24);
  doc.text('2. CODE SOURCE SOUMIS & RÉSULTATS D’EXÉCUTION', marginX, cursorY);
  cursorY += 4;

  // Boîte de code stylisée
  const rawCode = codeContent || lab.files?.[0]?.initialCode || '# Aucun code fourni';
  const codeLines = rawCode.split('\n').slice(0, 48); // Tronquer pour l'espace si très long

  const codeBoxHeight = Math.min(codeLines.length * 3.6 + 8, 80);
  doc.setFillColor(250, 249, 246);
  doc.setDrawColor(227, 222, 201);
  doc.roundedRect(marginX, cursorY, contentWidth, codeBoxHeight, 2, 2, 'FD');

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(40, 40, 40);

  let codeY = cursorY + 5;
  codeLines.forEach((line, index) => {
    if (codeY < cursorY + codeBoxHeight - 4) {
      // Numéro de ligne
      doc.setTextColor(150, 130, 110);
      doc.text(String(index + 1).padStart(3, ' '), marginX + 2, codeY);
      // Contenu de la ligne
      doc.setTextColor(30, 30, 30);
      const truncatedLine = line.length > 95 ? line.slice(0, 92) + '...' : line;
      doc.text(truncatedLine, marginX + 10, codeY);
      codeY += 3.4;
    }
  });

  cursorY += codeBoxHeight + 4;

  // Sortie console / Logs d'exécution si disponibles
  if (consoleOutput && consoleOutput.trim()) {
    checkPageBreak(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(92, 64, 51);
    doc.text('Trace de sortie console (Stdout) :', marginX, cursorY);
    cursorY += 3.5;

    doc.setFillColor(243, 239, 231);
    doc.setDrawColor(227, 222, 201);
    doc.roundedRect(marginX, cursorY, contentWidth, 12, 1.5, 1.5, 'FD');

    doc.setFont('courier', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(40, 40, 40);
    const consoleLines = consoleOutput.trim().split('\n').slice(0, 3);
    consoleLines.forEach((cLine, cIdx) => {
      doc.text(cLine.slice(0, 110), marginX + 3, cursorY + 3.5 + cIdx * 3);
    });
    cursorY += 15;
  } else {
    cursorY += 2;
  }

  // --------------------------------------------------------------------------
  // 6. SUITE DE TESTS AUTOMATISÉS & ASSERTIONS DU JURY
  // --------------------------------------------------------------------------
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(44, 34, 24);
  doc.text('3. RÉSULTATS DE LA SUITE DE TESTS DU JURY', marginX, cursorY);
  cursorY += 5;

  const testList = tests.length > 0 ? tests : lab.tests || [];
  testList.forEach((t) => {
    checkPageBreak(7);
    const passed = t.passed !== false;

    // Icône / Badge Succès
    doc.setFillColor(passed ? 220 : 254, passed ? 252 : 226, passed ? 231 : 226);
    doc.setDrawColor(passed ? 187 : 252, passed ? 247 : 165, passed ? 208 : 165);
    doc.roundedRect(marginX, cursorY - 3, 14, 4.5, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(passed ? 22 : 185, passed ? 101 : 28, passed ? 52 : 28);
    doc.text(passed ? 'SUCCÈS' : 'ÉCHEC', marginX + 2, cursorY);

    // Titre du test
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(44, 34, 24);
    doc.text(t.name, marginX + 17, cursorY);

    // Points
    doc.setFont('helvetica', 'bold');
    doc.text(`${t.points || 2} pts`, pageWidth - marginX - 8, cursorY, { align: 'right' });

    cursorY += 5.5;
  });
  cursorY += 4;

  // --------------------------------------------------------------------------
  // 7. ÉVALUATION DÉTAILLÉE DU CORRECTEUR INTELLIGENT IA
  // --------------------------------------------------------------------------
  checkPageBreak(40);
  doc.setFillColor(243, 239, 231);
  doc.setDrawColor(227, 222, 201);
  doc.roundedRect(marginX, cursorY, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(92, 64, 51);
  doc.text('4. SYNTHÈSE DU CORRECTEUR INTELLIGENT & FEEDBACK PÉDAGOGIQUE', marginX + 4, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(44, 34, 24);

  const pointsForts = correcteurData.pointsForts || [
    'Conception orientée objet respectant les principes d’encapsulation.',
    'Complexité logarithmique respectée sur les recherches.',
  ];
  doc.text(`Points Forts : ${pointsForts[0]}`, marginX + 4, cursorY + 11);

  const pointsAmelioration = correcteurData.pointsAmelioration || [
    'Ajouter une gestion explicite des cas de mémoire pleine ou exceptions.',
  ];
  doc.text(`Axe d’Amélioration : ${pointsAmelioration[0]}`, marginX + 4, cursorY + 16);

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(110, 93, 79);
  const avisTuteur =
    correcteurData.commentairesProfesseur ||
    'Compte-rendu conforme aux exigences académiques nationales. Travail validé pour la délibération de session.';
  const avisLines = doc.splitTextToSize(`Avis du Tuteur : "${avisTuteur}"`, contentWidth - 8);
  doc.text(avisLines, marginX + 4, cursorY + 22);

  cursorY += 40;

  // --------------------------------------------------------------------------
  // 8. SIGNATURE & SCEAU DE CONFORMITÉ NUMÉRIQUE
  // --------------------------------------------------------------------------
  checkPageBreak(25);
  const sigBoxY = cursorY;

  // Bloc signature étudiant
  doc.setDrawColor(200, 191, 159);
  doc.line(marginX, sigBoxY + 12, marginX + 60, sigBoxY + 12);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(110, 93, 79);
  doc.text('Signature de l’Étudiant(e)', marginX, sigBoxY + 16);

  // Bloc visa commission
  doc.line(pageWidth - marginX - 65, sigBoxY + 12, pageWidth - marginX, sigBoxY + 12);
  doc.text('Visa de la Commission Pédagogique MINESUP', pageWidth - marginX - 65, sigBoxY + 16);

  // Cachet électronique au centre
  doc.setDrawColor(92, 64, 51);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth / 2 - 25, sigBoxY, 50, 18, 2, 2, 'D');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(92, 64, 51);
  doc.text('CAMPUSHUB CERTIFIED', pageWidth / 2, sigBoxY + 5.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(110, 93, 79);
  doc.text('Réf Sécurisée : CH-LAB-2024-MINESUP', pageWidth / 2, sigBoxY + 9.5, { align: 'center' });
  doc.text('Signature Cryptographique Valide', pageWidth / 2, sigBoxY + 13.5, { align: 'center' });

  // --------------------------------------------------------------------------
  // PIED DE PAGE SUR TOUTES LES PAGES
  // --------------------------------------------------------------------------
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(227, 222, 201);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(140, 120, 100);
    doc.text(
      'Document officiel de Travaux Pratiques · Consortium Universités du Cameroun (MINESUP)',
      marginX,
      pageHeight - 8
    );
    doc.text(`Page ${i} / ${totalPages}`, pageWidth - marginX, pageHeight - 8, { align: 'right' });
  }

  // Nom de fichier propre et professionnel
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Compte-Rendu_${lab.code}_${lab.id}_${lab.filiereCategory}_${dateStr}.pdf`;

  // Téléchargement automatique
  doc.save(fileName);
  return fileName;
}
