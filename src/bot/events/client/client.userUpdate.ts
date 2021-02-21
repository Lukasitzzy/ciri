import { User } from 'discord.js';


import { CustomEvent } from '../../../packages/core/src/events/CustomEvent';


export default class userUpdateEvent extends CustomEvent {
    /**
     *
     */
    constructor() {
        super({
            id: 'client.userUpdate',
            options: {
                emitter: 'client',
                event: 'userUpdate'
            }
        });
    }

    public run(user1: User, user2: User): void {
        if (this.client.isOwner(user1)) {
            if (user1.avatar !== user2.avatar) {
                this.client.logger.debug(` [AVATAR_CHANGE] ${user1.username} changed his avatar!`);
            }
        } else {
            return;
        }

    }
}
