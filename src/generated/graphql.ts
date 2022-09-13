export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  Time: any;
};

/** Add a token for a GitHub Admin App */
export type AddGitHubAdminAppToken = {
  __typename?: 'AddGitHubAdminAppToken';
  ok?: Maybe<Scalars['Boolean']>;
};

export type AddGitHubOrg = {
  __typename?: 'AddGitHubOrg';
  gitHubOrg?: Maybe<GitHubOrg>;
  ok?: Maybe<Scalars['Boolean']>;
};

/** A boolean attribute of a product */
export type AttributeBoolean = Node & {
  __typename?: 'AttributeBoolean';
  field?: Maybe<Field>;
  fieldId: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  iid: Scalars['ID'];
  product?: Maybe<Product>;
  productId: Scalars['Int'];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars['Int'];
  value?: Maybe<Scalars['Boolean']>;
};

export type AttributeBooleanConnection = {
  __typename?: 'AttributeBooleanConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeBooleanEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `AttributeBoolean` and its cursor. */
export type AttributeBooleanEdge = {
  __typename?: 'AttributeBooleanEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AttributeBoolean>;
};

export type AttributeBooleanInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars['Int'];
  /** The value of the attribute */
  value?: InputMaybe<Scalars['Boolean']>;
};

/** An enumeration. */
export enum AttributeBooleanSortEnum {
  FieldIdAsc = 'FIELD_ID_ASC',
  FieldIdDesc = 'FIELD_ID_DESC',
  IidAsc = 'IID_ASC',
  IidDesc = 'IID_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  TypeFieldAssociationIidAsc = 'TYPE_FIELD_ASSOCIATION_IID_ASC',
  TypeFieldAssociationIidDesc = 'TYPE_FIELD_ASSOCIATION_IID_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC'
}

/** A date attribute of a product */
export type AttributeDate = Node & {
  __typename?: 'AttributeDate';
  field?: Maybe<Field>;
  fieldId: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  iid: Scalars['ID'];
  product?: Maybe<Product>;
  productId: Scalars['Int'];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars['Int'];
  value?: Maybe<Scalars['String']>;
};

export type AttributeDateConnection = {
  __typename?: 'AttributeDateConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeDateEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `AttributeDate` and its cursor. */
export type AttributeDateEdge = {
  __typename?: 'AttributeDateEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AttributeDate>;
};

export type AttributeDateInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars['Int'];
  /** The value of the attribute */
  value?: InputMaybe<Scalars['Date']>;
};

/** An enumeration. */
export enum AttributeDateSortEnum {
  FieldIdAsc = 'FIELD_ID_ASC',
  FieldIdDesc = 'FIELD_ID_DESC',
  IidAsc = 'IID_ASC',
  IidDesc = 'IID_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  TypeFieldAssociationIidAsc = 'TYPE_FIELD_ASSOCIATION_IID_ASC',
  TypeFieldAssociationIidDesc = 'TYPE_FIELD_ASSOCIATION_IID_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC'
}

/** A date time attribute of a product */
export type AttributeDateTime = Node & {
  __typename?: 'AttributeDateTime';
  field?: Maybe<Field>;
  fieldId: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  iid: Scalars['ID'];
  product?: Maybe<Product>;
  productId: Scalars['Int'];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars['Int'];
  value?: Maybe<Scalars['DateTime']>;
};

export type AttributeDateTimeConnection = {
  __typename?: 'AttributeDateTimeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeDateTimeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `AttributeDateTime` and its cursor. */
export type AttributeDateTimeEdge = {
  __typename?: 'AttributeDateTimeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AttributeDateTime>;
};

export type AttributeDateTimeInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars['Int'];
  /** The value of the attribute */
  value?: InputMaybe<Scalars['DateTime']>;
};

/** An enumeration. */
export enum AttributeDateTimeSortEnum {
  FieldIdAsc = 'FIELD_ID_ASC',
  FieldIdDesc = 'FIELD_ID_DESC',
  IidAsc = 'IID_ASC',
  IidDesc = 'IID_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  TypeFieldAssociationIidAsc = 'TYPE_FIELD_ASSOCIATION_IID_ASC',
  TypeFieldAssociationIidDesc = 'TYPE_FIELD_ASSOCIATION_IID_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC'
}

/** A float attribute of a product */
export type AttributeFloat = Node & {
  __typename?: 'AttributeFloat';
  field?: Maybe<Field>;
  fieldId: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  iid: Scalars['ID'];
  product?: Maybe<Product>;
  productId: Scalars['Int'];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars['Int'];
  value?: Maybe<Scalars['Float']>;
};

export type AttributeFloatConnection = {
  __typename?: 'AttributeFloatConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeFloatEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `AttributeFloat` and its cursor. */
export type AttributeFloatEdge = {
  __typename?: 'AttributeFloatEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AttributeFloat>;
};

export type AttributeFloatInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars['Int'];
  /** The value of the attribute */
  value?: InputMaybe<Scalars['Float']>;
};

/** An enumeration. */
export enum AttributeFloatSortEnum {
  FieldIdAsc = 'FIELD_ID_ASC',
  FieldIdDesc = 'FIELD_ID_DESC',
  IidAsc = 'IID_ASC',
  IidDesc = 'IID_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  TypeFieldAssociationIidAsc = 'TYPE_FIELD_ASSOCIATION_IID_ASC',
  TypeFieldAssociationIidDesc = 'TYPE_FIELD_ASSOCIATION_IID_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC'
}

/** An integer attribute of a product */
export type AttributeInteger = Node & {
  __typename?: 'AttributeInteger';
  field?: Maybe<Field>;
  fieldId: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  iid: Scalars['ID'];
  product?: Maybe<Product>;
  productId: Scalars['Int'];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars['Int'];
  value?: Maybe<Scalars['Int']>;
};

export type AttributeIntegerConnection = {
  __typename?: 'AttributeIntegerConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeIntegerEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `AttributeInteger` and its cursor. */
export type AttributeIntegerEdge = {
  __typename?: 'AttributeIntegerEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AttributeInteger>;
};

export type AttributeIntegerInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars['Int'];
  /** The value of the attribute */
  value?: InputMaybe<Scalars['Int']>;
};

