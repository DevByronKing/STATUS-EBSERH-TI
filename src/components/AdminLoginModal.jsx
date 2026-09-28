import React, { useState } from 'react';
import { X, Lock, Shield, KeyRound, Check, AlertCircle } from 'lucide-react';
import { getAdminPin, setAdminPin } from '../services/storage';

export default function AdminLoginModal({ onClose, onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPin = getAdminPin();
    if (pin === correctPin) {
      setError('');
      onLoginSuccess();
    } else {
      setError('PIN ou Senha incorreta. Tente novamente.');
    }
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    const correctPin = getAdminPin();
    if (currentPin !== correctPin) {
      setError('PIN atual incorreto.');
      return;
    }
    if (newPin.length < 4) {
      setError('O novo PIN deve ter pelo menos 4 caracteres.');
      return;
    }
    setAdminPin(newPin);
    setSuccessMsg('PIN de administrador alterado com sucesso!');
    setIsChangingPin(false);
    setCurrentPin('');
    setNewPin('');
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Shield size={24} className="text-primary" />
            <div>
              <h3>Controle de Acesso Administrativo</h3>
              <p>Autenticação para criação, edição e fechamento de chamados</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}><X size={18} /></button>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert success">
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {!isChangingPin ? (
          <form onSubmit={handleLogin} className="modal-form">
            <div className="form-group">
              <label>Digite seu PIN / Senha de Administrador</label>
              <div className="pin-input-wrap">
                <Lock size={16} className="pin-icon" />
                <input
                  type="password"
                  autoFocus
                  placeholder="PIN padrão: elis2026"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(''); }}
                  required
                />
              </div>
              <span className="form-hint">Senha padrão inicial: <code>elis2026</code></span>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-link"
                onClick={() => { setIsChangingPin(true); setError(''); }}
              >
                <KeyRound size={14} />
                <span>Alterar PIN de Acesso</span>
              </button>
              <button type="submit" className="btn-primary-action submit-btn">
                <Check size={16} />
                <span>Entrar no Modo Admin</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="modal-form">
            <div className="form-group">
              <label>PIN Atual</label>
              <input
                type="password"
                placeholder="Digite o PIN atual (padrão: elis2026)"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Novo PIN</label>
              <input
                type="password"
                placeholder="Mínimo 4 caracteres"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                required
              />
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => { setIsChangingPin(false); setError(''); }}
              >
                Voltar
              </button>
              <button type="submit" className="btn-primary-action submit-btn">
                <Check size={16} />
                <span>Salvar Novo PIN</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
