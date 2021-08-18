const isDev = process.env.NODE_ENV === 'development';

export const cl = (...args) => {
  if (!isDev) {
    return;
  }

  console.log(...args);
};