import { CommandContext, TextbasedChannel } from '../../../packages/core/src/commands/CommandContext';
import { CustomCommand } from '../../../packages/core/src/commands/CustomCommand';
import * as NodeUtil from 'util';
const Nil = '!!NL!!';
const reg = new RegExp(Nil, 'g');
export default class EvalCommand extends CustomCommand {
    constructor() {
        super({
            id: 'eval',
            description: {
                text: ''
            },
            options: {
                aliases: ['eval'],
                ownerOnly: true,
                args: [{
                    id: 'code',
                    match: 'restContent'
                }]
            }
        });

    }

    public async run(ctx: CommandContext<{ code: string; }, TextbasedChannel>): Promise<any> {
        await this.parseEval(ctx);
    }

    public async parseEval(
        ctx: CommandContext<{
            code: string;
        }, TextbasedChannel>
    ): Promise<void> {
        ctx.msg.edit;
        try {
            const code = ctx.args.code;
            if (!code) {
                await ctx.send(`${ctx.emote('error')} cannot find something to evaluate`);
                return;
            }

            const evaled = eval(code);
            console.log(evaled);


            const str = await this.parseRes(evaled);
            if (str.length >= 1700) {
                console.log(str);
                await ctx.send([
                    `${ctx.emote('success')} sucessfully evaled.`,
                    'message was to long to be send.',
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    `${this.client.user?.username} v${require('../../../../package.json').version} | node ${process.version} | type ${typeof evaled}`
                ].join('\n'));
                return;
            }
            await ctx.send([
                `${ctx.emote('success')} sucessfully evaled.`,
                '```js',
                str,
                '```',
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                `${this.client.user?.username} v${require('../../../../package.json').version} | node ${process.version} | type ${typeof evaled}`
            ].join('\n'));


        } catch (error) {
            await ctx.send('ereeeeeeeeeeeeeeeeeeee');
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
        );
    }

}
