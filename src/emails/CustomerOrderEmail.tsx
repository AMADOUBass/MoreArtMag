import * as React from 'react';

interface EmailProps {
  orderNumber: string;
  customerName: string;
  items: any[];
  totalAmount: number;
}

export const CustomerOrderEmail = ({
  orderNumber,
  customerName,
  items,
  totalAmount
}: EmailProps) => (
  <div style={{
    backgroundColor: '#0a0604',
    color: '#ffffff',
    fontFamily: 'serif',
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto'
  }}>
    <h1 style={{ color: '#d4af37', fontStyle: 'italic', fontSize: '24px' }}>Merci pour votre acquisition, {customerName}.</h1>
    <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '40px' }}>
      Votre commande <strong style={{ color: '#ffffff' }}>#{orderNumber}</strong> est confirmée. Bazan prépare personnellement votre œuvre pour l'envoi.
    </p>

    <div style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: '#a0a0a0' }}>{item.sizeLabel} × {item.quantity}</div>
          </div>
          <div>{(item.priceCents * item.quantity / 100).toFixed(2)} €</div>
        </div>
      ))}
    </div>

    <div style={{ borderTop: '1px solid #333', marginTop: '20px', paddingTop: '20px', textAlign: 'right' }}>
      <div style={{ fontSize: '18px', color: '#d4af37' }}>
        Total : {(totalAmount / 100).toFixed(2)} €
      </div>
    </div>

    <div style={{ marginTop: '40px', textAlign: 'center' }}>
      <a href={`https://moreartmag.art/suivi/${orderNumber}`} style={{
        backgroundColor: '#d4af37',
        color: '#000000',
        padding: '12px 24px',
        textDecoration: 'none',
        fontWeight: 'bold',
        borderRadius: '2px'
      }}>
        Suivre ma commande
      </a>
    </div>

    <footer style={{ marginTop: '60px', borderTop: '1px solid #333', paddingTop: '20px', fontSize: '10px', color: '#666', textAlign: 'center' }}>
      © 2026 MOREART MAG | BAZAN TOGOLA<br />
      Une quête de racines à travers l'image et la matière.
    </footer>
  </div>
);
