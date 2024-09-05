import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(){
    // Inicialização Supabase
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Leitura do estoque
    const {data: estoque, error} = await supabase
    .from('estoque')
    .select('id, ingrediente, quantidade, atualizado_em, unidade_medida, quantidade_reserva')
    .order('ingrediente', {ascending: true})

    // Captura de erro
    if (error) {
        console.error('Error fetching estoque:', error);
        return Response.json({ error: 'Error fetching estoque:' }, { status: 500 });
    }

    return Response.json({ estoque });
}