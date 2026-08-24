import { useEffect, useMemo, useState } from 'react';
import { LinkGroupAccordion } from '../../components/LinkGroupAccordion';
import { LinkItem } from '../../components/LinkItem';
import {
  createLinkGroup,
  createLinkItem,
  isValidLinkUrl,
} from '../../data/linksBoard';
import { useTranslation } from '../../i18n/LanguageProvider';
import { loadLinksBoard, saveLinksBoard } from '../../utils/linksBoardStorage';
import './LinksBoardPage.css';

const EMPTY_LINK_FORM = {
  groupId: '',
  title: '',
  url: '',
};

const EMPTY_GROUP_FORM = {
  title: '',
};

export const LinksBoardPage = () => {
  const { t } = useTranslation();
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [groupFormValues, setGroupFormValues] = useState(EMPTY_GROUP_FORM);
  const [groups, setGroups] = useState(() => {
    return loadLinksBoard().groups;
  });
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [linkFormValues, setLinkFormValues] = useState(EMPTY_LINK_FORM);
  const [links, setLinks] = useState(() => {
    return loadLinksBoard().links;
  });
  const [openGroupIds, setOpenGroupIds] = useState(() => {
    return loadLinksBoard().groups.map((group) => {
      return group.id;
    });
  });

  useEffect(() => {
    saveLinksBoard({
      groups,
      links,
    });
  }, [groups, links]);

  const ungroupedLinks = useMemo(() => {
    return links.filter((link) => {
      return !link.groupId;
    });
  }, [links]);

  const getLinksByGroupId = (groupId) => {
    return links.filter((link) => {
      return link.groupId === groupId;
    });
  };

  const handleOpenCreateLink = () => {
    setEditingLink(null);
    setLinkFormValues(EMPTY_LINK_FORM);
    setErrorMessage('');
    setIsLinkFormOpen(true);
  };

  const handleOpenEditLink = (link) => {
    setEditingLink(link);
    setLinkFormValues({
      groupId: link.groupId || '',
      title: link.title,
      url: link.url,
    });
    setErrorMessage('');
    setIsLinkFormOpen(true);
  };

  const handleCloseLinkForm = () => {
    setEditingLink(null);
    setLinkFormValues(EMPTY_LINK_FORM);
    setErrorMessage('');
    setIsLinkFormOpen(false);
  };

  const handleOpenCreateGroup = () => {
    setEditingGroup(null);
    setGroupFormValues(EMPTY_GROUP_FORM);
    setErrorMessage('');
    setIsGroupFormOpen(true);
  };

  const handleOpenEditGroup = (group) => {
    setEditingGroup(group);
    setGroupFormValues({
      title: group.title,
    });
    setErrorMessage('');
    setIsGroupFormOpen(true);
  };

  const handleCloseGroupForm = () => {
    setEditingGroup(null);
    setGroupFormValues(EMPTY_GROUP_FORM);
    setErrorMessage('');
    setIsGroupFormOpen(false);
  };

  const handleSubmitLinkForm = (event) => {
    event.preventDefault();

    const trimmedTitle = linkFormValues.title.trim();
    const trimmedUrl = linkFormValues.url.trim();
    const nextGroupId = linkFormValues.groupId || null;

    if (!trimmedTitle || !trimmedUrl) {
      setErrorMessage(t('linksBoard.linkRequired'));
      return;
    }

    if (!isValidLinkUrl(trimmedUrl)) {
      setErrorMessage(t('linksBoard.invalidUrl'));
      return;
    }

    if (editingLink) {
      setLinks((currentLinks) => {
        return currentLinks.map((link) => {
          if (link.id !== editingLink.id) {
            return link;
          }

          return {
            ...link,
            groupId: nextGroupId,
            title: trimmedTitle,
            updatedAt: Date.now(),
            url: trimmedUrl,
          };
        });
      });
    } else {
      const createdLink = createLinkItem({
        groupId: nextGroupId,
        title: trimmedTitle,
        url: trimmedUrl,
      });

      setLinks((currentLinks) => {
        return [createdLink, ...currentLinks];
      });
    }

    if (nextGroupId) {
      setOpenGroupIds((currentIds) => {
        if (currentIds.includes(nextGroupId)) {
          return currentIds;
        }

        return [...currentIds, nextGroupId];
      });
    }

    handleCloseLinkForm();
  };

  const handleSubmitGroupForm = (event) => {
    event.preventDefault();

    const trimmedTitle = groupFormValues.title.trim();

    if (!trimmedTitle) {
      setErrorMessage(t('linksBoard.groupRequired'));
      return;
    }

    if (editingGroup) {
      setGroups((currentGroups) => {
        return currentGroups.map((group) => {
          if (group.id !== editingGroup.id) {
            return group;
          }

          return {
            ...group,
            title: trimmedTitle,
            updatedAt: Date.now(),
          };
        });
      });
    } else {
      const createdGroup = createLinkGroup(trimmedTitle);

      setGroups((currentGroups) => {
        return [createdGroup, ...currentGroups];
      });
      setOpenGroupIds((currentIds) => {
        return [...currentIds, createdGroup.id];
      });
    }

    handleCloseGroupForm();
  };

  const handleDeleteLink = (linkId) => {
    setLinks((currentLinks) => {
      return currentLinks.filter((link) => {
        return link.id !== linkId;
      });
    });
  };

  const handleDeleteGroup = (groupId) => {
    setGroups((currentGroups) => {
      return currentGroups.filter((group) => {
        return group.id !== groupId;
      });
    });
    setLinks((currentLinks) => {
      return currentLinks.map((link) => {
        if (link.groupId !== groupId) {
          return link;
        }

        return {
          ...link,
          groupId: null,
          updatedAt: Date.now(),
        };
      });
    });
    setOpenGroupIds((currentIds) => {
      return currentIds.filter((id) => {
        return id !== groupId;
      });
    });
  };

  const handleToggleGroup = (groupId) => {
    setOpenGroupIds((currentIds) => {
      if (currentIds.includes(groupId)) {
        return currentIds.filter((id) => {
          return id !== groupId;
        });
      }

      return [...currentIds, groupId];
    });
  };

  return (
    <div className="links-board-page">
      <header className="links-board-page__header">
        <div className="links-board-page__header-text">
          <h1 className="links-board-page__title">{t('linksBoard.title')}</h1>
          <p className="links-board-page__description">{t('linksBoard.description')}</p>
        </div>

        <div className="links-board-page__header-actions">
          <button
            className="links-board-page__button"
            onClick={handleOpenCreateGroup}
            type="button"
          >
            {t('linksBoard.addGroup')}
          </button>
          <button
            className="links-board-page__button links-board-page__button--primary"
            onClick={handleOpenCreateLink}
            type="button"
          >
            {t('linksBoard.addLink')}
          </button>
        </div>
      </header>

      <section className="links-board-page__section">
        <h2 className="links-board-page__section-title">
          {t('linksBoard.ungroupedTitle')}
        </h2>
        {ungroupedLinks.length === 0 ? (
          <p className="links-board-page__empty">{t('linksBoard.ungroupedEmpty')}</p>
        ) : (
          <div className="links-board-page__list">
            {ungroupedLinks.map((link) => {
              return (
                <LinkItem
                  deleteLabel={t('linksBoard.delete')}
                  editLabel={t('linksBoard.edit')}
                  key={link.id}
                  link={link}
                  onDelete={handleDeleteLink}
                  onEdit={handleOpenEditLink}
                  openLabel={t('linksBoard.open')}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="links-board-page__section">
        <h2 className="links-board-page__section-title">
          {t('linksBoard.groupsTitle')}
        </h2>
        {groups.length === 0 ? (
          <p className="links-board-page__empty">{t('linksBoard.groupsEmpty')}</p>
        ) : (
          <div className="links-board-page__groups">
            {groups.map((group) => {
              return (
                <LinkGroupAccordion
                  deleteGroupLabel={t('linksBoard.deleteGroup')}
                  deleteLabel={t('linksBoard.delete')}
                  editGroupLabel={t('linksBoard.edit')}
                  editLabel={t('linksBoard.edit')}
                  emptyLabel={t('linksBoard.groupEmpty')}
                  group={group}
                  isOpen={openGroupIds.includes(group.id)}
                  key={group.id}
                  links={getLinksByGroupId(group.id)}
                  onDeleteGroup={handleDeleteGroup}
                  onDeleteLink={handleDeleteLink}
                  onEditGroup={handleOpenEditGroup}
                  onEditLink={handleOpenEditLink}
                  onToggle={handleToggleGroup}
                  openLabel={t('linksBoard.open')}
                />
              );
            })}
          </div>
        )}
      </section>

      {isLinkFormOpen && (
        <div className="links-board-page__modal">
          <button
            aria-label={t('linksBoard.cancel')}
            className="links-board-page__modal-overlay"
            onClick={handleCloseLinkForm}
            type="button"
          />
          <div className="links-board-page__modal-card">
            <h2 className="links-board-page__modal-title">
              {editingLink ? t('linksBoard.editLink') : t('linksBoard.newLink')}
            </h2>
            <form className="links-board-page__form" onSubmit={handleSubmitLinkForm}>
              <div className="links-board-page__field">
                <label className="links-board-page__label" htmlFor="link-title">
                  {t('linksBoard.titleLabel')}
                </label>
                <input
                  autoFocus
                  className="links-board-page__input"
                  id="link-title"
                  onChange={(event) => {
                    setLinkFormValues((currentValues) => {
                      return {
                        ...currentValues,
                        title: event.target.value,
                      };
                    });
                  }}
                  placeholder={t('linksBoard.titlePlaceholder')}
                  type="text"
                  value={linkFormValues.title}
                />
              </div>

              <div className="links-board-page__field">
                <label className="links-board-page__label" htmlFor="link-url">
                  {t('linksBoard.urlLabel')}
                </label>
                <input
                  className="links-board-page__input"
                  id="link-url"
                  onChange={(event) => {
                    setLinkFormValues((currentValues) => {
                      return {
                        ...currentValues,
                        url: event.target.value,
                      };
                    });
                  }}
                  placeholder={t('linksBoard.urlPlaceholder')}
                  type="url"
                  value={linkFormValues.url}
                />
              </div>

              <div className="links-board-page__field">
                <label className="links-board-page__label" htmlFor="link-group">
                  {t('linksBoard.groupLabel')}
                </label>
                <select
                  className="links-board-page__input"
                  id="link-group"
                  onChange={(event) => {
                    setLinkFormValues((currentValues) => {
                      return {
                        ...currentValues,
                        groupId: event.target.value,
                      };
                    });
                  }}
                  value={linkFormValues.groupId}
                >
                  <option value="">{t('linksBoard.noGroup')}</option>
                  {groups.map((group) => {
                    return (
                      <option key={group.id} value={group.id}>
                        {group.title}
                      </option>
                    );
                  })}
                </select>
              </div>

              {errorMessage && (
                <p className="links-board-page__error">{errorMessage}</p>
              )}

              <div className="links-board-page__form-actions">
                <button
                  className="links-board-page__button"
                  onClick={handleCloseLinkForm}
                  type="button"
                >
                  {t('linksBoard.cancel')}
                </button>
                <button
                  className="links-board-page__button links-board-page__button--primary"
                  type="submit"
                >
                  {t('linksBoard.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGroupFormOpen && (
        <div className="links-board-page__modal">
          <button
            aria-label={t('linksBoard.cancel')}
            className="links-board-page__modal-overlay"
            onClick={handleCloseGroupForm}
            type="button"
          />
          <div className="links-board-page__modal-card">
            <h2 className="links-board-page__modal-title">
              {editingGroup ? t('linksBoard.editGroup') : t('linksBoard.newGroup')}
            </h2>
            <form className="links-board-page__form" onSubmit={handleSubmitGroupForm}>
              <div className="links-board-page__field">
                <label className="links-board-page__label" htmlFor="group-title">
                  {t('linksBoard.groupTitleLabel')}
                </label>
                <input
                  autoFocus
                  className="links-board-page__input"
                  id="group-title"
                  onChange={(event) => {
                    setGroupFormValues({
                      title: event.target.value,
                    });
                  }}
                  placeholder={t('linksBoard.groupTitlePlaceholder')}
                  type="text"
                  value={groupFormValues.title}
                />
              </div>

              {errorMessage && (
                <p className="links-board-page__error">{errorMessage}</p>
              )}

              <div className="links-board-page__form-actions">
                <button
                  className="links-board-page__button"
                  onClick={handleCloseGroupForm}
                  type="button"
                >
                  {t('linksBoard.cancel')}
                </button>
                <button
                  className="links-board-page__button links-board-page__button--primary"
                  type="submit"
                >
                  {t('linksBoard.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
