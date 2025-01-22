'use client';

//importações utilizadas
import { FormEvent, useState, useEffect } from "react"; //hooks para eventos e estado
import { useRouter } from "next/navigation"; //hook para navegação de rotas
import styles from "../styles/login.module.css"; //estilização página
import { setCookie, parseCookies } from 'nookies'; //biblioteca para acesso ao cookies, utilizada para fazer autenticação
import Botao from "../components/Botao"; // importação da interface para a estruturação de "usuario"
import { ApiURL } from '../../../config'; // URL da api definida em um arquivo para configurações

//interface de definição do formato de resposta que API deve trazer
interface ResponseSignin {
  erro: boolean,
  mensagem: string,
  token?: string
}

export default function Login() {
  const [email, setEmail] = useState(""); //estado para armazenamento de e-mail
  const [password, setPassword] = useState(""); //estado para armazenamento de senha
  const [erro, setError] = useState(""); //estado para armazenamento de mensagem de erro
  const router = useRouter();

  //hook que de verificação se o usuario está autenticado ao carregar componente
  useEffect(() => {
    const { 'authorization': token } = parseCookies(); // token de autenticação armazenado ao cookies
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      //requisição POST para API de autenticação
      const response = await fetch(`${ApiURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' //definição para tipo de conteudo em JSON
        },
        body: JSON.stringify({ email, password })
      })
      console.log(response)
      if (response) {
        const data: ResponseSignin = await response.json() // conversão de resposta da API ao JSON
        const { erro, mensagem, token = '' } = data; // desesturação de dados retornados
        console.log(data)
        if (erro) {
          setError(mensagem)
        } else {
          setCookie(undefined, 'authorization', token, {
            maxAge: 60 * 60 * 1
          })
          router.push('/')
        }
      } else {

      }
    }
    catch (error) {
      console.error('Erro na requisicao', error)
    }
  }


  return (
    <div className={styles.paginaLogin}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.titulo}>Faça seu Login</h1>

        <div className={styles.email}>
          <label htmlFor="email">Insira seu E-mail:</label>
          <input
            className={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.senha}>
          <label htmlFor="senha">Insira a sua Senha:</label>
          <input
            className={styles.input}
            type="password"
            id="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {erro && <p className={styles.msgErro}>{erro}</p>}
        <button type="submit" className={styles.botaoSubmit}>Efetuar Login</button>

        <Botao titulo="Ir para Página de Cadastro" botao={() => router.push('/paginaCadastro')} />
      </form>
    </div>
  );
}
