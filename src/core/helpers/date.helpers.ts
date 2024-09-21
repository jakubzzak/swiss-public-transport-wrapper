import * as moment from 'moment';

export const toDateString = (date: Date) => {
  return moment(date).format('YYYY-MM-DD');
};

export const toTimeString = (date: Date) => {
  return moment(date).format('HH:mm');
};
