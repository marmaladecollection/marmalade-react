export const dynamic = "force-dynamic";

import { fetchSoldItems } from '../firebase';
import SalesTable from '../components/SalesTable';
import styles from '../admin/page.module.scss';

export default async function SalesPage() {
  const soldItems = await fetchSoldItems();

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <div className={styles.tableContainer + ' ' + styles['tableContainer--large-gap']}>
            <SalesTable soldItems={soldItems} heading="Sold Items" styles={styles} />
          </div>
        </div>
      </div>
    </div>
  );
} 