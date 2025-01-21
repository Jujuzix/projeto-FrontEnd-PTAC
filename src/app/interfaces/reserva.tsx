   //definição da interface de mesa, para a definição da estrutura de dados
   interface Reserva{
    n_mesa: number, // numero da mesa
    data_reserva: string, // data de reserva
    n_pessoas: number, // quantidade de pessoas
    n_pessoas_sentando: number // quantidade de pessoas sentadas na mesa
}

//exporta interface
export default Reserva;