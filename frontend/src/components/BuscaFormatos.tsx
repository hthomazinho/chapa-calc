import { useState } from 'react';
import { formatosAPI } from '../services/api';
import type { Formato } from '../types';
import './BuscaFormatos.css';

interface Props {
  onSelecionado: (formato: Formato) => void;
}

export const BuscaFormatos = ({ onSelecionado }: Props) => {
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<Formato[]>([]);
  const [carregando, setCarregando] = useState(false);

  const handleBuscar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusca(valor);

    if (valor.length < 2) {
      setResultados([]);
      return;
    }

    setCarregando(true);
    try {
      const response = await formatosAPI.buscar(valor);
      setResultados(response.data);
    } catch (error) {
      console.error('Erro ao buscar:', error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="busca-container">
      <h2>Buscar Formato</h2>
      <input
        type="text"
        placeholder="Ex: calha, caixa, cone..."
        value={busca}
        onChange={handleBuscar}
        className="busca-input"
      />

      {carregando && <p>Carregando...</p>}

      <div className="formatos-grid">
        {resultados.map((formato) => (
          <div
            key={formato.id}
            className="formato-card"
            onClick={() => onSelecionado(formato)}
          >
            {formato.foto_url && (
              <img src={formato.foto_url} alt={formato.nome} />
            )}
            <h3>{formato.nome}</h3>
            <p>Dobras: {formato.quantidade_dobras}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
