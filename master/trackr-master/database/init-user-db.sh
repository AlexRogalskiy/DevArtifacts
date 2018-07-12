 #!/bin/bash
 set -e

 
 psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
     CREATE USER root with PASSWORD 'mysecretpassword';

     CREATE DATABASE tracker;
     GRANT ALL PRIVILEGES ON DATABASE tracker TO root;

EOSQL
