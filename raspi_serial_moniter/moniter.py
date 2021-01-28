import serial
import time
from datetime import datetime, date
from time import sleep
import os
import sys

from dotenv import load_dotenv

load_dotenv()


ports = {"win32": os.environ["win32port"], "linux": os.environ["linuxport"]}
platform = sys.platform


port = ports[platform]
print("starting on " + str(platform) + " with port " + str(port))

ser = serial.Serial(port=port, baudrate=9600)


print("Loaded")

while True:

    data_raw = ser.readline().decode("utf-8", errors="replace").strip()

    if data_raw:
        print("Data is: " + data_raw)
        try:
            num = int(data_raw)
            if num > 70:
                print("Water leak detected.")
        except:
            print("Num could not be converted.")


