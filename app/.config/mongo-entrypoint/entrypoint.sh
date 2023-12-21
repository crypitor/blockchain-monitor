mongosh <<EOF
db.createUser({
  user: '$MONGO_INITDB_ROOT_USERNAME',
  pwd: '$MONGO_INITDB_ROOT_PASSWORD',
  roles: [
    {
      role: 'readWrite',
      db: '$MONGO_INITDB_DATABASE',
    },
  ],
});
use $MONGO_INITDB_ROOT_USERNAME
db.createUser({
  user: '$MONGO_INITDB_USERNAME',
  pwd: '$MONGO_INITDB_PASSWORD',
  roles: [
    {
      role: 'readWrite',
      db: '$MONGO_INITDB_DATABASE',
    }
  ]
})
EOF