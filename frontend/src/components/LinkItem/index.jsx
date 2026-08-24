import './LinkItem.css';

export const LinkItem = ({
  deleteLabel,
  editLabel,
  link,
  onDelete,
  onEdit,
  openLabel,
}) => {
  return (
    <article className="link-item">
      <div className="link-item__content">
        <h3 className="link-item__title">{link.title}</h3>
        <a
          className="link-item__url"
          href={link.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {link.url}
        </a>
      </div>

      <div className="link-item__actions">
        <a
          className="link-item__action link-item__action--primary"
          href={link.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {openLabel}
        </a>
        <button
          className="link-item__action"
          onClick={() => {
            onEdit(link);
          }}
          type="button"
        >
          {editLabel}
        </button>
        <button
          className="link-item__action link-item__action--danger"
          onClick={() => {
            onDelete(link.id);
          }}
          type="button"
        >
          {deleteLabel}
        </button>
      </div>
    </article>
  );
};
