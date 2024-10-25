'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/cadastro.module.css";
import Botao from "../components/Botao";
import Usuario from "../interfaces/usuario";

export default function Cadastro() {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    email: '',
    password: '',
  });
  const [erro, setErro] = useState("");
  const router = useRouter();

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

  return (
    <div className={styles.paginaCadastro}>
      <form className={styles.form}>
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
