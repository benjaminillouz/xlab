import React, { useState, useMemo, useEffect } from 'react';

// ===========================================
// CONFIGURATION
// ===========================================

const LOGO_URL = "https://static.wixstatic.com/media/b07e07_99b2a9f75e874f24a4597db0afd55aac~mv2.jpeg";
const PRIMARY_COLOR = '#004B63';

// ===========================================
// UTILITAIRES
// ===========================================

const getTodayString = () => new Date().toISOString().split('T')[0];

const getMinDeliveryDate = (commandeDate) => {
  const date = new Date(commandeDate);
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
};

// Récupération des paramètres URL
const getUrlParams = () => {
  if (typeof window === 'undefined') return {
    idCommande: '', idPraticien: '', idCentre: '', idPatient: '',
    nomPatient: '', prenomPatient: '', nomPraticien: '', nomCentre: ''
  };
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    idCommande: params.get('ID_commande') || '',
    idPraticien: params.get('ID_praticien') || '',
    idCentre: params.get('ID_centre') || '',
    idPatient: params.get('Patient_id') || '',
    nomPatient: params.get('Patient_nom') || '',
    prenomPatient: params.get('Patient_prenom') || '',
    nomPraticien: params.get('Praticien_nom') || '',
    nomCentre: params.get('Centre_nom') || ''
  };
};

// ===========================================
// CATALOGUE PRODUITS
// ===========================================

