# docker-compose-example
 dockerized nodejs express & postgreSQL CRUD backend
# DataBase
in order to create a new db we should launch a ubuntu Ec2 Instance 
and run the following commands 


# connecting to the EC2 instance 
ssh -i /path/to/your-key.pem ubuntu@public-ip-address

can be done from the aws web as well

updating the instance
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common

installing and enabling docker 
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker

pulling pg image 
sudo docker pull postgres

running the container up with volumes
sudo docker run -d --name postgres-db \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres


# restarting the ec2 instance to enable docker  
newgrp docker



connecting to the db

sudo apt update
sudo apt install postgresql-client

