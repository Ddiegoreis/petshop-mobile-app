/**
 * Formata uma string de telefone para o padrão brasileiro (XX) XXXXX-XXXX
 */
export const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);

    if (!match) return cleaned;

    let formatted = '';
    if (match[1]) formatted += `(${match[1]}`;
    if (match[1].length === 2) formatted += ') ';
    if (match[2]) formatted += match[2];
    if (match[2].length === 4 && cleaned.length === 10) {
        // Formato fixo (XX) XXXX-XXXX
        formatted += '-';
    } else if (match[2].length === 5) {
        // Formato celular (XX) XXXXX-XXXX
        formatted += '-';
    }
    if (match[3]) formatted += match[3];

    return formatted.trim();
};

/**
 * Remove toda a formatação de uma string (deixa apenas números)
 */
export const cleanString = (value: string): string => {
    return value.replace(/\D/g, '');
};

/**
 * Formata uma string de números para o padrão de moeda brasileiro (ex: 1.234,50)
 */
export const formatCurrency = (value: string): string => {
    let digits = value.replace(/\D/g, '');
    if (!digits) return '';

    // Remove leading zeros
    digits = parseInt(digits, 10).toString();
    if (digits === 'NaN' || !digits) digits = '0';

    // Ensure at least 3 digits to separate cents
    while (digits.length < 3) {
        digits = '0' + digits;
    }

    const decimalPart = digits.slice(-2);
    let integerPart = digits.slice(0, -2);

    // Add thousands separators
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${integerPart},${decimalPart}`;
};