const PRODUCTS_CATALOG = {
  CONJOINTE: [
    { code: "PC34", nom: "Ailette Bridge Céramo Métallique", dents: true, teinte: true },
    { code: "PC36", nom: "Ailette Bridge Collé", dents: true, teinte: true },
    { code: "PC1", nom: "Ailette Bridge Collé Emax", dents: true, teinte: true },
    { code: "PC3", nom: "Couronne Céramo Métallique", dents: true, teinte: true },
    { code: "PC4", nom: "Couronne Emax", dents: true, teinte: true },
    { code: "PC5", nom: "Couronne Full Zircone", dents: true, teinte: true },
    { code: "PC6", nom: "Couronne Métallique", dents: true, teinte: true },
    { code: "PC7", nom: "Couronne Résine Provisoire", dents: true, teinte: true },
    { code: "PC8", nom: "Couronne Zircone Multicouche", dents: true, teinte: true },
    { code: "PC9", nom: "Couronne Zircone Stratifiée", dents: true, teinte: true },
    { code: "FCT", nom: "Facette Emax", dents: true, teinte: true },
    { code: "PC10", nom: "Inlay Core Coulé", dents: true, teinte: false },
    { code: "PC11", nom: "Inlay Core Fibré", dents: true, teinte: false },
    { code: "PC12", nom: "Inlay Onlay Emax", dents: true, teinte: true },
    { code: "ONL", nom: "Onlay Zircone", dents: true, teinte: true },
    { code: "PC23", nom: "Pilier de Bridge Céramo Métallique", dents: true, teinte: true },
    { code: "PC24", nom: "Pilier de Bridge Emax", dents: true, teinte: true },
    { code: "PC25", nom: "Pilier de Bridge Full Zircone", dents: true, teinte: true },
    { code: "PC26", nom: "Pilier de Bridge Métallique", dents: true, teinte: true },
    { code: "PC16", nom: "Inter de Bridge Céramo Métallique", dents: true, teinte: true },
    { code: "PC17", nom: "Inter de Bridge Emax", dents: true, teinte: true },
    { code: "PC18", nom: "Inter de Bridge Full Zircone", dents: true, teinte: true },
  ],
  ADJOINTE: [
    { code: "PA1", nom: "PEI Maxillaire", arcade: "maxillaire", dents: false, teinte: false },
    { code: "PA19", nom: "PEI Mandibulaire", arcade: "mandibulaire", dents: false, teinte: false },
    { code: "PA3", nom: "PBM Finitions Directes Maxillaire", arcade: "maxillaire", dents: true, teinte: true },
    { code: "PA21", nom: "PBM Finitions Directes Mandibulaire", arcade: "mandibulaire", dents: true, teinte: true },
    { code: "PA4", nom: "PBM + Bourrelets d'Occlusion Maxillaire", arcade: "maxillaire", dents: false, teinte: false },
    { code: "PA22", nom: "PBM + Bourrelets d'Occlusion Mandibulaire", arcade: "mandibulaire", dents: false, teinte: false },
    { code: "PA7", nom: "Prothèse Résine Montage Cire Maxillaire", arcade: "maxillaire", dents: true, teinte: true },
    { code: "PA25", nom: "Prothèse Résine Montage Cire Mandibulaire", arcade: "mandibulaire", dents: true, teinte: true },
    { code: "PA9", nom: "Prothèse Résine Finitions Directes Maxillaire", arcade: "maxillaire", dents: true, teinte: true },
    { code: "PA27", nom: "Prothèse Résine Finitions Directes Mandibulaire", arcade: "mandibulaire", dents: true, teinte: true },
    { code: "PA11", nom: "Stellite unilatéral Maxillaire", arcade: "maxillaire", dents: true, teinte: true },
    { code: "PA29", nom: "Stellite unilatéral Mandibulaire", arcade: "mandibulaire", dents: true, teinte: true },
    { code: "PA13", nom: "Crochets Valplast Maxillaire", arcade: "maxillaire", dents: true, teinte: false },
    { code: "PA31", nom: "Crochets Valplast Mandibulaire", arcade: "mandibulaire", dents: true, teinte: false },
    { code: "PA16", nom: "Rebasage Maxillaire", arcade: "maxillaire", dents: false, teinte: false },
    { code: "PA34", nom: "Rebasage Mandibulaire", arcade: "mandibulaire", dents: false, teinte: false },
    { code: "PA17", nom: "Adjonction/Réparation Maxillaire", arcade: "maxillaire", dents: false, teinte: false },
    { code: "PA35", nom: "Adjonction/Réparation Mandibulaire", arcade: "mandibulaire", dents: false, teinte: false },
  ],
  IMPLANTOLOGIE: [
    { code: "IMP2", nom: "Couronne Céramo Métallique Transvissée", dents: true, teinte: true },
    { code: "IMP17", nom: "Couronne Céramo Métallique Scellée", dents: true, teinte: true },
    { code: "IMP8", nom: "Couronne Full Zircone Transvissée", dents: true, teinte: true },
    { code: "IMP23", nom: "Couronne Full Zircone Scellée", dents: true, teinte: true },
    { code: "IMP11", nom: "Couronne Zircone Multicouche Transvissée", dents: true, teinte: true },
    { code: "IMP26", nom: "Couronne Zircone Multicouche Scellée", dents: true, teinte: true },
    { code: "IMP3", nom: "Pilier de Bridge Céramo Métallique Transvissée", dents: true, teinte: true },
    { code: "IMP9", nom: "Pilier de Bridge Full Zircone Transvissée", dents: true, teinte: true },
    { code: "IMP4", nom: "Inter de Bridge Céramo Métallique", dents: true, teinte: true },
    { code: "IMP10", nom: "Inter de Bridge Full Zircone", dents: true, teinte: true },
    { code: "IMP31", nom: "Locator", dents: true, teinte: false },
    { code: "IMP34", nom: "Gouttière chirurgicale", dents: true, teinte: false },
    { code: "IMP36", nom: "Clé de repositionnement", dents: true, teinte: true },
  ],
  ORTHODONTIE: [
    { code: "OTH1", nom: "Modèles d'étude Maxillaire", arcade: "maxillaire", dents: false, teinte: false },
    { code: "OTH7", nom: "Modèles d'étude Mandibulaire", arcade: "mandibulaire", dents: false, teinte: false },
    { code: "OTH3", nom: "Gouttière bruxisme semi rigide Maxillaire", arcade: "maxillaire", dents: false, teinte: false },
    { code: "OTH9", nom: "Gouttière bruxisme semi rigide Mandibulaire", arcade: "mandibulaire", dents: false, teinte: false },
    { code: "OTH5", nom: "Gouttière bruxisme rigide Maxillaire", arcade: "maxillaire", dents: false, teinte: false },
    { code: "OTH11", nom: "Gouttière bruxisme rigide Mandibulaire", arcade: "mandibulaire", dents: false, teinte: false },
    { code: "OTH6", nom: "Gouttière d'éclaircissement Maxillaire", arcade: "maxillaire", dents: false, teinte: false },
    { code: "OTH12", nom: "Gouttière d'éclaircissement Mandibulaire", arcade: "mandibulaire", dents: false, teinte: false },
    { code: "OTH13", nom: "Gouttière de contention Maxillaire", arcade: "maxillaire", dents: false, teinte: false },
    { code: "OTH20", nom: "Gouttière de contention Mandibulaire", arcade: "mandibulaire", dents: false, teinte: false },
    { code: "CNT", nom: "Fil de contention", arcade: null, dents: false, teinte: false },
  ]
};

