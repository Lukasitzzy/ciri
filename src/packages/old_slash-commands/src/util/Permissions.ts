/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Permissions, BitField } from 'discord.js';
import { PermissionStrings } from './Constants';

//@ts-ignore
export class CustomPermissions extends Permissions {
    toString(): string {
        return `CustomPermission(bits=${this.bitfield})`;
    }

    public static resolve(
        bit:
      | keyof typeof PermissionStrings
      | bigint
      | BitField<keyof typeof PermissionStrings, bigint>
    ): bigint {
    //@ts-ignore
        const { defaultBit } = this;
        if (typeof bit === 'undefined') return defaultBit;
        if (typeof defaultBit === typeof bit && bit >= defaultBit)
            return BigInt(bit);
        if (bit instanceof BitField) return bit.bitfield;
        if (Array.isArray(bit))
            return bit
                .map((p) => this.resolve(p))
                .reduce((prev, p) => prev | p, defaultBit);

        // if (+bit && BigInt(bit) === PermissionStrings.USE_APPLICATION_COMMANDS) return PermissionStrings.USE_APPLICATION_COMMANDS;
        if (bit === 'USE_APPLICATION_COMMANDS')
            return PermissionStrings.USE_APPLICATION_COMMANDS;
        if (
            typeof bit === 'string' &&
      typeof this.FLAGS[bit as keyof typeof PermissionStrings] !== 'undefined'
        )
            return this.FLAGS[bit as keyof typeof PermissionStrings];
        //@
        return super.resolve(bit as bigint);
    }

  static FLAGS = PermissionStrings;
}
