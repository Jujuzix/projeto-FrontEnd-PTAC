//definição da interface de mesa, para a definição da estrutura de dados
interface Mesa {
    id: number; // código único da mesa       
    n_mesa: number; //número da mesa
    n_lugares: number; //número de lugares
    n_pessoas: number; //quantidade de pessoas
    tipo: string;  // categoria 
  }
  
  //exporta interface
  export default Mesa;
  