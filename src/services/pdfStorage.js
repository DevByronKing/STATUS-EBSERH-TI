// Gerenciador de armazenamento de PDFs via IndexedDB (sem limite de 5MB do LocalStorage)
const DB_NAME = 'elis_pdf_database';
const DB_VERSION = 1;
const STORE_NAME = 'ticket_pdfs';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Salvar PDF no IndexedDB
export async function savePdfToIndexedDb(id, fileOrBlob, metadata = {}) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64Data = reader.result;
      const record = {
        id: id,
        name: metadata.name || fileOrBlob.name || 'chamado.pdf',
        size: metadata.size || fileOrBlob.size,
        type: 'application/pdf',
        ticketNumber: metadata.ticketNumber || '',
        uploadedAt: new Date().toISOString(),
        dataUrl: base64Data
      };

      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(fileOrBlob);
  });
}

// Obter PDF do IndexedDB por ID
export async function getPdfFromIndexedDb(id) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Erro ao buscar PDF no IndexedDB:', err);
    return null;
  }
}

// Excluir PDF
export async function deletePdfFromIndexedDb(id) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Erro ao deletar PDF:', err);
    return false;
  }
}

// Converter File para Base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
