
const SECONDS_BY_HOURS = 3600;
const SECONDS_BY_MINUTES = 60;

export const convertTimeToSecond = (time: string): string => {
  if (!time) return '';
  let timeStr = time;
  if (timeStr.split(':').length < 3) {
    timeStr = `${timeStr}:00`;
  }
  const [hours, minutes, seconds] = timeStr.split(':');

  let countSeconds = Number(seconds);
  if (minutes) {
    countSeconds = countSeconds + (Number(minutes) * SECONDS_BY_MINUTES);
  }
  if (hours) {
    countSeconds = countSeconds + (Number(hours) * SECONDS_BY_HOURS);
  }

  return String(countSeconds);
};

export const convertSecondToTime = (seconds: string): string => {
  let secondsLeft = Number(seconds);
  let hours = Math.floor(secondsLeft / SECONDS_BY_HOURS);
  if (hours >= 1) {
    secondsLeft = secondsLeft - (hours * SECONDS_BY_HOURS);
  }
  let minutes = Math.floor(secondsLeft / SECONDS_BY_MINUTES);
  if (minutes >= 1) {
    secondsLeft = secondsLeft - (minutes * SECONDS_BY_MINUTES);
  }

  return `${addTimeString(hours)}:${addTimeString(minutes)}:${addTimeString(secondsLeft)}`;
};

const addTimeString = (time: string | number): string => {
  let timeText = String(time);
  if (timeText.length === 1) {
    timeText = `0${timeText}`;
  }
  return timeText;
};

export const strPadLeft = (string: number, pad: string, length: number): string => {
  return (new Array(length + 1).join(pad) + string).slice(-length);
};

export const getTimeFromSecond = (_time: number) => {
  let time = _time;
  const hours = Math.floor(time / 3600);
  if (hours > 0) {
    time = time - hours * 3600;
  }
  const minutes = Math.floor(time / 60);
  if (minutes > 0) {
    time = time - minutes * 60;
  }
  const seconds = time;
  return [hours, minutes, seconds];
};

// HH:mm:ss
export const displayTimeStr = (_time: number) => {
  const [hours, minutes, seconds] = getTimeFromSecond(_time);

  let displayTime = `${strPadLeft(minutes, '0', 2)}:${strPadLeft(seconds, '0', 2)}`;
  if (hours > 0) {
    displayTime = `${strPadLeft(hours, '0', 2)}:${displayTime}`;
  }
  return displayTime;
};

// {HH} Jam {mm} Menit {ss} Detik
export const displayTimeStrWithTime = (_time: number, lang?: string) => {
  const [hours, minutes, seconds] = getTimeFromSecond(_time);

  let displayTime = `${minutes} ${lang === 'id' ? 'Menit' : 'Minutes'} and ${seconds} ${lang === 'id' ? 'Detik' : 'Seconds'}`;
  if (hours > 0) {
    displayTime = `${hours} ${lang === 'id' ? 'Jam' : 'Hours'} ${displayTime}`;
  }
  return displayTime;
};

export default {
  convertTimeToSecond,
  convertSecondToTime,
  addTimeString,
  strPadLeft,
  getTimeFromSecond,
  displayTimeStr,
  displayTimeStrWithTime,
};