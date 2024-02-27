export function robustFetch(url: string, abortSignal?: AbortSignal, retries: number = 3, timer: number = 300): Promise<any> { 
  return fetch(url, {signal: abortSignal})
    .then(response => {
      if(!response.ok) {
        if(response.status === 404 || response.status === 403) {
          console.log('Resource not available');
          throw new Error('Error accessing the resource');
        }
        if(retries === 0) return Promise.reject(new Error('Fetch error'));

        console.log(`API responded with status ${response.status}, retrying... \n - Attempts left: ${retries} \n - body: \n ${response.body}, \n `);
        return new Promise(resolve => setTimeout(resolve, timer))
          .then(() => robustFetch(url, abortSignal, retries - 1, timer * 2));
      }


      return response.json().catch(() => {
        console.log('Error parsing JSON');
        throw new Error('Error parsing JSON');
      });
    }).catch(error => {
      if( retries === 0 || error.message === 'Error parsing JSON' || error.message === 'Error accessing the resource') {
        console.log('Fetch failed.', error);
        throw error;
      }
      
      if(abortSignal?.aborted) return new Promise((resolve) => resolve({}));

      console.log(`Retrying due to network error... Attempts left: ${retries}`, error);
      return new Promise(resolve => setTimeout(resolve, timer))
        .then(() => robustFetch(url, abortSignal, retries - 1, timer * 2));
    });
}

export function toKebabCase(string?: string): string {
  if(!string) return '';
  return string.replace(/([A-Z])([A-Z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')            
    .toLowerCase();
}