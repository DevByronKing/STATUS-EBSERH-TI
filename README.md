# Status Elis | EBSERH Tecnologia da Informação 🏥🚀

Painel web executivo para acompanhamento em tempo real das atividades, implantações tecnológicas e pendências operacionais das unidades hospitalares EBSERH (Hospital Universitário João de Barros Barreto e Hospital Universitário Bettina Ferro de Souza).

Desenvolvido para publicação direta no **Vercel** com link compartilhável para gestores, diretores e equipes técnicas.

---

## 🌟 Principais Funcionalidades

1. **Visão Executiva para Gestores (Modo Leitura)**
   - Indicador de progresso circular dinâmico (%) para cada unidade hospitalar.
   - Cards de status com efeito 3D Tilt, iluminação Spotlight e badges coloridos com brilho suave.
   - Filtros instantâneos por status (*Todas, Concluídas, Em Andamento, Pendentes/Bloqueadas*).
   - Busca em tempo real por equipamentos, portais RFID, servidores, etc.
   - Alternador de Tema Claro e Escuro (**Dark / Light Theme**).
   - Botão **Compartilhar Link** que copia a URL pronta para envio via Teams, WhatsApp ou E-mail.

2. **Gestão Completa de Atividades (Modo Administrador com PIN)**
   - Acesso seguro protegido por PIN (padrão inicial: `elis2026`, com opção de alterar).
   - **Criar Atividade:** Formulário com seletor de unidade, ícone, status, descrição, validação do sistema e caixa de alerta/bloqueio.
   - **Editar Atividade:** Edição rápida de qualquer parâmetro em modal responsivo.
   - **Excluir Atividade:** Com confirmação para evitar perdas acidentais.
   - **Histórico & Anotações:** Linha do tempo de comentários com autor e data/hora em cada card.

3. **Gestão de Pendências & Documento de Fechamento de Chamado Elis**
   - Registro de pendências com nível de criticidade (*Baixa, Média, Alta, Crítica*) e vínculo opcional a uma atividade/equipamento.
   - Fluxo de **Fechar Pendência (Emitir Chamado)**:
     - Wizard interativo para preenchimento dos dados oficiais do chamado técnico.
     - Gera automaticamente o número do chamado no padrão Elis (ex: `T 26 09 13480`).
     - Efeito comemorativo de confetes ao concluir a homologação.
   - **Documento Oficial de Fechamento de Chamado (Idêntico ao PDF Elis)**:
     - Logotipo oficial da Elis.
     - Metadados completos: Solicitante, Detalhes, Localização, Planejamento e Processamento.
     - Blocos estruturados: Pedido/Justificativa, Ações Técnicas Executadas, Status e Conclusão / Homologação.
     - Tempos de atendimento e métricas de SLA.
     - Botão **Imprimir / Gerar PDF** formatado com CSS `@media print` para papel A4 perfeito (1/2 e 2/2).

4. **Sincronização em Nuvem (Supabase) + Backup Local**
   - Funciona imediatamente em **Modo Local (LocalStorage)** sem precisar configurar nada.
   - Suporte nativo a **Supabase (Nuvem Gratuita)**:
     - Script SQL pronto em `supabase_schema.sql` (1 clique para criar tabelas).
     - Quando conectado, qualquer alteração feita por você atualiza a tela de todos os gestores **ao vivo em tempo real via WebSocket**.
   - Ferramenta de **Exportar / Importar Backup JSON** para guardar cópias no seu computador.

---

## 🚀 Como Subir no Vercel (Passo a Passo)

### Opção 1: Via GitHub (Mais Recomendada)

1. Crie um repositório no seu GitHub (ex: `status-elis`).
2. Abra o terminal na pasta `status-elis`:
   ```bash
   git init
   git add .
   git commit -m "feat: Status Elis EBSERH Dashboard"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/status-elis.git
   git push -u origin main
   ```
3. Acesse [vercel.com](https://vercel.com) e faça login.
4. Clique em **"Add New..." > "Project"** e selecione o repositório `status-elis`.
5. O Vercel detectará automaticamente que é um projeto **Vite**.
6. Clique em **"Deploy"**. Em menos de 1 minuto seu link estará no ar:
   `https://status-elis-xxx.vercel.app`

### Opção 2: Via Vercel CLI (Direto do Terminal)

1. No terminal da pasta `status-elis`, execute:
   ```bash
   npx vercel
   ```
2. Siga as instruções rápidas na tela (aceitar as configurações padrão).
3. O Vercel gerará o link de produção imediatamente!

---

## ☁️ Como Ativar a Sincronização em Tempo Real (Supabase)

Para que seus gestores vejam em tempo real as atualizações que você fizer:

1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
2. Clique em **"New Project"** (ex: nome `status-elis`).
3. No menu lateral esquerdo, clique em **SQL Editor**, cole o conteúdo do arquivo `supabase_schema.sql` e clique em **Run**.
4. Vá em **Project Settings > API** e copie:
   - **Project URL**
   - **Project API Key (`anon` / `public`)**
5. Você pode inserir essas chaves de duas formas:
   - **No Vercel (Ambiente):** Adicione as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas configurações do projeto no Vercel.
   - **Direto no Painel Web:** Clique no botão de nuvem (**Modo Local / Supabase**) no topo do painel, cole a URL e Anon Key e clique em **Salvar & Ativar Nuvem**.

---

## 🔒 Credenciais Padrão do Administrador

- **PIN Inicial:** `elis2026`
- Para alterar o PIN, clique em **Acesso Admin > Alterar PIN de Acesso**.

---

## 🛠️ Executar Localmente

```bash
# Entrar na pasta do projeto
cd status-elis

# Instalar dependências (já realizado)
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```
