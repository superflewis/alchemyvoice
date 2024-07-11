const { PvRecorder } = require('@picovoice/pvrecorder-node');

async function testPvRecorder(device) {
  try {
    console.log(`Testing PvRecorder with device: ${device || 'default'}`);
    
    // Log available devices
    const devices = PvRecorder.getAudioDevices();
    console.log('Available audio devices:', devices);
    
    const recorder = new PvRecorder(512, device);
    await recorder.start();
    console.log(`PvRecorder initialized successfully with device: ${device || 'default'}`);
    recorder.stop();
    recorder.release();
  } catch (error) {
    console.error(`Error initializing PvRecorder with device ${device || 'default'}:`, error.message);
  }
}

const devices = [
  null,  // Default device
  'default',
  'monoinput',
  'dsnooped_mono',
  'hw:CARD=seeed2micvoicec,DEV=0',
  'plughw:CARD=seeed2micvoicec,DEV=0',
  'sysdefault:CARD=seeed2micvoicec',
  'dsnoop:CARD=seeed2micvoicec,DEV=0'
];

(async () => {
  for (const device of devices) {
    await testPvRecorder(device);
  }
})();
