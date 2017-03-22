# Imageboard

Imageboard architecture is a service-oriented architecture where components talk to each other using REST APIs.

Service-oriented architecture advantages:
* Easier auto-scaling because just the service that is having the problem needs to scale;
* Easier capacity planning;
* Problems can be identified more easily because they are isolated behind REST calls;
* Effects of change are narrowed;
* More efficient local caching.

We use message queuing (RabbitMQ) in order to pass work between components.

Switching vote data into Cassandra was a huge win at reddit. Cassandra’s bloom filters enabled really fast negative lookups. For comments it’s very fast to tell which comments you didn’t vote on, so the negative answers come back quickly.

I would store this vote data independently of the answers data

http://i.imgur.com/GoSTm9l.png

https://www.owasp.org/index.php/Cheat_Sheets

![architecture](http://i.imgur.com/UTSjZrm.png)
