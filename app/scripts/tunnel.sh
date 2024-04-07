ssh -L 127.0.0.1:27017:localhost:27017 \
    -L 127.0.0.1:29092:localhost:29092 \
    -L 127.0.0.1:6379:localhost:6379 \
    -L 127.0.0.1:8080:localhost:8080 \
    root@crypitor-api-dev