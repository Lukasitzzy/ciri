
export interface IWSResponse {
    channel_id: string;
    id: string;
    guild_id?: string;
    data: iWsResponseData;
    member?: IPartialInteractionMember;
}

interface iWsResponseData {
    id: string;
    options: any[];
    name: string;
    description?: string;

}

interface IPartialInteractionMember {
    id: string;
}