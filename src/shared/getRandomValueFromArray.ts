export const getRandomValueFromArray = <T>(items: T[]) => {
  return items[Math.floor(Math.random() * items.length)] as T;
};
