This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Content Management

Data Store is Firebase with msm gmail
Photos Store is Google photos with msm gmail

### Adding an item

## Hosting
On IONOS skw@g u-i

## Deploying
ssh [user]@[ip address]
(see IONOS console for details and password)
git clone/pull from repo into /srv/marmalade

To transfer images from local machine to server...


## Config
Go to IONOS Domains and SSL 
Select your domain
Go to DNS
sudo systemctl restart nginx
sudo chmod -R 644 /srv/marmalade/*
sudo chmod -R 755 /srv/marmalade
sudo chown -R www-data:www-data /srv/marmalade
npm install
npm run build
sudo resolvectl flush-caches     (flush DNS)
pm2 startup
sudo netstat -tulnp | grep :3000

## Troubleshooting
Can't see my images - Switch off VPN
Can't see the webpage - Ask ChatGPT about setting up nginx and DNS A records.  These take time to propogate changes. Using a USA VPN, they propogate quicker!

sudo tail -f /var/log/nginx/error.log



