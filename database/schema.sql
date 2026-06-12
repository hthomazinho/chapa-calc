-- Tabela de Chapas
CREATE TABLE IF NOT EXISTS chapas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  espessura DECIMAL(10, 2) NOT NULL,
  desconto_por_dobra BOOLEAN DEFAULT true,
  criada_em TIMESTAMP DEFAULT NOW(),
  atualizada_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de Formatos
CREATE TABLE IF NOT EXISTS formatos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  chapa_id INTEGER NOT NULL,
  foto_url TEXT,
  quantidade_dobras INTEGER DEFAULT 0,
  descricao TEXT,
  criada_em TIMESTAMP DEFAULT NOW(),
  atualizada_em TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (chapa_id) REFERENCES chapas(id) ON DELETE CASCADE
);

-- Tabela de Dobras do Formato
CREATE TABLE IF NOT EXISTS dobras_formato (
  id SERIAL PRIMARY KEY,
  formato_id INTEGER NOT NULL,
  numero_dobra INTEGER NOT NULL,
  grau DECIMAL(10, 2) NOT NULL,
  posicao VARCHAR(50),
  criada_em TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (formato_id) REFERENCES formatos(id) ON DELETE CASCADE
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  formato_id INTEGER NOT NULL,
  chapa_id INTEGER NOT NULL,
  medida_horizontal DECIMAL(10, 2) NOT NULL,
  medida_vertical DECIMAL(10, 2) NOT NULL,
  quantidade_dobras INTEGER NOT NULL,
  desconto_total DECIMAL(10, 2),
  medida_corte_horizontal DECIMAL(10, 2),
  medida_corte_vertical DECIMAL(10, 2),
  pdf_url TEXT,
  criada_em TIMESTAMP DEFAULT NOW(),
  atualizada_em TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (formato_id) REFERENCES formatos(id),
  FOREIGN KEY (chapa_id) REFERENCES chapas(id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_formatos_chapa_id ON formatos(chapa_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_formato_id ON pedidos(formato_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_chapa_id ON pedidos(chapa_id);
