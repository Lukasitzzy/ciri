

export interface  GuildCasesDbData {
    moderatorID: string;
    caseID: string;
    num: number;
    userID: string;
    guildID: string;
    reason?: string;
    action: 'BAN' | 'KICK' | 'MUTE';
    referenceCase?: string;
}
