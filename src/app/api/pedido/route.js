import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request) {
    // Inicialização Supabase
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Lendo os itens da requisição feita pelo chatbot
    const requestBody = await request.json()

    // Criando um novo pedido
    const { data: newOrder } = await supabase.from('pedido').insert({}).select().single()

    // Promise para criar um novo pedido_tem_estoque para cada ingrediente
    try {
        await Promise.all(requestBody.ingredientes.map(async (ingrediente, i) => {
            const { data: newPedidoEstoque, error } = await supabase
            .from('pedido_tem_estoque')
            .insert({
                pedido_id: newOrder.id,
                estoque_id: ingrediente.id,
                quantidade: ingrediente.quantidade
            })
            .select();

            // Captura de erro
            if (error) {
                console.error('Error inserting ingrediente:', error);
                throw error;
            }

            // Confirmação de inserção
            console.log('Inserted ingrediente:', newPedidoEstoque);
        }));
        // Captura de erro
    } catch (error) {
        console.error('Error inserting ingrediente:', error);
        return Response.json({ error: 'Error inserting ingrediente:' }, { status: 500 });
    }

    // Promise para atualizar o estoque 
    // (atualizando a quantidade de ingredientes subtraindo os que foram utilizados no pedido)
    try {
        await Promise.all(requestBody.ingredientes.map(async (ingrediente) => {
            // Lendo o estoque do ingrediente
            const { data: estoque, error } = await supabase
                .from('estoque')
                .select('quantidade, id')
                .eq('id', ingrediente.id)
                .single()

            // Atualizando o estoque e a coluna atualizado_em
            await supabase.from('estoque')
                .update({
                    quantidade: estoque.quantidade - ingrediente.quantidade,
                    atualizado_em: (new Date()).toISOString()
                }).eq('id', ingrediente.id)

            // Atualizando a situação do pedido para "Confirmado" e a coluna atualizado_em
            await supabase.from('pedido')
                .update({
                    atualizado_em: (new Date()).toISOString(), situacao: "Confirmado"
                })
                .eq('id', newOrder.id)

            // Captura de erro
            if (error) {
                console.error('Error updating estoque:', error);
                throw error;
            }
        })
        )
        // Captura de erro
    } catch (error) {
        console.error('Error updating estoque:', error);
        return Response.json({ error: 'Failed to update estoque' }, { status: 500 });
    }

    // Promise para inserir notificação caso o estoque de algum ingrediente esteja acabando
    try {
        await Promise.all(requestBody.ingredientes.map(async (ingrediente) => {

            // Lendo o estoque do ingrediente
            const { data: estoque, error } = await supabase.from('estoque')
            .select('quantidade, id, quantidade_reserva, ingrediente')
            .eq('id', ingrediente.id)
            .single()

            // Se a quantidade disponível do estoque for menor que a quantidade mínima de reserva, 
            // insere uma notificação informando o gerente
            if (estoque.quantidade <= estoque.quantidade_reserva) {
                await supabase.from('notificacao')
                    .insert({
                        mensagem: `O estoque de ${estoque.ingrediente} está acabando. Reestoque o mais rápido possível.`,
                        tipo: "estoque"
                    })
            }
        }))
    // Captura de erro
    } catch (error) {
        console.error('Error inserting notificacao:', error);
        return Response.json({ error: 'Failed to insert notificacao' }, { status: 500 });
    }

    return Response.json({ success: true });
}