const TEINTES = ['A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D2', 'D3', 'D4'];
const DENTS_MAXILLAIRE = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const DENTS_MANDIBULAIRE = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const CATEGORY_CONFIG = {
  CONJOINTE: { icon: '🦷', label: 'Prothèses Fixes' },
  ADJOINTE: { icon: '🦴', label: 'Prothèses Mobiles' },
  IMPLANTOLOGIE: { icon: '⚙️', label: 'Implantologie' },
  ORTHODONTIE: { icon: '✨', label: 'Orthodontie / Autres' }
};

// ===========================================
// COMPOSANT QR CODE
// ===========================================

const QRCode = ({ value, size = 120 }) => {
  const generateMatrix = (data) => {
    const s = 21;
    const m = Array(s).fill(null).map(() => Array(s).fill(false));
    
    // Finder patterns
    const addFinder = (sx, sy) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          if (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4)) {
            if (sy + y < s && sx + x < s) m[sy + y][sx + x] = true;
          }
        }
      }
    };
    
    addFinder(0, 0);
    addFinder(s - 7, 0);
    addFinder(0, s - 7);
    
    // Data encoding
    const str = String(data || 'QR');
    let idx = 0;
    for (let y = 8; y < s - 8; y++) {
      for (let x = 8; x < s - 8; x++) {
        const c = str.charCodeAt(idx % str.length) || 65;
        m[y][x] = ((c + x * y + idx) % 3) === 0;
        idx++;
      }
    }
    
    return m;
  };

  const matrix = generateMatrix(value);
  const cell = size / matrix.length;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {matrix.map((row, y) =>
        row.map((c, x) => c ? (
          <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={PRIMARY_COLOR} />
        ) : null)
      )}
    </svg>
  );
};

// ===========================================
// COMPOSANT SCHEMA DENTAIRE
// ===========================================

const DentalChart = ({ selectedTeeth = [], onToothToggle, arcade = 'both' }) => {
  const showMax = arcade === 'both' || arcade === 'maxillaire';
  const showMand = arcade === 'both' || arcade === 'mandibulaire';
  
  const Tooth = ({ num }) => {
    const selected = selectedTeeth.includes(num);
    return (
      <button
        type="button"
        onClick={() => onToothToggle(num)}
        className="w-7 h-8 rounded text-xs font-bold border-2 transition-all"
        style={{
          backgroundColor: selected ? PRIMARY_COLOR : '#f8fafc',
          borderColor: selected ? PRIMARY_COLOR : '#e2e8f0',
          color: selected ? 'white' : '#64748b',
        }}
      >
        {num}
      </button>
    );
  };

  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
      <div className="flex flex-col items-center gap-1">
        {showMax && (
          <>
            <span className="text-xs text-slate-500 font-medium">Maxillaire</span>
            <div className="flex gap-0.5 flex-wrap justify-center">
              {DENTS_MAXILLAIRE.map(n => <Tooth key={n} num={n} />)}
            </div>
          </>
        )}
        {showMax && showMand && <div className="w-full h-px bg-slate-300 my-1" />}
        {showMand && (
          <>
            <div className="flex gap-0.5 flex-wrap justify-center">
              {DENTS_MANDIBULAIRE.map(n => <Tooth key={n} num={n} />)}
            </div>
            <span className="text-xs text-slate-500 font-medium">Mandibulaire</span>
          </>
        )}
      </div>
      {selectedTeeth.length > 0 && (
        <p className="text-xs text-center mt-2 pt-2 border-t border-slate-200">
          <span className="text-slate-500">Sélection: </span>
          <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>
            {[...selectedTeeth].sort((a, b) => a - b).join(', ')}
          </span>
        </p>
      )}
    </div>
  );
};

// ===========================================
// COMPOSANT SELECT TEINTE
// ===========================================

