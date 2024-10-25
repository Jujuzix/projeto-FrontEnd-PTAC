import styles from "../styles/login.module.css"; 

type BotaoProp = {
    titulo: string,
    botao: () => void
}

const Botao: React.FC<BotaoProp> = ({titulo, botao}) => {
    return (
        <button className={styles.botao} onClick={botao}>
            {titulo}
        </button>
    );
}

export default Botao;
// inultio isso