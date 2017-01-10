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
    ResourceManager,
    Task
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

export enum ResourcePageColumnType {
    ResourceName,
    Position,
    City,
    Practice,
    SubPractice,
    ResourceMgr
}

export enum DetailPageColumnType {
    ProjectName,
    ProjectNumber,
    WBSElement,
    Client,
    OpportunityOwner,
    ProjectManager,
    Description
}

export class ColumnOption {
    ColumnName: string;
    FieldName: string;
    Hidden: boolean;
    public constructor(
        fields?: {
            ColumnName?: string,
            FieldName?: string,
            Hidden?: boolean
        }) {
        if (fields) Object.assign(this, fields);
    }


}

export class ResourcePageColumnOption extends ColumnOption {
    ColumnType: ResourcePageColumnType;
    public constructor(
        fields?: {
            ColumnName?: string,
            Hidden?: boolean,
            ColumnType?: ResourcePageColumnType
        }) {
        super(fields);
        this.ColumnType = fields.ColumnType || this.ColumnType;
    }
}

export class DetailPageColumnOption extends ColumnOption {
    ColumnType: DetailPageColumnType;
    public constructor(
        fields?: {
            ColumnName?: string,
            Hidden?: boolean,
            ColumnType?: DetailPageColumnType,
            
        }) {
        super(fields);
        this.ColumnType = fields.ColumnType || this.ColumnType;
    }
}