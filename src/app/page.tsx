'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles/page.module.css";
import Botao from "./components/Botao";

export default function Home() {
  const [user, setUser] = useState(true);
  const route = useRouter();

  if (user) {
    return (
      <div className={styles.page}>
        <h1 className={styles.titulo}>Bem-Vindo ao Restaurante!</h1>
        <p className={styles.mensagem}>
          Estamos felizes em tê-lo aqui. Escolha uma das opções abaixo para continuar.
        </p>
        <div className={styles.botoesContainer}>
          <Botao titulo="Ir para Página de Login" botao={() => route.push('/paginaLogin')} />
          <Botao titulo="Faça o seu Cadastro" botao={() => route.push('/paginaCadastro')} />
          <Botao titulo="Faça reserva de sua Mesa" botao={() => route.push('/paginacadMesas')} />
        </div>
      </div>
    );
  }
}