'use client';

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.css";
import Usuario from "../interfaces/usuario";
import { setCookie, parseCookies } from 'nookies';
import Botao from "../components/Botao";
import { ApiURL } from "../config";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    const usuarioLogado = localStorage.getItem('usuario');
    if (usuarioLogado) {
      console.log(usuarioLogado);
      router.push('/');
    }
  }, [router]);

  useEffect(()=> {
    const {'restaurant-token' : token} = parseCookies()
    if (token){
      router.push('/')
    }
  }, [router]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('https://prof-jeferson.github.io/API-reservas/usuarios.json');
      if (!response.ok) {
        setErro("Erro ao buscar usuários.");
        return;
      }

      const usuarios = await response.json();
      const usuarioConvertido: Usuario[] = usuarios as Usuario[];

      const user = usuarioConvertido.find((user) => user.email === email && user.password === password);
      if (user) {
        localStorage.setItem('usuario', JSON.stringify(user)); 
        router.push("/");
      } else {
        setErro("Usuário não encontrado.");
      }
    } catch (error) {
      setErro("Ocorreu um erro ao fazer login.");
      console.error(error);
    }
  };

  const  handleSubmit = async (e :FormEvent) => {
    e.preventDefault();
    try {

      const response = await fetch(`${ApiURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({email, password})
      })
  
      if (response){
        const data = await response.json();
        const {erro, mensagem, token} = data
        console.log(data)
        if (erro){
         setErro(mensagem)
        } else {
          setCookie(undefined, 'restaurant-token', token, {
            maxAge: 60*60*1 //1 hora
          })
          router.push('/')
        }
      }
    } catch (error) {
      console.error('Erro na requisicao', error)
    }

    console.log('Email:', email);
    console.log('Senha:', password);
  };
  

  return (
    <div className={styles.paginaLogin}>
      <form onSubmit={onSubmit} className={styles.form}>
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