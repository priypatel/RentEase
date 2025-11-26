export const cardAnim = (i = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06 },
});
