import { UsbSerialManager, UsbSerial, Parity } from "react-native-usb-serialport-for-android";
import { ScrollView, Alert, Button } from "react-native";
import { useLayoutEffect, useState } from "react";

const SerialPortComponent = () => {
  const [usbSerial, setUsbSerial] = useState(null);
  
  useLayoutEffect(() => {
    initSerialPort();
  }, []);

  async function initSerialPort() {
    try {
      // Check for the available devices
      const devices = await UsbSerialManager.list();
      
      // Send request for the first available device
      const granted = await UsbSerialManager.tryRequestPermission(devices[0].deviceId);
      if (granted) {
        // Open the port for communication
        const usbSerialport = await UsbSerialManager.open(devices[0].deviceId, {
          baudRate: 9600,
          parity: Parity.None,
          dataBits: 8,
          stopBits: 1
        });
        setUsbSerial(usbSerialport);
      } else {
        Alert.alert('USB permission denied');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function sendData(data) {
    if (usbSerial) {
      try {
        // Convert the data (string) to a number, then to a hex string
        const hexData = parseInt(data, 16).toString(16).toUpperCase(); // Convert to hex
        // const hexData = data
        console.log(hexData)
        // const hexData = data == "0x01"|| "0x02" ? data : data.toString(16); // Convert to hex

        // Send the hex data as bytes to the serial port
        await usbSerial.send(hexData);
        console.log(`Sent data: ${hexData}`);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <ScrollView>
      <Button onPress={initSerialPort} title="Init"/>
      <Button onPress={() => sendData('01')} title="ON"/>
      <Button onPress={() => sendData('02')} title="OFF"/>
      <Button onPress={() => sendData('10')} title="BLINK"/>
    </ScrollView>
  );
};

export default SerialPortComponent;
