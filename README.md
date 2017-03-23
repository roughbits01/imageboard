# Imageboard

Imageboard architecture is a service-oriented architecture where components talk to each other using message queuing (RabbitMQ) or direct REST API calls.

Service-oriented architecture advantages:
* Easier auto-scaling because just the service that is having the problem needs to scale;
* Easier capacity planning;
* Problems can be identified more easily because they are isolated behind REST calls;
* Effects of change are narrowed;
* More efficient local caching.

Switching vote data into Cassandra was a huge win at reddit. Cassandra’s bloom filters enabled really fast negative lookups. For comments it’s very fast to tell which comments you didn’t vote on, so the negative answers come back quickly.

I would store this vote data independently of the answers data

http://i.imgur.com/GoSTm9l.png

https://www.owasp.org/index.php/Cheat_Sheets

![architecture](http://i.imgur.com/UTSjZrm.png)

### The Service Registry
In a microservices application, the set of running service instances changes dynamically. Instances have dynamically assigned network locations. Consequently, in order for a client to make a request to a service it must use a service‑discovery mechanism.
The service registry is a key part of service discovery. It is a database containing the network locations of service instances. A service registry should provide a REST API for registering and querying service instances. A service instance registers its network location using a POST request. Every 30 seconds it must refresh its registration using a PUT request. A registration is removed by either using an HTTP DELETE request or by the instance registration timing out. As you might expect, a client can retrieve the registered service instances by using an HTTP GET request.
