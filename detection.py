import io
import os
from google.cloud import vision
from google.cloud.vision import types
from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
 
pnconfig = PNConfiguration()
 
pnconfig.subscribe_key = 'sub-c-3731efe6-6814-11e8-847f-0e36953de9e2'
pnconfig.publish_key = 'pub-c-7fdfeca3-5a0d-4530-8ca9-d299c15d9994'
pnconfig.secret_key = 'sec-c-NGNiMmE3YzktOTRhZi00OGIxLThmM2ItNzZiMzkxM2Y4ZThi'
 
pubnub = PubNub(pnconfig)

client = vision.ImageAnnotatorClient()

file_name = os.path.join(
    os.path.dirname(__file__),
    '/Users/namratha/Downloads/300.jpg')

with io.open(file_name, 'rb') as image_file:
    content = image_file.read()

image = types.Image(content=content)

response = client.label_detection(image=image)
labels = response.label_annotations

for label in labels:
    if "cat" not in label.description: 
        print(label.description)
        output = 'no'
    else:
        output = 'yes'
        print('Yes')
        break
 
 
def my_publish_callback(envelope, status):
    if not status.is_error():
        pass
    else:
        pass
 
 
class MySubscribeCallback(SubscribeCallback):
    def presence(self, pubnub, presence):
        pass
 
    def status(self, pubnub, status):
        if status.category == PNStatusCategory.PNUnexpectedDisconnectCategory:
            pass
        if status.category == PNStatusCategory.PNConnectedCategory:
            if output is 'yes':
                pubnub.publish().channel('alert_notify').message('Cat!').async(my_publish_callback)
        if status.category == PNStatusCategory.PNReconnectedCategory:
            pass
        if status.category == PNStatusCategory.PNDecryptionErrorCategory:
            pass
 
    def message(self, pubnub, message):
        pass
 

pubnub.add_listener(MySubscribeCallback())
pubnub.subscribe().channels('alert_notify').execute()
