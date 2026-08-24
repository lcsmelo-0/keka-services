import './QrHistoryList.css';

export const QrHistoryList = ({
  downloadLabel,
  emptyLabel,
  entries,
  formatCreatedAt,
  isDownloadingId,
  loadingLabel,
  onDownload,
  title,
}) => {
  if (!entries) {
    return (
      <section className="qr-history-list">
        <h2 className="qr-history-list__title">{title}</h2>
        <p className="qr-history-list__empty">{loadingLabel}</p>
      </section>
    );
  }

  if (entries.length === 0) {
    return (
      <section className="qr-history-list">
        <h2 className="qr-history-list__title">{title}</h2>
        <p className="qr-history-list__empty">{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section className="qr-history-list">
      <h2 className="qr-history-list__title">{title}</h2>
      <ul className="qr-history-list__items">
        {entries.map((entry) => {
          return (
            <li className="qr-history-list__item" key={entry.id}>
              <div className="qr-history-list__content">
                <p className="qr-history-list__date">{formatCreatedAt(entry.createdAt)}</p>
                <p className="qr-history-list__value">{entry.value}</p>
              </div>
              <button
                className="qr-history-list__download"
                disabled={isDownloadingId === entry.id}
                onClick={() => {
                  onDownload(entry);
                }}
                type="button"
              >
                {downloadLabel}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
