import { serverHandShake } from "nuedb-client"
import chalk from "chalk";

export async function handShake(host, port, username, password) {

    console.log(chalk.blue(`Processing hand shake...\n`));
    const response = await serverHandShake(host, port, username, password);
    
    if (!response.success) {
        console.error(chalk.red.bold(response.message));  
        throw new Error(response.message) 
    }
    
    return response.message;

}