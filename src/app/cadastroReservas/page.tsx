'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/cadastro.module.css";
import Botao from "../components/Botao";
import Reserva from "../interfaces/reserva";
import { ApiURL } from '../../../config';
import { parseCookies } from 'nookies';

interface ResponseSignin {
  erro: boolean;
  mensagem: string;
  token?: string;
}

interface Mesa {
  id: number;
  n_mesa: number;
  n_pessoas: number;
  tipo: string;
  data_reserva?: string;
}

export default function ReservaPage() {
  const [reserva, setReserva] = useState<Reserva>({
    n_mesa: 0,
    data_reserva: "",
    n_pessoas: 0
  });

  function filtroData() {
    const dataSelecionada = new Date()
    return dataSelecionada.toISOString().split("T")[0]
  }

  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [erro, setErro] = useState<string>("");
  const [dateTables, setDateTables] = useState(filtroData);
  const router = useRouter();

  // Função para atualizar a data da reserva no estado
  function handleChangeDate(e: ChangeEvent<HTMLInputElement>) {
    const novaData = e.target.value;
    setDateTables(novaData);
    alterarData(novaData);
  }

  // Carrega as mesas disponíveis
  const carregarMesas = async () => {
    try {
      const { 'authorization': token } = parseCookies();
      setErro("");
      const response = await fetch(`${ApiURL}/mesas/`, {
        method: "GET",
        headers: {
          "Authorization": token
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMesas(data.mesas);
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

  // Alterar o número da mesa selecionada
  const selecionarMesa = (mesaId: number) => {
    const mesaReservada = mesas.find(
      (mesa) => mesa.n_mesa === mesaId && mesa.data_reserva === dateTables
    );

    if (!mesaReservada) {
      setReserva((prevReserva) => ({
        ...prevReserva,
        n_mesa: mesaId
      }));
    } else {
      setErro("Esta mesa já está reservada para essa data.");
    }
  };

  // Alterar a data da reserva
  const alterarData = (novaData: string) => {
    setReserva((valoresAnteriores) => ({
      ...valoresAnteriores,
      data_reserva: novaData
    }));
  };

  // Enviar a reserva
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validação de dados
    if (!reserva.n_mesa || !reserva.data_reserva) {
      setErro("Por favor, selecione uma mesa e uma data.");
      return;
    }

    // Validar se a data é no futuro
    if (new Date(reserva.data_reserva) < new Date(filtroData())) {
      setErro("A data selecionada não pode ser no passado.");
      return;
    }

    setErro("");
    try {
      const { 'authorization': token } = parseCookies();
      const response = await fetch(`${ApiURL}/mesas/reservar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": token
        },
        body: JSON.stringify(reserva)
      });

      if (response.ok) {
        const data: ResponseSignin = await response.json();
        const { erro, mensagem = '' } = data;
        if (erro) {
          setErro(mensagem);
        } else {
          router.push('/'); // Redirecionar para a página inicial
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

          <div className={styles.email}>
            <label htmlFor="data">Escolha a data para a reserva:</label>
            <input
              className={styles.input}
              type="date"
              id="data"
              value={dateTables}
              min={filtroData()}
              onChange={handleChangeDate}
              required
            />
          </div>

          <label htmlFor="n_mesa">Selecione uma mesa:</label>
          <div className="">
            {mesas.map((table) => {
              const mesaReservada = mesas.find(
                (tableReserva) => tableReserva.data_reserva === dateTables && tableReserva.n_mesa === table.n_mesa
              );
              const isDisabled = mesaReservada !== undefined;

              return (
                <button
                  key={table.id}
                  onClick={() => selecionarMesa(table.n_mesa)}
                  disabled={isDisabled}
                >
                  <h1>Mesa: {table.n_mesa}</h1>
                  <h2>Numero de pessoas: {table.n_pessoas}</h2>
                  {isDisabled && <p>Reservada</p>}
                </button>
              );
            })}
          </div>
        </div>

        <div >
          {reserva.n_mesa ? (
            <div>
              <h2 >Reservar Mesa {reserva.n_mesa}</h2>
              <label>
                Data:
                <input
                  type="date"
                  value={reserva.data_reserva}
                  min={filtroData()}
                  onChange={(e) => alterarData(e.target.value)}
                />
              </label>
            </div>
          ) : (
            <p>Selecione uma mesa para reservar</p>
          )}
        </div>

        {erro && <p className={styles.msgErro}>{erro}</p>}

        <button type="submit" className={styles.botaoSubmit}>Confirmar Reserva</button>
        <Botao titulo="Ir para a Página de Login" botao={() => router.push('/paginaLogin')} />
      </form>
    </div>
  );
}