const TeinteSelect = ({ value, onChange, hasError }) => {
  const colors = {
    'A1': '#F5E6D3', 'A2': '#EDD9C4', 'A3': '#E5CCB5', 'A3.5': '#DEC0A6', 'A4': '#D4B397',
    'B1': '#F0E4D8', 'B2': '#E8D7C9', 'B3': '#E0CABA', 'B4': '#D8BDAB',
    'C1': '#E8DED4', 'C2': '#E0D1C5', 'C3': '#D8C4B6', 'C4': '#D0B7A7',
    'D2': '#E5D8CC', 'D3': '#DDCBBF', 'D4': '#D5BEB2'
  };

  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-9 pr-3 py-2 rounded-lg border-2 bg-white text-sm appearance-none cursor-pointer
          ${hasError ? 'border-red-400' : 'border-slate-200'}`}
      >
        <option value="">Choisir teinte...</option>
        {TEINTES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <div
        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-slate-300"
        style={{ backgroundColor: value ? colors[value] : '#f1f5f9' }}
      />
    </div>
  );
};

// ===========================================
// COMPOSANT LIGNE PRODUIT
// ===========================================

const ProductLine = ({ product, data, onUpdate, onRemove, errors = [] }) => {
  const errDents = errors.some(e => e.field === 'dents');
  const errTeinte = errors.some(e => e.field === 'teinte');

  return (
    <div
      className={`bg-white rounded-lg border-2 p-3 ${errors.length > 0 ? 'border-red-300' : 'border-slate-200'}`}
      style={{ borderLeftWidth: '4px', borderLeftColor: errors.length > 0 ? '#f87171' : PRIMARY_COLOR }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${PRIMARY_COLOR}15`, color: PRIMARY_COLOR }}>
            {product.code}
          </span>
          <p className="text-sm font-semibold text-slate-800 mt-0.5">{product.nom}</p>
        </div>
        <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500 p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-2">
        {product.dents && (
          <div>
            <label className={`text-xs font-medium ${errDents ? 'text-red-600' : 'text-slate-600'}`}>
              Dents * {errDents && '(obligatoire)'}
            </label>
            <div className={errDents ? 'ring-2 ring-red-300 rounded-lg mt-1' : 'mt-1'}>
              <DentalChart
                selectedTeeth={data.dents || []}
                onToothToggle={(num) => {
                  const curr = data.dents || [];
                  const next = curr.includes(num) ? curr.filter(n => n !== num) : [...curr, num];
                  onUpdate({ ...data, dents: next });
                }}
                arcade={product.arcade || 'both'}
              />
            </div>
          </div>
        )}

        {product.teinte && (
          <div>
            <label className={`text-xs font-medium ${errTeinte ? 'text-red-600' : 'text-slate-600'}`}>
              Teinte * {errTeinte && '(obligatoire)'}
            </label>
            <div className="mt-1">
              <TeinteSelect
                value={data.teinte}
                onChange={(val) => onUpdate({ ...data, teinte: val })}
                hasError={errTeinte}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===========================================
// COMPOSANT SECTION CATEGORIE
// ===========================================

const CategorySection = ({ catKey, orders, onAdd, onUpdate, onRemove, errors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const config = CATEGORY_CONFIG[catKey];
  const products = PRODUCTS_CATALOG[catKey];
  const catErrors = errors.filter(e => e.category === catKey);
  const hasErrors = catErrors.length > 0;

  // Filtrer les produits selon la recherche
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const search = searchTerm.toLowerCase().trim();
    return products.filter(p => 
      p.nom.toLowerCase().includes(search) || 
      p.code.toLowerCase().includes(search)
    );
  }, [products, searchTerm]);

  const handleAdd = () => {
    if (!selectedCode) return;
    const product = products.find(p => p.code === selectedCode);
    if (product) {
      onAdd(catKey, product);
      setSelectedCode('');
      setSearchTerm(''); // Reset recherche après ajout
    }
  };

  // Ajout rapide depuis la liste filtrée
  const handleQuickAdd = (product) => {
    onAdd(catKey, product);
    setSearchTerm('');
  };

  useEffect(() => {
    if (orders.length > 0 || hasErrors) setIsOpen(true);
  }, [orders.length, hasErrors]);

  return (
    <div className={`bg-white rounded-xl border overflow-hidden ${hasErrors ? 'border-red-300' : 'border-slate-200'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between hover:bg-slate-50"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <span className="font-bold text-slate-800">{config.label}</span>
          {orders.length > 0 && (
            <span
              className="px-2 py-0.5 text-xs font-bold text-white rounded-full"
              style={{ backgroundColor: hasErrors ? '#ef4444' : PRIMARY_COLOR }}
            >
              {orders.length}{hasErrors ? ' ⚠' : ''}
            </span>
          )}
        </div>
        <svg className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-3 pt-0 border-t border-slate-100">
          {/* Champ de recherche */}
          <div className="mb-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Rechercher un produit..."
                className="w-full px-3 py-2 pl-9 text-sm border-2 border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-slate-300 transition-colors"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Résultats de recherche rapide ou sélecteur */}
          {searchTerm.trim() ? (
            <div className="mb-3">
              {filteredProducts.length > 0 ? (
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {filteredProducts.map(p => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => handleQuickAdd(p)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <span className="text-sm font-medium text-slate-800">{p.nom}</span>
                        <span className="ml-2 text-xs font-mono text-slate-400">{p.code}</span>
                      </div>
                      <span 
                        className="text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                      >
                        + Ajouter
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-2">Aucun produit trouvé</p>
              )}
            </div>
          ) : (
            <div className="flex gap-2 mb-3">
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="flex-1 px-2 py-2 text-sm border-2 border-slate-200 rounded-lg bg-white"
              >
                <option value="">Sélectionner un produit...</option>
                {products.map(p => (
                  <option key={p.code} value={p.code}>{p.nom}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!selectedCode}
                className="px-4 py-2 text-white font-bold rounded-lg disabled:opacity-50"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                +
              </button>
            </div>
          )}

          {/* Liste des produits ajoutés */}
          {orders.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {orders.map((order) => (
                <ProductLine
                  key={order.id}
                  product={order.product}
                  data={order.data}
                  onUpdate={(newData) => onUpdate(catKey, order.id, newData)}
                  onRemove={() => onRemove(catKey, order.id)}
                  errors={catErrors.filter(e => e.orderId === order.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-3">Aucun acte ajouté</p>
          )}
        </div>
      )}
    </div>
  );
};

// ===========================================
// COMPOSANT PRINCIPAL
// ===========================================

export default function DentalOrderForm() {
  const [step, setStep] = useState(1);
  const [nextId, setNextId] = useState(1);
  const [validationErrors, setValidationErrors] = useState([]);

  // Paramètres URL
  const urlParams = useMemo(() => getUrlParams(), []);

  // État du formulaire
  const [formData, setFormData] = useState({
    idCommande: '',
    idPraticien: '',
    idCentre: '',
    idPatient: '',
    praticien: '',
    centre: '',
    nomPatient: '',
    prenomPatient: '',
    dateCommande: getTodayString(),
    dateLivraison: getMinDeliveryDate(getTodayString()),
    travailARefaire: false,
    codeBarre: '',
    empreinteNumerique: false,
    message: ''
  });

  // Initialisation depuis URL
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      idCommande: urlParams.idCommande || prev.idCommande,
      idPraticien: urlParams.idPraticien || prev.idPraticien,
      idCentre: urlParams.idCentre || prev.idCentre,
      idPatient: urlParams.idPatient || prev.idPatient,
      praticien: urlParams.nomPraticien || prev.praticien,
      centre: urlParams.nomCentre || prev.centre,
      nomPatient: urlParams.nomPatient || prev.nomPatient,
      prenomPatient: urlParams.prenomPatient || prev.prenomPatient,
    }));
  }, [urlParams]);

  // Commandes par catégorie
  const [orders, setOrders] = useState({
    CONJOINTE: [],
    ADJOINTE: [],
    IMPLANTOLOGIE: [],
    ORTHODONTIE: []
  });

  // Nombre total d'actes
  const totalItems = Object.values(orders).reduce((sum, arr) => sum + arr.length, 0);

  // Ajouter un produit
  const addProduct = (category, product) => {
    const newOrder = {
      id: nextId,
      product: { ...product },
      data: { dents: [], teinte: '' }
    };
    setNextId(prev => prev + 1);
    setOrders(prev => ({
      ...prev,
      [category]: [...prev[category], newOrder]
    }));
  };

  // Mettre à jour les données d'une commande
  const updateOrder = (category, orderId, newData) => {
    setOrders(prev => ({
      ...prev,
      [category]: prev[category].map(o => o.id === orderId ? { ...o, data: newData } : o)
    }));
    // Effacer les erreurs liées
    setValidationErrors(prev => prev.filter(e => !(e.category === category && e.orderId === orderId)));
  };

  // Supprimer une commande
  const removeOrder = (category, orderId) => {
    setOrders(prev => ({
      ...prev,
      [category]: prev[category].filter(o => o.id !== orderId)
    }));
  };

  // Validation
  const validateOrders = () => {
    const errs = [];
    Object.entries(orders).forEach(([cat, list]) => {
      list.forEach((order) => {
        if (order.product.dents && (!order.data.dents || order.data.dents.length === 0)) {
          errs.push({
            category: cat,
            orderId: order.id,
            field: 'dents',
            message: `Sélectionnez les dents pour "${order.product.nom}"`
          });
        }
        if (order.product.teinte && !order.data.teinte) {
          errs.push({
            category: cat,
            orderId: order.id,
            field: 'teinte',
            message: `Sélectionnez une teinte pour "${order.product.nom}"`
          });
        }
      });
    });
    return errs;
  };

  const handleContinue = () => {
    const errs = validateOrders();
    setValidationErrors(errs);
    if (errs.length === 0) {
      setStep(3);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fonction de soumission
  const handleSubmit = () => {
    // Construire les données pour l'URL
    
    // PC = Prothèses Conjointes (dents sélectionnées)
    const pcDents = orders.CONJOINTE
      .flatMap(o => o.data.dents || [])
      .sort((a, b) => a - b)
      .join(',');
    
    // PA Max = Prothèses Adjointes Maxillaire
    const paMax = orders.ADJOINTE
      .filter(o => o.product.arcade === 'maxillaire')
      .map(o => o.product.code)
      .join(',');
    
    // PA Mand = Prothèses Adjointes Mandibulaire
    const paMand = orders.ADJOINTE
      .filter(o => o.product.arcade === 'mandibulaire')
      .map(o => o.product.code)
      .join(',');
    
    // Other = Implantologie + Orthodontie
    const otherProd = [
      ...orders.IMPLANTOLOGIE.map(o => `${o.product.code}:${(o.data.dents || []).join('-')}`),
      ...orders.ORTHODONTIE.map(o => o.product.code)
    ].join(',');
    
    // Type de travail (codes des catégories utilisées)
    const wtype = Object.entries(orders)
      .filter(([_, list]) => list.length > 0)
      .map(([cat]) => cat.substring(0, 3))
      .join(',');
    
    // Prothèses immédiates (extractions)
    const extrac = formData.travailARefaire ? 'oui' : 'non';
    
    // Construire l'URL
    const baseUrl = 'https://app.applications-cemedis.fr/bonsdecommandesxlab';
    const params = new URLSearchParams({
      id: formData.idCommande || '',
      centre: formData.centre || '',
      praticien: formData.praticien || '',
      datec: formData.dateCommande || '',
      datel: formData.dateLivraison || '',
      patientnom: formData.nomPatient || '',
      patientprenom: formData.prenomPatient || '',
      wtype: wtype,
      pc: pcDents,
      pamax: paMax,
      pamand: paMand,
      other: otherProd,
      comment: formData.message || '',
      extrac: extrac
    });
    
    const redirectUrl = `${baseUrl}?${params.toString()}`;
    
    // Redirection
    window.location.href = redirectUrl;
  };

  // ===========================================
  // RENDU
  // ===========================================

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold" style={{ color: PRIMARY_COLOR }}>Bon de Commande</h1>
              <p className="text-xs text-slate-500">Prothèses dentaires</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3].map(n => (
                <div
                  key={n}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    ${step >= n ? 'text-white' : 'bg-slate-200 text-slate-500'}`}
                  style={{ backgroundColor: step >= n ? PRIMARY_COLOR : undefined }}
                >
                  {step > n ? '✓' : n}
                </div>
              ))}
            </div>
            <img 
              src={LOGO_URL} 
              alt="Logo" 
              className="w-12 h-12 rounded-lg object-contain border border-slate-200"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* ============ ÉTAPE 1 ============ */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-center text-slate-800">Informations</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Praticien */}
              <div className="bg-white rounded-xl p-4 border">
                <h3 className="font-bold text-slate-800 mb-3">👨‍⚕️ Praticien</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nom du praticien *"
                    value={formData.praticien}
                    onChange={e => setFormData({ ...formData, praticien: e.target.value })}
                    readOnly={!!urlParams.nomPraticien}
                    className={`w-full px-3 py-2 rounded-lg border-2 text-sm ${urlParams.nomPraticien ? 'bg-slate-100 text-slate-600' : 'border-slate-200'}`}
                  />
                  {urlParams.idPraticien && <p className="text-xs text-slate-400">ID: {urlParams.idPraticien}</p>}
                  <input
                    type="text"
                    placeholder="Centre *"
                    value={formData.centre}
                    onChange={e => setFormData({ ...formData, centre: e.target.value })}
                    readOnly={!!urlParams.nomCentre}
                    className={`w-full px-3 py-2 rounded-lg border-2 text-sm ${urlParams.nomCentre ? 'bg-slate-100 text-slate-600' : 'border-slate-200'}`}
                  />
                  {urlParams.idCentre && <p className="text-xs text-slate-400">ID: {urlParams.idCentre}</p>}
                </div>
              </div>

              {/* Patient */}
              <div className="bg-white rounded-xl p-4 border">
                <h3 className="font-bold text-slate-800 mb-3">👤 Patient</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nom *"
                    value={formData.nomPatient}
                    onChange={e => setFormData({ ...formData, nomPatient: e.target.value })}
                    readOnly={!!urlParams.nomPatient}
                    className={`w-full px-3 py-2 rounded-lg border-2 text-sm ${urlParams.nomPatient ? 'bg-slate-100 text-slate-600' : 'border-slate-200'}`}
                  />
                  <input
                    type="text"
                    placeholder="Prénom *"
                    value={formData.prenomPatient}
                    onChange={e => setFormData({ ...formData, prenomPatient: e.target.value })}
                    readOnly={!!urlParams.prenomPatient}
                    className={`w-full px-3 py-2 rounded-lg border-2 text-sm ${urlParams.prenomPatient ? 'bg-slate-100 text-slate-600' : 'border-slate-200'}`}
                  />
                </div>
                {urlParams.idPatient && <p className="text-xs text-slate-400 mt-2">ID Patient: {urlParams.idPatient}</p>}
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-xl p-4 border">
              <h3 className="font-bold text-slate-800 mb-3">📅 Dates & Options</h3>
              <div className="grid md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-medium">Date commande *</label>
                  <input
                    type="date"
                    min={getTodayString()}
                    value={formData.dateCommande}
                    onChange={e => {
                      const d = e.target.value;
                      const minL = getMinDeliveryDate(d);
                      setFormData({
                        ...formData,
                        dateCommande: d,
                        dateLivraison: formData.dateLivraison < minL ? minL : formData.dateLivraison
                      });
                    }}
                    className="w-full px-2 py-2 rounded-lg border-2 border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Livraison souhaitée *</label>
                  <input
                    type="date"
                    min={getMinDeliveryDate(formData.dateCommande)}
                    value={formData.dateLivraison}
                    onChange={e => setFormData({ ...formData, dateLivraison: e.target.value })}
                    className="w-full px-2 py-2 rounded-lg border-2 border-slate-200 text-sm"
                  />
                  <p className="text-xs text-slate-400">Min. J+7</p>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Empreinte num.</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, empreinteNumerique: !formData.empreinteNumerique })}
                    className={`w-full px-2 py-2 rounded-lg border-2 text-sm font-medium
                      ${formData.empreinteNumerique ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200'}`}
                  >
                    {formData.empreinteNumerique ? '✓ Oui' : 'Non'}
                  </button>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Travail à refaire</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, travailARefaire: !formData.travailARefaire })}
                    className={`w-full px-2 py-2 rounded-lg border-2 text-sm font-medium
                      ${formData.travailARefaire ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200'}`}
                  >
                    {formData.travailARefaire ? '✓ Oui' : 'Non'}
                  </button>
                </div>
              </div>

              {/* Notice délais */}
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800 space-y-1">
                  <span className="block">⏱️ Délais de <strong>7 jours minimum</strong> pour un cas simple</span>
                  <span className="block">⏱️ Délais de <strong>11 jours</strong> pour les cas combinés</span>
                  <span className="block">⏱️ Délais de <strong>12 jours</strong> pour les cas implantaires</span>
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 text-white font-bold rounded-lg"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ============ ÉTAPE 2 ============ */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-center text-slate-800">Sélection des produits</h2>

            {/* Erreurs de validation */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="font-bold text-red-800 text-sm mb-1">⚠️ Champs obligatoires :</p>
                <ul className="text-xs text-red-700 space-y-0.5">
                  {validationErrors.map((e, i) => <li key={i}>• {e.message}</li>)}
                </ul>
              </div>
            )}

            {/* Catégories */}
            <div className="space-y-3">
              {Object.keys(CATEGORY_CONFIG).map(catKey => (
                <CategorySection
                  key={catKey}
                  catKey={catKey}
                  orders={orders[catKey]}
                  onAdd={addProduct}
                  onUpdate={updateOrder}
                  onRemove={removeOrder}
                  errors={validationErrors}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg"
              >
                ← Retour
              </button>
              <button
                type="button"
                onClick={handleContinue}
                disabled={totalItems === 0}
                className="px-5 py-2 text-white font-bold rounded-lg disabled:opacity-50"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Valider →
              </button>
            </div>
          </div>
        )}

        {/* ============ ÉTAPE 3 ============ */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-center text-slate-800">Récapitulatif</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Détails */}
              <div className="md:col-span-2 space-y-3">
                {/* Infos */}
                <div className="bg-white rounded-xl p-4 border">
                  <h3 className="font-bold text-slate-800 mb-2">📋 Informations</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><span className="text-slate-400">Praticien:</span> {formData.praticien}</p>
                    <p><span className="text-slate-400">Centre:</span> {formData.centre}</p>
                    <p><span className="text-slate-400">Patient:</span> {formData.prenomPatient} {formData.nomPatient}</p>
                    <p><span className="text-slate-400">Livraison:</span> {formData.dateLivraison}</p>
                    {formData.empreinteNumerique && <p className="col-span-2 text-teal-600">✓ Empreinte numérique</p>}
                  </div>
                </div>

                {/* Actes */}
                {Object.entries(orders).map(([cat, list]) => list.length > 0 && (
                  <div key={cat} className="bg-white rounded-xl p-4 border">
                    <h3 className="font-bold text-slate-800 mb-2">
                      {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                    </h3>
                    <div className="space-y-1">
                      {list.map(order => (
                        <div key={order.id} className="text-sm py-1 border-b border-slate-100 last:border-0">
                          <div className="flex justify-between">
                            <span className="font-medium">{order.product.nom}</span>
                            <span className="text-xs font-mono" style={{ color: PRIMARY_COLOR }}>{order.product.code}</span>
                          </div>
                          {order.data.dents?.length > 0 && (
                            <p className="text-xs text-slate-500">Dents: {[...order.data.dents].sort((a, b) => a - b).join(', ')}</p>
                          )}
                          {order.data.teinte && <p className="text-xs text-slate-500">Teinte: {order.data.teinte}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Message */}
                <div className="bg-white rounded-xl p-4 border">
                  <h3 className="font-bold text-slate-800 mb-2">💬 Message</h3>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    placeholder="Instructions..."
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 text-sm resize-none"
                  />
                </div>
              </div>

              {/* QR Code & Validation */}
              <div>
                <div className="sticky top-20 bg-white rounded-xl p-4 border-2 shadow" style={{ borderColor: PRIMARY_COLOR }}>
                  {formData.idCommande && (
                    <div className="text-center mb-3">
                      <div className="inline-block p-2 bg-white rounded border">
                        <QRCode value={formData.idCommande} size={100} />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">N° Commande</p>
                      <p className="font-bold font-mono" style={{ color: PRIMARY_COLOR }}>{formData.idCommande}</p>
                    </div>
                  )}

                  <div className="text-center mb-3">
                    <span className="text-slate-500 text-sm">Total:</span>
                    <span className="text-xl font-bold ml-2" style={{ color: PRIMARY_COLOR }}>
                      {totalItems} acte{totalItems > 1 ? 's' : ''}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-2 text-white font-bold rounded-lg"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                  >
                    ✓ Valider la commande
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full mt-2 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer sticky étape 2 */}
      {step === 2 && totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <span className="font-bold" style={{ color: PRIMARY_COLOR }}>
              {totalItems} acte{totalItems > 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={handleContinue}
              className="px-5 py-2 text-white font-bold rounded-lg"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              Continuer →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
