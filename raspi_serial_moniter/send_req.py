import requests
import os
def send_req():
    url = "https://waterleakbackend.herokuapp.com/api/db/create"

    payload = "{}"
    headers = {
        'Content-Type': "application/json",
        'auth-token': os.getenv("auth-token")
        }

    response = requests.request("POST", url, data=payload, headers=headers)

    print(response.text)

if __name__ == "__main__":
    print("Ran as standalone. Sending Request.")
    send_req()