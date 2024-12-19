'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/cadastro.module.css";
import Botao from "../components/Botao";
import { ApiURL } from '../../../config';
import Mesa from "../interfaces/mesa";
import { parseCookies } from "nookies";

interface ResponseSignin {
  erro: boolean;
  mensagem: string;
  token?: string;
}

export default function MesaPage() {
  const [mesa, setMesa] = useState<Mesa>({
    id: 0,
    n_mesa: 0,
    n_pessoas: 0,
    n_lugares: 0,
    tipo: '',
  });

  const [erro, setErro] = useState<string>("");
  const [carregando, setCarregando] = useState<boolean>(false);  
  const router = useRouter();

  const alterarNmesa = (novoNmesa: string) => {
    const newNmesa = parseInt(novoNmesa);
    if (!isNaN(newNmesa) && newNmesa > 0) { 
      setMesa((valoresAnteriores) => ({
        ...valoresAnteriores,
        n_mesa: newNmesa,
      }));
    }
  };

  const alterarNlugar = (novoNlugar: string) => {
    const newNlugar = parseInt(novoNlugar);
    if (!isNaN(newNlugar) && newNlugar > 0) { 
      setMesa((valoresAnteriores) => ({
        ...valoresAnteriores,
        n_pessoas: newNlugar, 
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCarregando(true); 
    try {
      const { 'authorization': token } = parseCookies();

      const response = await fetch(`${ApiURL}/mesas/cadastrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          n_mesa: mesa.n_mesa,
          n_pessoas: mesa.n_pessoas, 
          tipo: mesa.tipo
        }),
      });

      if (response) {  // Verificando se a resposta foi ok
        const data: ResponseSignin = await response.json();
        const { erro, mensagem } = data;

        if (erro) {
          setErro(mensagem); // Exibe mensagem de erro do backend
        } else {
          router.push('/'); // Redireciona para a página inicial após o cadastro
        }
      } else {
        setErro("Erro ao tentar cadastrar. Tente novamente."); // Mensagem de erro geral
      }
    } catch (error) {
      console.error('Erro na requisição', error);
      setErro("Erro de rede ou servidor. Tente novamente."); // Mensagem de erro de rede
    } finally {
      setCarregando(false);  // Finaliza o carregamento
    }
  };

  return (
    <div className={styles.paginaCadastro}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.email}>
          <label htmlFor="n_mesa">Insira o número para utilização da mesa:</label>
          <input
            className={styles.input}
            type="number"
            id="n_mesa"
            value={mesa.n_mesa}
            onChange={(e) => alterarNmesa(e.target.value)}
            required
          />
        </div>

        <div className={styles.email}>
          <label htmlFor="n_pessoas">Insira o número de lugares para a mesa:</label>
          <input
            className={styles.input}
            type="number"
            id="n_pessoas"
            value={mesa.n_pessoas}
            onChange={(e) => alterarNlugar(e.target.value)}
            required
          />
        </div>

        {erro && <p className={styles.msgErro}>{erro}</p>} {/* Exibe a mensagem de erro */}

        <button type="submit" className={styles.botaoSubmit} disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Efetuar o seu cadastro de mesa'}
        </button>
        <Botao titulo="Ir para Página de Login" botao={() => router.push('/paginaLogin')} />
      </form>
    </div>
  );
}
