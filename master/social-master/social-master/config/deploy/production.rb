server 'your_instance_name',
  user: 'ubuntu', roles: %w{web app db}

set :ssh_options, {
  keys: 'your_key_file'
}
