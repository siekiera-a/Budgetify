FROM postgres:latest

ENV POSTGRES_DB budgetify
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD mysecretpassword

COPY src/main/resources/sql/all_in_one.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