/** An enumeration. */
export enum AttributeIntegerSortEnum {
  FieldIdAsc = 'FIELD_ID_ASC',
  FieldIdDesc = 'FIELD_ID_DESC',
  IidAsc = 'IID_ASC',
  IidDesc = 'IID_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  TypeFieldAssociationIidAsc = 'TYPE_FIELD_ASSOCIATION_IID_ASC',
  TypeFieldAssociationIidDesc = 'TYPE_FIELD_ASSOCIATION_IID_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC'
}

/** A time attribute of a product */
export type AttributeTime = Node & {
  __typename?: 'AttributeTime';
  field?: Maybe<Field>;
  fieldId: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  iid: Scalars['ID'];
  product?: Maybe<Product>;
  productId: Scalars['Int'];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars['Int'];
  value?: Maybe<Scalars['String']>;
};

export type AttributeTimeConnection = {
  __typename?: 'AttributeTimeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeTimeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `AttributeTime` and its cursor. */
export type AttributeTimeEdge = {
  __typename?: 'AttributeTimeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AttributeTime>;
};

export type AttributeTimeInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars['Int'];
  /** The value of the attribute */
  value?: InputMaybe<Scalars['Time']>;
};

/** An enumeration. */
export enum AttributeTimeSortEnum {
  FieldIdAsc = 'FIELD_ID_ASC',
  FieldIdDesc = 'FIELD_ID_DESC',
  IidAsc = 'IID_ASC',
  IidDesc = 'IID_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  TypeFieldAssociationIidAsc = 'TYPE_FIELD_ASSOCIATION_IID_ASC',
  TypeFieldAssociationIidDesc = 'TYPE_FIELD_ASSOCIATION_IID_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC'
}

/** A unicode text attribute of a product */
export type AttributeUnicodeText = Node & {
  __typename?: 'AttributeUnicodeText';
  field?: Maybe<Field>;
  fieldId: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  iid: Scalars['ID'];
  product?: Maybe<Product>;
  productId: Scalars['Int'];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars['Int'];
  value?: Maybe<Scalars['String']>;
};

