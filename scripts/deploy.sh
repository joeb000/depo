
zip -r deploy_package.zip . -x test/\* -x *.zip -x node_modules/\* -x scripts/\* -x contracts/\* -x build/\* -x untruffle/\*


sftp -i ~/.keys/joe-aws-admin.pem ubuntu@ec2-35-171-154-10.compute-1.amazonaws.com <<EOF
cd staging
put deploy_package.zip
exit
EOF


ssh -i ~/.keys/joe-aws-admin.pem ubuntu@ec2-35-171-154-10.compute-1.amazonaws.com << 'EOF'
ls -l
whoami
echo "$BASH_VERSION"
/home/ubuntu/.nvm/versions/node/v10.18.0/bin/pm2 stop depo-api
rm -rf server/*
cp staging/deploy_package.zip server/.
cd server
unzip -q -o deploy_package.zip
rm -f deploy_package.zip
cp -r ~/node_modules_copy ./node_modules
/home/ubuntu/.nvm/versions/node/v10.18.0/bin/pm2 start pm2-server.config.js --env development
exit
EOF