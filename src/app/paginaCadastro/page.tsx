'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.css"; 
import Botao from "../components/Botao";
import Usuario from "../interfaces/usuario";

export default function Cadastro() {
  const [nome, setNome] = useState<string>("");
  const [email1, setEmail1] = useState<string>("");
  const [email2, setEmail2] = useState<string>("");
  const [idade, setIdade] = useState<number | "">(""); 
  const [senha1, setSenha1] = useState<string>("");
  const [senha2, setSenha2] = useState<string>("");
  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    email: '',
    password: '',
  });
  const [erro, setErro] = useState("");
  const router = useRouter();

const alterarNome = (novoNome: string) => {
  setUsuario((valoresAnteriores)=> ({
    ...valoresAnteriores,
    nome:novoNome
  }))
  console.log(usuario)
}

  /*const handleCadastro = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email1 === email2 && password1 === password2) {
      // Aqui você pode adicionar a lógica para cadastrar o usuário
      router.push('/'); 
    } else {
      setErro("Email ou Senha Inválido"); 
    }
  };*/

  return (
    <div className={styles.paginaLogin}>
      <h1 className={styles.titulo}>Faça seu Cadastro</h1>
      <form>
        <div className={styles.nome}>
          <label htmlFor="nome">Insira seu Nome:</label>
          <input
            className={styles.input}
            type="text"
            id="nome"
            value={usuario.nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className={styles.email}>
          <label htmlFor="email1">Insira seu E-mail:</label>
          <input
            className={styles.input}
            type="email"
            id="email1"
            value={usuario.email}
            onChange={(e) => setEmail1(e.target.value)}
            required
          />
        </div>

        <div className={styles.email2}>
          <label htmlFor="email2">Insira seu E-mail Novamente:</label>
          <input
            className={styles.input}
            type="email"
            id="email2"
            value={usuario.email}
            onChange={(e) => setEmail2(e.target.value)}
            required
          />
        </div>

        <div className={styles.senha}>
          <label htmlFor="senha1">Insira a sua Senha:</label>
          <input
            className={styles.input}
            type="password"
            id="senha1"
            minLength={8}
            value={usuario.password}
            onChange={(e) => setSenha1(e.target.value)}
            required
          />
        </div>

        <div className={styles.senha2}>
          <label htmlFor="senha2">Insira a sua Senha Novamente:</label>
          <input
            className={styles.input}
            type="password"
            id="senha2"
            minLength={8}
            value={usuario.password}
            onChange={(e) => setSenha2(e.target.value)}
            required
          />
        </div>

        {erro && <p className={styles.msgErro}>{erro}</p>}
        
        <Botao titulo="Efetuar Cadastro" botao={() => router.push('/')} />
        <Botao titulo="Ir para Pagina Login" botao={() => router.push('/paginaLogin')} />
      </form>
    </div>
  ); 
}