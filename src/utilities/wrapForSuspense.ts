export default function wrapForSuspense<T>(promise: Promise<T>): {read: () => any} {
  let status = 'pending'
  let response: T | undefined;

  const suspender = promise.then(
    (res) => {
      status = 'success'
      response = res
    },
    (err) => {
      status = 'error'
      response = err
    },
  );

  const read = () => {
    if(status === 'pending') throw suspender;
    if(status === 'error') throw response;
    return response;
  }

  return { read }
}