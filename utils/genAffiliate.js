function genAffiliate(length) {
 if (length === 0) return '';
 const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
 return chars[Math.floor(Math.random() * chars.length)] + genAffiliate(length - 1);
}

module.exports = {genAffiliate}