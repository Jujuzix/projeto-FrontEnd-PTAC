//definição da interface de mesa, para a definição da estrutura de dados
interface Usuario{
    id?: number, // código de usuario, se necessario
    nome: string, // nome de usuario
    email?: string, // email se necessario
    password?: string, // senha 
    tipo?: string  // categoria para definição
}


 //exporta interface
export default Usuario;