export type AttributeUnicodeTextConnection = {
  __typename?: 'AttributeUnicodeTextConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeUnicodeTextEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `AttributeUnicodeText` and its cursor. */
export type AttributeUnicodeTextEdge = {
  __typename?: 'AttributeUnicodeTextEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AttributeUnicodeText>;
};

export type AttributeUnicodeTextInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars['Int'];
  /** The value of the attribute */
  value?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum AttributeUnicodeTextSortEnum {
  FieldIdAsc = 'FIELD_ID_ASC',
  FieldIdDesc = 'FIELD_ID_DESC',
  IidAsc = 'IID_ASC',
  IidDesc = 'IID_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  TypeFieldAssociationIidAsc = 'TYPE_FIELD_ASSOCIATION_IID_ASC',
  TypeFieldAssociationIidDesc = 'TYPE_FIELD_ASSOCIATION_IID_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC'
}

export type AttributesInputFields = {
  /** Attributes of type boolean */
  boolean?: InputMaybe<Array<InputMaybe<AttributeBooleanInputFields>>>;
  /** Attributes of type date */
  date?: InputMaybe<Array<InputMaybe<AttributeDateInputFields>>>;
  /** Attributes of type date time */
  dateTime?: InputMaybe<Array<InputMaybe<AttributeDateTimeInputFields>>>;
  /** Attributes of type float */
  float?: InputMaybe<Array<InputMaybe<AttributeFloatInputFields>>>;
  /** Attributes of type integer */
  integer?: InputMaybe<Array<InputMaybe<AttributeIntegerInputFields>>>;
  /** Attributes of type time */
  time?: InputMaybe<Array<InputMaybe<AttributeTimeInputFields>>>;
  /** Attributes of type unicode text */
  unicodeText?: InputMaybe<Array<InputMaybe<AttributeUnicodeTextInputFields>>>;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token?: Maybe<Scalars['String']>;
};

export type AuthenticateWithGitHub = {
  __typename?: 'AuthenticateWithGitHub';
  authPayload?: Maybe<AuthPayload>;
};

/** Convert the product type of a product */
export type ConvertProductType = {
  __typename?: 'ConvertProductType';
  ok?: Maybe<Scalars['Boolean']>;
  product?: Maybe<Product>;
};

/** Create a field */
export type CreateField = {
  __typename?: 'CreateField';
  field?: Maybe<Field>;
  ok?: Maybe<Scalars['Boolean']>;
};

/** Input to createField() */
export type CreateFieldInput = {
  /** The name of the field */
  name: Scalars['String'];
  type_?: InputMaybe<FieldType>;
};

/** Create a log */
export type CreateLog = {
  __typename?: 'CreateLog';
  log?: Maybe<Log>;
  ok?: Maybe<Scalars['Boolean']>;
};

/** Input to createLog() */
export type CreateLogInput = {
  id_?: InputMaybe<Scalars['Int']>;
  /** The log level */
  level?: InputMaybe<Scalars['String']>;
  /** The message */
  message?: InputMaybe<Scalars['String']>;
};

/** Create a product */
export type CreateProduct = {
  __typename?: 'CreateProduct';
  ok?: Maybe<Scalars['Boolean']>;
  product?: Maybe<Product>;
};

export type CreateProductFilePath = {
  __typename?: 'CreateProductFilePath';
  ok?: Maybe<Scalars['Boolean']>;
  productFilePath?: Maybe<ProductFilePath>;
};

export type CreateProductFilePathInput = {
  note?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
  productId?: InputMaybe<Scalars['Int']>;
};

/** Input to createProduct() */
export type CreateProductInput = {
  /** Attributes */
  attributes?: InputMaybe<AttributesInputFields>;
  /** The name of the product */
  name: Scalars['String'];
  /** Note about the product in MarkDown. */
  note?: InputMaybe<Scalars['String']>;
  /** Paths to the products. e.g., nersc:/go/to/my/product_v3 */
  paths?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Relations to other products */
  relations?: InputMaybe<Array<InputMaybe<RelationInputFields>>>;
  /** The product type ID */
  typeId: Scalars['Int'];
};

/**
 * Add relations between two products. The arguments only specify the relation
 * from one product to the other. The reverse relation will be also added.
 */
export type CreateProductRelation = {
  __typename?: 'CreateProductRelation';
  ok?: Maybe<Scalars['Boolean']>;
  productRelation?: Maybe<ProductRelation>;
};

/** An input to createProductRelation() */
export type CreateProductRelationInput = {
  /** The productId of the other product */
  otherProductId: Scalars['Int'];
  /** The productId of the self product */
  selfProductId: Scalars['Int'];
  /** The typeId of the product relation type of the relation from "self" to the "other" */
  typeId: Scalars['Int'];
};

/** An input to createProductRelationTypes() */
export type CreateProductRelationTypeInput = {
  /** The indefinite article placed before the singular noun "i.e., "a" or "an".  */
  indefArticle?: InputMaybe<Scalars['String']>;
  /** The name of the relation type */
  name: Scalars['String'];
  /** The plural noun, the relation type name in plural. */
  plural?: InputMaybe<Scalars['String']>;
  /** The singular noun, the relation type name in singular. */
  singular?: InputMaybe<Scalars['String']>;
};

/** Create a pair of product relation types */
export type CreateProductRelationTypes = {
  __typename?: 'CreateProductRelationTypes';
  ok?: Maybe<Scalars['Boolean']>;
  productRelationType?: Maybe<ProductRelationType>;
};

/** Create a product type */
export type CreateProductType = {
  __typename?: 'CreateProductType';
  ok?: Maybe<Scalars['Boolean']>;
  productType?: Maybe<ProductType>;
};

/** Input to createProductType() */
export type CreateProductTypeInput = {
  /** The field IDs */
  fieldIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** A name of the icon from https://materialdesignicons.com/ */
  icon?: InputMaybe<Scalars['String']>;
  /** The indefinite article placed before the singular noun "i.e., "a" or "an".  */
  indefArticle?: InputMaybe<Scalars['String']>;
  /** The name of the product type */
  name: Scalars['String'];
  /** The order in which the type is displayed, for example, in navigation bars. */
  order?: InputMaybe<Scalars['Int']>;
  /** The plural noun, the product type name in plural. */
  plural?: InputMaybe<Scalars['String']>;
  /** The singular noun, the product type name in singular. */
  singular?: InputMaybe<Scalars['String']>;
};

/** Delete a field */
export type DeleteField = {
  __typename?: 'DeleteField';
  ok?: Maybe<Scalars['Boolean']>;
};

/** Delete a token for a GitHub Admin App */
export type DeleteGitHubAdminAppToken = {
  __typename?: 'DeleteGitHubAdminAppToken';
  ok?: Maybe<Scalars['Boolean']>;
};

export type DeleteGitHubOrg = {
  __typename?: 'DeleteGitHubOrg';
  ok?: Maybe<Scalars['Boolean']>;
};

/** Delete a log */
export type DeleteLog = {
  __typename?: 'DeleteLog';
  ok?: Maybe<Scalars['Boolean']>;
};

/** Delete a product */
export type DeleteProduct = {
  __typename?: 'DeleteProduct';
  ok?: Maybe<Scalars['Boolean']>;
};

export type DeleteProductFilePath = {
  __typename?: 'DeleteProductFilePath';
  ok?: Maybe<Scalars['Boolean']>;
};

/** Remove relations from two products. */
export type DeleteProductRelation = {
  __typename?: 'DeleteProductRelation';
  ok?: Maybe<Scalars['Boolean']>;
};

/** Delete a pair of product relation types */
export type DeleteProductRelationTypes = {
  __typename?: 'DeleteProductRelationTypes';
  ok?: Maybe<Scalars['Boolean']>;
};

/** Delete a product type */
export type DeleteProductType = {
  __typename?: 'DeleteProductType';
  ok?: Maybe<Scalars['Boolean']>;
};

export type Field = Node & {
  __typename?: 'Field';
  attributesBoolean?: Maybe<AttributeBooleanConnection>;
  attributesDate?: Maybe<AttributeDateConnection>;
  attributesDateTime?: Maybe<AttributeDateTimeConnection>;
  attributesFloat?: Maybe<AttributeFloatConnection>;
  attributesInteger?: Maybe<AttributeIntegerConnection>;
  attributesTime?: Maybe<AttributeTimeConnection>;
  attributesUnicodeText?: Maybe<AttributeUnicodeTextConnection>;
  entryTypes?: Maybe<TypeFieldAssociationConnection>;
  fieldId: Scalars['ID'];
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  type_?: Maybe<FieldType>;
};


export type FieldAttributesBooleanArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeBooleanSortEnum>>>;
};


export type FieldAttributesDateArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateSortEnum>>>;
};


export type FieldAttributesDateTimeArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateTimeSortEnum>>>;
};


export type FieldAttributesFloatArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeFloatSortEnum>>>;
};


export type FieldAttributesIntegerArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeIntegerSortEnum>>>;
};


export type FieldAttributesTimeArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeTimeSortEnum>>>;
};


export type FieldAttributesUnicodeTextArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeUnicodeTextSortEnum>>>;
};


export type FieldEntryTypesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<TypeFieldAssociationSortEnum>>>;
};

export type FieldConnection = {
  __typename?: 'FieldConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FieldEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `Field` and its cursor. */
export type FieldEdge = {
  __typename?: 'FieldEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Field>;
};

/** An enumeration. */
export enum FieldSortEnum {
  FieldIdAsc = 'FIELD_ID_ASC',
  FieldIdDesc = 'FIELD_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC'
}

/** An enumeration. */
export enum FieldType {
  Boolean = 'BOOLEAN',
  Date = 'DATE',
  DateTime = 'DATE_TIME',
  Float = 'FLOAT',
  Integer = 'INTEGER',
  Time = 'TIME',
  UnicodeText = 'UNICODE_TEXT'
}

export type GitHubOAuthAppInfo = {
  __typename?: 'GitHubOAuthAppInfo';
  authorizeUrl?: Maybe<Scalars['String']>;
  clientId?: Maybe<Scalars['String']>;
  redirectUri?: Maybe<Scalars['String']>;
};

export type GitHubOrg = Node & {
  __typename?: 'GitHubOrg';
  avatarUrl?: Maybe<Scalars['String']>;
  gitHubId: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  login: Scalars['String'];
  memberships?: Maybe<GitHubOrgMembershipConnection>;
  orgId: Scalars['ID'];
  url?: Maybe<Scalars['String']>;
};


export type GitHubOrgMembershipsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<GitHubOrgMembershipSortEnum>>>;
};

