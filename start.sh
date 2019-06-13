#!/bin/sh
screen -S Epi2024-py -dm python3 /home/chaton/Epi2024/main.py
screen -S Epi2024-js -dm node /home/chaton/Epi2024/main.js
screen -S Epi2024-VPN -dm openvpn --config /home/chaton/Epi2024/ThalusA.Epi2024.ovpn