echo "Building backend..."
docker build -t mongod/backend:latest ./mongod
if [ $? -ne 0 ]; then
  echo "Backend build failed"
  exit 1
fi

echo "Building frontend..."
docker build -t reactmongo/frontend:latest ./reactmongo
if [ $? -ne 0 ]; then
  echo "Frontend build failed"
  exit 1
fi
