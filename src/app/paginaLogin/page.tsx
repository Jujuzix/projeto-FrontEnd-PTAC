'use client';

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.css";
import { setCookie, parseCookies } from 'nookies';
import Botao from "../components/Botao";
import { ApiURL } from '../../../config';

interface ResponseSignin {
  erro: boolean,
  mensagem: string,
  token?: string
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const { 'authorization': token } = parseCookies();
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${ApiURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      console.log(response)
      if (response) {
        const data: ResponseSignin = await response.json()
        const { erro, mensagem, token = '' } = data;
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
