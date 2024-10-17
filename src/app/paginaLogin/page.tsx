'use client';
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.css"; 
import Botao from "../components/Botao";
import { error } from "console";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [user, setUser] = useState(true);
  const router = useRouter();

  
  const handleLogin = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(email === 'email111@gmail.example.com' && senha ==='senha123'){
    } else{
        setErro ("Email ou Senha Inválido ") 
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
            <Botao titulo="Efetuar Login" botao={() => router.push('/')}/>
            <Botao titulo="Ir para Pagina de Cadastro" botao={() => router.push('/paginaCadastro')}/>
          </form>
      </div>
    ); 
  }

