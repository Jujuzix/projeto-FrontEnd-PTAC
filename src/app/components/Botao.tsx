// estilização do botão
import styles from "../styles/login.module.css"; 

//definição para o tipo de propriedades que o componente irá receber
type BotaoProp = {
    titulo: string,
    botao: () => void //função callback executada para clicar no botão
}

// declaração de componente utilizando React.FC para tipagem
const Botao: React.FC<BotaoProp> = ({titulo, botao}) => {
    return (
        <button className={styles.botao} onClick={botao}>
            {titulo}
        </button>
    );
}

//exportação do componente para reutilização em outros arquivos do projeto
export default Botao;
