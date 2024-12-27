
export class Meta {
    readonly createdBy: string;
    readonly createdAt: Date;
    readonly updatedBy: string;
    readonly updatedAt: Date;

    constructor(createdBy: string, createdAt: Date, updatedBy: string, updatedAt: Date) {
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedBy = updatedBy;
        this.updatedAt = updatedAt;
    }

    static fromJson(json: any): Meta {
        return new Meta(
            json.createdBy,
            new Date(json.createdAt),
            json.updatedBy,
            new Date(json.updatedAt));
    }

    static toJson(meta: Meta): any {
        return {
            createdBy: meta.createdBy,
            createdAt: meta.createdAt.toISOString(),
            updatedBy: meta.updatedBy,
            updatedAt: meta.updatedAt.toISOString(),
        };
    }
}
