import fs from 'fs';
import path from 'path';

export const readConfigFromVolume = async (volumeName: string) => {
    const volumePath = path.join('/var/lib/docker/volumes', volumeName, '_data');
    const configFilePath = path.join(volumePath, 'config.json');
  
    try {
      // Ensure config file exists
      if (!fs.existsSync(configFilePath)) {
        throw new Error(`Config file not found in volume: ${configFilePath}`);
      }
  
      // Read and parse the configuration file
      const configData = fs.readFileSync(configFilePath, 'utf8');
      const config = JSON.parse(configData);
  
      console.log('Configuration read successfully:', config);
  
      return {
        success: true,
        config,
      };
    } catch (error) {
        console.log(error);
        
      return {
        success: false,
        message: `Error reading configuration`,
      };
    }
  };
  