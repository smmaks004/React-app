import { Command } from '../models/command.js';

class CommandsService {
    
    // GET
    static async getAllCommands(){
        const commands = await Command.find();
        return commands;
    }

    static async getAllCommandsForCards(){
        const commands = await Command.find({ 'data.scanType': 1, status: 'completed' });
        return commands;
    }

    static async getAllCommandsForFingers(){
        // const commands = await Command.find({ 'data.scanType': 2, status: 'completed' });
        const commands = await Command.find({ 'data.scanType': 2});
        return commands;
    }

    static async getCommandById({ id }) {
        const command = await Command.findById(id);
        return command;
    }

    static async getCommandByStatus({ status }) {
        const command = await Command.findOne({ status: 'sent' }).sort({ createdAt: 1 });
        return command;
    }

    static async getAllNotSendedCommands(){
        const commands = await Command.find({ sent: false, status: 'pending' }).sort({ createdAt: 1 });
        return commands;
    }

    static async claimNextPendingCommand() {
        const command = await Command.findOneAndUpdate(
            { sent: false, status: 'pending' },
            { sent: true, status: 'completed' }, ////
            { new: true, sort: { createdAt: 1 } }
        );

        return command;
    }

    // static async getOldestSentCommand() {
    //     const command = await Command.findOne({ status: 'completed' }).sort({ createdAt: 1 });
    //     return command;
    // }


    // CREATE
    static async createCommand({ action, data }) {
        return await Command.create({ action, data, status: 'pending' });
    }

    static async createCompletedCommand({ action, data }) {
        return await Command.create({ action, data, status: 'completed' });
    }
    

    // DELETE
    static async deleteCommandById({ id }) {
        const command = await Command.findByIdAndDelete({ _id: id });
        
        return command;
    }

    // UPDATE
    static async updateCommandStatus({ id, status, data }) {
        const command = await Command.findByIdAndUpdate( 
            { _id: id }, { status, data }, { new: true });
        return command;
    }
    
    static async updateCommandToCompletedById({ commandId, data }) {
        const command = await Command.findByIdAndUpdate(
            commandId,
            {
                data: data,
                status: 'completed',
            },
            { new: true }
        );
        return command;
    }


}

export default CommandsService;