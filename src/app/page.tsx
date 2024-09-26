'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles/page.module.css"; // ajuste o caminho conforme necessário
import Botao from "./components/botao";

export default function Home() {
  const [user, setUser] = useState(true);
  const route = useRouter();

  if (user) {
    return (
      <div className={styles.page}>
        <h1>Bem-Vindo a Página Principal :)</h1>
        <br/>
        <Botao titulo="Ir para Pagina Login" botao={() => route.push('/paginaLogin')}/>
      </div>
    );
  }
}