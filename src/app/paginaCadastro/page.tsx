'use client';

//importações utilizadas
import { FormEvent, useState, useEffect } from "react"; //hooks para eventos e estado
import { useRouter } from "next/navigation"; //hook para navegação de rotas
import styles from "../styles/cadastro.module.css"; //estilização página
import Botao from "../components/Botao"; //componente para personalização de botão
import Usuario from "../interfaces/usuario";// importação da interface para a estruturação de "usuario"
import { ApiURL } from '../../../config'; // URL da api definida em um arquivo para configurações
import { setCookie, parseCookies } from 'nookies';//biblioteca para acesso ao cookies, utilizada para fazer autenticação

//interface de definição do formato de resposta que API deve trazer
interface ResponseSignin {
  erro: boolean,
  mensagem: string,
  token?: string
}

export default function Cadastro() {

  //estado para armazenamento de dados 
  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    email: '',
    password: '',
  });
  const [erro, setError] = useState("");
  const router = useRouter(); //hook de navegação

  
  const alterarNome = (novoNome: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      nome: novoNome
    }));
  };

  const alterarEmail = (novoEmail: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      email: novoEmail
    }));
  };

  const alterarSenha = (novaSenha: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      password: novaSenha
    }));
  };


  useEffect(() => {
    const { 'authorization': token } = parseCookies();
    if (token) {
      router.push('/');
    }
  }, [router]);

  const  handleSubmit = async (e : FormEvent) => {
    e.preventDefault();
    try {
     const response = await fetch(`${ApiURL}/auth/cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({nome: usuario.nome,email: usuario.email, password: usuario.password})
     })
      if (response){
        const data : ResponseSignin = await response.json()
        const {erro, mensagem, token = ''} = data;
        console.log(data)
        if (erro){
          setError(mensagem)
        } else {
          // npm i nookies setCookie
          setCookie(undefined, 'authorization', token, {
            maxAge: 60*60*1 // 1 hora
          } )

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
    <div className={styles.paginaCadastro}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.nome}>
          <h1 className={styles.titulo}>Faça seu Cadastro</h1>
          <label htmlFor="nome">Insira seu Nome:</label>
          <input
            className={styles.input}
            type="text"
            id="nome"
            value={usuario.nome}
            onChange={(e) => alterarNome(e.target.value)}
            required
          />
        </div>

        <div className={styles.email}>
          <label htmlFor="email">Insira seu E-mail:</label>
          <input
            className={styles.input}
            type="email"
            id="email"
            value={usuario.email}
            onChange={(e) => alterarEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.senha}>
          <label htmlFor="senha">Insira a sua Senha:</label>
          <input
            className={styles.input}
            type="password"
            id="senha"
            minLength={8}
            value={usuario.password}
            onChange={(e) => alterarSenha(e.target.value)}
            required
          />
        </div>

        {erro && <p className={styles.msgErro}>{erro}</p>}

        <button type="submit" className={styles.botaoSubmit}>Efetuar Cadastro</button>
        <Botao titulo="Ir para Página de Login" botao={() => router.push('/paginaLogin')} />
      </form>
    </div>
  );
}
