'use client';
//importações para funcionamento de componentes
import { useState } from "react"; //hook para gerenciamento de estado
import { useRouter } from "next/navigation"; //hook para rota Next.js
import styles from "./styles/page.module.css"; //estilização para página
import Botao from "./components/Botao"; //componente para personalização de botão

//componente de página principal
export default function Home() {

  //user (estado atual)
  //setUser (função utilizada para atualizar este estado)
  const [user, setUser] = useState(true);

  //variável para utilização de hook de rotas
  const route = useRouter();

  // somente será renderizado conteúdo se o user será true
  //caso o user seja false, não terá renderização
  if (user) {
    return (
      <div className={styles.page}>
        <h1 className={styles.titulo}>Bem-Vindo ao Restaurante!</h1>
        <p className={styles.mensagem}>
          Estamos felizes em tê-lo aqui. Escolha uma das opções abaixo para continuar.
        </p>
        <div className={styles.botoesContainer}>
          <Botao titulo="Faça o seu Cadastro" botao={() => route.push('/paginaCadastro')} />
          <Botao titulo="Ir para Página de Login" botao={() => route.push('/paginaLogin')} />
          <Botao titulo="Cadastro Mesa" botao={() => route.push('/cadastroMesas')} />
          <Botao titulo="Faça reserva de sua Mesa" botao={() => route.push('/cadastroReservas')} />
        </div>
      </div>
    );
  }
}