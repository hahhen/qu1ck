import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request) {
    //Inicialização Supabase
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    //Recupera os itens da requisição feita pelo chatbot
    const requestBody = await request.json()

    //Leitura do estoque
    const {data: estoque} = await supabase.from('estoque').select('quantidade, id')

    //Verifica se há algum ingrediente na requisição com quantidade superior às quantidades disponíveis no estoque
    const notEnoughIngredients = requestBody.ingredientes.some((ingrediente) => {
        ingrediente.quantidade > estoque.find((item) => item.id === ingrediente.id).quantidade
    })

    //Retorna false se houver ingredientes suficientes para a requisição, true caso contrário
    return Response.json({ notEnoughIngredients })
}