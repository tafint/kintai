###################
# For UBUNTU users
###################

# Edit the hosts file: vi /etc/hosts
127.0.0.1   kintai.local

# Copy the .conf file
cp /var/www/html/kintai/deploys/20151217/local/kintai.local.conf /etc/apache2/sites-available/
a2ensite kintai.local.conf
service apache2 reload

####################
# For WINDOWS users
####################

# Add the following line to c:\Windows\System32\drivers\etc\hosts
127.0.0.1   kintai.local

# Add the following line to c:\wamp\bin\apache\apache2.4.9\conf\extra\httpd-vhosts.conf
IncludeOptional "c:/wamp/www/kintai/deploys/20151217/local/httpd-vhosts.conf"

# Restart WampServer

####################
# Installation
####################

# Create a new database named "kintai"
# Import DB from file "deploys/20151217/local/database/db.zip" into your MySQL
# cd to the "src" directory, run the command "composer install" in Terminal
# cd to the "src/public/themes/homer" directory, run the command "npm install"
# Login information: demo[@example.com] / @demo*