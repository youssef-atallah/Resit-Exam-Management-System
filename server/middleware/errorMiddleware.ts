// general error handler for all errors
export const errorHandler = (err: Error, req: any, res: any, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke! pls try again');
};