### Responsibilities of the Origin Server
* Serving the dynamic and static content when requested.
* Deciding how content (potentially dynamic) should be cached, via the HTTP cache headers.

### Responsibilities of the API Gateway
* Validate the request by calling an authentication service, before routing the request to a backend service.
* Handles some requests by simply routing them to the appropriate backend service.
* Handles other requests by invoking multiple backend services and aggregating the results.
* SSL termination

### Responsibilities of the Cache Server
* Determine if HTTP request will accept a cached response, and if there's a fresh item in the cache to respond with.
* Send HTTP request to the Origin Server if the request shouldn't be cached or if its cached item is stale.
* Respond with HTTP responses from its cache or from the origin server as appropriate.

### Responsibilities of the client
* Sending requests.
* Caching responses.
* Deciding to pull requests from local cache or making HTTP request to retrieve them.

### Static Server
* We use Nginx to serve up pre-compressed static content.
