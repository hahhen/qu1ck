import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(){
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: estoque} = await supabase.from('pedido').select('id, situacao, criado_em, atualizado_em, pedido_tem_estoque(estoque(ingrediente, unidade_medida), quantidade)').order('id', {ascending: false})
    return Response.json({ estoque });
}