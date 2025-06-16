const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Ocorrencia = require('./models/ocorrencia'); // <-- arquivo com "o" minúsculo

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve index.html e outros arquivos da pasta "public"

// Conexão com MongoDB (Render usa variável de ambiente MONGO_URI)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Eventos de conexão
mongoose.connection.on('connected', () => {
  console.log('📡 Conectado no MongoDB!');
  console.log('🧠 Banco usado:', mongoose.connection.name);
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Erro ao conectar no MongoDB:', err);
});

// Rota POST para registrar ocorrência
app.post('/ocorrencias', async (req, res) => {
  try {
    const { nomeAluno, serie, professor, assinatura, descricao, ocorrencias } = req.body;
    const dataISO = new Date().toISOString();
    const nomeComData = `${dataISO.slice(0, 10)} - ${nomeAluno}`;

    const nova = new Ocorrencia({
      nomeAluno: nomeComData,
      serie,
      professor,
      assinatura,
      descricao,
      ocorrencias,
      dataHora: new Date()
    });

    await nova.save();
    res.status(201).json({ message: 'Ocorrência salva com sucesso!' });
  } catch (err) {
    console.error('❌ Erro ao salvar ocorrência:', err);
    res.status(500).json({ error: 'Erro ao salvar ocorrência.' });
  }
});

// Rota GET para listar ocorrências em ordem decrescente
app.get('/ocorrencias', async (req, res) => {
  try {
    const lista = await Ocorrencia.find().sort({ dataHora: -1 });
    res.json(lista);
  } catch (err) {
    console.error('❌ Erro ao listar ocorrências:', err);
    res.status(500).json({ error: 'Erro ao listar ocorrências.' });
  }
});

// Rota básica para teste de status
app.get('/', (req, res) => {
  res.send('🚀 API de Ocorrências está online!');
});

// Define porta (usada no Render ou localmente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta http://localhost:${PORT}`);
});
