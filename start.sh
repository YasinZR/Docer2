#!/bin/bash
# Ensure, that docker-compose stopped
docker-compose stop

# Start new deployment
docker-compose up

<<<<<<< HEAD
docker exec -i mongo_db mongosh -u admin -p 123456 --authenticationDatabase admin Store < mongo-init.js
=======
docker exec -i mongo_db mongosh -u admin -p 123456 --authenticationDatabase admin Store < mongo-init.js
>>>>>>> a48b14280183917c8cf7993e3473fed862aff49a
