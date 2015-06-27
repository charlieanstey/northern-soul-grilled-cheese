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
    sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password northernsoul'
    sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password northernsoul'
    sudo apt-get install -y apache2 mysql-server-5.6 php5 php5-gd php5-mysql
    sudo touch /etc/apache2/conf-available/fqdn.conf
    sudo echo "ServerName northernsoul.local" > /etc/apache2/conf-available/fqdn.conf
    sudo a2enconf fqdn
    sudo rm -Rf /var/www/html
    sudo ln -s /vagrant /var/www/html
    sudo sed -i ':DocumentRoot /var/www/html:a \
    SetEnv APPLICATION_ENVIRONMENT local' /etc/apache2/sites-enabled/000-default.conf
    sudo sed s/display_errors = Off/display_errors = On/g /etc/php5/apache2/php.ini
    sudo sed s/display_startup_errors = Off/display_startup_errors = On/g /etc/php5/apache2/php.ini
  SHELL
end
