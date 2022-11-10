export interface Duck {
    id: string;
    name: string;
    age: number;
}

export type DuckCreate = Omit<Duck, 'id'>;
