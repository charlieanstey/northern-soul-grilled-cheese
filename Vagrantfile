# -*- mode: ruby -*-
# vi: set ft=ruby :


Vagrant.configure(2) do |config|
  
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 80, host: 8087

  config.vm.provider "virtualbox" do |vb|
    # Customize the amount of memory on the VM:
    vb.memory = "1024"
  end

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    debconf-set-selections <<< 'mysql-server mysql-server/root_password password northernsoul'
    debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password northernsoul'
    sudo apt-get install -y apache2 mysql-server-5.6 php5 php5-gd php5-mysql
    sudo sh -c 'echo "ServerName northernsoul.local" >> /etc/apache2/apache2.conf'
  SHELL
end
