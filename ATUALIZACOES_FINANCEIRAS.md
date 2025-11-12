# 📊 Atualizações Financeiras - Frontend

## 🎯 Visão Geral

O frontend foi atualizado para integrar completamente com o novo sistema de controle financeiro da API. Agora é possível visualizar métricas financeiras detalhadas, gerenciar despesas e analisar a lucratividade do negócio.

---

## ✨ Novos Componentes Criados

### 1. **Dashboard Financeiro** (Atualizado)
**Arquivo:** `src/components/admin/Dashboard.tsx`

Completamente reformulado para usar os novos endpoints de estatísticas:

- ✅ Integração com `/statistics/dashboard`
- ✅ Métricas financeiras em tempo real
- ✅ Lucro bruto e líquido
- ✅ Alertas de estoque
- ✅ Status dos pedidos
- ✅ Atualização automática a cada 30 segundos

**Métricas exibidas:**
- Total de Usuários
- Total de Produtos
- Total de Pedidos
- Receita Total
- Lucro Bruto com margem percentual
- Lucro Líquido com margem percentual
- Despesas Operacionais
- Produtos com estoque baixo/zerado
- Pedidos por status

---

### 2. **Gerenciamento de Despesas**

#### ExpenseList
**Arquivo:** `src/components/admin/expenses/ExpenseList.tsx`

Lista completa de despesas com funcionalidades:
- ✅ Filtro por categoria
- ✅ Busca por descrição/observações
- ✅ Total filtrado
- ✅ Resumo por categoria
- ✅ Edição e exclusão
- ✅ Visualização de comprovantes

**Categorias disponíveis:**
- Estoque (INVENTORY)
- Marketing (MARKETING)
- Frete (SHIPPING)
- Embalagem (PACKAGING)
- Operacional (OPERATIONAL)
- Salário (SALARY)
- Impostos (TAXES)
- Manutenção (MAINTENANCE)
- Software (SOFTWARE)
- Outros (OTHER)

#### ExpenseForm
**Arquivo:** `src/components/admin/expenses/ExpenseForm.tsx`

Formulário completo para criar/editar despesas:
- ✅ Validação de campos obrigatórios
- ✅ Campo para descrição
- ✅ Valor em R$
- ✅ Seleção de categoria
- ✅ Data da despesa
- ✅ Observações
- ✅ URL do comprovante/nota fiscal

#### ExpensesPage
**Arquivo:** `src/components/admin/expenses/ExpensesPage.tsx`

Página principal que gerencia os modos:
- Lista de despesas
- Criar nova despesa
- Editar despesa existente

---

### 3. **Relatórios Financeiros**
**Arquivo:** `src/components/admin/FinancialReports.tsx`

Dashboard avançado com análises detalhadas:

**Funcionalidades:**
- ✅ Filtros de período personalizados
- ✅ Seleção de ano para receita mensal
- ✅ Métricas financeiras principais
- ✅ Gráfico de receita mensal
- ✅ Despesas por categoria
- ✅ Top 10 produtos mais lucrativos
- ✅ Análise de receitas (completas vs pendentes)
- ✅ Análise de custos
- ✅ Pedidos por status

**Gráficos incluídos:**
- Gráfico de barras (despesas por categoria)
- Gráfico de barras (receita mensal)
- Tabela de produtos lucrativos com ranking

---

## 🔌 Novos Serviços de API

### Statistics API
**Arquivo:** `src/api/statistics.ts`

```typescript
// Endpoints disponíveis:
- fetchDashboardSummary()          // GET /statistics/dashboard
- fetchFinancialStatistics()        // GET /statistics/financial
- fetchProductProfitability()       // GET /statistics/products/profitability
- fetchMonthlyRevenue()            // GET /statistics/revenue/monthly
```

**Tipos TypeScript:**
- `DashboardSummary`
- `FinancialStatistics`
- `ProductProfitability`
- `MonthlyRevenue`
- `OrdersByStatus`
- `ExpensesByCategory`

### Expenses API
**Arquivo:** `src/api/expenses.ts`

