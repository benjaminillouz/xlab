import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';

const PRIMARY_COLOR = '#004B63';

// Styles PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottom: `2px solid ${PRIMARY_COLOR}`,
    paddingBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  idbc: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginTop: 5,
  },
  qrSection: {
    alignItems: 'center',
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoLeft: {
    flex: 1,
  },
  infoRight: {
    width: 100,
    alignItems: 'center',
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 8,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 10,
    marginTop: 15,
    paddingBottom: 5,
    borderBottom: `1px solid ${PRIMARY_COLOR}`,
  },
  sectionIcon: {
    marginRight: 8,
  },
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_COLOR,
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 8,
    backgroundColor: '#fafafa',
  },
  tableRowAlt: {
    backgroundColor: '#fff',
  },
  tableCell: {
    fontSize: 9,
    color: '#333',
  },
  colDent: { width: '12%' },
  colType: { width: '35%' },
  colMateriau: { width: '20%' },
  colTeinte: { width: '15%' },
  colRealisation: { width: '18%' },
  badge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 8,
  },
  badgeYes: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  badgeNo: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  empreinteSection: {
    marginTop: 20,
    padding: 15,
    border: `1px solid ${PRIMARY_COLOR}`,
    borderRadius: 5,
  },
  empreinteTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: '1px solid #e0e0e0',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 8,
    color: '#999',
  },
  typeTravauxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 5,
  },
  typeTravauxBadge: {
    backgroundColor: `${PRIMARY_COLOR}15`,
    color: PRIMARY_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
    marginRight: 5,
    marginBottom: 5,
  },
});

// Configuration des catégories
const CATEGORY_CONFIG = {
  CONJOINTE: { label: 'Prothèses Fixes' },
  ADJOINTE: { label: 'Prothèses Mobiles' },
  IMPLANTOLOGIE: { label: 'Prothèses Implantaires' },
  ORTHODONTIE: { label: 'Autres' }
};

// Extraction du matériau depuis le nom du produit
const extractMateriau = (nom) => {
  if (nom.includes('Emax')) return 'Emax';
  if (nom.includes('Zircone Multicouche')) return 'Zircone Multicouche';
  if (nom.includes('Zircone Stratifiée')) return 'Zircone Stratifiée';
  if (nom.includes('Full Zircone')) return 'Full Zircone';
  if (nom.includes('Céramo Métallique')) return 'Céramo Métallique';
  if (nom.includes('Métallique')) return 'Métallique';
  if (nom.includes('Résine')) return 'Résine';
  if (nom.includes('Composite')) return 'Composite';
  if (nom.includes('Valplast')) return 'Valplast';
  if (nom.includes('Stellite')) return 'Stellite';
  return '-';
};

// Extraction du type depuis le nom du produit
const extractType = (nom) => {
  if (nom.includes('Couronne')) return 'Couronne';
  if (nom.includes('Inlay Onlay')) return 'Inlay Onlay';
  if (nom.includes('Inlay Core')) return 'Inlay Core';
  if (nom.includes('Onlay')) return 'Onlay';
  if (nom.includes('Facette')) return 'Facette';
  if (nom.includes('Pilier de Bridge')) return 'Pilier Bridge';
  if (nom.includes('Inter de Bridge')) return 'Inter Bridge';
  if (nom.includes('Ailette Bridge')) return 'Ailette Bridge';
  if (nom.includes('PEI')) return 'PEI';
  if (nom.includes('PBM')) return 'PBM';
  if (nom.includes('Prothèse Résine')) return 'Prothèse Résine';
  if (nom.includes('Stellite')) return 'Stellite';
  if (nom.includes('Crochets')) return 'Crochets';
  if (nom.includes('Rebasage')) return 'Rebasage';
  if (nom.includes('Adjonction')) return 'Adjonction/Réparation';
  if (nom.includes('Gouttière')) return 'Gouttière';
  if (nom.includes('Modèles')) return 'Modèles étude';
  if (nom.includes('Locator')) return 'Locator';
  if (nom.includes('Fil de contention')) return 'Fil contention';
  return nom.split(' ').slice(0, 2).join(' ');
};

// Composant Table pour une catégorie
const CategoryTable = ({ categoryKey, orders }) => {
  if (!orders || orders.length === 0) return null;

  const config = CATEGORY_CONFIG[categoryKey];

  return (
    <View style={styles.table} wrap={false}>
      <Text style={styles.sectionTitle}>{config.label}</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, styles.colDent]}>Dent(s)</Text>
        <Text style={[styles.tableHeaderCell, styles.colType]}>Type de prothèse</Text>
        <Text style={[styles.tableHeaderCell, styles.colMateriau]}>Matériau</Text>
        <Text style={[styles.tableHeaderCell, styles.colTeinte]}>Teinte</Text>
        <Text style={[styles.tableHeaderCell, styles.colRealisation]}>Réalisation</Text>
      </View>
      {orders.map((order, index) => (
        <View key={order.id} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowAlt : {}]}>
          <Text style={[styles.tableCell, styles.colDent]}>
            {order.data.dents?.length > 0
              ? [...order.data.dents].sort((a, b) => a - b).join(', ')
              : order.product.arcade === 'maxillaire' ? 'Max.' : order.product.arcade === 'mandibulaire' ? 'Mand.' : '-'}
          </Text>
          <Text style={[styles.tableCell, styles.colType]}>{extractType(order.product.nom)}</Text>
          <Text style={[styles.tableCell, styles.colMateriau]}>{extractMateriau(order.product.nom)}</Text>
          <Text style={[styles.tableCell, styles.colTeinte]}>{order.data.teinte || '-'}</Text>
          <Text style={[styles.tableCell, styles.colRealisation]}>Finitions</Text>
        </View>
      ))}
    </View>
  );
};

