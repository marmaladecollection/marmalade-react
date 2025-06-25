"use client";

import { useState } from 'react';
import { isValidDeliveryPostcode } from '../config/deliveryAreas';
import styles from './DeliveryAddressForm.module.scss';

export default function DeliveryAddressForm({ onSubmit }) {
  const [deliveryAddress, setDeliveryAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    postcode: '',
    country: 'GB'
  });
  const [addressError, setAddressError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setAddressError('');

    if (!deliveryAddress.postcode) {
      setAddressError('Please enter a postcode');
      return;
    }

    if (!isValidDeliveryPostcode(deliveryAddress.postcode)) {
      setAddressError("Oh no, it looks like you're outside our normal delivery area.  Please drop us an email, team@marmaladecollection.com, and we may be able to sort something out.");
      return;
    }

    onSubmit(deliveryAddress);
  };

  return (
    <div className={styles.addressForm}>
      <h2>Delivery Address</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="line1">Address Line 1</label>
          <input
            type="text"
            id="line1"
            value={deliveryAddress.line1}
            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line1: e.target.value })}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="line2">Address Line 2 (optional)</label>
          <input
            type="text"
            id="line2"
            value={deliveryAddress.line2}
            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line2: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={deliveryAddress.city}
            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="postcode">Postcode</label>
          <input
            type="text"
            id="postcode"
            value={deliveryAddress.postcode}
            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postcode: e.target.value })}
            required
          />
        </div>
        {addressError && <div className={styles.error}>{addressError}</div>}
        <button type="submit" className={styles.submitButton}>
          Continue to Payment
        </button>
      </form>
    </div>
  );
} 