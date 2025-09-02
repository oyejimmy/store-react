import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 15,
    padding: 15,
    border: '1px solid #E0E0E0',
    borderRadius: 5,
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
    borderBottom: '2px solid #E0E0E0',
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c6e49',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    borderTop: '1px solid #E0E0E0',
    margin: '10px 0',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: 120,
    fontWeight: 'bold',
  },
  infoValue: {
    flex: 1,
  },
  note: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  table: {
    width: '100%',
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 5,
    borderBottom: '1px solid #E0E0E0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottom: '1px solid #E0E0E0',
  },
  tableCol: {
    padding: 5,
  },
  tableCol1: {
    width: '10%',
  },
  tableCol2: {
    width: '40%',
  },
  tableCol3: {
    width: '15%',
    textAlign: 'right',
  },
  tableCol4: {
    width: '15%',
    textAlign: 'right',
  },
  tableCol5: {
    width: '20%',
    textAlign: 'right',
  },
  totalSection: {
    marginTop: 20,
    borderTop: '1px solid #E0E0E0',
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  totalLabel: {
    width: '30%',
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    width: '20%',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
    borderTop: '1px solid #E0E0E0',
    paddingTop: 10,
  },
});

const OrderReceipt: React.FC<{ order: any }> = ({ order }) => {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const calculateTotalItems = (items: any[]) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const calculateTotalWeight = (items: any[]) => {
    // Assuming each item has a weight property, default to 1kg if not provided
    return items.reduce((sum, item) => sum + (item.weight || 1) * item.quantity, 0);
  };

  const totalItems = calculateTotalItems(order.items || []);
  const totalWeight = calculateTotalWeight(order.items || []);
  const totalAmount = order.total || order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
  const codAmount = order.paymentMethod === 'cod' ? totalAmount : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Customer Section */}
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.title}>🧾 Shipment Confirmation – TCS Courier</Text>
            <Text style={styles.subtitle}>
              Date: {formatDate(order.createdAt)} | Time: {formatTime(order.createdAt)}
            </Text>
          </View>
          
          <Text>
            Your package ({totalItems} pieces, {totalWeight} kg) has been dispatched from Karachi via Overnight Service to {order.shippingAddress?.city || 'your city'}.
          </Text>
          
          {codAmount > 0 && (
            <Text style={{ marginTop: 5 }}>
              COD Amount: Rs. {codAmount.toLocaleString('en-PK')}/-
            </Text>
          )}
          
          {order.items?.length > 0 && (
            <Text style={{ marginTop: 5 }}>
              Product: {order.items[0].name}
            </Text>
          )}
          
          <View style={styles.note}>
            <Text>Note: Please expect a call before delivery. Handle with care – item marked as fragile.</Text>
          </View>
        </View>

        {/* Admin Section */}
        <View style={[styles.section, { borderColor: '#2c6e49' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: '#2c6e49' }]}>🗂️ Internal Shipment Log – TCS Courier</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date/Time:</Text>
            <Text style={styles.infoValue}>{formatDate(order.createdAt)}, {formatTime(order.createdAt)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Origin → Destination:</Text>
            <Text style={styles.infoValue}>Karachi (KHI) → {order.shippingAddress?.city || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service:</Text>
            <Text style={styles.infoValue}>Overnight | Pieces: {totalItems} | Weight: {totalWeight} kg</Text>
          </View>
          
          {codAmount > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>COD:</Text>
              <Text style={styles.infoValue}>Rs. {codAmount.toLocaleString('en-PK')}/- | Fragile: Yes</Text>
            </View>
          )}
          
          {order.items?.length > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Product Detail:</Text>
              <Text style={styles.infoValue}>{order.items[0].name}</Text>
            </View>
          )}
          
          <View style={[styles.note, { marginTop: 10 }]}>
            <Text>Order ID: {order.orderNumber || 'N/A'}</Text>
            <Text>Customer: {order.customer?.name || 'N/A'}</Text>
            <Text>Contact: {order.customer?.phone || order.shippingAddress?.phone || 'N/A'}</Text>
            <Text>Address: {order.shippingAddress?.line1 || ''} {order.shippingAddress?.line2 || ''}, {order.shippingAddress?.city || ''}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OrderReceipt;
