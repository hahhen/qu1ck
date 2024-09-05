import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
    // Inicialização Supabase
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Leitura dos pedidos
    const { data: estoque, error } = await supabase
        .from('pedido')
        .select('id, situacao, criado_em, atualizado_em, pedido_tem_estoque(estoque(ingrediente, unidade_medida), quantidade)')
        .order('id', { ascending: false })

    // Captura de erro
    if (error) {
        console.error('Error fetching pedido:', error);
        return Response.json({ error: 'Error fetching pedido:' }, { status: 500 });
    }

    return Response.json({ estoque });
}