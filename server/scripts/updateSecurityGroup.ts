import { EC2Client, AuthorizeSecurityGroupIngressCommand, RevokeSecurityGroupIngressCommand, DescribeSecurityGroupsCommand } from "@aws-sdk/client-ec2";
import axios from "axios";

const SECURITY_GROUP_ID = process.env.AWS_SECURITY_GROUP_ID;
const PORT = 5432; // Default PostgreSQL port

async function getCurrentIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error getting current IP:', error);
    throw error;
  }
}

export async function updateSecurityGroup() {
  if (!SECURITY_GROUP_ID) {
    throw new Error('AWS_SECURITY_GROUP_ID environment variable is not set');
  }

  const client = new EC2Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
  });

  try {
    // Get current IP
    const currentIP = await getCurrentIP();
    console.log('Current IP:', currentIP);

    // Get existing security group rules
    const describeCommand = new DescribeSecurityGroupsCommand({
      GroupIds: [SECURITY_GROUP_ID]
    });
    const securityGroup = await client.send(describeCommand);
    const existingRules = securityGroup.SecurityGroups?.[0]?.IpPermissions || [];

    // Revoke old rules
    for (const rule of existingRules) {
      if (rule.FromPort === PORT && rule.ToPort === PORT) {
        const revokeCommand = new RevokeSecurityGroupIngressCommand({
          GroupId: SECURITY_GROUP_ID,
          IpPermissions: [rule]
        });
        await client.send(revokeCommand);
        console.log('Revoked old rule:', rule);
      }
    }

    // Add new rule
    const authorizeCommand = new AuthorizeSecurityGroupIngressCommand({
      GroupId: SECURITY_GROUP_ID,
      IpPermissions: [{
        FromPort: PORT,
        ToPort: PORT,
        IpProtocol: 'tcp',
        IpRanges: [{
          CidrIp: `${currentIP}/32`,
          Description: 'Dynamic IP access'
        }]
      }]
    });

    await client.send(authorizeCommand);
    console.log('Added new rule for IP:', currentIP);
  } catch (error) {
    console.error('Error updating security group:', error);
    throw error;
  }
} 