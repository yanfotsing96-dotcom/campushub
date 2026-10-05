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
          <span className="meta-field font-semibold">{res.filiere}</span>
          <span className="meta-separator" aria-hidden="true">
            ·
          </span>
          <span className="meta-field">{res.niveau}</span>

          {res.codeUe && (
            <>
              <span className="meta-separator" aria-hidden="true">
                ·
              </span>
              <span className="meta-field font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {res.codeUe}
              </span>
            </>
          )}

          {res.universityName && (
            <>
              <span className="meta-separator" aria-hidden="true">
                ·
              </span>
              <span className="meta-field font-semibold text-slate-700 dark:text-slate-300">
                🏛️ {res.universityName}
              </span>
            </>
          )}

          {res.authorName && (
            <>
              <span className="meta-separator" aria-hidden="true">
                ·
              </span>
              <span className="meta-field text-slate-500">
                Publié par : {res.authorName}
              </span>
            </>
          )}

          <span className="meta-separator" aria-hidden="true">
            ·
          </span>
          <span className="meta-field text-emerald-600 dark:text-emerald-400 font-semibold">
            📥 {res.downloads || 0} téléchargements
          </span>
        </div>

        {res.description && (
          <p className="crud-item-desc line-clamp-2">{res.description}</p>
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
