"use client";

import Thumbnail from "@/app/thumbnail";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMarmaladeContext } from "../../context/MarmaladeContext";
import { fetchItemById } from "../../firebase";
import styles from "./page.module.scss";

export default function ItemPage() {
  const [item, setItem] = useState([]);
  const router = useRouter();
  const { addToBasket } = useMarmaladeContext();

  useEffect(() => {
    const pathname = window.location.pathname;
    const itemIdFromPath = pathname.split("/").pop();
    fetchItemById(itemIdFromPath, setItem);
  }, []);

  const add = () => {
    addToBasket(item.id);
    router.push("/basket");
  }

  return (
    <div className={styles.page}>
      <main className={styles.mainBit}>
        <div className={styles.images}>
          <Thumbnail item={item} />
        </div>
        <div className={styles.actions}>
            <div className={styles.summary}>
                <span className={styles.description}>Rose and Geranium Scented Candle</span>
                <span className={styles.price}>£{item.price}</span>
             </div>
            <span className={styles.returns}>Free UK Returns on all orders</span>
            <div className={styles.buttons}>
                <a className={styles.addToBag} onClick={add}>Add to bag</a>
                <a className={styles.saveForLater}>Save for later</a>
            </div>
            <span className={styles.productInfo}>Product Information</span>
        </div>
        
      </main>
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
      </div>
  );
}
