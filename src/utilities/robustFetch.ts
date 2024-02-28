const messages = {
  unavailable: 'Cannot access the resource',
  badResponse: 'Resource API returned with bad response',
  json: 'Cannot parse JSON data',
  network: 'Cannot reach the resource API'
}

export default function robustFetch(url: string, abortSignal?: AbortSignal, retries: number = 3, timer: number = 300): Promise<any> {
  const verbose = import.meta.env.MODE === 'dev' || import.meta.env.MODE === 'testing';

  return fetch(url, {signal: abortSignal})
    .then(response => {
      if(!response.ok) {
        const message = response.status === 404 || response.status === 403 ? messages.unavailable : messages.badResponse;
        if(verbose) console.log(`API: critial error!`, response);
        throw new Error(message);
      }

      return response.json().catch(() => {
        throw new Error(messages.json);
      });
    }).catch(error => {
      // Since network error message varies between clients, check explicitly for all known (critial) error cases
      if(abortSignal?.aborted || retries === 0 || error.message === messages.unavailable || error.message === messages.json) {
        throw error; // exit, no retries.
      }

      // Network or bad response error
      if(verbose) console.log(`Retrying... Attempts left: ${retries}`, error);

      // Recursive retry with longer retry-timeout
      return new Promise(resolve => setTimeout(resolve, timer))
        .then(() => robustFetch(url, abortSignal, retries - 1, timer * 2));
    });
}