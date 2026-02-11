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
