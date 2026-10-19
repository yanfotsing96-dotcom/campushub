import { memo } from 'react';
import { Download, Pencil, Trash2, Lock } from 'lucide-react';

const ResourceItemCard = memo(function ResourceItemCard({
  res,
  isBeingEdited,
  isConfirmingDelete,
  canEditThis,
  canDeleteThis,
  isDelegate,
  onEdit,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  onDownload,
}) {
  return (
    <li
      className={`crud-item-card transition-all duration-200 ${
        isBeingEdited ? 'is-active-edit' : ''
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="crud-item-content">
        <div className="crud-item-title-row">
          <h4 className="crud-item-title">{res.titre}</h4>
        </div>

        {/* Zero-Pill Typography Metadata */}
        <div className="crud-item-meta">
          {res.category && (
            <>
              <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[#E3DEC9] dark:bg-[#382D23] text-[#5C381E] dark:text-[#D8D1B8]">
                {res.category === 'COURS' ? '📖 COURS' : res.category === 'TD' || res.category === 'TP' ? '🧪 TD / TP' : res.category === 'EXAMEN' || res.category === 'CC' ? '📝 ÉPREUVE' : '💡 FICHE'}
              </span>
              <span className="meta-separator" aria-hidden="true">
                ·
              </span>
            </>
          )}

          <span className="meta-field font-semibold text-[#2C2218] dark:text-[#FAF5F0]">{res.filiere}</span>
          <span className="meta-separator" aria-hidden="true">
            ·
          </span>
          <span className="meta-field font-bold text-[#744A2B] dark:text-[#D8D1B8]">{res.niveau}</span>

          {res.codeUe && (
            <>
              <span className="meta-separator" aria-hidden="true">
                ·
              </span>
              <span className="meta-field font-mono font-bold text-[#744A2B] dark:text-[#D8D1B8]">
                {res.codeUe}
              </span>
            </>
          )}

          {res.universityName && (
            <>
              <span className="meta-separator" aria-hidden="true">
                ·
              </span>
              <span className="meta-field font-semibold text-[#493C30] dark:text-[#CFC4B6]">
                🏛️ {res.universityName}
              </span>
            </>
          )}

          {res.authorName && (
            <>
              <span className="meta-separator" aria-hidden="true">
                ·
              </span>
              <span className="meta-field text-[#6E5D4F] dark:text-[#AFA28F]">
                Publié par : {res.authorName}
              </span>
            </>
          )}

          <span className="meta-separator" aria-hidden="true">
            ·
          </span>
          <span className="meta-field text-[#3D6B42] dark:text-[#7EB584] font-semibold">
            📥 {res.downloads || 0} téléchargements
          </span>
        </div>

        {res.description && (
          <p className="crud-item-desc line-clamp-2 text-[#6E5D4F] dark:text-[#CFC4B6]">{res.description}</p>
        )}
      </div>

      {/* Actions RBAC rigoureusement conditionnées */}
      <div className="crud-item-actions">
        {/* Bouton Télécharger */}
        <button
          type="button"
          className="action-btn action-btn-download"
          onClick={() => onDownload(res)}
          title="Télécharger le document"
        >
          <Download size={14} />
          <span>Télécharger</span>
        </button>

        {/* Mode confirmation de suppression */}
        {isConfirmingDelete ? (
          <div className="delete-confirm-box">
            <span className="delete-confirm-text">Supprimer ?</span>
            <button
              type="button"
              className="btn-confirm-yes"
              onClick={() => onDelete(res.id)}
            >
              Oui
            </button>
            <button
              type="button"
              className="btn-confirm-no"
              onClick={onCancelDelete}
            >
              Non
            </button>
          </div>
        ) : (
          <>
            {/* Bouton Modifier */}
            {canEditThis && (
              <button
                type="button"
                className="action-btn action-btn-edit"
                onClick={() => onEdit(res)}
                title="Modifier cette ressource"
              >
                <Pencil size={14} />
                <span>Modifier</span>
              </button>
            )}

            {/* Bouton Supprimer */}
            {canDeleteThis && (
              <button
                type="button"
                className="action-btn action-btn-delete"
                onClick={() => onConfirmDelete(res.id)}
                title="Supprimer cette ressource"
              >
                <Trash2 size={14} />
                <span>Supprimer</span>
              </button>
            )}

            {/* Indicateur lecture seule pour délégué hors périmètre */}
            {isDelegate && !canEditThis && (
              <span
                className="badge-scope-readonly"
                title="Cette ressource appartient à un autre département"
              >
                <Lock size={12} />
                <span>Lecture seule</span>
              </span>
            )}
          </>
        )}
      </div>
    </li>
  );
});

export default ResourceItemCard;
