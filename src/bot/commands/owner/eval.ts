/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandContext, TextbasedChannel } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import * as NodeUtil from 'util';
import { VERSION } from '../../../packages/util/Constants';
import { applyOptions } from '../../../packages/util/decorators';

import { Message, Util } from 'discord.js';
import { EMOTES } from '../../../packages/util/Constants';
import { IApplicationCommand, IApplicationCommandOption } from '../../../packages/util/typings/InteractionTypes';
import { getApi } from '../../../packages/util/Functions';
import { MessageEmbed } from 'discord.js';
import { performance } from 'node:perf_hooks';
const Nil = '!!NL!!';
const reg = new RegExp(Nil, 'g');
@applyOptions({
    id: 'eval',
    description: {
        text: '',
        aliases: [],
        examples: [],
        usage: []
    },
    options: {
        aliases: ['eval'],
        ownerOnly: true,
        category: 'owner',
        args: [{
            id: 'code',
            match: 'restContent'
        }]
    }
})
export default class EvalCommand extends CustomCommand {


    public async run(ctx: CommandContext<{ code: string; }, TextbasedChannel>): Promise<any> {
        await this.parseEval(ctx);
        
    }

    public createCustomCommand(
        name: string, 
        description: string,
        options: IApplicationCommandOption[], 
        guildID?: string
        ): Promise<IApplicationCommand>  {
        if (!this.client.user) throw new Error('client no ready');
        return guildID ?
        getApi(this.client)
        .applications(this.client.user.id)
        .guilds(guildID)
        .commands.post({
            data: {
                name: name,
                description: description,
                options: options
            }
        })
        : getApi(this.client)
        .applications(this.client.user?.id)
        .commands.post({
            data: {
                name: name,
                description: description,
                options: options
            }
        });
    }

    public async parseEval(
        ctx: CommandContext<{
            code: string;
        }, TextbasedChannel>
    ): Promise<void> {
        try {
            const code = ctx.args.code;
            if (!code) {
                await ctx.send(`${ctx.emote('error')} cannot find something to evaluate`);
                return;
            }
            //
            const client = this.client;
            const db = client.db;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const constants = require('../../../packages/util/Constants');
            const evaled = eval(code);
            const start = Date.now();
            const str = await this.parseRes(evaled);
            if (str.length >= 1700) {
                console.log(Util.cleanContent(str, ctx.msg.channel));
                await ctx.send([
                    `${ctx.emote('success')} sucessfully executed it in \`${Date.now() - start}ms\`.`,
                    'message was to long to be send.',
                    `${this.client.user?.username} v${VERSION} | node ${process.version} | type ${typeof evaled}`
                ].join('\n'));
                return;
            }
            await ctx.send([
                `${ctx.emote('success')} sucessfully executed it in \`${Date.now() - start}ms\`.`,
                '```js',
                Util.cleanContent(str,ctx.msg.channel),
                '```',

                `${this.client.user?.username} v${VERSION} | node ${process.version} | type ${typeof evaled}`
            ].join('\n'));


        } catch (error) {
            this.client.logger.error(error, this.id);
            const e = `${error.name}: ${error.message}`;
            await ctx.send([
                `${ctx.emote('error')} failed to run the command`,
                '```',
                Util.cleanContent(e,ctx.msg.channel),
                '```',
                `${this.client.user?.username} v${VERSION} | node ${process.version} | type ${error?.name || 'Error'}`
            ].join('\n'));
        }
    }

    private async parseRes(thing: any): Promise<string> {
        if (!thing) {
            return 'undefined';
        }
        if (thing && thing.constructor.name === 'Promise') {
            thing = await thing;
        }

        if (typeof thing !== 'string') {
            return this.parseRes(NodeUtil.inspect(thing, { depth: 0 }));
        }

        const pat = new RegExp(
            `${this.client.token?.split('').join('[^]{0,2}')}|${this.client.token?.split('').reverse().join('[^]{0,2}')}`,
            'gi'
        );
        return thing.replace(
            pat, '--'
        ).replace(reg, '\n');
    }

    private async _sendEmotes(ctx: CommandContext<Record<string, any>, TextbasedChannel>) {
        const keys = Object.keys(EMOTES.CUSTOM) as (keyof typeof EMOTES.CUSTOM)[];

        for (const key of keys) {
            await Util.delayFor(1000);
            await ctx.sendNew(` ${key.toUpperCase()} :: ${EMOTES.CUSTOM[key]}  ::  \\${EMOTES.CUSTOM[key]} :: ${EMOTES.DEFAULT[key]}  `);
        }
    }

    public help(prefix: string): MessageEmbed {
        const embed = new MessageEmbed();
        const {text, aliases, usage, examples} = this.description;

        embed.setDescription([
            `**description**\n${text}`,
            `**aliases**: ${aliases.map(alias => `\`${alias}\``).join(' ')}`,
            usage.length ? `**usage**: ${usage.map(us => `\`${us.replace(/{{prefix}}/, prefix)}\``).join(' ')}` : '',
            examples.length ? `**examples**: ${examples.map((example) => `\`${example.replace(/{{prefix}}/, prefix)}\``).join(' ')}` : ''
        ].filter(f => f !== '').join('\n'));
        return embed;
    }


}
