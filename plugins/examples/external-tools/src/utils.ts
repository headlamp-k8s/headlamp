import { getExternalTools } from '@kinvolk/headlamp-plugin/lib';

/**
 * Checks if a tool is available in the list of external tools
 * @param toolName The name of the tool to check
 * @returns Promise that resolves to true if the tool is available, false otherwise
 */
export async function isToolAvailable(toolName: string): Promise<boolean> {
  try {
    const tools = await getExternalTools();
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', tools);
    return tools.some(tool => tool.name === toolName);
  } catch (error) {
    console.error(`Error checking if ${toolName} is available:`, error);
    return false;
  }
}
