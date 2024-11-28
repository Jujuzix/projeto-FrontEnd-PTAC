'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/cadastro.module.css";
import Botao from "../components/Botao";
import { ApiURL } from '../../../config';
import Mesa from "../interfaces/mesa";

interface ResponseSignin {
  erro: boolean;
  mensagem: string;
  token?: string;
}

export default function MesaPege() {
  const [mesa, setMesa] = useState<Mesa>({
    id: 0,
    n_mesa: 0,
    n_lugares: 0
  });

  const [erro, setError] = useState<string>("");
  const router = useRouter();

  const alterarNmesa = (novoNmesa: string) => {
    const newNmesa = parseInt(novoNmesa);
    if (!isNaN(newNmesa)) {
      setMesa((valoresAnteriores) => ({
        ...valoresAnteriores,
        n_mesa: newNmesa
      }));
    }
  };

  const alterarNlugar = (novoNlugar: string) => {
    const newNlugar = parseInt(novoNlugar);
    if (!isNaN(newNlugar)) {
      setMesa((valoresAnteriores) => ({
        ...valoresAnteriores,
        n_lugares: newNlugar
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${ApiURL}/mesa/mesa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          n_mesa: mesa.n_mesa,
          n_lugares: mesa.n_lugares
        })
      });

      if (response.ok) {
        const data: ResponseSignin = await response.json();
        const { erro, mensagem, token = '' } = data;

        if (erro) {
          setError(mensagem);
        } else {
          // setCookie(undefined, 'restaurant-token', token, { maxAge: 60 * 60 * 1 });
          router.push('/');
        }
      } else {
        setError("Erro ao tentar cadastrar. Tente novamente.");
      }
    } catch (error) {
      console.error('Erro na requisição', error);
      setError("Erro de rede ou servidor. Tente novamente.");
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
          <label htmlFor="n_lugares">Insira o número de lugares para a mesa:</label>
          <input
            className={styles.input}
            type="number"
            id="n_lugares"
            value={mesa.n_lugares}
            onChange={(e) => alterarNlugar(e.target.value)} 
            required
          />
        </div>

        {erro && <p className={styles.msgErro}>{erro}</p>}

        <button type="submit" className={styles.botaoSubmit}>Efetuar a sua Reserva</button>
        <Botao titulo="Ir para Página de Login" botao={() => router.push('/paginaLogin')} />
      </form>
    </div>
  );
}
