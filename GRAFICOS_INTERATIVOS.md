# 📊 Gráficos Interativos - Sistema Financeiro

## 🎯 Visão Geral

Sistema completo de visualização de dados financeiros com gráficos interativos usando **Recharts**, uma biblioteca moderna e responsiva para React.

---

## 📦 Biblioteca Instalada

```bash
npm install recharts
```

**Recharts** - Biblioteca de gráficos construída com React e D3:
- ✅ Totalmente responsiva
- ✅ Componentes declarativos
- ✅ Suporte a tema dark
- ✅ Tooltips customizados
- ✅ Animações suaves
- ✅ TypeScript support

---

## 🆕 Novos Componentes

### 1. **FinancialCharts** (Principal)
**Arquivo:** `src/components/admin/charts/FinancialCharts.tsx`

Dashboard avançado com 5 tipos de visualizações diferentes:

#### Tipos de Gráficos Disponíveis:

**1. Receita no Tempo** (`revenue`)
- Gráfico de Área: Evolução de Receita, Custo e Lucro
- Gráfico de Linha: Pedidos por mês
- Visualização temporal completa

**2. Despesas por Categoria** (`expenses`)
- Gráfico de Barras Horizontal: Top categorias de despesas
- Gráfico de Pizza: Distribuição percentual
- Análise detalhada de gastos

**3. Lucro Comparativo** (`profit`)
- Gráfico de Barras: Comparação de Receita vs Custos vs Lucros
- Gráfico de Pizza: Composição das margens
- Análise de lucratividade

**4. Top Produtos** (`products`)
- Gráfico de Barras Horizontal: 10 produtos mais lucrativos
- Comparação de Lucro vs Receita por produto
- Ranking de performance

**5. Análise Mensal** (`monthly`)
- Gráfico Composto: Barras + Linha
- Receita, Custo (barras) e Lucro (linha)
- Visão completa do ano

---

### 2. **DashboardWithCharts** (Completo)
**Arquivo:** `src/components/admin/DashboardWithCharts.tsx`

Dashboard executivo com gráficos em tempo real:

**Componentes incluídos:**
- 📊 Gráfico de Área: Evolução da Receita e Lucro
- 📊 Gráfico de Barras: Pedidos mensais
- 📊 Gráfico de Pizza: Status dos pedidos
- 📊 Gráfico de Pizza: Status do estoque
- 📈 Cards com métricas principais
- 🔄 Auto-atualização a cada 30 segundos

---

## 🎨 Tipos de Gráficos Implementados

### LineChart (Linha)
```tsx
<LineChart data={data}>
  <Line 
    type="monotone" 
    dataKey="valor" 
    stroke="#3b82f6"
    strokeWidth={3}
  />
</LineChart>
```
**Uso:** Tendências ao longo do tempo, evolução de métricas

### AreaChart (Área)
```tsx
<AreaChart data={data}>
  <Area 
    type="monotone" 
    dataKey="valor"
    fill="url(#gradient)"
  />
</AreaChart>
```
**Uso:** Volume ao longo do tempo com preenchimento

### BarChart (Barras)
```tsx
<BarChart data={data}>
  <Bar 
    dataKey="valor" 
    fill="#3b82f6"
    radius={[8, 8, 0, 0]}
  />
</BarChart>
```
**Uso:** Comparação entre categorias

### PieChart (Pizza)
```tsx
<PieChart>
  <Pie 
    data={data}
    dataKey="valor"
    label={({ name, percent }) => `${name}: ${percent}%`}
  />
</PieChart>
```
**Uso:** Distribuição percentual

### ComposedChart (Composto)
```tsx
<ComposedChart data={data}>
  <Bar dataKey="receita" fill="#3b82f6" />
  <Line dataKey="lucro" stroke="#10b981" />
</ComposedChart>
```
**Uso:** Combinação de múltiplos tipos

---

## 🎯 Filtros Disponíveis

### ChartFilters Component

```tsx
<ChartFilters
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
  selectedYear={selectedYear}
  onYearChange={setSelectedYear}
  chartType={chartType}
  onChartTypeChange={setChartType}
/>
```

**Filtros incluídos:**
1. **Tipo de Gráfico** - Dropdown com 5 opções
2. **Data Inicial** - Date picker
3. **Data Final** - Date picker
4. **Ano** - Seletor de ano (últimos 5 anos)

---

## 💡 Como Usar

### Adicionar ao Router

```tsx
import FinancialCharts from './components/admin/charts/FinancialCharts';
import DashboardWithCharts from './components/admin/DashboardWithCharts';

// Rotas
<Route path="/admin/charts" element={<FinancialCharts />} />
<Route path="/admin/dashboard-charts" element={<DashboardWithCharts />} />
```

