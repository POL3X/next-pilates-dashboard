import { UserGroup } from "../UserGroup/userGroup";

export type Group = {
    uuid: string;
    categoryUuid: string;
    name: string;
    dayOfWeek: string;
    startTime: Date;  // Now using Date for time
    duration: Date;   // Now using Date for time
    maxUsers: number;
    companyUuid: string;
    userGroup: UserGroup[]
}