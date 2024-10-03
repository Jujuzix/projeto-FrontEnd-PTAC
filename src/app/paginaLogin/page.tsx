'use client';
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.css"; 
import { error } from "console";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  //Manipulador de Eventos para formulario de login dentro de uma aplicação.
  const handleLogin = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();//preve o cancelamento de algum evento.
    if(email === 'email111@gmail.example.com' && senha ==='senha123'){
        router.push('/') // verificação das credenciais para entrar dentro da pagina principal.
    } else{
        setErro ("Email ou Senha Inválidos.") //se a verificação tiver erro, retornará esta mensagem. 
    }
  }

    return (
      <div className={styles.paginaLogin}>
          <h1 className={styles.titulo}>Faça seu Login</h1>
          <form onSubmit={handleLogin}>
            <div className={styles.email}>
              <label htmlFor="email">Insira seu E-mail:</label>
              <input className={styles.input} type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /> 
            </div>

            <div className={styles.senha}>
              <label htmlFor="senha">Insira a sua Senha:</label>
              <input className={styles.input} type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            {erro && <p className={styles.msgErro}>{erro}</p>}
              <button type="submit" className={styles.botao}>Efetuar Login</button>
          </form>
      </div>
    ); 
  }

