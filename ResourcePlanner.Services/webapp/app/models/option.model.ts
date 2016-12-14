export class Option {
    Id: number;
    Name: string;

    public constructor(
        fields?: {
            Id?: number,
            Name?: string,
        }) {
        if (fields) Object.assign(this, fields);
    }
}

export enum OptionType {
    Position,
    OrgUnit,
    City,
    Region,
    Market,
    Practice,
    SubPractice,
    agg,
    ResourceManager
}

export class CategoryOption extends Option {
    Category: string;

    public constructor(
        fields?: {
            Id?: number,
            Name?: string,
            Category?: string,
        }) {
        super(fields);
        this.Category = fields.Category || this.Category;
    }
}