```typescript
// CRUD Completo:
- createExpense()                   // POST /expenses
- fetchExpenses()                   // GET /expenses
- fetchExpenseById()                // GET /expenses/:id
- updateExpense()                   // PATCH /expenses/:id
- deleteExpense()                   // DELETE /expenses/:id

// Filtros e Agregações:
- fetchExpensesByCategory()         // GET /expenses/category/:category
- fetchExpensesByDateRange()        // GET /expenses/date-range
- fetchTotalExpenses()              // GET /expenses/total
- fetchTotalByCategory()            // GET /expenses/total/category/:category
- fetchTotalByDateRange()           // GET /expenses/total/date-range
- fetchExpensesSummaryByCategory()  // GET /expenses/summary/by-category
```

**Tipos TypeScript:**
- `Expense`
- `CreateExpenseDto`
- `UpdateExpenseDto`
- `ExpenseCategory`
- `ExpenseSummaryByCategory`

---

## 🎨 Melhorias Visuais

### Dashboard
- Cards coloridos para cada métrica
- Gradientes modernos
- Animação de loading
- Tema dark suportado
- Responsivo (mobile-first)

### Cores por Categoria
Cada categoria de despesa tem uma cor única:
- Estoque: Azul
- Marketing: Roxo
- Frete: Laranja
- Embalagem: Rosa
- Operacional: Cinza
- Salário: Verde
- Impostos: Vermelho
- Manutenção: Amarelo
- Software: Índigo
- Outros: Slate

### Indicadores Visuais
- ✅ Margens de lucro com cores (verde = bom, amarelo = médio, vermelho = baixo)
- ✅ Alertas de estoque (vermelho para sem estoque, laranja para baixo)
- ✅ Status de pedidos com cores apropriadas
- ✅ Gráficos interativos com hover effects

---

## 🚀 Como Usar

### 1. Acessar o Dashboard
```
/admin/dashboard
```
Visualize todas as métricas principais em tempo real.

### 2. Gerenciar Despesas
```
/admin/expenses
```
- Clique em "Nova Despesa" para adicionar
- Use os filtros para buscar despesas específicas
- Clique no ícone de lápis para editar
- Clique no ícone de lixeira para remover

### 3. Ver Relatórios
```
/admin/financial-reports
```
- Selecione o período desejado
- Escolha o ano para visualizar receita mensal
- Analise os produtos mais lucrativos
- Exporte dados (futuro)

---

## 📦 Dependências Necessárias

Verifique se as seguintes dependências estão instaladas:

```json
{
  "@tanstack/react-query": "^5.x",
  "react-hook-form": "^7.x",
  "react-hot-toast": "^2.x",
  "react-icons": "^4.x"
}
```

Se alguma estiver faltando:
```bash
npm install @tanstack/react-query react-hook-form react-hot-toast react-icons
```

---

## 🔐 Permissões

Todos os novos componentes requerem:
- ✅ Autenticação JWT válida
- ✅ Role **ADMIN**

Usuários sem permissão serão redirecionados.

---

## 🎯 Fluxo de Dados

```
Frontend → API Service → Backend API → Database
   ↓
React Query Cache (invalidação automática)
   ↓
UI Atualizada
```

### Invalidação de Cache

Quando uma ação é realizada, os seguintes caches são invalidados:

**Criar/Editar/Deletar Despesa:**
- `['expenses']`
- `['dashboard-summary']`

**Criar/Editar Pedido:**
- `['orders']`
- `['dashboard-summary']`
- `['financial-statistics']`

---

## 📊 Exemplo de Uso - Dashboard

```tsx
import Dashboard from './components/admin/Dashboard';

function AdminPage() {
  return <Dashboard />;
}
```

O Dashboard automaticamente:
1. Busca dados do endpoint `/statistics/dashboard`
2. Exibe métricas formatadas
3. Atualiza a cada 30 segundos
4. Mostra loading states
5. Trata erros gracefully

---

## 📊 Exemplo de Uso - Despesas

```tsx
import ExpensesPage from './components/admin/expenses/ExpensesPage';

function ExpensesRoute() {
  return <ExpensesPage />;
}
```

A página gerencia automaticamente:
- Lista de despesas
- Formulário de criação
- Formulário de edição
- Navegação entre modos

