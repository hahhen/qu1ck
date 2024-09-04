import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(){
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data: notificacoes} = await supabase.from('notificacao').select('id, criado_em, mensagem').order('criado_em', {ascending: false})

    return Response.json({ notificacoes });
}