#!/usr/bin/env bash

CMD="docker-compose up web"

# Check the options
while getopts b:ut opt; do
  case $opt in
    b)
    IMG=${OPTARG}
    CMD="docker-compose build ${IMG}"
    ;;

    u)
    CMD="docker-compose up web"

    ;;

    t)
    CMD="docker-compose up test"

    ;;

    \?)
    echo "Invalid option: -$OPTARG" >&2
    usage
    ;;
  esac
done

echo $CMD
$CMD