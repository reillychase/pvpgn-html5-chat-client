# PvPGN HTML5 Chat Client
An HTML5 chat client for PvPGN servers. Uses Materialize CSS and Websockify

DEMO: https://war2.info/demo.html

LOGIN: abcde/abcde or abcdef/abcdef

## Intro
I wanted to be able to chat on PvPGN servers from my iPhone, but there was not an app for that unfortunately. (Android users have WesChat: https://play.google.com/store/apps/details?id=bnet.pvpgn&hl=en) 

I set out to write my own iPhone app, but I am still working on it. In the meantime it was easier to write this HTML5 app. It won't stay logged in if you lock your phone, won't push notifications, but it still serves its purpose as a simple web client.

## How it works
Originally I thought that with HTML5 and websockets I could open a raw TCP connection directly from the HTTP user to the PvPGN server, but it turns out that this is not the way websockets actually work. Websockets only allow asynchronous communication between a web client and ***webserver***.

However, I discovered websockify: https://github.com/novnc/websockify

Websockify can act as a bridge from a websocket to a network socket.

This means the web client opens a websocket to your webserver, then websockify proxies that connection to the PvPGN server's telnet port.

I rewrote the example javascript provided by websockify (wsirc.js) to make it compatible with PvPGN telnet, and named it wspvpgn.js.

PvPGN sees all the connections as coming from the webserver, not the actual end-user, which is important to keep in mind. If your PvPGN server limits the number of connections from a single IP, the HTML5 chat client may only be able to serve a few clients at a time unless you change PvPGN configuration.

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

Reboot to trigger the cronjob, or manually run the command above to start websockify running

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
        
## Developer Instructions
If you have some skills in HTML/CSS/Javascript and would like to contribute, here is some more information:

1. Here is an example of how color is added to messages coming from PvPGN:

This is done in /static/js/websockify/wspvpgn.js. Regex is used to match an incoming message and change it before outputting it to the chatroom window.

    is_here_regex = /^\[(.*) is here\]/g;
    is_here = is_here_regex.exec(msg);

For example this identifies when "Joining channel:" is seen

    joining_channel_regex = /^Joining channel: (.*)/g;
    joining_channel = joining_channel_regex.exec(msg);

Then this changes the color to green and outputs it to the chatroom:

    while (joining_channel != null) {

      chatroom = ''

      in_channel = [];

      new_msg = '<span style="color: #00ef00;">Joining channel: ' + joining_channel[1] + '</span>'
      writeToChannel(new_msg);
      joining_channel = joining_channel_regex.exec(msg);

      flag = 0;
    };

### Here are some things that need some work:
- ~~Unicode (doesn't work currently)~~
- ~~Only working in Chrome and Safari. IE, Edge, and Firefox give websocket error~~
- ~~Better handling of failed login (Currently just displays Login failed in chatroom, should stay on Login screen and give failure message)~~
- Bug on iPhone: When msg box is clicked on, iPhone opens the keyboard which for some reason causes a padding between keyboard and msg box
- Add client tag to commands automatically. Currently if you do '/channels' for example it won't work because PvPGN is expecting '/channels client-tag' like '/channels w2bn'.
- When connection is closed without pressing exit, for example by locking iPhone, the black chatroom window will display still instead of login screen
- ~~Fix colors for whispering~~
- Unescape server messages (aka " \\' " -> " ' ")
- Desktop version with fixed chatroom player list
- Channel name and count at top of chatroom player list
- Click player to whisper
- Channels and Games menus
- Make admin/operator of channel different color (will require checking /admins periodically)
- Weird glitch on iPhone, page flickers when entering password
