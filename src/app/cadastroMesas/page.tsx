'use client';


import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/cadastro.module.css";
import Botao from "../components/Botao";
import Usuario from "../interfaces/usuario";
import { ApiURL } from '../../../config';
import { setCookie, parseCookies } from 'nookies';

interface ResponseSignin {
  erro: boolean,
  mensagem: string,
  token?: string
}

export default function Cadastro() {
    const alterarquantPessoas = (value: string) => {
        let newValue = parseInt(value, 10);  
      
    
        if (newValue > 50) {
          alert("A quantidade de pessoas não pode ser superior a 50!");  
          newValue = 50; 
        }
      
        
        setUsuario({
          ...usuario,
          quantPessoas: newValue,
        });
      };
      



  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    data: '',
    quantPessoas: '',
  });
  const [erro, setError] = useState("");
  const router = useRouter();

  const alterarNome = (novoNome: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      nome: novoNome
    }));
  };

  const alterarData = (novaData: date) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      data: novaData
    }));
  };

  const alterarPessoas = (novaquantPessoas: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      quantPessoas: novaquantPessoas
    }));
  };


  useEffect(() => {
    const { 'restaurant-token': token } = parseCookies();
    if (token) {
      router.push('/');
    }
  }, [router]);

  const  handleSubmit = async (e : FormEvent) => {
    e.preventDefault();
    try {
     const response = await fetch(`${ApiURL}/auth/cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({nome: usuario.nome,data: usuario.data, quantPessoas: usuario.quantPessoas})
     })
      if (response){
        const data : ResponseSignin = await response.json()
        const {erro, mensagem, token = ''} = data;
        console.log(data)
        if (erro){
          setError(mensagem)
        } else {
          // npm i nookies setCookie
          setCookie(undefined, 'restaurant-token', token, {
            maxAge: 60*60*1 // 1 hora
          } )

          router.push('/')

        }
      } else {

      }
  } 
    catch (error) {
    console.error('Erro na requisicao', error)
  }
}

  return (
    <div className={styles.paginaCadastro}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.nome}>
          <h1 className={styles.titulo}>Faça a Sua Reserva de Mesa:</h1>
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
          <label htmlFor="data">Insira a Data para utilização da mesa:</label>
          <input
            className={styles.input}
            type="date"
            id="data"
            value={usuario.data}
            onChange={(e) => alterarData(e.target.value)}
            required
          />
        </div>

        <div className={styles.senha}>
          <label htmlFor="quantPessoas">Insira a Quantidade de Pessoas que irá ocupar a mesa:</label>
          <input
            className={styles.input}
            type="number"
            id="quantPessoas"
            min="1"
            max="50"
            value={usuario.quantPessoas}
            onChange={(e) => alterarquantPessoas(e.target.value)}
            required
          />
        </div>

        {erro && <p className={styles.msgErro}>{erro}</p>}

        <button type="submit" className={styles.botaoSubmit}>Efetuar a sua Reserva</button>
        <Botao titulo="Ir para Página de Login" botao={() => router.push('/paginaLogin')} />
      </form>
    </div>
  );
}
