const mongoose = require('mongoose');

const OcorrenciaSchema = new mongoose.Schema({
  nomeAluno: String,
  serie: String,
  professor: String,
  assinatura: String,
  descricao: String,
  ocorrencias: [String],
  dataHora: Date
});

// força o nome da coleção para 'ocorrencia'
module.exports = mongoose.model('Ocorrencia', OcorrenciaSchema, 'ocorrencia');

