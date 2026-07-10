import { company } from '../data/company';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import {
  calculateLineTotal,
  getServiceDescription,
} from '../utils/serviceHelpers';

export const InvoicePreview = ({
  client,
  dueDate,
  invoiceDate,
  invoiceNumber,
  previewRef,
  services,
  total,
}) => {
  return (
    <article className="invoice-preview" ref={previewRef}>
      <header className="invoice-preview__header">
        <div className="invoice-preview__company">
          <p className="invoice-preview__company-name">{company.name}</p>
          <p className="invoice-preview__company-meta">{company.federalId}</p>
          <p className="invoice-preview__company-meta">
            <span>{company.addressLine1}</span>
            <span className="invoice-preview__company-meta-separator"> · </span>
            <span className="invoice-preview__company-meta-location">{company.cityState}</span>
          </p>
        </div>
        <div className="invoice-preview__title-block">
          <p className="invoice-preview__title">INVOICE</p>
          <p className="invoice-preview__number"># {invoiceNumber || '—'}</p>
        </div>
      </header>

      <section className="invoice-preview__meta">
        <div className="invoice-preview__meta-group">
          <p className="invoice-preview__label">Customer</p>
          <p className="invoice-preview__value invoice-preview__value--strong">
            {client?.name ?? '—'}
          </p>
          <p className="invoice-preview__label invoice-preview__label--spaced">
            Bill To
          </p>
          <p className="invoice-preview__value">{client?.addressLine1 ?? '—'}</p>
          <p className="invoice-preview__value">{client?.addressLine2 ?? '—'}</p>
          <p className="invoice-preview__value">{client?.cityStateZip ?? '—'}</p>
        </div>

        <div className="invoice-preview__meta-group invoice-preview__meta-group--right">
          <div className="invoice-preview__date-row">
            <span className="invoice-preview__label">Invoice Date</span>
            <span className="invoice-preview__value">{formatDate(invoiceDate)}</span>
          </div>
          <div className="invoice-preview__date-row">
            <span className="invoice-preview__label">Due Date</span>
            <span className="invoice-preview__value">{formatDate(dueDate) || '—'}</span>
          </div>
          <div className="invoice-preview__amount-due">
            <span className="invoice-preview__amount-due-label">Amount Due</span>
            <span className="invoice-preview__amount-due-value">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </section>

      <table className="invoice-preview__table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Hours</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => {
            const parsedRate = Number(service.rate) || 0;
            const lineTotal = calculateLineTotal(service.hours, service.rate);

            return (
              <tr key={service.id}>
                <td className="invoice-preview__description">
                  {getServiceDescription(service, dueDate)}
                </td>
                <td>{service.hours || '—'}</td>
                <td>{service.rate ? formatCurrency(parsedRate) : '—'}</td>
                <td>{formatCurrency(lineTotal)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Total</td>
            <td>{formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>

      <footer className="invoice-preview__footer">
        <div className="invoice-preview__footer-section">
          <p className="invoice-preview__footer-title">Payment Details</p>
          <p className="invoice-preview__footer-line">
            <span>Bank</span>
            <span>{company.bank.name}</span>
          </p>
          <p className="invoice-preview__footer-line">
            <span>Account Type</span>
            <span>{company.bank.accountType}</span>
          </p>
          <p className="invoice-preview__footer-line">
            <span>Account Holder</span>
            <span>{company.bank.holderName}</span>
          </p>
          <p className="invoice-preview__footer-line">
            <span>Account Number</span>
            <span>{company.bank.accountNumber}</span>
          </p>
          <p className="invoice-preview__footer-line">
            <span>Routing Number</span>
            <span>{company.bank.routingNumber}</span>
          </p>
          <p className="invoice-preview__footer-line">
            <span>Bank Address</span>
            <span>{company.bank.address}</span>
          </p>
        </div>

        <div className="invoice-preview__footer-section">
          <p className="invoice-preview__footer-title">Services Provided</p>
          <p className="invoice-preview__services">{company.services}</p>
        </div>
      </footer>
    </article>
  );
};
