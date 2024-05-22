import { serverHandShake } from "nuedb-client"
import chalk from "chalk";

export async function handShake(host, port, username, password) {

    console.log(`[i] Processing hand shake...`);
    const response = await serverHandShake(host, port, username, password);
    console.log(`[i] Authenticating...\n`);
    if (!response.success) {
        console.error(chalk.red.bold('[x] ' + response.message + '\n'));  
        throw new Error(response.message) 
    }
    
    return response.message;

}