export type GitHubOrgConnection = {
  __typename?: 'GitHubOrgConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<GitHubOrgEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `GitHubOrg` and its cursor. */
export type GitHubOrgEdge = {
  __typename?: 'GitHubOrgEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<GitHubOrg>;
};

export type GitHubOrgMembership = Node & {
  __typename?: 'GitHubOrgMembership';
  entryId: Scalars['ID'];
  /** The ID of the object. */
  id: Scalars['ID'];
  member?: Maybe<GitHubUser>;
  memberId: Scalars['Int'];
  org?: Maybe<GitHubOrg>;
  orgId: Scalars['Int'];
};

export type GitHubOrgMembershipConnection = {
  __typename?: 'GitHubOrgMembershipConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<GitHubOrgMembershipEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `GitHubOrgMembership` and its cursor. */
export type GitHubOrgMembershipEdge = {
  __typename?: 'GitHubOrgMembershipEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<GitHubOrgMembership>;
};

/** An enumeration. */
export enum GitHubOrgMembershipSortEnum {
  EntryIdAsc = 'ENTRY_ID_ASC',
  EntryIdDesc = 'ENTRY_ID_DESC',
  MemberIdAsc = 'MEMBER_ID_ASC',
  MemberIdDesc = 'MEMBER_ID_DESC',
  OrgIdAsc = 'ORG_ID_ASC',
  OrgIdDesc = 'ORG_ID_DESC'
}

/** An enumeration. */
export enum GitHubOrgSortEnum {
  AvatarUrlAsc = 'AVATAR_URL_ASC',
  AvatarUrlDesc = 'AVATAR_URL_DESC',
  GitHubIdAsc = 'GIT_HUB_ID_ASC',
  GitHubIdDesc = 'GIT_HUB_ID_DESC',
  LoginAsc = 'LOGIN_ASC',
  LoginDesc = 'LOGIN_DESC',
  OrgIdAsc = 'ORG_ID_ASC',
  OrgIdDesc = 'ORG_ID_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC'
}

export type GitHubToken = Node & {
  __typename?: 'GitHubToken';
  /** The ID of the object. */
  id: Scalars['ID'];
  scope?: Maybe<Scalars['String']>;
  timeCreated?: Maybe<Scalars['DateTime']>;
  tokenId: Scalars['ID'];
  tokenMasked?: Maybe<Scalars['String']>;
  user?: Maybe<GitHubUser>;
  userId: Scalars['Int'];
};

export type GitHubTokenConnection = {
  __typename?: 'GitHubTokenConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<GitHubTokenEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `GitHubToken` and its cursor. */
export type GitHubTokenEdge = {
  __typename?: 'GitHubTokenEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<GitHubToken>;
};

export type GitHubTokenFilter = {
  /** Conjunction of filters joined by ``AND``. */
  and?: InputMaybe<Array<GitHubTokenFilter>>;
  /** Negation of filters. */
  not?: InputMaybe<GitHubTokenFilter>;
  /** Conjunction of filters joined by ``OR``. */
  or?: InputMaybe<Array<GitHubTokenFilter>>;
  /** Case-insensitive containment test. */
  scopeIlike?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum GitHubTokenSortEnum {
  ScopeAsc = 'SCOPE_ASC',
  ScopeDesc = 'SCOPE_DESC',
  TimeCreatedAsc = 'TIME_CREATED_ASC',
  TimeCreatedDesc = 'TIME_CREATED_DESC',
  TokenIdAsc = 'TOKEN_ID_ASC',
  TokenIdDesc = 'TOKEN_ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type GitHubUser = Node & {
  __typename?: 'GitHubUser';
  avatarUrl?: Maybe<Scalars['String']>;
  gitHubId: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  login: Scalars['String'];
  memberships?: Maybe<GitHubOrgMembershipConnection>;
  name?: Maybe<Scalars['String']>;
  postedProducts?: Maybe<ProductConnection>;
  tokens?: Maybe<GitHubTokenConnection>;
  updatedProducts?: Maybe<ProductConnection>;
  url?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
};


export type GitHubUserMembershipsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<GitHubOrgMembershipSortEnum>>>;
};


export type GitHubUserPostedProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductSortEnum>>>;
};


export type GitHubUserTokensArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<GitHubTokenFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<GitHubTokenSortEnum>>>;
};


export type GitHubUserUpdatedProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductSortEnum>>>;
};

