This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Run jest tests with

```bash
npm run test
```

## Content Management
Data Store is Firebase with msm gmail.
In the Firebase db, the main object is Item. In the Item blurb field, use [term|education] to show a popup with
educational info for a term.
Photos are not online. They are stored on my local machine and 
copied across to the server machine.

## Payments
Uses Stripe

## Emails
Use nodemailer and nextjs app endpoints to ensure they are sent from the server side.
No other cloud code is required.

## Adding an item
1. Add webp image under public/images matching the name in firestore.
  1.1 For multiple images name them name.webp for the main image, then name-n.webp for others.
  1.2 For condition report name them name-scratch-n.webp
1. Add item to [Firestore](https://console.firebase.google.com/u/3/project/marmalade-collection/firestore/databases/-default-/data/~2Fitem~2Ftable-2)
    item should have key matching image filename and fields:
        blurb
        condition
        conditionDetail
        dimensions "?D x ?W x ?H" in cm
        name
        price

## Hosting
On IONOS skw@g u-i

## Deploying
npm install
npm run test
rsync -avz --exclude '.git' --exclude '.next' --exclude 'node_modules' . root@217.154.9.107:/srv/marmalade/
ssh root@217.154.9.107
cd /srv/marmalade/
npm run build
pm2 restart marmalade

## SSL Certificate
Generate from IONOS every April
Follow ChatGPT guidance to download correct files
rsync -a marmalade* root@217.154.9.107:/srv/marmalade/ssl/
on server: pm2 restart marmalade

/srv/marmalade/
(see IONOS console for details and password)

## Config
(hint - Use Warp AI to help resolve deployment problems)

Go to IONOS Domains and SSL 
Select your domain
Go to DNS
https://my.ionos.co.uk/domain-dns-settings/marmaladecollection.com?linkId=ct.txt.domainlist.dns-settings.pro&from=connect-domain%2Fmarmaladecollection.com
sudo systemctl restart nginx
sudo chmod -R 644 /srv/marmalade/*
sudo chmod -R 755 /srv/marmalade
sudo chown -R www-data:www-data /srv/marmalade
npm install
npm run build
sudo resolvectl flush-caches     (flush DNS)
pm2 startup
sudo netstat -tulnp | grep :3000

## Maintenance
Uses uptime robot (with duck email) for status monitoring

## Troubleshooting
Can't see my images - Switch off VPN
Can't see the webpage - Ask ChatGPT about setting up nginx and DNS A records.  These take time to propogate changes. Using a USA VPN, they propogate quicker!

sudo tail -f /var/log/nginx/error.log



