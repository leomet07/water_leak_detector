import serial
import time
from datetime import datetime, date
from time import sleep
import os
import sys

# ports = {"win32": "COM3", "linux": "/dev/ttyACM0"}
ports = {"win32": "COM4", "linux": "/dev/ttyUSB0"}
platform = sys.platform


port = ports[platform]
print("starting on " + str(platform) + " with port " + str(port))

ser = serial.Serial(port=port, baudrate=9600)


print("Loaded")

while True:

    data_raw = ser.readline().decode("utf-8", errors="replace").strip()

    if data_raw:
        print("Data is: " + data_raw)

