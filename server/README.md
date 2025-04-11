


### to run the database locally using docker
```
docker run --name mydb-container -e POSTGRES_USER=johndoe -e POSTGRES_PASSWORD=randompassword -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
```