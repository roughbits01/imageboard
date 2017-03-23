# Imageboard

The idea behind this project is to learn how to design large-scale systems.
Imageboard architecture is a service-oriented architecture where components talk to each other using message queuing (RabbitMQ) or direct REST API calls. Microservices can be described as a suite of independently deployable, small, modular services

Service-oriented architecture advantages:
* Easier auto-scaling because just the service that is having the problem needs to scale;
* Easier capacity planning;
* Problems can be identified more easily because they are isolated behind REST calls;
* Effects of change are narrowed;
* More efficient local caching.
* The single responsibility principle advocates for small and autonomous services that work together. Small teams with small services can plan more aggressively for rapid growth.

Switching vote data into Cassandra was a huge win at reddit. Cassandra’s bloom filters enabled really fast negative lookups. For comments it’s very fast to tell which comments you didn’t vote on, so the negative answers come back quickly.

I would store this vote data independently of the answers data

http://i.imgur.com/GoSTm9l.png

https://www.owasp.org/index.php/Cheat_Sheets

![architecture](http://i.imgur.com/UTSjZrm.png)

### The API Gateway
An API Gateway is a server that is the single entry point into the system.
* Request Routing
* Load Balancing
* API Aggregation
* Webserver Caching and Microcaching
* SSL Termination
* Access Control

The API Gateway validates the JSON Web Token (JWT) before passing the request to the API endpoints.
* Request Limiting
* Protocol Translation

### The Service Registry
In a microservices application, the set of running service instances changes dynamically. Instances have dynamically assigned network locations. Consequently, in order for a client to make a request to a service it must use a service‑discovery mechanism.
The service registry is a key part of service discovery. It is a database containing the network locations of service instances. A service registry should provide a REST API for registering and querying service instances. A service instance registers its network location using a POST request. Every 30 seconds it must refresh its registration using a PUT request. A registration is removed by either using an HTTP DELETE request or by the instance registration timing out. As you might expect, a client can retrieve the registered service instances by using an HTTP GET request.

### Message Queuing
Message queues receive, hold, and deliver messages. If an operation is too slow to perform inline, you can use a message queue with the following workflow:

1. An application publishes a job to the queue, then notifies the user of job status
2. A worker picks up the job from the queue, processes it, then signals the job is complete

Asynchronous workflows help reduce request times for expensive operations that would otherwise be performed in-line. They can also help by doing time-consuming work in advance, such as periodic aggregation of data.

### Redis
Leaderboards/Counting
Redis does an amazing job at increments and decrements since it's in-memory. Sets and sorted sets also make our lives easier when trying to do these kinds of operations, and Redis just so happens to offer both of these data structures.

Showing latest items listings
Showing items in bump order
