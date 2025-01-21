'use client';

//importações utilizadas
import { FormEvent, useState } from "react"; //hooks para eventos e estado
import { useRouter } from "next/navigation"; //hook para navegação de rotas
import styles from "../styles/cadastro.module.css"; //estilização página
import Botao from "../components/Botao"; //componente para personalização de botão
import { ApiURL } from '../../../config'; // URL da api definida em um arquivo para configurações
import Mesa from "../interfaces/mesa"; // importação da interface para a estruturação de "mesa"
import { parseCookies } from "nookies"; //biblioteca para acesso ao cookies, utilizada para fazer autenticação

//interface de definição do formato de resposta que API deve trazer
interface ResponseSignin {
  erro: boolean; //tratamento de erro
  mensagem: string; //mensagem de sucesso ou erro
  token?: string; //token de autenticação
}

//componente página de cadastro de mesas
export default function MesaPage() {
  //estado inicial para armazenamento de dados
  const [mesa, setMesa] = useState<Mesa>({
    id: 0,
    n_mesa: 0,
    n_pessoas: 0,
    n_lugares: 0,
    tipo: '',
  });

  const [erro, setErro] = useState<string>(""); //estado de armazenamento de mensagens de erro
  const [carregando, setCarregando] = useState<boolean>(false);  //estado de controle de carregamento
  const router = useRouter(); //hook para navegação de rotas

  const alterarNmesa = (novoNmesa: string) => {
    const newNmesa = parseInt(novoNmesa); //converção de valor para número inteiro
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

  //tratamento de envio de formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); //evita comportamento padão do formulário
    setCarregando(true); //defnição de estado de carregamento em true
    try {
      const { 'authorization': token } = parseCookies(); //obtem token de autenticação dos cookies

      //requisição a API para cadastro de mesa
      const response = await fetch(`${ApiURL}/mesas/cadastrar`, {
        method: 'POST', //método HTTP
        headers: {
          'Content-Type': 'application/json', //conteúdo da requisição
          'Authorization': token //token de autenticação
        },
        body: JSON.stringify({
          n_mesa: mesa.n_mesa,
          n_pessoas: mesa.n_pessoas, 
          tipo: mesa.tipo
        }),
      });

      //tratamento de resposta da API
      if (response) { 
        const data: ResponseSignin = await response.json();
        const { erro, mensagem } = data;

        if (erro) {
          setErro(mensagem); //mensagem de erro caso precise ser retornado
        } else {
          router.push('/'); // redirecionamento para página principal 
        }
      } else {
        setErro("Erro ao tentar cadastrar. Tente novamente."); 
      }
    } catch (error) {
      console.error('Erro na requisição', error);
      setErro("Erro de rede ou servidor. Tente novamente."); // mensagem caso a requisição falhe
    } finally {
      setCarregando(false); //definição de estado de carregamento para false
    }
  };

  return (
    <div className={styles.paginaCadastro}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* campo para informar número da mesa escolhida */}
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
        
        {/* campo para informação sobre número de lugares em mesa */}
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

        {/* retorno de mensagem de erro */}
        {erro && <p className={styles.msgErro}>{erro}</p>} 

        {/* submissão de formulário */}
        <button type="submit" className={styles.botaoSubmit} disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Efetuar o seu cadastro de mesa'}
        </button>
        {/* redirecionamento para página de login */}
        <Botao titulo="Ir para Página de Login" botao={() => router.push('/paginaLogin')} />
      </form>
    </div>
  );
}
