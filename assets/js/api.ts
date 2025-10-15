import axios from 'axios';

class ErrorWithStatus extends Error {
  status: number;
  constructor(msg, status = 500) {
    super(msg);
    this.status = status;
  }
}

class Api {
  /**
   * @param {String} url
   * Слэш на конце url не ставится, если в  <code>@Route()</code> контроллера симфони он так же не указан в конце.
   * Иначе будет redirect. {@link https://symfony.com/doc/4.1/routing.html#routing-trailing-slash-redirection}
   * Редирект может приводить к переключению протокола с https на http и блокировке http-запроса.
   * @param {Object} params GET-параметры запросы
   */
  get(url: string, params?: object): Promise<any> {
    return this.unwrapProtocol(
      axios.get(url, {
        params: params,
        headers: { 'X-Api-Request': '1' },
      }),
    );
  }

  /**
   * @param {String} url
   * @param {Object|FormData} data
   */
  post(url: string, data?: any): Promise<any> {
    return this.unwrapProtocol(
      axios.post(url, data, {
        headers: { 'X-Api-Request': '1' },
      }),
    );
  }

  /**
   * @param {String} url
   * @param {Object|FormData} data
   */
  patch(url: string, data?: any): Promise<any> {
    return this.unwrapProtocol(
        axios.patch(url, data, {
          headers: { 'X-Api-Request': '1' },
        }),
    );
  }

  /**
   * @param {String} url
   */
  delete(url: string): Promise<any> {
    return this.unwrapProtocol(
      axios.delete(url, {
        headers: { 'X-Api-Request': '1' },
      }),
    );
  }

  private unwrapProtocol(promise: Promise<any>): Promise<any> {
    return promise
      .then((response) => {
        if (response.data.error) {
          return Promise.reject(
            new Error(response.data.error.message || response.data),
          );
        } else if (response.data.errors) {
          // Ошибки форм, просто отдаём объект ошибок
          return Promise.reject({ errors: response.data.errors });
        } else if (typeof response.data.response === 'undefined') {
          return Promise.resolve().then(() => {
            return response.data;
          });
        } else {
          return Promise.resolve().then(() => {
            return response.data.response;
          });
        }
      })
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          const currentPath = e.response.request.responseURL;

          if (currentPath.includes('/auth/login')) {
            // Если пользователь на странице "Авторизации", не выполняем редирект и reload
            return Promise.reject(new ErrorWithStatus(e.response.data.detail, e.response.status));
          }

          window.location.href = '/#';
          window.location.reload();
          return Promise.reject(new ErrorWithStatus(e.response.data.detail, e.response.status));
        }
        if (e.response && e.response.status === 403) {
          window.location.href = '/#';
          window.location.reload();

          return Promise.reject(new ErrorWithStatus(e.response.data.detail, e.response.status));
        }
        if (e && e.response && e.response.data && e.response.data.detail) {
          return Promise.reject(new ErrorWithStatus(e.response.data.detail, e.response.status));
        }
        if (e && e.response && e.response.data && e.response.data.error) {
          if (typeof e.response.data.error === 'string') {
            // так запихивается ошибка авторизации
            return Promise.reject(new Error(e.response.data.error));
          } else if (e.response.data.error.message) {
            let e2 = new Error(e.response.data.error.message);
            e2.name = e.response.status;
            return Promise.reject(e2);
          }
        }
        return Promise.reject(e);
      });
  }
}

export default new Api();
