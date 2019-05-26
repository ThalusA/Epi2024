#!/bin/sh
screen -S Epi2024-py -dm sh -c "python3 /volume1/homes/ThalusA/CloudStation/Programmation/Epi2024/main.py" & screen -S Epi2024-js -dm sh -c "node /volume1/homes/ThalusA/CloudStation/Programmation/Epi2024/main.js"

