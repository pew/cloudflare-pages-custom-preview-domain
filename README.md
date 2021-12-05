# cloudflare pages custom domain for preview deployments

you want a **custom subdomain** for your cloudflare pages **preview deployment**? read on.

this is just a quick n dirty project, let's aim to explain things a bit better and make deployment easier.

you'll create a Worker which calls the Cloudflare API from time to time (defined in the cron pattern) to retrieve the current domain of your latest _preview build_ in Cloudflare Pages. This URL is stored in Cloudflare KV. The Worker will fetch the Cloudflare Pages site then when you hit the configured route.

1. [get your global api key](https://support.cloudflare.com/hc/en-us/articles/200167836-Managing-API-Tokens-and-Keys) (unfortunately scoped api tokens are not available for pages yet)
2. [create a new cloudflare worker](https://workers.new/)
3. go to worker settings and add the following **environment variables**

| environment name | value                         | encrypt it? |
| ---------------- | ----------------------------- | ----------- |
| accountId        | your couldflare account id    | yes         |
| apiKey           | cloudflare api key            | yes         |
| email            | cloudflare email address      | yes         |
| projectName      | cloudflare pages project NAME | no          |

4. create a Cloudflare KV namespace (you can do this in the Workers Dashboard)
5. add one key to the namespace already. use `route` for the key name and the route you want to use for this worker in the `value` field, something like that:

| key   | value                         |
| ----- | ----------------------------- |
| route | https://subdomain.example.com |

6. add the Namespace to your Worker (open the Worker > Settings > Variables > _KV Namespace Bindings_)
7. [create a _cron trigger_ to execute every hour](https://developers.cloudflare.com/workers/platform/cron-triggers)
8. open the cloudflare worker editor and paste the contents of the `index.js` file in this repo in there.
9. assign a route in the Cloudflare Dashboard to match your Worker, like so:

```
subdomain.example.com/* => your-worker
```
