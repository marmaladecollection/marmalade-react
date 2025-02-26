"use client";

import styles from "./delivery.module.scss";

export default function ItemSecondary({ item }) {

  return (
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
  );
}
