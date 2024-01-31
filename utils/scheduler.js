function scheduleTask(time, callback) {
  const regex = /^(\d+)([smh]|d(\d{1,2}))$/;
  const match = time.match(regex);

  if (!match) {
    console.error("Invalid time format. Please use '(1-59)s', '(1-59)m', '(1-24)h', or 'd(0-23)' format.");
    return;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  let interval = 0;

  switch (unit) {
    case 's':
      interval = value * 1000;
      break;
    case 'm':
      interval = value * 60 * 1000;
      break;
    case 'h':
      interval = value * 60 * 60 * 1000;
      break;
    case 'd':
      const hour = parseInt(match[3], 10);
      if (hour < 0 || hour >= 24) {
        console.error("Invalid hour value. Please use a value between 0 and 23 for 'd' format.");
        return;
      }
      const currentHour = new Date().getHours();
      const timeDiff = hour - currentHour;
      if (timeDiff < 0) {
        // If specified time has already passed today, schedule for the next day
        interval = (24 + timeDiff) * 60 * 60 * 1000;
      } else {
        interval = timeDiff * 60 * 60 * 1000;
      }
      break;
    default:
      console.error("Invalid time unit. Please use 's', 'm', 'h', or 'd' format.");
      return;
  }

  setInterval(callback, interval);
}
module.exports = scheduleTask;