import React from 'react';
import { X, Download, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

export default function PdfViewerModal({ pdfDocument, onClose }) {
  if (!pdfDocument) return null;

  // Pode ser uma URL direta (/documents/chamado-13480.pdf), um DataURL (data:application/pdf;base64,...), ou objeto
  const pdfUrl = typeof pdfDocument === 'string' ? pdfDocument : pdfDocument.dataUrl || pdfDocument.url;
  const title = pdfDocument.title || pdfDocument.ticketNumber || 'Documento de Fechamento de Chamado';
  const fileName = pdfDocument.name || pdfDocument.fileName || 'chamado-fechamento.pdf';

  return (
    <div className="modal-overlay pdf-viewer-overlay" onClick={onClose}>
      <div className="modal-container pdf-viewer-container" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho do Visualizador de PDF */}
        <div className="pdf-viewer-header">
          <div className="pdf-header-title-wrap">
            <div className="pdf-icon-badge">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <div className="pdf-sub-tag">
                <CheckCircle2 size={12} className="text-emerald" />
                <span>CHAMADO OFICIAL HOMOLOGADO &middot; SISTEMA PARALELO ELIS</span>
              </div>
              <h3 className="pdf-main-title">{title}</h3>
            </div>
          </div>

          <div className="pdf-header-actions">
            {/* Download do PDF */}
            <a 
              href={pdfUrl} 
              download={fileName} 
              className="btn-pdf-header-action"
              title="Baixar arquivo PDF original"
            >
              <Download size={16} />
              <span>Baixar PDF</span>
            </a>

            {/* Abrir em Nova Aba */}
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-pdf-header-action"
              title="Abrir em nova aba do navegador"
            >
              <ExternalLink size={16} />
              <span>Nova Aba</span>
            </a>

            <button className="btn-close-modal" onClick={onClose} title="Fechar visualizador (ESC)">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Visualizador de PDF Embutido */}
        <div className="pdf-iframe-container">
          <iframe 
            src={pdfUrl} 
            title={title}
            className="pdf-iframe"
          />
        </div>
      </div>
    </div>
  );
}
