// Geração de mapa de cotação em DOCX
import type { Purchase, Proposal } from "../types"

export interface MapaData {
  purchase: Purchase
  proposals: Proposal[]
  metadata: {
    generatedAt: string
    generatedBy: string
  }
}

export async function generateMapaCotacao(data: MapaData): Promise<Buffer> {
  const { purchase, proposals, metadata } = data

  // Fallback to simple text format
  const content = `
MAPA DE COTAÇÃO

Instituição: ${purchase.instituicao.toUpperCase()}
Projeto: ${purchase.projeto}
Termo de Parceria: ${purchase.termoParceria}
Rubrica: ${purchase.rubrica}

OBJETO:
${purchase.objeto}

JUSTIFICATIVA:
${purchase.justificativa}

PROPOSTAS RECEBIDAS:

${proposals
  .map(
    (p, i) => `
${i + 1}. ${p.fornecedor}
   CNPJ: ${formatCNPJ(p.cnpj)}
   Valor: R$ ${p.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
   Data: ${formatDate(p.dataEmissao)}
`,
  )
  .join("\n")}

PROPOSTA VENCEDORA:
Fornecedor: ${proposals[0]?.fornecedor || "Não definido"}
Valor: R$ ${(proposals[0]?.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}

---
Gerado em: ${new Date(metadata.generatedAt).toLocaleString("pt-BR")}
Por: ${metadata.generatedBy}
`

  return Buffer.from(content, "utf-8")
}

function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
}

function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString("pt-BR")
  } catch {
    return date
  }
}
