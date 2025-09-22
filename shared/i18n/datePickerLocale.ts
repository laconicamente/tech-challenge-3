import { registerTranslation, TranslationsType } from 'react-native-paper-dates';

const ptLocale: TranslationsType = {
    save: 'Aplicar',
    selectSingle: 'Selecione uma data',
    selectMultiple: 'Selecione as datas',
    selectRange: 'Selecione o período',
    notAccordingToDateFormat: (inputFormat: string) => `Formato deve ser: ${inputFormat}`,
    mustBeHigherThan: (date: string) => `Deve ser após ${date}`,
    mustBeLowerThan: (date: string) => `Deve ser antes de ${date}`,
    mustBeBetween: (start: string, end: string) => `Deve estar entre ${start} e ${end}`,
    dateIsDisabled: 'Data indisponível',
    previous: 'Anterior',
    next: 'Próximo',
    typeInDate: 'Digite a data',
    pickDateFromCalendar: 'Escolha no calendário',
    close: 'Fechar',
    hour: '',
    minute: ''
};

registerTranslation('pt-BR', ptLocale);