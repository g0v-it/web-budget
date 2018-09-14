import Configuration from '@/utils/configuration'

import numeral from 'numeral';

// import 'numeral/locales';
numeral.register('locale', 'it', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'mila',
    million: 'mil',
    billion: 'mld',
    trillion: 'trl'
  },
  ordinal: function (number) {
    return 'º';
  },
  currency: {
    symbol: '€'
  }
});

numeral.locale(Configuration().current().locale);

export default numeral;

