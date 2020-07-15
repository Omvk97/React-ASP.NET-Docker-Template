#!/bin/bash

if [ -z "$API_PORT" ]; then
    echo -e "\e[1;31mERROR - 'API_PORT' has not been provided. \e[0m"
    exit 1
fi

if [ -z "$UI_PORT" ]; then
    echo -e "\e[1;31mERROR - 'UI_PORT' has not been provided. \e[0m"
    exit 1
fi

if [[ -z "$POSTGRES_CONNECTION_STRING" ]]; then
    echo -e "\e[1;31mERROR - 'POSTGRES_CONNECTION_STRING' has not been provided \e[0m"
    exit 1
fi
