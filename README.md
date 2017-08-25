# PvPGN HTML5 Chat Client
An HTML5 chat client for PvPGN servers. Uses Materialize CSS and Websockify

DEMO: https://war2.info/demo.html

LOGIN: abcde/abcde

## Intro
I wanted to be able to chat on PvPGN servers from my iPhone, but there was not an app for that unfortunately. (Android users have WesChat: https://play.google.com/store/apps/details?id=bnet.pvpgn&hl=en) 

I set out to write my own iPhone app, but I am still working on it. In the meantime it was easier to write this HTML5 app. It won't stay logged in if you lock your phone, won't push notifications, but it still serves its purpose nicely as a simple web client.

## How it works
Originally I thought that with HTML5 and websockets I could open a raw TCP connection directly from the HTTP user to the PvPGN server, but it turns out that this is not the way websockets actually work. Websockets only allow asynchronous communication between a web client and web server.

However, I discovered websockify: https://github.com/novnc/websockify

Websockify can act as a bridge from a websocket to a network socket.

This means the web client opens a websocket to your webserver, then websockify proxies that connection to the PvPGN server's telnet port.

I rewrote the example javascript provided by websockify (wsirc.js) to make it compatible with PvPGN telnet, and named it wspvpgn.js.

PvPGN sees all the connections as coming from the webserver, not the actual end-user, which is important to keep in mind. If your server has IP limiting, the HTML5 chat client may only be able to serve a few clients at a time unless you allow more connections from the same IP on PvPGN.

## Installation Insructions
### Install Websockify
    apt-get install git
    cd ~
    git clone https://github.com/novnc/websockify.git


### Add a cronjob to start Websockify server on reboot

    crontab -e
      @reboot sleep 30 && /home/***your-username***/websockify/run ***your-websockify-port*** ***your-pvpgn-server:6112*** --cert ***path-to-your-ssl-cert.pem*** --key=***path/to/your/privkey.pem*** -D


So for example:

    @reboot sleep 30 && /home/war2.info/websockify/run 6112 server.war2.ru:6112 --cert /etc/letsencrypt/live/war2.info/cert.pem --key=/etc/letsencrypt/live/war2.info/privkey.pem -D

### Clone PvPGN HTML5 Chat Client to your Web Dir

    cd /var/www (your web dir)
    git clone https://github.com/reillychase/pvpgn_html5_chat_client.git

### Customize /static/js/websockify/wspvpgn.js
Change the following code:

    var host = 'war2.info',
    
And

    if (server == 'server.war2.ru') {
      port = '6112';
      channel = 'war2bne'
    }

To your custom settings like below:
    
    var host = 'your-website-address.com'

    if (server == 'server-name-from-value-of-chat.html-dropdown') {
      port = 'websockify-port-running-on-your-server';
      channel = 'channel-to-log-into-on-pvpgn'
    }

## If using HTTP instead of HTTPS
If your website is HTTP instead of HTTPS, follow the above instructions but make these changes:

### Change cronjob to start Websockify server on reboot

    crontab -e
      @reboot sleep 30 && /home/***your-username***/websockify/run ***your-websockify-port*** ***your-pvpgn-server:6112*** -D


So for example:

    @reboot sleep 30 && /home/war2.info/websockify/run 6112 server.war2.ru:6112 -D

### Change /static/js/websockify/wspvpgn.js to replace 'wss://' with 'ws:/'

So that this:

        scheme = "wss://", uri;

Becomes this:

        scheme = "ws://", uri;