// Document PDF principal
const OrderPDFDocument = ({ formData, orders, qrCodeDataUrl }) => {
  const hasOrders = Object.values(orders).some(list => list.length > 0);
  const activeCategories = Object.entries(orders)
    .filter(([_, list]) => list.length > 0)
    .map(([cat]) => CATEGORY_CONFIG[cat].label);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {qrCodeDataUrl && (
              <Image src={qrCodeDataUrl} style={styles.qrCode} />
            )}
            <View style={{ marginLeft: qrCodeDataUrl ? 15 : 0 }}>
              <Text style={styles.headerTitle}>BON DE COMMANDE</Text>
              <Text style={styles.idbc}>IDBC: {formData.idCommande || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.qrSection}>
            <Text style={{ fontSize: 8, color: '#666' }}>Réf: {formData.idCommande || 'N/A'}</Text>
          </View>
        </View>

        {/* Informations */}
        <View style={styles.infoSection}>
          <View style={styles.infoLeft}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>PRATICIEN</Text>
              <Text style={styles.infoValue}>{formData.praticien || 'Non renseigné'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CENTRE</Text>
              <Text style={styles.infoValue}>{formData.centre || 'Non renseigné'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date de commande</Text>
              <Text style={styles.infoValue}>{formData.dateCommande}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date de livraison souhaitée</Text>
              <Text style={styles.infoValue}>{formData.dateLivraison}</Text>
            </View>
          </View>
          <View style={styles.infoLeft}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NOM DU PATIENT</Text>
              <Text style={styles.infoValue}>{formData.nomPatient || 'Non renseigné'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>PRENOM DU PATIENT</Text>
              <Text style={styles.infoValue}>{formData.prenomPatient || 'Non renseigné'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type de travaux</Text>
              <View style={styles.typeTravauxContainer}>
                {activeCategories.map((cat, i) => (
                  <Text key={i} style={styles.typeTravauxBadge}>{cat}</Text>
                ))}
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Travail à refaire</Text>
              <Text style={[styles.badge, formData.travailARefaire ? styles.badgeYes : styles.badgeNo]}>
                {formData.travailARefaire ? 'OUI' : 'NON'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tables par catégorie */}
        {hasOrders && (
          <View>
            <CategoryTable categoryKey="CONJOINTE" orders={orders.CONJOINTE} />
            <CategoryTable categoryKey="ADJOINTE" orders={orders.ADJOINTE} />
            <CategoryTable categoryKey="IMPLANTOLOGIE" orders={orders.IMPLANTOLOGIE} />
            <CategoryTable categoryKey="ORTHODONTIE" orders={orders.ORTHODONTIE} />
          </View>
        )}

        {/* Section Empreinte */}
        <View style={styles.empreinteSection}>
          <Text style={styles.empreinteTitle}>Empreinte numérique</Text>
          <Text style={[styles.badge, formData.empreinteNumerique ? styles.badgeYes : styles.badgeNo]}>
            {formData.empreinteNumerique ? 'OUI' : 'NON'}
          </Text>
        </View>

        {/* Message si présent */}
        {formData.message && (
          <View style={{ marginTop: 15, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 5 }}>Instructions :</Text>
            <Text style={{ fontSize: 9, color: '#333' }}>{formData.message}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Document généré le {new Date().toLocaleDateString('fr-FR')} - CEMEDIS Xlab
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};

// Fonction pour générer le QR code en data URL
const generateQRCode = async (text) => {
  if (!text) return null;
  try {
    return await QRCode.toDataURL(text, {
      width: 200,
      margin: 1,
      color: {
        dark: PRIMARY_COLOR,
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Erreur génération QR code:', err);
    return null;
  }
};

// Fonction pour générer le PDF en base64 (avec data URI pour faciliter le décodage)
export const generatePDFBase64 = async (formData, orders) => {
  // 1. Générer le QR code
  const qrCodeDataUrl = await generateQRCode(formData.idCommande || 'N/A');

  // 2. Générer le PDF avec le QR code
  const blob = await pdf(
    <OrderPDFDocument formData={formData} orders={orders} qrCodeDataUrl={qrCodeDataUrl} />
  ).toBlob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Retourne le data URI complet: data:application/pdf;base64,XXXXX
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default OrderPDFDocument;
