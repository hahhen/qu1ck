import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const requestBody = await request.json()

    const { data: newOrder } = await supabase.from('pedido').insert({}).select().single()

    try {
        // Use Promise.all to ensure all inserts complete before proceeding
        await Promise.all(requestBody.ingredientes.map(async (ingrediente, i) => {
            const { data: newPedidoEstoque, error } = await supabase.from('pedido_tem_estoque').insert({
                pedido_id: newOrder.id,
                estoque_id: ingrediente.id,
                quantidade: ingrediente.quantidade
            }).select();

            if (error) {
                console.error('Error inserting ingrediente:', error);
                throw error;
            }

            console.log('Inserted ingrediente:', newPedidoEstoque);
        }));
    } catch (error) {
        console.error('Error inserting ingrediente:', error);
        return Response.json({ error: 'Error inserting ingrediente:' }, { status: 500 });
    }

    try {
        await Promise.all(requestBody.ingredientes.map(async (ingrediente) => {
            const { data: estoque, error } = await supabase.from('estoque').select('quantidade, id').eq('id', ingrediente.id).single()
            await supabase.from('estoque').update({ quantidade: estoque.quantidade - ingrediente.quantidade }).eq('id', ingrediente.id)
            await supabase.from('estoque').update({ atualizado_em: (new Date()).toISOString() }).eq('id', ingrediente.id)
            await supabase.from('pedido').update({ atualizado_em: (new Date()).toISOString(), situacao: "Confirmado" }).eq('id', newOrder.id)

            if (error) {
                console.error('Error updating estoque:', error);
                throw error;
            }
        })
        )
    } catch (error) {
        console.error('Error updating estoque:', error);
        return Response.json({ error: 'Failed to update estoque' }, { status: 500 });
    }

    try {
        await Promise.all(requestBody.ingredientes.map(async (ingrediente) => {
            const { data: estoque, error } = await supabase.from('estoque').select('quantidade, id, quantidade_reserva, ingrediente').eq('id', ingrediente.id).single()
            if (estoque.quantidade <= estoque.quantidade_reserva) {
                await supabase.from('notificacao').insert({ mensagem: `O estoque de ${estoque.ingrediente} está acabando. Reestoque o mais rápido possível.`, tipo: "estoque" })
            }
        }))
    } catch (error) {
        console.error('Error inserting notificacao:', error);
        return Response.json({ error: 'Failed to insert notificacao' }, { status: 500 });
    }

    return Response.json({ success: true });
}