# Full-stack auth example

This is an example of a full-stack app that students can refer to when building projects.

## Front end
* React
* react-router-dom
* Redux
* redux-promise-middleware
* Axios

## Back end
* Express
* Express-session
* Passport
* Auth0
* Massive

<hr />

### Example of .env file
<details>
<summary><code>.env file</code></summary>

```
REACT_APP_LOGIN=http://localhost:3005/auth
SECRET=my-session-secret
AUTH_DOMAIN=my-auth-domain
AUTH_CLIENT_ID=my_auth_client_id
AUTH_CLIENT_SECRET=client-secret
AUTH_CALLBACK=http://localhost:3005/auth/callback
CONNECTION_STRING= URI from heroku database credentials
```
</details>
