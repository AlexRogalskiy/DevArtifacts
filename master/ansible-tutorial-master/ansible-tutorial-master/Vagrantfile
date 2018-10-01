# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "trusty64"

  config.vm.network :forwarded_port, guest: 80, host: 8001
  config.vm.provider "virtualbox" do |v|
    v.memory = 1028
  end
end
