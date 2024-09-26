type botaoProp = {
    titulo: string,
    botao: () => void
}    

const Botao: React.FC<botaoProp> = ({titulo, botao}) => {
       return( <button onClick={botao}>{titulo} </button>
    );
}

export default Botao;