export type GitHubUserConnection = {
  __typename?: 'GitHubUserConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<GitHubUserEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `GitHubUser` and its cursor. */
export type GitHubUserEdge = {
  __typename?: 'GitHubUserEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<GitHubUser>;
};

export type GitHubUserFilter = {
  /** Conjunction of filters joined by ``AND``. */
  and?: InputMaybe<Array<GitHubUserFilter>>;
  /** Negation of filters. */
  not?: InputMaybe<GitHubUserFilter>;
  /** Conjunction of filters joined by ``OR``. */
  or?: InputMaybe<Array<GitHubUserFilter>>;
  orgMember?: InputMaybe<Scalars['Boolean']>;
};

/** An enumeration. */
export enum GitHubUserSortEnum {
  AvatarUrlAsc = 'AVATAR_URL_ASC',
  AvatarUrlDesc = 'AVATAR_URL_DESC',
  GitHubIdAsc = 'GIT_HUB_ID_ASC',
  GitHubIdDesc = 'GIT_HUB_ID_DESC',
  LoginAsc = 'LOGIN_ASC',
  LoginDesc = 'LOGIN_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** Record of errors, etc. */
export type Log = Node & {
  __typename?: 'Log';
  /** The ID of the object. */
  id: Scalars['ID'];
  id_: Scalars['ID'];
  level?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['DateTime']>;
};

export type LogConnection = {
  __typename?: 'LogConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LogEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `Log` and its cursor. */
export type LogEdge = {
  __typename?: 'LogEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Log>;
};

/** An enumeration. */
export enum LogSortEnum {
  IdAsc = 'ID__ASC',
  IdDesc = 'ID__DESC',
  LevelAsc = 'LEVEL_ASC',
  LevelDesc = 'LEVEL_DESC',
  MessageAsc = 'MESSAGE_ASC',
  MessageDesc = 'MESSAGE_DESC',
  TimeAsc = 'TIME_ASC',
  TimeDesc = 'TIME_DESC'
}

export type MutationAdmin = {
  __typename?: 'MutationAdmin';
  /** Add a token for a GitHub Admin App */
  addGitHubAdminAppToken?: Maybe<AddGitHubAdminAppToken>;
  addGitHubOrg?: Maybe<AddGitHubOrg>;
  authenticateWithGitHub?: Maybe<AuthenticateWithGitHub>;
  /** Convert the product type of a product */
  convertProductType?: Maybe<ConvertProductType>;
  /** Create a field */
  createField?: Maybe<CreateField>;
  /** Create a log */
  createLog?: Maybe<CreateLog>;
  /** Create a product */
  createProduct?: Maybe<CreateProduct>;
  createProductFilePath?: Maybe<CreateProductFilePath>;
  /**
   * Add relations between two products. The arguments only specify the relation
   * from one product to the other. The reverse relation will be also added.
   */
  createProductRelation?: Maybe<CreateProductRelation>;
  /** Create a pair of product relation types */
  createProductRelationTypes?: Maybe<CreateProductRelationTypes>;
  /** Create a product type */
  createProductType?: Maybe<CreateProductType>;
  /** Delete a field */
  deleteField?: Maybe<DeleteField>;
  /** Delete a token for a GitHub Admin App */
  deleteGitHubAdminAppToken?: Maybe<DeleteGitHubAdminAppToken>;
  deleteGitHubOrg?: Maybe<DeleteGitHubOrg>;
  /** Delete a log */
  deleteLog?: Maybe<DeleteLog>;
  /** Delete a product */
  deleteProduct?: Maybe<DeleteProduct>;
  deleteProductFilePath?: Maybe<DeleteProductFilePath>;
  /** Remove relations from two products. */
  deleteProductRelation?: Maybe<DeleteProductRelation>;
  /** Delete a pair of product relation types */
  deleteProductRelationTypes?: Maybe<DeleteProductRelationTypes>;
  /** Delete a product type */
  deleteProductType?: Maybe<DeleteProductType>;
  saveWebConfig?: Maybe<SaveWebconfig>;
  /** Update a field */
  updateField?: Maybe<UpdateField>;
  /** Update the member lists of GitHub organizations */
  updateGitHubOrgMemberLists?: Maybe<UpdateGitHubOrgMemberLists>;
  /**
   * Update a product.
   *
   * Note: This is to update the DB entry about a product. If the
   * product itself has been updated, a new entry should be added by
   * createProduct()
   */
  updateProduct?: Maybe<UpdateProduct>;
  updateProductFilePath?: Maybe<UpdateProductFilePath>;
  /** Update a product relation type */
  updateProductRelationType?: Maybe<UpdateProductRelationType>;
  /** Update a product type */
  updateProductType?: Maybe<UpdateProductType>;
};


export type MutationAdminAddGitHubAdminAppTokenArgs = {
  code: Scalars['String'];
};


export type MutationAdminAddGitHubOrgArgs = {
  login: Scalars['String'];
};


export type MutationAdminAuthenticateWithGitHubArgs = {
  code: Scalars['String'];
};


export type MutationAdminConvertProductTypeArgs = {
  productId: Scalars['Int'];
  typeId: Scalars['Int'];
};


export type MutationAdminCreateFieldArgs = {
  input: CreateFieldInput;
};


export type MutationAdminCreateLogArgs = {
  input: CreateLogInput;
};


export type MutationAdminCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationAdminCreateProductFilePathArgs = {
  input: CreateProductFilePathInput;
};


export type MutationAdminCreateProductRelationArgs = {
  input: CreateProductRelationInput;
};


export type MutationAdminCreateProductRelationTypesArgs = {
  reverse?: InputMaybe<CreateProductRelationTypeInput>;
  selfReverse?: InputMaybe<Scalars['Boolean']>;
  type: CreateProductRelationTypeInput;
};


export type MutationAdminCreateProductTypeArgs = {
  input: CreateProductTypeInput;
};


export type MutationAdminDeleteFieldArgs = {
  fieldId?: InputMaybe<Scalars['Int']>;
};


export type MutationAdminDeleteGitHubAdminAppTokenArgs = {
  tokenId: Scalars['Int'];
};


export type MutationAdminDeleteGitHubOrgArgs = {
  login: Scalars['String'];
};


export type MutationAdminDeleteLogArgs = {
  id_?: InputMaybe<Scalars['Int']>;
};


export type MutationAdminDeleteProductArgs = {
  productId: Scalars['Int'];
};


export type MutationAdminDeleteProductFilePathArgs = {
  pathId?: InputMaybe<Scalars['Int']>;
};


export type MutationAdminDeleteProductRelationArgs = {
  relationId: Scalars['Int'];
};


export type MutationAdminDeleteProductRelationTypesArgs = {
  typeId: Scalars['Int'];
};


export type MutationAdminDeleteProductTypeArgs = {
  typeId?: InputMaybe<Scalars['Int']>;
};


export type MutationAdminSaveWebConfigArgs = {
  json: Scalars['String'];
};


export type MutationAdminUpdateFieldArgs = {
  fieldId: Scalars['Int'];
  input: UpdateFieldInput;
};


export type MutationAdminUpdateProductArgs = {
  input: UpdateProductInput;
  productId: Scalars['Int'];
};


export type MutationAdminUpdateProductFilePathArgs = {
  input: UpdateProductFilePathInput;
  pathId?: InputMaybe<Scalars['Int']>;
};


export type MutationAdminUpdateProductRelationTypeArgs = {
  input: UpdateProductRelationTypeInput;
  typeId: Scalars['Int'];
};


export type MutationAdminUpdateProductTypeArgs = {
  input: UpdateProductTypeInput;
  typeId: Scalars['Int'];
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type Product = Node & {
  __typename?: 'Product';
  attributesBoolean?: Maybe<AttributeBooleanConnection>;
  attributesDate?: Maybe<AttributeDateConnection>;
  attributesDateTime?: Maybe<AttributeDateTimeConnection>;
  attributesFloat?: Maybe<AttributeFloatConnection>;
  attributesInteger?: Maybe<AttributeIntegerConnection>;
  attributesTime?: Maybe<AttributeTimeConnection>;
  attributesUnicodeText?: Maybe<AttributeUnicodeTextConnection>;
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  paths?: Maybe<ProductFilePathConnection>;
  postingGitHubUser?: Maybe<GitHubUser>;
  postingGitHubUserId?: Maybe<Scalars['Int']>;
  productId: Scalars['ID'];
  relations?: Maybe<ProductRelationConnection>;
  timePosted?: Maybe<Scalars['DateTime']>;
  timeUpdated?: Maybe<Scalars['DateTime']>;
  typeId: Scalars['Int'];
  type_?: Maybe<ProductType>;
  updatingGitHubUser?: Maybe<GitHubUser>;
  updatingGitHubUserId?: Maybe<Scalars['Int']>;
};


export type ProductAttributesBooleanArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeBooleanSortEnum>>>;
};


export type ProductAttributesDateArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateSortEnum>>>;
};


export type ProductAttributesDateTimeArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateTimeSortEnum>>>;
};


export type ProductAttributesFloatArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeFloatSortEnum>>>;
};


