'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/cadastro.module.css";
import Botao from "../components/Botao";
import Reserva from "../interfaces/reserva";
import { ApiURL } from '../../../config';

interface ResponseSignin {
  erro: boolean;
  mensagem: string;
  token?: string;
}

export default function ReservaPage() {
  const [reserva, setReserva] = useState<Reserva>({
    nome_reserva: "",
    n_mesa: 0,
    data_reserva: "",
    n_pessoas: 0
  });

  const [erro, setError] = useState<string>("");
  const router = useRouter();

  const alterarNome = (novoNome: string) => {
    setReserva((valoresAnteriores) => ({
      ...valoresAnteriores,
      nome_reserva: novoNome
    }));
  };

  const alterarNmesa = (novoNmesa: string) => {
    const newNmesa = parseInt(novoNmesa, 10);
    if (!isNaN(newNmesa)) {
      setReserva((valoresAnteriores) => ({
        ...valoresAnteriores,
        n_mesa: newNmesa
      }));
    }
  };

  const alterarData = (novaData: string) => {
    setReserva((valoresAnteriores) => ({
      ...valoresAnteriores,
      data_reserva: novaData
    }));
  };

  const alterarPessoas = (novaquantPessoas: string) => {
    const newValue = parseInt(novaquantPessoas, 10);
    if (!isNaN(newValue) && newValue >= 1 && newValue <= 50) {
      setReserva((valoresAnteriores) => ({
        ...valoresAnteriores,
        n_pessoas: newValue
      }));
    } else {
      setError("A quantidade de pessoas deve ser entre 1 e 50!");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${ApiURL}/mesa/reservar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: reserva.nome_reserva,
          n_mesa: reserva.n_mesa,
          data: reserva.data_reserva,
          n_pessoas: reserva.n_pessoas
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
        <div className={styles.nome}>
          <h1 className={styles.titulo}>Faça a Sua Reserva de Mesa:</h1>
          <label htmlFor="nome">Insira seu Nome:</label>
          <input
            className={styles.input}
            type="text"
            id="nome"
            value={reserva.nome_reserva}
            onChange={(e) => alterarNome(e.target.value)}
            required
          />
        </div>

        <div className={styles.email}>
          <label htmlFor="n_mesa">Insira o número para utilização da mesa:</label>
          <input
            className={styles.input}
            type="number"
            id="n_mesa"
            value={reserva.n_mesa}
            onChange={(e) => alterarNmesa(e.target.value)}
            required
          />
        </div>

        <div className={styles.email}>
          <label htmlFor="data">Insira a Data para utilização da mesa:</label>
          <input
            className={styles.input}
            type="date"
            id="data"
            value={reserva.data_reserva}
            onChange={(e) => alterarData(e.target.value)}
            required
          />
        </div>

        <div className={styles.senha}>
          <label htmlFor="n_pessoas">Insira a Quantidade de Pessoas que irão ocupar a mesa:</label>
          <input
            className={styles.input}
            type="number"
            id="n_pessoas"
            min="1"
            max="50"
            value={reserva.n_pessoas}
            onChange={(e) => alterarPessoas(e.target.value)}
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
