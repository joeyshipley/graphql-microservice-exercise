import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const DATE = {
  utcNow: utcNow
};

function utcNow() {
  return dayjs.utc().format();
}