export type ProductAttributesIntegerArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeIntegerSortEnum>>>;
};


export type ProductAttributesTimeArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeTimeSortEnum>>>;
};


export type ProductAttributesUnicodeTextArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeUnicodeTextSortEnum>>>;
};


export type ProductPathsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductFilePathSortEnum>>>;
};


export type ProductRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductRelationSortEnum>>>;
};

export type ProductConnection = {
  __typename?: 'ProductConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `Product` and its cursor. */
export type ProductEdge = {
  __typename?: 'ProductEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Product>;
};

export type ProductFilePath = Node & {
  __typename?: 'ProductFilePath';
  /** The ID of the object. */
  id: Scalars['ID'];
  note?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  pathId: Scalars['ID'];
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['Int']>;
};

export type ProductFilePathConnection = {
  __typename?: 'ProductFilePathConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductFilePathEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `ProductFilePath` and its cursor. */
export type ProductFilePathEdge = {
  __typename?: 'ProductFilePathEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ProductFilePath>;
};

/** An enumeration. */
export enum ProductFilePathSortEnum {
  NoteAsc = 'NOTE_ASC',
  NoteDesc = 'NOTE_DESC',
  PathAsc = 'PATH_ASC',
  PathDesc = 'PATH_DESC',
  PathIdAsc = 'PATH_ID_ASC',
  PathIdDesc = 'PATH_ID_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC'
}

export type ProductFilter = {
  /** Conjunction of filters joined by ``AND``. */
  and?: InputMaybe<Array<ProductFilter>>;
  /** Negation of filters. */
  not?: InputMaybe<ProductFilter>;
  /** Conjunction of filters joined by ``OR``. */
  or?: InputMaybe<Array<ProductFilter>>;
  /** Exact match. */
  typeId?: InputMaybe<Scalars['Int']>;
  typeName?: InputMaybe<Scalars['String']>;
};

/** A relation from one product to another */
export type ProductRelation = Node & {
  __typename?: 'ProductRelation';
  /** The ID of the object. */
  id: Scalars['ID'];
  other?: Maybe<Product>;
  otherProductId: Scalars['Int'];
  relationId: Scalars['ID'];
  reverse?: Maybe<ProductRelation>;
  reverseRelationId?: Maybe<Scalars['Int']>;
  selfProductId: Scalars['Int'];
  self_?: Maybe<Product>;
  typeId: Scalars['Int'];
  type_?: Maybe<ProductRelationType>;
};

export type ProductRelationConnection = {
  __typename?: 'ProductRelationConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductRelationEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `ProductRelation` and its cursor. */
export type ProductRelationEdge = {
  __typename?: 'ProductRelationEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ProductRelation>;
};

/** An enumeration. */
export enum ProductRelationSortEnum {
  OtherProductIdAsc = 'OTHER_PRODUCT_ID_ASC',
  OtherProductIdDesc = 'OTHER_PRODUCT_ID_DESC',
  RelationIdAsc = 'RELATION_ID_ASC',
  RelationIdDesc = 'RELATION_ID_DESC',
  ReverseRelationIdAsc = 'REVERSE_RELATION_ID_ASC',
  ReverseRelationIdDesc = 'REVERSE_RELATION_ID_DESC',
  SelfProductIdAsc = 'SELF_PRODUCT_ID_ASC',
  SelfProductIdDesc = 'SELF_PRODUCT_ID_DESC',
  TypeIdAsc = 'TYPE_ID_ASC',
  TypeIdDesc = 'TYPE_ID_DESC'
}

/** A type of relations between products */
export type ProductRelationType = Node & {
  __typename?: 'ProductRelationType';
  /** The ID of the object. */
  id: Scalars['ID'];
  indefArticle?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  plural?: Maybe<Scalars['String']>;
  relations?: Maybe<ProductRelationConnection>;
  reverse?: Maybe<ProductRelationType>;
  reverseTypeId?: Maybe<Scalars['Int']>;
  singular?: Maybe<Scalars['String']>;
  typeId: Scalars['ID'];
};


/** A type of relations between products */
export type ProductRelationTypeRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductRelationSortEnum>>>;
};

export type ProductRelationTypeConnection = {
  __typename?: 'ProductRelationTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductRelationTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `ProductRelationType` and its cursor. */
export type ProductRelationTypeEdge = {
  __typename?: 'ProductRelationTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ProductRelationType>;
};

/** An enumeration. */
export enum ProductRelationTypeSortEnum {
  IndefArticleAsc = 'INDEF_ARTICLE_ASC',
  IndefArticleDesc = 'INDEF_ARTICLE_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  PluralAsc = 'PLURAL_ASC',
  PluralDesc = 'PLURAL_DESC',
  ReverseTypeIdAsc = 'REVERSE_TYPE_ID_ASC',
  ReverseTypeIdDesc = 'REVERSE_TYPE_ID_DESC',
  SingularAsc = 'SINGULAR_ASC',
  SingularDesc = 'SINGULAR_DESC',
  TypeIdAsc = 'TYPE_ID_ASC',
  TypeIdDesc = 'TYPE_ID_DESC'
}

/** An enumeration. */
export enum ProductSortEnum {
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  NoteAsc = 'NOTE_ASC',
  NoteDesc = 'NOTE_DESC',
  PostingGitHubUserIdAsc = 'POSTING_GIT_HUB_USER_ID_ASC',
  PostingGitHubUserIdDesc = 'POSTING_GIT_HUB_USER_ID_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  TimePostedAsc = 'TIME_POSTED_ASC',
  TimePostedDesc = 'TIME_POSTED_DESC',
  TimeUpdatedAsc = 'TIME_UPDATED_ASC',
  TimeUpdatedDesc = 'TIME_UPDATED_DESC',
  TypeIdAsc = 'TYPE_ID_ASC',
  TypeIdDesc = 'TYPE_ID_DESC',
  UpdatingGitHubUserIdAsc = 'UPDATING_GIT_HUB_USER_ID_ASC',
  UpdatingGitHubUserIdDesc = 'UPDATING_GIT_HUB_USER_ID_DESC'
}

/** A product type */
export type ProductType = Node & {
  __typename?: 'ProductType';
  fields?: Maybe<TypeFieldAssociationConnection>;
  icon?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  indefArticle?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  order?: Maybe<Scalars['Int']>;
  plural?: Maybe<Scalars['String']>;
  products?: Maybe<ProductConnection>;
  singular?: Maybe<Scalars['String']>;
  typeId: Scalars['ID'];
};


/** A product type */
export type ProductTypeFieldsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<TypeFieldAssociationSortEnum>>>;
};


/** A product type */
export type ProductTypeProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductSortEnum>>>;
};

export type ProductTypeConnection = {
  __typename?: 'ProductTypeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `ProductType` and its cursor. */
export type ProductTypeEdge = {
  __typename?: 'ProductTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ProductType>;
};

export type ProductTypeFilter = {
  /** Conjunction of filters joined by ``AND``. */
  and?: InputMaybe<Array<ProductTypeFilter>>;
  /** Negation of filters. */
  not?: InputMaybe<ProductTypeFilter>;
  /** Conjunction of filters joined by ``OR``. */
  or?: InputMaybe<Array<ProductTypeFilter>>;
};

/** An enumeration. */
export enum ProductTypeSortEnum {
  IconAsc = 'ICON_ASC',
  IconDesc = 'ICON_DESC',
  IndefArticleAsc = 'INDEF_ARTICLE_ASC',
  IndefArticleDesc = 'INDEF_ARTICLE_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  OrderAsc = 'ORDER_ASC',
  OrderDesc = 'ORDER_DESC',
  PluralAsc = 'PLURAL_ASC',
  PluralDesc = 'PLURAL_DESC',
  SingularAsc = 'SINGULAR_ASC',
  SingularDesc = 'SINGULAR_DESC',
  TypeIdAsc = 'TYPE_ID_ASC',
  TypeIdDesc = 'TYPE_ID_DESC'
}

export type QueryAdmin = {
  __typename?: 'QueryAdmin';
  /** The version of Alembic migration */
  alembicVersion?: Maybe<Scalars['String']>;
  allFields?: Maybe<FieldConnection>;
  allGitHubOrgs?: Maybe<GitHubOrgConnection>;
  allGitHubTokens?: Maybe<GitHubTokenConnection>;
  allGitHubUsers?: Maybe<GitHubUserConnection>;
  allLogs?: Maybe<LogConnection>;
  allProductFilePaths?: Maybe<ProductFilePathConnection>;
  allProductRelationTypes?: Maybe<ProductRelationTypeConnection>;
  allProductRelations?: Maybe<ProductRelationConnection>;
  allProductTypes?: Maybe<ProductTypeConnection>;
  allProducts?: Maybe<ProductConnection>;
  field?: Maybe<Field>;
  gitHubOAuthAppInfo?: Maybe<GitHubOAuthAppInfo>;
  gitHubViewer?: Maybe<GitHubUser>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isSignedIn?: Maybe<Scalars['Boolean']>;
  log?: Maybe<Log>;
  node?: Maybe<Node>;
  product?: Maybe<Product>;
  productRelation?: Maybe<ProductRelation>;
  productRelationType?: Maybe<ProductRelationType>;
  productType?: Maybe<ProductType>;
  /** The version of Acondbs */
  version?: Maybe<Scalars['String']>;
  webConfig?: Maybe<WebConfig>;
};


export type QueryAdminAllFieldsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<FieldSortEnum>>>;
};


export type QueryAdminAllGitHubOrgsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<GitHubOrgSortEnum>>>;
};


export type QueryAdminAllGitHubTokensArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<GitHubTokenFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<GitHubTokenSortEnum>>>;
};


export type QueryAdminAllGitHubUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<GitHubUserFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<GitHubUserSortEnum>>>;
};


export type QueryAdminAllLogsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<LogSortEnum>>>;
};


export type QueryAdminAllProductFilePathsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductFilePathSortEnum>>>;
};


export type QueryAdminAllProductRelationTypesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductRelationTypeSortEnum>>>;
};


export type QueryAdminAllProductRelationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductRelationSortEnum>>>;
};


export type QueryAdminAllProductTypesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<ProductTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductTypeSortEnum>>>;
};


export type QueryAdminAllProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<ProductSortEnum>>>;
};


export type QueryAdminFieldArgs = {
  fieldId?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryAdminLogArgs = {
  id_?: InputMaybe<Scalars['Int']>;
};


export type QueryAdminNodeArgs = {
  id: Scalars['ID'];
};


export type QueryAdminProductArgs = {
  name?: InputMaybe<Scalars['String']>;
  productId?: InputMaybe<Scalars['Int']>;
  typeId?: InputMaybe<Scalars['Int']>;
};


export type QueryAdminProductRelationArgs = {
  relationId?: InputMaybe<Scalars['Int']>;
};


export type QueryAdminProductRelationTypeArgs = {
  name?: InputMaybe<Scalars['String']>;
  typeId?: InputMaybe<Scalars['Int']>;
};


export type QueryAdminProductTypeArgs = {
  name?: InputMaybe<Scalars['String']>;
  typeId?: InputMaybe<Scalars['Int']>;
};

/** A relation to another product */
export type RelationInputFields = {
  /** The product ID of the other product */
  productId: Scalars['Int'];
  /** The relation type ID */
  typeId: Scalars['Int'];
};

export type SaveWebconfig = {
  __typename?: 'SaveWebconfig';
  ok?: Maybe<Scalars['Boolean']>;
  webConfig?: Maybe<WebConfig>;
};

export type TypeFieldAssociation = Node & {
  __typename?: 'TypeFieldAssociation';
  attributesBoolean?: Maybe<AttributeBooleanConnection>;
  attributesDate?: Maybe<AttributeDateConnection>;
  attributesDateTime?: Maybe<AttributeDateTimeConnection>;
  attributesFloat?: Maybe<AttributeFloatConnection>;
  attributesInteger?: Maybe<AttributeIntegerConnection>;
  attributesTime?: Maybe<AttributeTimeConnection>;
  attributesUnicodeText?: Maybe<AttributeUnicodeTextConnection>;
  field?: Maybe<Field>;
  fieldId: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  iid: Scalars['ID'];
  order?: Maybe<Scalars['Int']>;
  typeId: Scalars['Int'];
  type_?: Maybe<ProductType>;
};


export type TypeFieldAssociationAttributesBooleanArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeBooleanSortEnum>>>;
};


export type TypeFieldAssociationAttributesDateArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateSortEnum>>>;
};


export type TypeFieldAssociationAttributesDateTimeArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateTimeSortEnum>>>;
};


export type TypeFieldAssociationAttributesFloatArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeFloatSortEnum>>>;
};


export type TypeFieldAssociationAttributesIntegerArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeIntegerSortEnum>>>;
};


export type TypeFieldAssociationAttributesTimeArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeTimeSortEnum>>>;
};


export type TypeFieldAssociationAttributesUnicodeTextArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<AttributeUnicodeTextSortEnum>>>;
};

export type TypeFieldAssociationConnection = {
  __typename?: 'TypeFieldAssociationConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TypeFieldAssociationEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** A Relay edge containing a `TypeFieldAssociation` and its cursor. */
export type TypeFieldAssociationEdge = {
  __typename?: 'TypeFieldAssociationEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<TypeFieldAssociation>;
};

/** An enumeration. */
export enum TypeFieldAssociationSortEnum {
  FieldIdAsc = 'FIELD_ID_ASC',
  FieldIdDesc = 'FIELD_ID_DESC',
  IidAsc = 'IID_ASC',
  IidDesc = 'IID_DESC',
  OrderAsc = 'ORDER_ASC',
  OrderDesc = 'ORDER_DESC',
  TypeIdAsc = 'TYPE_ID_ASC',
  TypeIdDesc = 'TYPE_ID_DESC'
}

/** Update a field */
export type UpdateField = {
  __typename?: 'UpdateField';
  field?: Maybe<Field>;
  ok?: Maybe<Scalars['Boolean']>;
};

/** Input to updateField() */
export type UpdateFieldInput = {
  /** The name of the field */
  name: Scalars['String'];
};

/** Update the member lists of GitHub organizations */
export type UpdateGitHubOrgMemberLists = {
  __typename?: 'UpdateGitHubOrgMemberLists';
  ok?: Maybe<Scalars['Boolean']>;
};

/**
 * Update a product.
 *
 * Note: This is to update the DB entry about a product. If the
 * product itself has been updated, a new entry should be added by
 * createProduct()
 */
export type UpdateProduct = {
  __typename?: 'UpdateProduct';
  ok?: Maybe<Scalars['Boolean']>;
  product?: Maybe<Product>;
};

export type UpdateProductFilePath = {
  __typename?: 'UpdateProductFilePath';
  ok?: Maybe<Scalars['Boolean']>;
  productFilePath?: Maybe<ProductFilePath>;
};

export type UpdateProductFilePathInput = {
  note?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
};

/** Input to updateProduct() */
export type UpdateProductInput = {
  /** Attributes */
  attributes?: InputMaybe<AttributesInputFields>;
  /** The name of the product */
  name?: InputMaybe<Scalars['String']>;
  /** Note about the product in MarkDown. */
  note?: InputMaybe<Scalars['String']>;
  /** Paths to the products. e.g., nersc:/go/to/my/product_v3 */
  paths?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Relations to other products */
  relations?: InputMaybe<Array<InputMaybe<RelationInputFields>>>;
};

/** Update a product relation type */
export type UpdateProductRelationType = {
  __typename?: 'UpdateProductRelationType';
  ok?: Maybe<Scalars['Boolean']>;
  productRelationType?: Maybe<ProductRelationType>;
};

/** An input to updateProductRelationType() */
export type UpdateProductRelationTypeInput = {
  /** The indefinite article placed before the singular noun "i.e., "a" or "an".  */
  indefArticle?: InputMaybe<Scalars['String']>;
  /** The plural noun, the relation type name in plural. */
  plural?: InputMaybe<Scalars['String']>;
  /** The singular noun, the relation type name in singular. */
  singular?: InputMaybe<Scalars['String']>;
};

/** Update a product type */
export type UpdateProductType = {
  __typename?: 'UpdateProductType';
  ok?: Maybe<Scalars['Boolean']>;
  productType?: Maybe<ProductType>;
};

/** Input to updateProductType() */
export type UpdateProductTypeInput = {
  /** The field IDs */
  fieldIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** A name of the icon from https://materialdesignicons.com/ */
  icon?: InputMaybe<Scalars['String']>;
  /** The indefinite article placed before the singular noun "i.e., "a" or "an".  */
  indefArticle?: InputMaybe<Scalars['String']>;
  /** The name of the product type */
  name?: InputMaybe<Scalars['String']>;
  /** The order in which the type is displayed, for example, in navigation bars. */
  order?: InputMaybe<Scalars['Int']>;
  /** The plural noun, the product type name in plural. */
  plural?: InputMaybe<Scalars['String']>;
  /** The singular noun, the product type name in singular. */
  singular?: InputMaybe<Scalars['String']>;
};

/** Web configuration */
export type WebConfig = Node & {
  __typename?: 'WebConfig';
  /** The ID of the object. */
  id: Scalars['ID'];
  id_: Scalars['ID'];
  json?: Maybe<Scalars['String']>;
};
