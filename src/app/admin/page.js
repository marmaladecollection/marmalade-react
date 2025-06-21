'use client';
import { useEffect, useState } from 'react';
import { fetchAllItems, fetchSoldItems } from '../firebase';
import styles from './page.module.scss';

// Helper to format date as 'Fri, 10th May 25, 15:45'
function formatSaleDate(ts) {
  if (!ts || typeof ts.seconds !== 'number') return '';
  const date = new Date(ts.seconds * 1000);
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
  // Extract postcode and country
  const { postal_code, country, ...rest } = addr;
  // Get the rest of the address values in their original order
  const restEntries = Object.entries(addr)
    .filter(([k]) => k !== 'postal_code' && k !== 'country')
    .map(([k, v]) => v);
  // Add postcode and country at the end if present
  if (postal_code) restEntries.push(postal_code);
  if (country) restEntries.push(country);
  return restEntries.join(', ').replace(/, /g, '\n');
}

// Helper to convert snake_case or camelCase/PascalCase to Title Case with spaces
function toTitleCase(str) {
  return str
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
}

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    fetchAllItems(setItems);
    fetchSoldItems().then(setSoldItems);
  }, []);

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
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          {/* Sold Items table on top */}
          <div className={styles.tableContainer + ' ' + styles['tableContainer--large-gap']}>
            {soldItems.length > 0 && (
              <>
                <div className={styles.itemListHeading}>Sold Items</div>
                <table className={styles.itemTable}>
                  <colgroup>
                    {soldKeys.map(key => (
                      key === 'price' ? (
                        <col key={key} style={{ width: '24px' }} />
                      ) :
                      [
                        'saleDate',
                        'customerName',
                      ].includes(key) ? (
                        <col key={key} style={{ width: '80px' }} />
                      ) :
                      [
                        'name',
                        'customerEmail',
                      ].includes(key) ? (
                        <col key={key} style={{ width: '96px' }} />
                      ) :
                      [
                        'paymentStatus',
                        'paymentMethod',
                      ].includes(key) ? (
                        <col key={key} style={{ width: '40px' }} />
                      ) : (
                        <col key={key} />
                      )
                    ))}
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
                              ? formatSaleDate(item[key])
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
              </>
            )}
          </div>
          {/* Items for Sale table below */}
          <div className={styles.tableContainer}>
            {items.length > 0 && (
              <>
                <div className={styles.itemListHeading}>Items for Sale</div>
                <table className={styles.itemTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id} className={styles.itemRow}>
                        <td>{item.name}</td>
                        <td>£{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 