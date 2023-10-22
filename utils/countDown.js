function updateCountdown(_target,hour) {
 const now = new Date();
 const target = new Date(_target)
 target.setHours(hour, 0, 0, 0);
 let timeDiff = target - now;
 if (timeDiff < 0) {
     target.setDate(target.getDate() + 1);
     timeDiff = target - now; 
 }

 const hours = Math.floor(timeDiff / (1000 * 60 * 60));
 const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
 const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

 const formattedCountdown = `${hours}h:${minutes < 10 ? '0' : ''}${minutes}m:${seconds < 10 ? '0' : ''}${seconds}s`;
 setTimeout(updateCountdown, 1000);
 return formattedCountdown
}

module.exports = {
 updateCountdown
}