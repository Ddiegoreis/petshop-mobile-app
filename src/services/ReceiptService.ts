import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';

type ReceiptData = {
    paymentId: number;
    ownerName: string;
    ownerPhone?: string | null;
    petNames: string[];
    description: string;
    amount: number;
    paidAt: Date;
    referenceMonth?: string | null;
};

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatCurrency(amount: number): string {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateTime(date: Date): string {
    return date.toLocaleString('pt-BR');
}

function formatPaymentDateForFile(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function sanitizeFilePart(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase();
}

async function resolveLogoUri(): Promise<string | null> {
    try {
        const logoAsset = Asset.fromModule(require('../../assets/image/icon.png'));
        await logoAsset.downloadAsync();
        if (logoAsset.localUri) {
            const base64 = await new File(logoAsset.localUri).base64();
            return `data:image/png;base64,${base64}`;
        }
        return null;
    } catch {
        return null;
    }
}

function buildReceiptHtml(data: ReceiptData, logoDataUri: string | null): string {
    const pets = data.petNames.length > 0 ? data.petNames.join(', ') : 'Sem pets cadastrados';
    const receiptCode = `REC-${String(data.paymentId).padStart(6, '0')}`;
    const referenceMonth = data.referenceMonth ?? '-';

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4;
            margin: 12mm;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            font-family: "Courier New", monospace;
            color: #111;
            background: #fff;
          }
          .receipt {
            width: 100%;
            min-height: 100%;
            border: 1px dashed #888;
            padding: 20px;
          }
          .header {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 10px;
          }
          .logo {
            width: 64px;
            height: 64px;
            border-radius: 8px;
            object-fit: cover;
          }
          .title {
            font-size: 22px;
            font-weight: bold;
          }
          .subtitle {
            font-size: 16px;
            margin-top: 4px;
          }
          .divider {
            border-top: 1px dashed #888;
            margin: 16px 0;
          }
          .row {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 8px;
            word-break: break-word;
          }
          .label {
            font-weight: bold;
          }
          .amount {
            font-size: 30px;
            font-weight: bold;
            margin: 10px 0;
          }
          .center {
            text-align: center;
          }
          .footer {
            font-size: 14px;
            color: #444;
            margin-top: 12px;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            ${logoDataUri ? `<img class="logo" src="${logoDataUri}" />` : ''}
            <div>
              <div class="title">Cão Carioca Petshop</div>
              <div class="subtitle">Recibo de pagamento</div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="row"><span class="label">Codigo:</span> ${receiptCode}</div>
          <div class="row"><span class="label">Cliente:</span> ${escapeHtml(data.ownerName)}</div>
          <div class="row"><span class="label">Telefone:</span> ${escapeHtml(data.ownerPhone || '-')}</div>
          <div class="row"><span class="label">Pets:</span> ${escapeHtml(pets)}</div>
          <div class="row"><span class="label">Servico:</span> ${escapeHtml(data.description)}</div>
          <div class="row"><span class="label">Mes ref.:</span> ${escapeHtml(referenceMonth)}</div>
          <div class="row"><span class="label">Pagamento em:</span> ${escapeHtml(formatDateTime(data.paidAt))}</div>

          <div class="divider"></div>

          <div class="amount center">${escapeHtml(formatCurrency(data.amount))}</div>

          <div class="divider"></div>

          <div class="row center">Recebimento confirmado.</div>
          <div class="row center">Obrigada pela preferencia!</div>

          <div class="footer center">Cão Carioca Petshop</div>
        </div>
      </body>
    </html>
  `;
}

export const ReceiptService = {
    async generateAndShare(data: ReceiptData): Promise<void> {
        const canShare = await Sharing.isAvailableAsync();
        if (!canShare) {
            throw new Error('Compartilhamento não disponível neste dispositivo.');
        }

        const logoDataUri = await resolveLogoUri();
        const html = buildReceiptHtml(data, logoDataUri);

        const file = await Print.printToFileAsync({ html });
        const fileName = `${sanitizeFilePart(data.ownerName)}_${formatPaymentDateForFile(data.paidAt)}_recibo.pdf`;
        const sourceFile = new File(file.uri);
        const namedFile = new File(Paths.cache, fileName);

        if (namedFile.exists) {
            namedFile.delete();
        }

        sourceFile.copy(namedFile);

        await Sharing.shareAsync(namedFile.uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Compartilhar recibo',
            UTI: '.pdf',
        });
    },
};
