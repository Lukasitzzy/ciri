import { Interaction } from '../Interaction';
import { IWsResponse } from '../types';
import { SnowflakeUtil, MessageOptions, APIMessage } from 'discord.js';
import { ClientInteractionWS } from '../ClientInteractionWS';
/**
 * the command that was send via the websocket.
 */
export class InteractionCommand extends Interaction {

    private readonly $syncHandle: Record<string, (options: { hideSource: boolean; }) => void>;

    private readonly $commandID: string;

    private readonly $ws: ClientInteractionWS;
    private readonly $options: IWsResponse['data']['options'];
    /**
     * 
     * @param client the client that initialized the command
     * @param data the body of the websocket
     * @param syncHandle functions to handle
     */
    constructor(ws: ClientInteractionWS,
        data: IWsResponse, syncHandle: Record<string, (options: { hideSource: boolean; }) => void>) {
        super(ws.client, data);

        this.$syncHandle = syncHandle;
        this.$commandID = data.data.id;
        this.$options = data.data.options || [];

        this.$ws = ws;

    }

    /**
     * the timestamp the command was created.
     */
    get createdTimestamp(): number {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }
    /**
     * the Dateobject of the {@link InteractionCommand#createdTimestamp}
     */
    get createdAt(): Date {
        return new Date(this.createdTimestamp);
    }
    /**
     * replies to the comnand Interaction.
     * @param content the message content you want to send
     * @param options options of the reply
     * @returns nothing.
     */

    async reply(content: string | string[], options?: {
        /**
         * whenever the message should only show client side (only the user is seeing it)
         */
        ephemeral: boolean;
        /**
         * the discord.js's message options
         */
        options?: MessageOptions;
    }): Promise<unknown> {


        if (Array.isArray(content)) content = content.join('\n');

        options = options || {
            ephemeral: false,
            options: {}
        };
        // TO-DO: remove that here
        const URL = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;
        const { END_USER_AGREEMENT, INVITE_BOT: INVITE, TERMS_OF_SERICE, PRIVACY_POLICY, GENERAL_DATA_PROTECTON_REGULATION } = this.client.links;

        const apiMsg = APIMessage.create(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            this,
            [`${content}`,
            [
                process.env.NODE_ENV === 'production' ?
                    `[invite](${INVITE})` : 'INVITE',
                `[TOS](${TERMS_OF_SERICE})`,
                `[EULA](${END_USER_AGREEMENT})`,
                `[GDPR](${GENERAL_DATA_PROTECTON_REGULATION})`,
                `[PRIVACY POLICY](${PRIVACY_POLICY})`
            ].join(' | '),
            ].join('\n'),
            options.options
        ).resolveData() as { data: { content: string; flags: number; }; };
        if (Array.isArray(apiMsg.data?.content)) {
            throw new Error('message to long');
        }
        const id = this.client.user?.id;
        if (!id) {
            throw new Error('something fucked up');
        }
        // const header = new Headers();
        // header.append('Authorization', `Bot ${this.client.token}`);
        // header.append('Content-Type', 'application/json');

        if (options?.ephemeral) apiMsg.data.flags = 64;
        return this.$ws.post({ data: apiMsg.data, endpoint: 'callback' });
    }
}