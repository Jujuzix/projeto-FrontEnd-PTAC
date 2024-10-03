'use client'
import { useState } from "react";
import Usuario from "../interfaces/usuario"

const Perfil = () => {
 const [usuario, setUsuario] = useState<Usuario>({
    nome: 'Juliana',
    idade: 17
 })

    return(
        <div>
            <p>Nome: {usuario.nome}</p>
                <p> Idade: {usuario.idade}</p>
        </div>
    )
};

export default Perfil;