### Things to do

- [ ] Highlight which comments are new since the last time a user viewed a thread.

http://i.imgur.com/GoSTm9l.png

https://www.owasp.org/index.php/Cheat_Sheets

Switching vote data into Cassandra was a huge win at reddit. Cassandra’s bloom filters enabled really fast negative lookups. For comments it’s very fast to tell which comments you didn’t vote on, so the negative answers come back quickly.
