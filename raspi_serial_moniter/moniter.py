import serial
import time
from datetime import datetime, date
from time import sleep
import os
import sys

if not os.path.exists(".env"):
    print(".env does not exist. Ports could not be loaded.")
    exit()

from dotenv import load_dotenv

load_dotenv()
ports = {}


win32port = os.environ["win32port"] # possibly do some manipulating/veirfying
if win32port:
    ports["win32"] = win32port

    

linuxport = os.environ["linuxport"] # possibly do some manipulating/veirfying
if win32port:
    ports["linux"] = linuxport

    
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


