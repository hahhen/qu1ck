import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const requestBody = await request.json()

    const {data: estoque} = await supabase.from('estoque').select('quantidade, id')

    const notEnoughIngredients = requestBody.ingredientes.some((ingrediente) => {
        ingrediente.quantidade > estoque.find((item) => item.id === ingrediente.id).quantidade
    })

    return Response.json({ notEnoughIngredients })
}