### Uso Básico

```tsx
import FinancialCharts from './components/admin/charts/FinancialCharts';

function ChartsPage() {
  return <FinancialCharts />;
}
```

---

## 🎨 Cores Disponíveis

```typescript
const COLORS = {
  primary: '#3b82f6',    // Azul
  secondary: '#8b5cf6',  // Roxo
  success: '#10b981',    // Verde
  warning: '#f59e0b',    // Laranja
  danger: '#ef4444',     // Vermelho
  info: '#06b6d4',       // Ciano
  purple: '#a855f7',     // Roxo claro
  pink: '#ec4899',       // Rosa
  indigo: '#6366f1',     // Índigo
  teal: '#14b8a6',       // Azul-verde
};
```

---

## 📊 Exemplos de Dados

### Receita Mensal
```typescript
[
  { mes: 'Jan', receita: 12000, custo: 5000, lucro: 7000 },
  { mes: 'Fev', receita: 15000, custo: 6000, lucro: 9000 },
  // ...
]
```

### Despesas por Categoria
```typescript
[
  { categoria: 'MARKETING', total: 5000, quantidade: 12 },
  { categoria: 'OPERATIONAL', total: 3000, quantidade: 8 },
  // ...
]
```

### Produtos Lucrativos
```typescript
[
  { 
    produto: 'Brinco Dourado',
    lucro: 2500,
    receita: 5000,
    margem: 50
  },
  // ...
]
```

---

## 🔧 Customização

### Tooltip Customizado

```tsx
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any) => (
          <p style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
```

### Gradientes

```tsx
<defs>
  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
  </linearGradient>
</defs>

<Area fill="url(#colorReceita)" />
```

### Animações

```tsx
<Bar 
  dataKey="valor"
  animationDuration={1000}
  animationBegin={0}
/>
```

---

## 📱 Responsividade

Todos os gráficos usam `ResponsiveContainer`:

```tsx
<ResponsiveContainer width="100%" height={400}>
  <BarChart data={data}>
    {/* ... */}
  </BarChart>
</ResponsiveContainer>
```

**Breakpoints:**
- Mobile: height={300}
- Tablet: height={350}
- Desktop: height={400}+

---

## 🎯 Features Implementadas

### FinancialCharts
- ✅ 5 tipos de visualizações
- ✅ Filtros de data personalizados
- ✅ Seletor de tipo de gráfico
- ✅ Resumo rápido com cards
- ✅ Exportação (botão preparado)
- ✅ Tooltips informativos
- ✅ Tema dark suportado
- ✅ Animações suaves
- ✅ Loading states
- ✅ Responsivo

### DashboardWithCharts
- ✅ Gráficos em tempo real
- ✅ Auto-atualização (30s)
- ✅ Cards com métricas principais
- ✅ Gráfico de área (receita)
- ✅ Gráfico de barras (pedidos)
- ✅ Gráficos de pizza (status)
- ✅ Resumo financeiro detalhado
- ✅ Tendências com indicadores
- ✅ Tema dark suportado
- ✅ Totalmente responsivo

---

## 🔄 Integração com API

### Endpoints Utilizados

```typescript
// Statistics
fetchDashboardSummary()           // Dashboard geral
fetchFinancialStatistics()        // Análise financeira
fetchMonthlyRevenue(year)         // Receita mensal
fetchProductProfitability()       // Lucratividade

// Expenses
fetchExpensesSummaryByCategory()  // Despesas agregadas
```

### React Query Integration

```tsx
const { data, isLoading } = useQuery({
  queryKey: ['monthly-revenue', 2024],
  queryFn: () => fetchMonthlyRevenue(2024),
  refetchInterval: 30000, // Auto-atualiza
});
```

---

## 💡 Melhores Práticas

### 1. Performance
```tsx
// Use useMemo para preparar dados
const chartData = useMemo(() => {
  return rawData.map(item => ({
    // transformação
  }));
}, [rawData]);
```

### 2. Loading States
```tsx
{isLoading ? (
  <FaSpinner className="animate-spin" />
) : (
  <ResponsiveContainer>
    {/* gráfico */}
  </ResponsiveContainer>
)}
```

### 3. Formatação de Moeda
```tsx
const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
```

### 4. Cores Consistentes
```tsx
// Use constantes para cores
const COLORS = { /* ... */ };

<Bar fill={COLORS.primary} />
```

---

## 🎨 Paleta de Cores Recomendada

### Financeiro
- 💰 Receita: `#3b82f6` (Azul)
- 💵 Lucro: `#10b981` (Verde)
- 💸 Custo: `#ef4444` (Vermelho)
- 📊 Despesa: `#f59e0b` (Laranja)

