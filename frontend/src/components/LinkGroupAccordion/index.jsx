import { LinkItem } from '../LinkItem';
import './LinkGroupAccordion.css';

export const LinkGroupAccordion = ({
  deleteGroupLabel,
  deleteLabel,
  editGroupLabel,
  editLabel,
  emptyLabel,
  group,
  isOpen,
  links,
  onDeleteGroup,
  onDeleteLink,
  onEditGroup,
  onEditLink,
  onToggle,
  openLabel,
}) => {
  return (
    <section className={`link-group-accordion ${isOpen ? 'link-group-accordion--open' : ''}`}>
      <div className="link-group-accordion__header">
        <button
          className="link-group-accordion__toggle"
          onClick={() => {
            onToggle(group.id);
          }}
          type="button"
        >
          <span className="link-group-accordion__chevron">{isOpen ? '▾' : '▸'}</span>
          <span className="link-group-accordion__title">{group.title}</span>
          <span className="link-group-accordion__count">{links.length}</span>
        </button>

        <div className="link-group-accordion__header-actions">
          <button
            className="link-group-accordion__action"
            onClick={() => {
              onEditGroup(group);
            }}
            type="button"
          >
            {editGroupLabel}
          </button>
          <button
            className="link-group-accordion__action link-group-accordion__action--danger"
            onClick={() => {
              onDeleteGroup(group.id);
            }}
            type="button"
          >
            {deleteGroupLabel}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="link-group-accordion__body">
          {links.length === 0 ? (
            <p className="link-group-accordion__empty">{emptyLabel}</p>
          ) : (
            <div className="link-group-accordion__list">
              {links.map((link) => {
                return (
                  <LinkItem
                    deleteLabel={deleteLabel}
                    editLabel={editLabel}
                    key={link.id}
                    link={link}
                    onDelete={onDeleteLink}
                    onEdit={onEditLink}
                    openLabel={openLabel}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
