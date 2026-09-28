import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  Building,
  Calendar,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { savePdfToIndexedDb, fileToBase64 } from '../services/pdfStorage';

export default function CompleteActivityModal({
  activity,
  unit,
  onClose,
  onCompleteSuccess
}) {
  const [ticketNumber, setTicketNumber] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');
  const [closingDate, setClosingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Por favor, selecione apenas arquivos no formato PDF (.pdf).');
      return;
    }

    setPdfFile(file);
    const dataUrl = await fileToBase64(file);
    setPdfPreviewUrl(dataUrl);

    // Tenta extrair número de chamado do nome do arquivo se o campo estiver vazio
    if (!ticketNumber) {
      const match = file.name.match(/T[\s_-]?\d{2}[\s_-]?\d{2}[\s_-]?\d{4,6}/i);
      if (match) {
        setTicketNumber(match[0].toUpperCase().replace(/[-_]/g, ' '));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      alert('Atenção: O upload do PDF gerado pelo sistema de chamados é obrigatório para fechar a atividade.');
      return;
    }

    setIsProcessing(true);

    try {
      const storageId = `pdf-act-${activity.id}-${Date.now()}`;
      
      // Salva no IndexedDB para armazenamento local sem limite de quota
      const savedRecord = await savePdfToIndexedDb(storageId, pdfFile, {
        name: pdfFile.name,
        size: pdfFile.size,
        ticketNumber: ticketNumber || 'Sem número'
      });

      // Confetes de comemoração pela conclusão e homologação
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      const completionData = {
        status: 'completed',
        validation: ticketNumber ? `Homologado Chamado ${ticketNumber}` : 'Homologado com PDF',
        alert: null,
        closureDocument: {
          storageId: storageId,
          ticketNumber: ticketNumber.trim() || 'Chamado Paralelo',
          fileName: pdfFile.name,
          fileSize: pdfFile.size,
          dataUrl: savedRecord.dataUrl,
          closedAt: closingDate,
          notes: notes.trim()
        }
      };

      onCompleteSuccess(completionData);
    } catch (err) {
      console.error('Erro ao salvar documento PDF:', err);
      alert('Erro ao processar o arquivo PDF. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container complete-activity-modal" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="complete-icon-badge">
              <CheckCircle2 size={24} className="text-emerald" />
            </div>
            <div>
              <h3>Concluir Atividade & Upload do Chamado</h3>
              <p>Anexe o PDF emitido pelo sistema de chamados da Elis para homologação</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Informações da Atividade */}
        <div className="complete-activity-banner">
          <div className="activity-info-row">
            <span className="activity-icon-big">{activity.icon || '📦'}</span>
            <div>
              <h4 className="activity-title-big">{activity.title}</h4>
              <span className="activity-unit-sub">
                <Building size={12} />
                {unit?.name || 'Unidade Hospitalar'}
              </span>
            </div>
          </div>
          <p className="activity-desc-sub">{activity.description}</p>
        </div>

        {/* Formulário com Upload Obrigatório */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Número do Chamado (Sistema Paralelo)</label>
              <input
                type="text"
                placeholder="Ex: T 26 09 13480"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                required
              />
              <span className="form-hint">Digite o número gerado pelo sistema de chamados</span>
            </div>

            <div className="form-group">
              <label>Data de Execução / Fechamento</label>
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* ÁREA DE UPLOAD OBRIGATÓRIO DE PDF */}
          <div className="form-group">
            <label className="upload-mandatory-label">
              <span>Arquivo do Relatório em PDF</span>
              <span className="badge-required">* OBRIGATÓRIO</span>
            </label>

            <div 
              className={`pdf-dropzone ${dragActive ? 'drag-active' : ''} ${pdfFile ? 'has-file' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />

              {pdfFile ? (
                <div className="dropzone-file-selected">
                  <FileText size={36} className="text-emerald" />
                  <div className="file-info-text">
                    <strong className="file-name">{pdfFile.name}</strong>
                    <span className="file-size">{(pdfFile.size / 1024).toFixed(1)} KB &middot; Pronto para upload</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn-replace-file"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    Trocar PDF
                  </button>
                </div>
              ) : (
                <div className="dropzone-empty">
                  <Upload size={36} className="dropzone-icon" />
                  <p className="dropzone-main-text">
                    <strong>Clique para selecionar o PDF</strong> ou arraste o arquivo aqui
                  </p>
                  <span className="dropzone-sub-text">
                    Anexe o relatório gerado após fechar o chamado no sistema paralelo
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Observações Técnicas da Homologação (Opcional)</label>
            <textarea
              rows={2}
              placeholder="Ex: Dispositivos limpos, testados presencialmente e sincronizados com Myelis..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isProcessing}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className={`btn-primary-action submit-btn ${!pdfFile ? 'disabled-btn' : ''}`}
              disabled={!pdfFile || isProcessing}
            >
              <Check size={16} />
              <span>{isProcessing ? 'Gravando PDF...' : 'Concluir & Salvar Chamado'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
