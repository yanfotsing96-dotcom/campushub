import { useState, useRef, useEffect, useCallback } from 'react';
import {
  PenTool,
  Eraser,
  Square,
  Circle,
  ArrowRight,
  Minus,
  Trash2,
  Download,
  RotateCcw,
  Sparkles,
  Grid,
  Info,
} from 'lucide-react';

const COLORS = [
  { id: 'indigo', hex: '#6366f1', label: 'Indigo' },
  { id: 'emerald', hex: '#10b981', label: 'Émeraude' },
  { id: 'amber', hex: '#f59e0b', label: 'Ambre' },
  { id: 'rose', hex: '#f43f5e', label: 'Rose' },
  { id: 'sky', hex: '#0284c7', label: 'Ciel' },
  { id: 'dark', hex: '#0f172a', label: 'Sombre' },
  { id: 'light', hex: '#f8fafc', label: 'Blanc' },
];

const STROKE_WIDTHS = [
  { id: 'thin', size: 2, label: 'Fin' },
  { id: 'medium', size: 4, label: 'Moyen' },
  { id: 'thick', size: 8, label: 'Épais' },
];

export default function WhiteboardCollaboratif() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen'); // 'pen', 'eraser', 'rectangle', 'circle', 'arrow', 'line'
  const [color, setColor] = useState('#6366f1');
  const [lineWidth, setLineWidth] = useState(3);
  const [showGrid, setShowGrid] = useState(true);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);

  // Initialize canvas sizing
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const width = parent.clientWidth;
    const height = Math.max(500, parent.clientHeight || 500);

    // Save previous drawing if canvas already had content
    const prevImage = canvas.toDataURL();

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Reload previous content if resizing
    if (history.length > 0) {
      const img = new Image();
      img.src = prevImage;
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  }, [history.length]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas]);

  // Save state for undo
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory((prev) => [...prev.slice(-12), canvas.toDataURL()]);
  }, []);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    const coords = getCanvasCoordinates(e);
    setIsDrawing(true);
    setStartPos(coords);
    saveSnapshot();

    if (tool === 'pen' || tool === 'eraser') {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const coords = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.clearRect(coords.x - lineWidth * 3, coords.y - lineWidth * 3, lineWidth * 6, lineWidth * 6);
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const coords = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = color;

    // Draw geometric shapes on release
    if (tool === 'rectangle') {
      const width = coords.x - startPos.x;
      const height = coords.y - startPos.y;
      ctx.strokeRect(startPos.x, startPos.y, width, height);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(coords.x - startPos.x, 2) + Math.pow(coords.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (tool === 'arrow') {
      // Draw arrow line
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(coords.y - startPos.y, coords.x - startPos.x);
      const headLen = 14;
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineTo(
        coords.x - headLen * Math.cos(angle - Math.PI / 6),
        coords.y - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        coords.x - headLen * Math.cos(angle + Math.PI / 6),
        coords.y - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
  };

  const handleClear = () => {
    if (window.confirm('Voulez-vous effacer tout le tableau blanc ?')) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveSnapshot();
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const prevSnapshot = history[history.length - 1];

    const img = new Image();
    img.src = prevSnapshot;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistory((prev) => prev.slice(0, -1));
    };
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas with white background so transparency doesn't turn black in some viewers
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');

    // Fill background (white for universal export)
    tCtx.fillStyle = '#ffffff';
    tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tCtx.drawImage(canvas, 0, 0);

    const dataUrl = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `campushub-schema-architecture-uy1-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Pre-load educational architecture schemas
  const handleLoadSchema = (schemaType) => {
    saveSnapshot();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '13px sans-serif';
    ctx.lineWidth = 2.5;

    if (schemaType === 'linked-list') {
      // Draw Node 1
      ctx.strokeStyle = '#6366f1';
      ctx.fillStyle = '#6366f1';
      ctx.strokeRect(60, 160, 110, 60);
      ctx.strokeRect(170, 160, 50, 60);
      ctx.fillText('valeur: 42', 80, 195);
      ctx.fillText('next', 180, 195);

      // Arrow to Node 2
      ctx.beginPath();
      ctx.moveTo(220, 190);
      ctx.lineTo(310, 190);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(310, 190);
      ctx.lineTo(295, 183);
      ctx.lineTo(295, 197);
      ctx.closePath();
      ctx.fill();

      // Draw Node 2
      ctx.strokeStyle = '#10b981';
      ctx.fillStyle = '#10b981';
      ctx.strokeRect(310, 160, 110, 60);
      ctx.strokeRect(420, 160, 50, 60);
      ctx.fillText('valeur: 99', 330, 195);
      ctx.fillText('NULL', 430, 195);

      // Header title on canvas
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Modèle Pédagogique : Liste Simplement Chaînée en C (INF231)', 60, 90);
      ctx.font = '12px sans-serif';
      ctx.fillText('Tête de Liste -> [Maillon 1 : 42 | *next] -> [Maillon 2 : 99 | NULL]', 60, 120);
    } else if (schemaType === 'bst') {
      ctx.strokeStyle = '#6366f1';
      ctx.fillStyle = '#6366f1';

      // Root (50)
      ctx.beginPath();
      ctx.arc(280, 100, 28, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillText('50', 273, 105);

      // Left Child (30)
      ctx.beginPath();
      ctx.arc(170, 200, 28, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillText('30', 163, 205);

      // Right Child (70)
      ctx.beginPath();
      ctx.arc(390, 200, 28, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillText('70', 383, 205);

      // Branch Left
      ctx.beginPath();
      ctx.moveTo(260, 120);
      ctx.lineTo(190, 180);
      ctx.stroke();

      // Branch Right
      ctx.beginPath();
      ctx.moveTo(300, 120);
      ctx.lineTo(370, 180);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Arbre Binaire de Recherche (ABR)', 60, 50);
    }
  };

  return (
    <div className="space-y-4">
      {/* Whiteboard Toolbar Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs transition-colors">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Tool Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTool('pen')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tool === 'pen'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Crayon / Dessin à main levée"
            >
              <PenTool size={15} />
              <span>Crayon</span>
            </button>

            <button
              type="button"
              onClick={() => setTool('eraser')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tool === 'eraser'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Gomme"
            >
              <Eraser size={15} />
              <span>Gomme</span>
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Shape tools */}
            <button
              type="button"
              onClick={() => setTool('rectangle')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tool === 'rectangle'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Rectangle (Boîte / Structure / Composant)"
            >
              <Square size={15} />
              <span>Rectangle</span>
            </button>

            <button
              type="button"
              onClick={() => setTool('circle')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tool === 'circle'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Cercle (Nœud d'arbre ou de graphe)"
            >
              <Circle size={15} />
              <span>Cercle</span>
            </button>

            <button
              type="button"
              onClick={() => setTool('arrow')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tool === 'arrow'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Flèche orientée (Pointeur / Flux)"
            >
              <ArrowRight size={15} />
              <span>Flèche</span>
            </button>

            <button
              type="button"
              onClick={() => setTool('line')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tool === 'line'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title="Ligne droite"
            >
              <Minus size={15} />
              <span>Ligne</span>
            </button>
          </div>

          {/* Color & Stroke Width Pickers */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Color Palette */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={`w-6 h-6 rounded-lg transition-transform ${
                    color === c.hex ? 'scale-115 ring-2 ring-indigo-500 ring-offset-1' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={`Couleur ${c.label}`}
                />
              ))}
            </div>

            {/* Stroke Width */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {STROKE_WIDTHS.map((sw) => (
                <button
                  key={sw.id}
                  type="button"
                  onClick={() => setLineWidth(sw.size)}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    lineWidth === sw.size
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {sw.label}
                </button>
              ))}
            </div>

            {/* Grid & Actions */}
            <button
              type="button"
              onClick={() => setShowGrid((prev) => !prev)}
              className={`p-2 rounded-xl border text-xs ${
                showGrid
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
              title="Activer / Désactiver la grille"
            >
              <Grid size={16} />
            </button>

            <button
              type="button"
              onClick={handleUndo}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
              title="Annuler le dernier tracé"
            >
              <RotateCcw size={16} />
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:text-slate-300"
              title="Effacer tout le tableau"
            >
              <Trash2 size={16} />
            </button>

            <button
              type="button"
              onClick={handleExportPNG}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              <Download size={14} />
              <span>Exporter PNG</span>
            </button>
          </div>
        </div>

        {/* Quick Schema Presets for UY1 students */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles size={13} className="text-amber-500" />
            <span>Modèles de schémas UY1 :</span>
          </span>
          <button
            type="button"
            onClick={() => handleLoadSchema('linked-list')}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 hover:bg-indigo-100 font-medium"
          >
            Maillons & Pointeurs (INF231)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSchema('bst')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 hover:bg-emerald-100 font-medium"
          >
            Arbre Binaire ABR (INF201)
          </button>
        </div>
      </div>

      {/* Main Interactive Drawing Canvas Area */}
      <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-white dark:bg-slate-950">
        {/* Background Dot Grid */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#6366f1 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px',
            }}
          />
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />

        {/* Floating helper hint */}
        <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 pointer-events-none bg-white/70 dark:bg-slate-900/70 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-slate-200/60 dark:border-slate-800/60">
          <Info size={12} />
          <span>Glissez pour tracer des formes ou dessinez librement vos architectures d'algorithmes</span>
        </div>
      </div>
    </div>
  );
}
