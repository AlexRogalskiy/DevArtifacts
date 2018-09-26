# Drop schema
./bin/console doctrine:schema:drop --full-database --force
rm -rf var/uploads/cache/*
rm var/uploads/*

# Create schema
./bin/console doctrine:schema:create

# Load fixtures
./bin/console doctrine:fixtures:load -n \
--fixtures src/DataFixtures/ORM

# Install assets
./bin/console assets:install --symlink

# Clear cache
./bin/console cache:clear