#!/bin/bash
docker kill handsoff_database
docker rm handsoff_database
docker run -d -p5432:5432 --name handsoff_database handsoff/database
