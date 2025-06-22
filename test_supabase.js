// Script para testar a conexão com Supabase
// Abra o console do navegador (F12) e cole este código para testar

// Teste 1: Verificar se a API está respondendo
async function testSupabaseConnection() {
    const supabaseUrl = 'https://mvrheemfgobtmbbnjhbi.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cmhlZW1mZ29idG1iYm5qaGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTY1NDIsImV4cCI6MjA2NDU3MjU0Mn0.BI9rJHLULT1j3MLEGztS9ilRXsfJuPH3li_ZnYunQY0'; // Substitua pela chave real
    
    console.log('🔍 Testando conexão com Supabase...');
    
    try {
        // Teste básico de conexão
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        
        console.log('📡 Status da resposta:', response.status);
        
        if (response.status === 200) {
            console.log('✅ Conexão com Supabase OK!');
        } else if (response.status === 401) {
            console.log('❌ Erro 401: Chave de API inválida');
            console.log('💡 Verifique a chave anon/public no painel do Supabase');
        } else {
            console.log('❌ Erro:', response.status, response.statusText);
        }
        
    } catch (error) {
        console.log('❌ Erro de conexão:', error);
    }
}

// Teste 2: Verificar se a tabela players existe
async function testPlayersTable() {
    const supabaseUrl = 'https://mvrheemfgobtmbbnjhbi.supabase.co';
    const supabaseKey = 'SUA_CHAVE_AQUI'; // Substitua pela chave real
    
    console.log('🔍 Testando tabela players...');
    
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/players?limit=1`, {
            method: 'GET',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📊 Status da tabela:', response.status);
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('✅ Tabela players existe!');
            console.log('📄 Dados atuais:', data);
        } else if (response.status === 404) {
            console.log('❌ Tabela players não encontrada');
            console.log('💡 Execute o script SQL no painel do Supabase');
        } else {
            console.log('❌ Erro:', response.status, response.statusText);
        }
        
    } catch (error) {
        console.log('❌ Erro ao verificar tabela:', error);
    }
}

// Execute os testes
console.log('🚀 Iniciando testes do Supabase...');
testSupabaseConnection();
setTimeout(() => testPlayersTable(), 1000);
