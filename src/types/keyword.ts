export interface Keyword {
  id: string;
  keyword: string;
  category: string;
  memo: string;
  tags: string[];
  favorited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKeywordInput {
  keyword: string;
  category?: string;
  memo?: string;
  tags?: string[];
  favorited?: boolean;
}

export interface UpdateKeywordInput extends Partial<CreateKeywordInput> {}
