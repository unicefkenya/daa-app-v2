#/bin/bash
set -e
IMAGE=michameiu/android-build
VERSION=v1.0.0

# git push origin main
docker build -t $IMAGE:$VERSION .
docker tag  $IMAGE:$VERSION  $IMAGE:latest
docker push $IMAGE:$VERSION
# docker run -it -v .:/home/mobiledevops/app $IMAGE bash