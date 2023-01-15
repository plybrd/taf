# TAF
a WebDAV client in JavaScript featuring mithril.js. Just [try it](https://raw.githack.com/plybrd/taf/main/Src/index.html).

## Roadmap
- Show directory listing (expects XML server response) DONE
- Move up and down in the directory structure DONE
- Refresh directory listing DONE
- Upload file DONE
- Make folder DONE
- Rename folder/file TODO
- Move folder/file TODO
- Copy folder/file TODO

## Mithril
It uses version 2.2 of [mithril.js](https://mithril.js.org/). **But** Line  1503 must be chnged to enable sending a file with methode PUT. Just `|| body instanceof $window.Blob` was added.

## Setup of a WebDAV server with ningx

    rewrite ^/dav$ /dav/ permanent;
    location ~* /dav/(.+)$ {
    
      # Force usage of https
      if ($scheme = http) {
        rewrite ^ https://$server_name$request_uri? permanent;
      }
    
      set $realm "WebDAV Area";
      auth_basic $realm;
      auth_basic_user_file /var/www/<YOURDAVSPACE>/your.htpasswd;
    
      alias /var/www/<YOURDAVSPACE>/data/$remote_user/;
    
    # client_max_body_size 0;
      client_max_body_size 10M;
      client_body_temp_path /var/www/<YOURDAVSPACE>/tmp;
      create_full_put_path  on;
    
      dav_methods     PUT DELETE MKCOL COPY MOVE;
    # dav_ext_methods   PROPFIND OPTIONS;
      dav_access    user:rw group:rw all:r;
    
      autoindex     on;
      autoindex_exact_size on;
      # Switch XML server response on:
      autoindex_format xml;
    }  
