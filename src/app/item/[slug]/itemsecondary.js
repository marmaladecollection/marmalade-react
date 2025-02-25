"use client";

import styles from "./itemsecondary.module.scss";

export default function ItemSecondary({ item }) {


  return (
    <div className={styles.secondaryBit}>
      <div className={styles.productBlurb}>
        <p>
          Incredibly soft sheepskin hot water bottle cover. The sheepskins are specially sorted and selected,
          then cut by hand in Somerset. Each piece is unique, with variation in texture and colour.
        </p>
        <p>
          The open top design allows for easy filling. To fit a standard sized hot water bottle, which is
          approximately 33cm x 20cm and often 1.7L capacity.
        </p>
        <div className={styles.details}>
          <h4>Details</h4>
          H 100cm x 70cm
        </div>
      </div>
      <div className={styles.deliveryBlurb}>
        <h4>Delivery & Returns</h4>
        <h4>Free standard delivery on full price orders over £150.</h4>
        <div>
          <div>Standard Delivery (3-4 working days): £3</div>
          <div>Express Delivery (1-2 working days): £6</div>
          <div>Next Working Day Delivery: £8</div>
          <div>Before 12pm Next Working Day Delivery: £14</div>
        </div>
        <h4>Free returns <span>(subject to our returns policy).</span></h4>
        <span>Please refer to our delivery & returns policies for more information.</span>
      </div>
    </div>

  );
}
