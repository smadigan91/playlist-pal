# How to run proxy server
Included in this archive is a dockerfile for running the proxy server. The proxy server requires `node` and `npm` to work. There is a `package.json` document included for installing the `http-proxy` library in the docker container as part of the build.

# Information about proxy server
 - There are 2 security checks performed that can be expanded on and added to
   - included checks are for matching API paths and HTTP methods
   - other checks can include header validation, block malicious user agents, block/allow certain IP addresses, and limit the request body size
 - Before performing the security checks, there is a consideration to include a rate limiter to prevent too many requests from one address
 - There are some configuration values that can be pulled out of `index.js` into a separate configuration document. This includes the backend server address, the log file, allowed HTTP methods, and allowed API paths.