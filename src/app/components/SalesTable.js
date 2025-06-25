import React from 'react';
import PropTypes from 'prop-types';

// Shared component for rendering sold items tables for both admin and sales pages
// Accepts soldItems, heading, and styles as props

// Helper to format date as 'Fri, 10th May 25, 15:45'
function formatSaleDate(ts) {
  if (!ts) return '';
  let date;
  if (typeof ts === 'object' && typeof ts.seconds === 'number') {
    date = new Date(ts.seconds * 1000);
  } else if (typeof ts === 'string' && !isNaN(Date.parse(ts))) {
    date = new Date(ts);
  } else {
    return '';
  }
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const daySuffix = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  const dayStr = `${day}${daySuffix(day)}`;
  const weekday = days[date.getDay()];
  const month = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${weekday}, ${dayStr} ${month} ${year}, ${hour}:${min}`;
}

function formatDeliveryAddress(addr) {
  if (!addr || typeof addr !== 'object') return '';
  const { postal_code, country, ...rest } = addr;
  const restEntries = Object.entries(addr)
    .filter(([k]) => k !== 'postal_code' && k !== 'country')
    .map(([k, v]) => v);
  if (postal_code) restEntries.push(postal_code);
  if (country) restEntries.push(country);
  return restEntries.join(', ').replace(/, /g, '\n');
}

function toTitleCase(str) {
  return str
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
}

function timeSince(date) {
  if (!date) return '';
  let d;
  if (typeof date === 'object' && typeof date.seconds === 'number') {
    d = new Date(date.seconds * 1000);
  } else if (typeof date === 'string' && !isNaN(Date.parse(date))) {
    d = new Date(date);
  } else {
    return '';
  }
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return `${years} years ago`;
}

function isRecentSale(date) {
  if (!date) return false;
  let d;
  if (typeof date === 'object' && typeof date.seconds === 'number') {
    d = new Date(date.seconds * 1000);
  } else if (typeof date === 'string' && !isNaN(Date.parse(date))) {
    d = new Date(date);
  } else {
    return false;
  }
  const now = new Date();
  const diffMs = now - d;
  return diffMs < 4 * 60 * 60 * 1000; // less than 4 hours
}

export default function SalesTable({ soldItems, heading, styles = {} }) {
  // Dynamically get all unique keys for sold items (excluding id for readability)
  let soldKeys = soldItems.length > 0
    ? Object.keys(soldItems[0])
        .filter(k => k !== 'id')
        .filter(k => ![
          'currency',
          'paymentIntentId',
          'stripeSessionId',
          'paymentAmount',
          'conditionDetail',
          'dimensions',
          'condition',
          'blurb',
          'itemPrice',
          'itemId',
          'itemName',
        ].includes(k))
    : [];

  // Move 'saleDate' to the first position if present
  if (soldKeys.includes('saleDate')) {
    soldKeys = soldKeys.filter(k => k !== 'saleDate');
    soldKeys.unshift('saleDate');
  }
  // Move 'name' to the second and 'price' to the third position if present
  if (soldKeys.includes('name')) {
    soldKeys = soldKeys.filter(k => k !== 'name');
    soldKeys.splice(1, 0, 'name');
  }
  if (soldKeys.includes('price')) {
    soldKeys = soldKeys.filter(k => k !== 'price');
    soldKeys.splice(2, 0, 'price');
  }
  // Move 'paymentStatus' to last position if present
  if (soldKeys.includes('paymentStatus')) {
    soldKeys = soldKeys.filter(k => k !== 'paymentStatus');
    soldKeys.push('paymentStatus');
  }
  // Move 'customerName' before 'customerEmail' if both are present
  const nameIdx = soldKeys.indexOf('customerName');
  const emailIdx = soldKeys.indexOf('customerEmail');
  if (nameIdx !== -1 && emailIdx !== -1 && nameIdx > emailIdx) {
    soldKeys.splice(nameIdx, 1);
    soldKeys.splice(emailIdx, 0, 'customerName');
  }
  // Move 'paymentMethod' to last position if present
  if (soldKeys.includes('paymentMethod')) {
    soldKeys = soldKeys.filter(k => k !== 'paymentMethod');
    soldKeys.push('paymentMethod');
  }

  return (
    <>
      <div className={styles.itemListHeading}>{heading}</div>
      {soldItems.length === 0 ? (
        <div className={styles.noSales}>No sales yet</div>
      ) : (
        <table className={styles.itemTable}>
          <colgroup>
            {soldKeys.map(key => {
              if (key === 'saleDate') return <col key={key} style={{ width: '120px' }} />;
              if (key === 'name') return <col key={key} style={{ width: '140px' }} />;
              if (key === 'price') return <col key={key} style={{ width: '60px' }} />;
              if (key === 'customerName') return <col key={key} style={{ width: '120px' }} />;
              if (key === 'customerEmail') return <col key={key} style={{ width: '180px' }} />;
              if (key === 'paymentStatus') return <col key={key} style={{ width: '80px' }} />;
              if (key === 'paymentMethod') return <col key={key} style={{ width: '80px' }} />;
              if (key === 'deliveryAddress') return <col key={key} style={{ width: '200px' }} />;
              return <col key={key} />;
            })}
          </colgroup>
          <thead>
            <tr>
              {soldKeys.map(key => (
                <th
                  key={key}
                  className={[
                    key === 'customerEmail' ? 'customer-email' : '',
                    key === 'price' ? 'price' : '',
                    key === 'saleDate' ? 'sale-date' : '',
                    key === 'customerName' ? 'customer-name' : '',
                    key === 'paymentStatus' ? 'payment-status' : '',
                    key === 'paymentMethod' ? 'payment-method' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {toTitleCase(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {soldItems.map(item => (
              <tr key={item.id} className={styles.itemRow}>
                {soldKeys.map((key, colIdx) => (
                  <td
                    key={key}
                    className={[
                      key === 'customerEmail' ? 'customer-email' : '',
                      key === 'price' ? 'price' : '',
                      key === 'saleDate' ? 'sale-date' : '',
                      key === 'customerName' ? 'customer-name' : '',
                      key === 'paymentStatus' ? 'payment-status' : '',
                      key === 'paymentMethod' ? 'payment-method' : '',
                    ].filter(Boolean).join(' ')}
                    style={key === 'deliveryAddress' ? { whiteSpace: 'pre-line' } : {}}
                  > {
                    key === 'saleDate' && typeof item[key] === 'object' && item[key] !== null && typeof item[key].seconds === 'number'
                      ? <span>{formatSaleDate(item[key])}<br /><span className={styles.saleDateRelative}>{timeSince(item[key])}{isRecentSale(item[key]) && <><br /><span className={styles.recentSaleBadge}>RECENT SALE</span></>}</span></span>
                      : key === 'saleDate' && typeof item[key] === 'string'
                        ? <span>{formatSaleDate(item[key])}<br /><span className={styles.saleDateRelative}>{timeSince(item[key])}{isRecentSale(item[key]) && <><br /><span className={styles.recentSaleBadge}>RECENT SALE</span></>}</span></span>
                      : key === 'deliveryAddress' && typeof item[key] === 'object' && item[key] !== null
                        ? formatDeliveryAddress(item[key])
                      : key === 'price' && typeof item[key] !== 'object' && item[key] !== undefined && item[key] !== null
                        ? `£${item[key]}`
                      : typeof item[key] === 'object'
                        ? JSON.stringify(item[key])
                        : item[key]
                  } </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

SalesTable.propTypes = {
  soldItems: PropTypes.array.isRequired,
  heading: PropTypes.string.isRequired,
  styles: PropTypes.object,
};

SalesTable.defaultProps = {
  styles: {},
};

export { formatSaleDate, formatDeliveryAddress, toTitleCase, timeSince, isRecentSale }; 