export const maskPhone = (value: string) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
        return cleaned
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
};