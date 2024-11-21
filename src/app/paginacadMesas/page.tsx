'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/reserva.module.css"
import Botao from "../components/Botao";

export default function Home() {
  const [user, setUser] = useState(true);
  const route = useRouter();

  if (user) {
    return (
      <div className={styles.page}>
        <h1 className={styles.titulo}>Bem-Vindo a Página de Cadastro de Mesas!</h1>
        <p className={styles.mensagem}>
          Para salvar a sua Reserva, Clique abaixo para dar continuidade a este Cadastro.
        </p>
        <div className={styles.botoesContainer}>
          <Botao titulo="Faça reserva de sua Mesa" botao={() => route.push('/cadastroMesas')} />
          <Botao titulo="Voltar para Página Inicial" botao={() => route.push('/')} />
        </div>
      </div>
    );
  }
}