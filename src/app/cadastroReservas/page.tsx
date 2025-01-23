"use client";

//importações utilizadas
import { ChangeEvent, FormEvent, useEffect, useState } from "react"; //hooks de eventos e gerenciamento de estado
import { useRouter } from "next/navigation"; //hook para navegação de rotas
import styles from "../styles/cadastro.module.css"; //estilização da página
import Botao from "../components/Botao"; //componente para personalização de botão
import Reserva from "../interfaces/reserva"; //importação da interface para a estruturação de "reserva"
import { ApiURL } from "../../../config";// URL da api definida em um arquivo para configurações
import { parseCookies } from "nookies"; //biblioteca para acesso ao cookies, utilizada para fazer autenticação

//interface de definição do formato de resposta que API deve trazer
interface ResponseSignin {
  erro: boolean;
  mensagem: string;
  token?: string;
}

//interface de definição para formato de mesa
interface Mesa {
  id: number;
  n_mesa: number;
  n_pessoas: number;
  tipo: string;
  data_reserva?: string;
}

//componente página de cadastro de mesas
export default function ReservaPage() {

  //estado inicial para armazenamento de dados da reserva adicionada
  const [reserva, setReserva] = useState<Reserva>({
    id: 0,
    n_mesa: 0,
    data_reserva: filtroData(),
    n_pessoas: 0, 
    n_pessoas_sentando: 0, 
  });

  //função para obter data atual no formato (YYY-MM-DD)
  function filtroData() {
    const dataSelecionada = new Date();
    return dataSelecionada.toISOString().split("T")[0];
  }

  const [mesas, setMesas] = useState<Mesa[]>([]); //estado de armazenamento para lista de mesas disponíveis
  const [erro, setErro] = useState<string>(""); //estado para armazenamento de mensagens de erro
  const [dateTables, setDateTables] = useState(filtroData); //estado para gerenciar datas de reservas
  const router = useRouter(); // hook de rotas

  //função para carregamento de mesas disponíveis pela API
  const carregarMesas = async () => {
    try {
      const { authorization: token } = parseCookies(); //token de autenticação dos cookies
      setErro("");
      const response = await fetch(`${ApiURL}/mesas/`, {
        method: "GET", // método HTTP GET para obter mesas
        headers: {
          Authorization: token, //passa token ao cabeçalho
        },
      });

      if (response) {
        const data = await response.json(); //converção de resposta em JSON
        setMesas(data.mesas); //atualização de lista de mesas
      } else {
        setErro("Erro ao carregar as mesas disponíveis."); //mensagem e erro
      }
    } catch (error) {
      console.error("Erro na requisição", error);
      setErro("Erro de rede ao carregar as mesas.");
    }
  };

  //hook para carregamento de mesas ao montar o componente
  useEffect(() => {
    carregarMesas();
  }, []);

  //função para seleção de mesa para reserva
  const selecionarMesa = (mesaId: number) => {

    // verificação de mesas reservadas para a data de escolha
    const mesaReservada = mesas.find(
      (mesa) => mesa.n_mesa === mesaId && mesa.data_reserva === dateTables
    );

    if (!mesaReservada) {

      //encontro de mesa selecionada na lista
      const mesaSelecionada = mesas.find((mesa) => mesa.n_mesa === mesaId);

      //atualização de estado da reserva com os dados da mesa selecionada
      setReserva((prevReserva) => ({
        ...prevReserva,
        n_mesa: mesaId,
        n_pessoas: mesaSelecionada?.n_pessoas || 0,
        n_pessoas_sentando: 0, //reseta numero de pessoas sentada
      }));
    } else {
      setErro("Esta mesa já está reservada para essa data.");
    }
  };

  // função para alteração da data de reserva
  const alterarData = (novaData: string) => {
    setReserva((valoresAnteriores) => ({
      ...valoresAnteriores,
      data_reserva: novaData, // atualização de data no estado da reserva
    }));
    console.log('Reserva após alteração de data:', reserva); // Log dos dados 
  };

  //função para tratamento de mudança em data 
  function handleChangeDate(e: ChangeEvent<HTMLInputElement>) {
    const novaData = e.target.value;
    setDateTables(novaData); // atualização de estado da data
    alterarData(novaData); //chama função para atualizar o estado de reserva
  }

  //requisição a API para cadastro de reserva
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Verificando e validando os dados antes de enviar
    console.log('Dados de reserva antes de enviar:', reserva);

    if (!reserva.n_mesa || !reserva.data_reserva || !reserva.n_pessoas_sentando) {
      setErro("Por favor, selecione uma mesa, uma data e informe a quantidade de pessoas.");
      return;
    }

    if (new Date(reserva.data_reserva) < new Date(filtroData())) {
      setErro("A data selecionada não pode ser no passado.");
      return;
    }

    if (!reserva.n_pessoas_sentando || reserva.n_pessoas_sentando > reserva.n_pessoas) {
      setErro("Por favor, informe uma quantidade válida de pessoas que vão sentar.");
      return;
    }

    setErro("");
    try {
      const { authorization: token } = parseCookies();
      const response = await fetch(`${ApiURL}/mesas/reservar`, {
        method: "POST", //metodo HTTP POST para envio de reserva
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(reserva), // redirecionamento para página principal 
      });

      if (response.ok) {
        const data: ResponseSignin = await response.json();
        const { erro, mensagem = "" } = data;
        if (erro) {
          setErro(mensagem);
        } else {
          router.push("/");
        }
      } else {
        setErro("Erro ao tentar realizar a reserva. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na requisição", error);
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

          <div className="">
  {mesas && mesas.length > 0 ? (
    mesas.map((table) => {
      const isReserved = table.data_reserva === dateTables;
      return (
        <button
          key={table.id}
          onClick={() => selecionarMesa(table.n_mesa)}
          disabled={isReserved}
        >
          <h1>Mesa: {table.n_mesa}</h1>
          <h2>Capacidade: {table.n_pessoas} pessoas</h2>
          {isReserved && <p>Reservada</p>}
        </button>
      );
    })
  ) : (
    <p>Nenhuma mesa disponível.</p>
  )}
</div>

        </div>

        <div>
          {reserva.n_mesa ? (
            <div>
              <h2>Reservar Mesa {reserva.n_mesa}</h2>
              <h2>Capacidade para {reserva.n_pessoas} pessoas</h2>
              <label>
                Quantidade de pessoas que vão sentar:
                <input
                  type="number"
                  min={1}
                  max={reserva.n_pessoas}
                  value={reserva.n_pessoas_sentando || 0}
                  onChange={(e) => {
                    const quantidade = Math.min(
                      Math.max(1, Number(e.target.value)),
                      reserva.n_pessoas
                    );
                    setReserva((prev) => ({
                      ...prev,
                      n_pessoas_sentando: quantidade,
                    }));
                  }}
                />
              </label>
            </div>
          ) : (
            <p>Selecione uma mesa para reservar</p>
          )}
        </div>

        {erro && <p className={styles.msgErro}>{erro}</p>}

        <button type="submit" className={styles.botaoSubmit}>
          Confirmar Reserva
        </button>
        <Botao
          titulo="Ir para a Página de Login"
          botao={() => router.push("/paginaLogin")}
        />

        <Botao 
        titulo="Veja todas as reservas disponíveis"
        botao={() => router.push("/listaReservas")}
          />
      </form>
    </div>
  );
}