### Status
- ✅ Sucesso: `#10b981` (Verde)
- ⚠️ Alerta: `#f59e0b` (Laranja)
- ❌ Erro: `#ef4444` (Vermelho)
- ℹ️ Info: `#06b6d4` (Ciano)

---

## 📊 Tipos de Análises

### 1. Análise Temporal
```tsx
<LineChart data={monthlyData}>
  <Line dataKey="receita" stroke="#3b82f6" />
  <Line dataKey="lucro" stroke="#10b981" />
</LineChart>
```
**Quando usar:** Evolução de métricas ao longo do tempo

### 2. Análise Comparativa
```tsx
<BarChart data={comparativeData}>
  <Bar dataKey="receita" fill="#3b82f6" />
  <Bar dataKey="custo" fill="#ef4444" />
</BarChart>
```
**Quando usar:** Comparar múltiplas categorias

### 3. Análise de Composição
```tsx
<PieChart>
  <Pie data={distributionData} />
</PieChart>
```
**Quando usar:** Mostrar distribuição percentual

### 4. Análise Multi-dimensional
```tsx
<ComposedChart data={complexData}>
  <Bar dataKey="volume" />
  <Line dataKey="tendencia" />
</ComposedChart>
```
**Quando usar:** Combinar métricas diferentes

---

## 🐛 Troubleshooting

### Gráfico não aparece
1. Verifique se há dados: `console.log(data)`
2. Verifique o `ResponsiveContainer` width/height
3. Confirme que os `dataKey` correspondem aos dados

### Cores não aplicam
1. Verifique a sintaxe: `fill="#3b82f6"` não `fill="bg-blue-500"`
2. Use hex colors, não classes Tailwind

### Tooltip não funciona
1. Importe o componente: `import { Tooltip } from 'recharts'`
2. Adicione dentro do Chart: `<BarChart><Tooltip /></BarChart>`

### Responsive não funciona
1. Envolva com `<ResponsiveContainer>`
2. Defina width="100%" e height em pixels

---

## 📈 Próximas Melhorias

### Curto Prazo
- [ ] Exportação para PDF/PNG
- [ ] Zoom e pan nos gráficos
- [ ] Mais opções de filtros
- [ ] Gráficos de radar

### Médio Prazo
- [ ] Dashboard customizável (drag & drop)
- [ ] Comparação entre períodos
- [ ] Anotações nos gráficos
- [ ] Temas customizados

### Longo Prazo
- [ ] Machine Learning predictions
- [ ] Análise preditiva
- [ ] Exportação automática agendada
- [ ] Relatórios personalizados

---

## 📚 Documentação Recharts

**Site Oficial:** https://recharts.org

**Exemplos:**
- Line Chart: https://recharts.org/en-US/examples/SimpleLineChart
- Bar Chart: https://recharts.org/en-US/examples/SimpleBarChart
- Pie Chart: https://recharts.org/en-US/examples/PieChartWithCustomizedLabel
- Area Chart: https://recharts.org/en-US/examples/SimpleAreaChart
- Composed Chart: https://recharts.org/en-US/examples/ComposedChart

---

## 🎯 Casos de Uso

### Análise de Receita
```
Página: /admin/charts
Filtro: Tipo = "Receita no Tempo"
Período: Ano atual
```

### Controle de Despesas
```
Página: /admin/charts
Filtro: Tipo = "Despesas por Categoria"
Visualização: Pizza + Barras
```

### Performance de Produtos
```
Página: /admin/charts
Filtro: Tipo = "Top Produtos"
Período: Últimos 3 meses
```

### Dashboard Executivo
```
Página: /admin/dashboard-charts
Auto-atualização: Ativada
Gráficos: Área + Barras + Pizza
```

---

## ✨ Destaques

### FinancialCharts
- 🎨 **5 visualizações** diferentes
- 🔍 **Filtros avançados** de período
- 📊 **10+ gráficos** combinados
- 🎯 **Análise focada** em cada métrica

### DashboardWithCharts
- 🚀 **Tempo real** com auto-refresh
- 📈 **4 gráficos** simultâneos
- 💡 **Cards informativos** com métricas
- 🎨 **Visual atrativo** com gradientes

---

## 🎉 Conclusão

Sistema completo de gráficos interativos implementado com:
- ✅ Recharts instalado e configurado
- ✅ 2 componentes principais criados
- ✅ 5 tipos de visualizações
- ✅ Filtros personalizados
- ✅ Responsivo e moderno
- ✅ Tema dark suportado
- ✅ Auto-atualização
- ✅ Documentação completa

**Status:** ✅ Pronto para Produção  
**Versão:** 1.0.0  
**Biblioteca:** Recharts 2.x  
**Compatibilidade:** React 19+

---

**Desenvolvido com 📊 pela equipe Realce Seu Brilho**