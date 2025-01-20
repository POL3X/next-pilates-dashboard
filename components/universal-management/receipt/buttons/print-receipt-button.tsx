import React from 'react';
import { jsPDF } from 'jspdf';
import { getPaymentMethodLabel, Receipt } from '@/constants/Receipt/Receipt';
import { Company } from '@/constants/Company/Company';
import { User } from '@/constants/User/user';
import { monthNames } from '@/constants/MonthNames';
import { Button } from '@/components/ui/button';

interface ReceiptButtonProps {
  receiptData: Receipt;
  companyReceipt: Company;
  user: User;
  disabled?: boolean;
}

export function PrintReceiptButton({ receiptData, companyReceipt, user, disabled }: ReceiptButtonProps) {
  const handleGeneratePDF = async () => {
    const doc = new jsPDF();
    let yPosition = 10; // Inicializamos la posición vertical para el encabezado

    try {
      // **Encabezado con datos de la empresa**
      doc.setFontSize(12);
      doc.text(companyReceipt.name, 5, yPosition);
      yPosition += 5; // Ajustamos la posición vertical
      doc.setFontSize(10);
      doc.text(companyReceipt.address ?? '', 5, yPosition);
      yPosition += 5;
      doc.text('ESPAÑA', 5, yPosition);
      yPosition += 5;
      doc.text(companyReceipt.email ?? '', 5, yPosition);
      yPosition += 5;
      doc.text(companyReceipt.taxId ?? '', 5, yPosition);

      let rightMargin = doc.internal.pageSize.width - 10; // Calcula la posición 10px desde el borde derecho
      let rightYPosition = 10; // Inicializamos la posición vertical
      
      // **Información del cliente y la fecha**
      //doc.text('Cliente:', rightMargin, rightYPosition, { align: 'right' });
      //rightYPosition += 10;
      doc.text(user.name, rightMargin, rightYPosition, { align: 'right' });
      rightYPosition += 5;
      doc.text(user.email ?? '', rightMargin, rightYPosition, { align: 'right' });
      rightYPosition += 5;
      doc.text(`Método de pago: ${getPaymentMethodLabel(receiptData.paymentMethod)}`, rightMargin, rightYPosition, { align: 'right' });
      rightYPosition += 5;
      const fechaCobro = (receiptData.chargedAt && !isNaN(new Date(receiptData.chargedAt).getTime()))
        ? new Date(receiptData.chargedAt).toLocaleDateString()
        : 'No cobrado';
      doc.text(`Fecha cobro: ${fechaCobro}`, rightMargin, rightYPosition, { align: 'right' });

      // **Línea divisora**
      yPosition = Math.max(yPosition, rightYPosition) + 5; // Aseguramos que no se solapen los bloques
      doc.line(5, yPosition, rightMargin, yPosition);
      yPosition += 5;
      const createdDate = new Date(receiptData.createdAt ?? '');
      // **Descripción (ejemplo estático, adapta según tus datos)**
      doc.text('Recibo: ' + receiptData.uuid, 5, yPosition);
      yPosition += 5;
      doc.text('Periodo: ' + createdDate.toLocaleString('es-ES', { month: 'long' }).toLocaleUpperCase(), 5, yPosition);
      yPosition += 8;
      doc.setFontSize(12);
      doc.text('Concepto', 5, yPosition);
      yPosition += 5;
      doc.setFontSize(10);
      doc.text(receiptData.concept ?? '', 5, yPosition);
      // **Total**
      doc.setFontSize(12);
      doc.text('Total:', rightMargin - 40, yPosition, { align: 'right' });
      doc.text(receiptData.amount?.toString() ? receiptData.amount?.toString() + ' €' : '0 €', rightMargin, yPosition, { align: 'right' });

      // Descargar el PDF
      const periodo = (receiptData.createdAt && !isNaN(new Date(receiptData.createdAt).getTime()))
        ? monthNames[new Date(receiptData.createdAt).getMonth()]
        : 'No definido';
      doc.save(`recibo_${user.shortName}_${periodo}_${fechaCobro}.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  return (
    <Button disabled={disabled} onClick={handleGeneratePDF}>
      Descargar
    </Button>
  );
}
