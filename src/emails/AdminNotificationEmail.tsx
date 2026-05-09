import * as React from 'react';

interface EmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: any[];
  totalAmount: number;
}

export const AdminNotificationEmail = ({
  orderNumber,
  customerName,
  customerEmail,
  shippingAddress,
  items,
  totalAmount
}: EmailProps) => (
  <div style={{
    backgroundColor: '#f9f9f9',
    color: '#1a1a1a',
    fontFamily: 'sans-serif',
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #eee'
  }}>
    <h1 style={{ color: '#000', fontSize: '20px' }}>Nouvelle vente ! 🎉</h1>
    <p style={{ fontSize: '14px' }}>
      Une nouvelle commande vient d'être passée sur <strong>MoreArt Mag</strong>.
    </p>

    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
      <h2 style={{ fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Détails de la commande</h2>
      <p><strong>N° :</strong> {orderNumber}</p>
      <p><strong>Client :</strong> {customerName} ({customerEmail})</p>
      <p><strong>Adresse :</strong> {shippingAddress}</p>
    </div>

    <div style={{ margin: '20px 0' }}>
      {items.map((item, index) => (
        <div key={index} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
          {item.quantity}× {item.title} ({item.sizeLabel})
        </div>
      ))}
    </div>

    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
      Total : {(totalAmount / 100).toFixed(2)} €
    </p>

    <div style={{ marginTop: '30px' }}>
      <a href={`https://moreartmag.art/admin/commandes`} style={{
        backgroundColor: '#000',
        color: '#fff',
        padding: '12px 24px',
        textDecoration: 'none',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        Gérer la commande
      </a>
    </div>
  </div>
);
