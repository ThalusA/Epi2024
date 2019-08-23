#!/usr/bin/env sh
screen -S Epi2024-py -dm python3 /home/epi2024/Epi2024/main.py
screen -S Epi2024-js -dm node /home/epi2024/Epi2024/main.js
screen -S Epi2024-WEB -dm npm start --prefix /home/epi2024/Epi2024/epi2024-web