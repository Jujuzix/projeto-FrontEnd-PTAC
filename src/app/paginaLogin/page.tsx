'use client';
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.css";
import Usuario from "../interfaces/usuario";
import Botao from "../components/Botao";
import { error } from "console";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  /*const [user, setUser] = useState(true);*/
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await fetch('https://prof-jeferson.github.io/API-reservas/usuarios.json')
      if (!response) {
        console.log("Erro ao Buscar")
      }
      const usuarios = await response.json();
const usuarioConvertido: Usuario[] = usuarios as Usuario[]

      if (!usuarios) {
        console.log("Erro ao Buscar")
      }
      else {
        const user = usuarioConvertido.find((user) => user.email === email && user.password === senha)
        if(user){
          router.push("/")
        }else{
          console.log("usuario n encontrado")
        }
        console.log(user)
      }
    } catch {

    }
  }

  return (
    <div className={styles.paginaLogin}>
      <h1 className={styles.titulo}>Faça seu Login</h1>
      <form onSubmit={onSubmit}>
        <div className={styles.email}>
          <label htmlFor="email">Insira seu E-mail:</label>
          <input className={styles.input} type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className={styles.senha}>
          <label htmlFor="senha">Insira a sua Senha:</label>
          <input className={styles.input} type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        {erro && <p className={styles.msgErro}>{erro}</p>}
        <button type="submit">Efetuar Login</button>
        <Botao titulo="Ir para Pagina de Cadastro" botao={() => router.push('/paginaCadastro')} />
      </form>
    </div>
  );
}
