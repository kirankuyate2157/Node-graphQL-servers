// prisma migration + comment name
npx prisma migrate dev --name first_1

// docker cmd
run docker file -> docker compose up -d

// see db in docker file
_>  docker exec -it 55e21c7a9665  bash    //image (55e21c7a9665) by _> docker ps
// login postgres in docker image
_> su postgres
_> psql
_> \l  -> for list DB
_> \c threads  -> connect to threads db
_> \d  -> view db or describe db

