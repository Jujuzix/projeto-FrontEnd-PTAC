"use client";

// Importações necessárias
import { useEffect, useState } from "react"; //hooks de eventos e gerenciamento de estado
import { useRouter } from "next/navigation"; //hook para navegação de rotas
import styles from "../styles/cadastro.module.css"; //estilização da página
import { ApiURL } from '../../../config';  // URL da api definida em um arquivo para configurações
import { parseCookies } from "nookies"; // para parsear cookies

interface Reserva {
  id: number;
  n_mesa: number;
  data_reserva: string;
  n_pessoas: number;
  n_pessoas_sentando: number;
}

export default function ListaReserva() {
  // Estados para armazenar as reservas e mensagens de erro
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [erro, setErro] = useState<string>("");
  const router = useRouter();

  // Função para carregar as reservas da API
  const carregarReservas = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.authorization; // Obtém o token do cookie

      if (!token) {
        setErro("Usuário não autenticado. Faça login para continuar.");
        router.push("/login"); // Redireciona para a página de login
        return;
      }

      // Limpa o erro antes de realizar a requisição
      setErro("");

      // Requisição GET para buscar as reservas
      const response = await fetch(`${ApiURL}reserva`, { 
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}` 
        },
      });

      if (!response.ok) {
        const errorMessage =
          response.status === 401
            ? "Sua sessão expirou. Faça login novamente."
            : "Erro ao carregar as reservas. Tente novamente.";
        setErro(errorMessage);
        if (response.status === 401) router.push("/login"); // Redireciona para login se o token for inválido
        return;
      }

      const data = await response.json();

      if (data && Array.isArray(data.reservas)) {
        setReservas(data.reservas); 
      } else {
        setErro("Nenhuma reserva encontrada.");
        setReservas([]);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErro("Erro de rede ao carregar as reservas. Tente novamente."); // Mensagem de erro genérica
    }
  };

  // useEffect para carregar as reservas quando o componente for montado
  useEffect(() => {
    carregarReservas();
  }, []);

  return (
    <div className={styles.paginaCadastro}>
      <h1 className={styles.titulo}>Veja aqui as reservas cadastradas!</h1>

      {/* Exibe mensagem de erro, se houver */}
      {erro && <p className={styles.erro}>{erro}</p>}

      {/* Exibe a lista de reservas ou mensagem caso não existam */}
      {reservas.length > 0 ? (
        <ul className={styles.listaReservas}>
          {reservas.map((reserva) => (
            <li key={reserva.id} className={styles.itemReserva}>
              <strong>ID:</strong> {reserva.id} -{" "}
              <strong>Mesa:</strong> {reserva.n_mesa} -{" "}
              <strong>Data da Reserva:</strong>{" "}
              {new Date(reserva.data_reserva).toLocaleString()} -{" "}
              <strong>Quant. Pessoas:</strong> {reserva.n_pessoas} -{" "}
              <strong>Sentando:</strong> {reserva.n_pessoas_sentando}
            </li>
          ))}
        </ul>
      ) : (
        !erro && <p className={styles.semReservas}>Nenhuma reserva encontrada.</p>
      )}
    </div>
  );
}
