import { DiscordBot } from '../../../core/src/client/Client';
import { AitherUser } from '../../../extentions/User';
import { EconomyManager } from '../EconomyManager';


export class ProfileManager {
    private readonly _economy: EconomyManager;

    constructor(economy: EconomyManager) {
        this._economy = economy;
    }


    get client(): DiscordBot {
        return this._economy.client;
    }

    createProfile(user: AitherUser): void {
        if (!user) return;

    }

    deleteProfile(): void {
        return;
    }

    updateProfile(): void {
        return;
    }

    createInventory(): void {
        return;
    }

    updateInventory(): void {
        return;
    }

}
