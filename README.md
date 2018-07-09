# otg-delivery-backend

This project is a Node.js server that processes incoming coffee requests and, when the client asks, gives the oldest active request back. Also beginning to incorporate analytics (keeping track of each time user enters GeoFence, etc). Uses MongoDB for database, and our instance is hosted on mlab (ping me on Slack for access). The server itself is hosted on Heroku (http://otg-delivery-backend.herokuapp.com/api/ being the base endpoint).

# Commands
To run development server locally: `npm start`

To run all tests: `npm test`



 **Note:** even when running the server locally, messing with the data messes with the real, live production data. This is not ideal but I'm still working on separating out the production and development environments.
