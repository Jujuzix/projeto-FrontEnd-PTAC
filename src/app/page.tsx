'use client';
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles/login.module.css"; // ajuste o caminho conforme necessário

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const route = useRouter();

  
    return (
      <div className={styles.page}>
        <h1>Bem-Vindo </h1>
        
      </div>
    );
  }

