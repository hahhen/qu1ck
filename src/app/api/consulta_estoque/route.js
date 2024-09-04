import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(){
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: estoque} = await supabase.from('estoque').select('id, ingrediente, quantidade, atualizado_em, unidade_medida, quantidade_reserva').order('ingrediente', {ascending: true})

    return Response.json({ estoque });
}