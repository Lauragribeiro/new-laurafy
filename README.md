# Sistema de Gerenciamento Softex

Sistema de gerenciamento de prestações de contas e geração de documentos para a Softex.

## Funcionalidades

- Upload e extração automática de dados de documentos (NF, Ofício, Ordem de Compra)
- Extração de propostas de cotação com IA
- Geração automática de objeto e justificativa
- Geração de Mapa de Cotação em DOCX
- Consulta automática de CNPJ
- Gerenciamento de prestações de contas

## Tecnologias

- Next.js 15
- React 19
- TypeScript
- OpenAI GPT-4
- Tailwind CSS
- shadcn/ui
- docx (geração de documentos)

## Configuração

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente (veja `.env.example`)
4. Execute o projeto: `npm run dev`

## Variáveis de Ambiente

\`\`\`env
OPENAI_API_KEY=sua_chave_aqui
\`\`\`

## Estrutura

- `/app` - Páginas e rotas da aplicação
- `/lib` - Bibliotecas e utilitários
- `/components` - Componentes React
- `/data` - Armazenamento de dados (JSON)
