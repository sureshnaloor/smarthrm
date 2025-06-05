import { updateSecurityGroup } from './updateSecurityGroup';

const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function startIpUpdate() {
  console.log('Starting IP update service...');
  
  // Run immediately on start
  await updateSecurityGroup();
  
  // Then run every 5 minutes
  setInterval(async () => {
    try {
      await updateSecurityGroup();
    } catch (error) {
      console.error('Failed to update IP:', error);
    }
  }, UPDATE_INTERVAL);
}

startIpUpdate().catch(console.error); 