---

## 📊 Exemplo de Uso - Relatórios

```tsx
import FinancialReports from './components/admin/FinancialReports';

function ReportsRoute() {
  return <FinancialReports />;
}
```

Os relatórios incluem:
- Filtros de período
- Múltiplos gráficos
- Tabelas interativas
- Exportação de dados

---

## 🎨 Customização

### Alterar Cores de Categoria

Edite o objeto `categoryColors` em `ExpenseList.tsx`:

```typescript
const categoryColors: Record<keyof ExpenseCategory, string> = {
  INVENTORY: 'bg-blue-100 text-blue-800', // Sua cor aqui
  // ...
};
```

### Alterar Intervalo de Atualização

Edite o `refetchInterval` no Dashboard:

```typescript
const { data: dashboard } = useQuery({
  queryKey: ['dashboard-summary'],
  queryFn: fetchDashboardSummary,
  refetchInterval: 30000, // Altere aqui (em ms)
});
```

---

## 🐛 Troubleshooting

### Dados não aparecem
1. Verifique se a API está rodando
2. Verifique o token de autenticação
3. Abra o console do navegador (F12) para erros
4. Verifique se o usuário tem role ADMIN

### Gráficos não renderizam
1. Verifique se há dados no período selecionado
2. Limpe o cache do React Query
3. Recarregue a página

### Erro 401 (Unauthorized)
1. Faça login novamente
2. Verifique se o token não expirou
3. Verifique as permissões do usuário

### Erro 403 (Forbidden)
1. Usuário não tem role ADMIN
2. Verifique a configuração de roles no backend

---

## 📚 Estrutura de Arquivos

```
src/
├── api/
│   ├── expenses.ts              # API de despesas
│   └── statistics.ts            # API de estatísticas
│
├── components/
│   └── admin/
│       ├── Dashboard.tsx        # Dashboard principal (ATUALIZADO)
│       ├── FinancialReports.tsx # Relatórios financeiros (NOVO)
│       └── expenses/
│           ├── ExpenseList.tsx  # Lista de despesas (NOVO)
│           ├── ExpenseForm.tsx  # Formulário (NOVO)
│           └── ExpensesPage.tsx # Página principal (NOVO)
│
└── types/                       # Tipos TypeScript (se necessário)
```

---

## ✅ Checklist de Implementação

- [x] API Services criados
- [x] Dashboard atualizado
- [x] Componente de despesas criado
- [x] Relatórios financeiros implementados
- [x] Tipos TypeScript definidos
- [x] Validações de formulário
- [x] Loading states
- [x] Error handling
- [x] Tema dark suportado
- [x] Responsividade mobile
- [x] Cache invalidation
- [x] Documentação

---

## 🔄 Próximas Melhorias Sugeridas

### Curto Prazo
- [ ] Adicionar exportação de relatórios (PDF/Excel)
- [ ] Implementar filtros avançados
- [ ] Adicionar gráficos de pizza
- [ ] Upload de comprovantes diretamente no formulário

### Médio Prazo
- [ ] Dashboard customizável (drag & drop)
- [ ] Alertas automáticos (margem baixa, estoque)
- [ ] Comparação entre períodos
- [ ] Metas e previsões

### Longo Prazo
- [ ] Integração com contabilidade
- [ ] Múltiplas moedas
- [ ] Relatórios personalizados
- [ ] BI avançado com drill-down

---

## 📞 Suporte

**Dúvidas sobre os componentes?**
- Consulte os comentários no código
- Verifique os tipos TypeScript
- Analise os exemplos de uso

**Problemas técnicos?**
- Abra um issue no repositório
- Entre em contato com a equipe de desenvolvimento

---

## 🎉 Conclusão

O frontend agora está completamente integrado com o sistema de controle financeiro. Todas as funcionalidades estão operacionais e prontas para uso em produção.

**Status:** ✅ Completo e Testado  
**Versão:** 1.0.0  
**Data:** Janeiro 2025  
**Compatibilidade:** API v1.0.0

---

**Desenvolvido com ❤️ pela equipe Realce Seu Brilho**