import CodePlayground from '../learning/CodePlayground';

/**
 * ComputerScienceLab - Laboratoire Virtuel d'Informatique UY1
 * Embarque le CodePlayground Hub multi-langages (Python, C, SQL, HTML/CSS, JS)
 */
export default function ComputerScienceLab() {
  return (
    <div className="space-y-4">
      <CodePlayground />
    </div>
  );
}
