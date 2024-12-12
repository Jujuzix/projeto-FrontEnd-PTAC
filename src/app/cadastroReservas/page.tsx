'use client';

import { FormEvent, useEffect, useState } from "react";
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

interface MesasType {
  id: number;
  n_mesa: number;
  n_pessoas: number;
  tipo: string;
}

export default function ReservaPage() {
  const [mesa, setMesas] = useState<MesasType[]>([])

  useEffect(() => {
    async function fecthData() {
      const response = await fetch("http://localhost:3333/reservas")
      console.log(await response.json())
    }
    fecthData()
  }, [])

  const [reserva, setReserva] = useState<Reserva>({
    n_mesa: 0,
    data_reserva: "",
    n_pessoas: 0
  });

  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [erro, setErro] = useState<string>("");
  const router = useRouter();

  // Função para carregar as mesas disponíveis
  const carregarMesas = async () => {
    try {
      setErro(""); // Resetar erro antes de carregar
      const response = await fetch(`${ApiURL}/mesas/`);
      if (response) {
        const data = await response.json();
        setMesas(data.mesas); // Certifique-se que 'mesas' é a chave correta na resposta
      } else {
        setErro("Erro ao carregar as mesas disponíveis.");
      }
    } catch (error) {
      console.error('Erro na requisição', error);
      setErro("Erro de rede ao carregar as mesas.");
    }
  };

  useEffect(() => {
    carregarMesas();
  }, []);

  // Função para alterar a mesa selecionada
  const alterarNmesa = (novoNmesa: string) => {
    const mesaSelecionada = mesas.find((mesa) => mesa.n_mesa === parseInt(novoNmesa, 10));
    if (mesaSelecionada) {
      setReserva((valoresAnteriores) => ({
        ...valoresAnteriores,
        n_mesa: mesaSelecionada.n_mesa,
        n_pessoas: mesaSelecionada.n_pessoas
      }));
    }
  };

  // Função para alterar a data da reserva
  const alterarData = (novaData: string) => {
    setReserva((valoresAnteriores) => ({
      ...valoresAnteriores,
      data_reserva: novaData
    }));
  };

  // Função para alterar o número de pessoas
  const alterarPessoas = (novaQuantPessoas: string) => {
    const newValue = parseInt(novaQuantPessoas, 10);
    if (!isNaN(newValue) && newValue >= 1 && newValue <= 50) {
      setErro(""); // Resetar erro caso o valor seja válido
      setReserva((valoresAnteriores) => ({
        ...valoresAnteriores,
        n_pessoas: newValue
      }));
    } else {
      setErro("A quantidade de pessoas deve ser entre 1 e 50!");
    }
  };

  // Função de envio do formulário de reserva
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setErro(""); // Resetar erro antes de enviar
      const response = await fetch(`${ApiURL}/mesas/reservar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          n_mesa: reserva.n_mesa,
          data_reserva: reserva.data_reserva,
          n_pessoas: reserva.n_pessoas
        })
      });

      if (response) {
        const data: ResponseSignin = await response.json();
        const { erro, mensagem, token = '' } = data;

        if (erro) {
          setErro(mensagem);
        } else {
          router.push('/');
        }
      } else {
        setErro("Erro ao tentar realizar a reserva. Tente novamente.");
      }
    } catch (error) {
      console.error('Erro na requisição', error);
      setErro("Erro de rede ou servidor. Tente novamente.");
    }
  };

  return (
    <div className={styles.paginaCadastro}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.email}>
          <h1 className={styles.titulo}>Faça a Sua Reserva de Mesa:</h1>

          <label htmlFor="n_mesa">Selecione o número da mesa:</label>
          <select
            className={styles.input}
            id="n_mesa"
            value={reserva.n_mesa}
            onChange={(e) => alterarNmesa(e.target.value)}
            required
          >
            <option value="">Selecione uma mesa</option>
            {mesas.map((mesa) => (
              <option key={mesa.id} value={mesa.n_mesa}>
                Mesa {mesa.n_mesa} - Lugares: {mesa.n_pessoas} - Tipo: {mesa.tipo}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.email}>
          <label htmlFor="data">Escolha a data para a reserva:</label>
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
          <label htmlFor="n_pessoas">Quantidade de pessoas:</label>
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

        <button type="submit" className={styles.botaoSubmit}>Confirmar Reserva</button>
        <Botao titulo="Ir para a Página de Login" botao={() => router.push('/paginaLogin')} />
      </form>
    </div>
  );
}
