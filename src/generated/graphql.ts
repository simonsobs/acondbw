import gql from "graphql-tag";
import * as Urql from "@urql/vue";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  __typename?: "AddGitHubAdminAppToken";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type AddGitHubOrg = {
  __typename?: "AddGitHubOrg";
  gitHubOrg?: Maybe<GitHubOrg>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** A boolean attribute of a product */
export type AttributeBoolean = Node & {
  __typename?: "AttributeBoolean";
  field?: Maybe<Field>;
  fieldId: Scalars["Int"];
  /** The ID of the object. */
  id: Scalars["ID"];
  iid: Scalars["ID"];
  product?: Maybe<Product>;
  productId: Scalars["Int"];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars["Int"];
  value?: Maybe<Scalars["Boolean"]>;
};

export type AttributeBooleanConnection = {
  __typename?: "AttributeBooleanConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeBooleanEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `AttributeBoolean` and its cursor. */
export type AttributeBooleanEdge = {
  __typename?: "AttributeBooleanEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<AttributeBoolean>;
};

export type AttributeBooleanInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars["Int"];
  /** The value of the attribute */
  value?: InputMaybe<Scalars["Boolean"]>;
};

/** An enumeration. */
export enum AttributeBooleanSortEnum {
  FieldIdAsc = "FIELD_ID_ASC",
  FieldIdDesc = "FIELD_ID_DESC",
  IidAsc = "IID_ASC",
  IidDesc = "IID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
  TypeFieldAssociationIidAsc = "TYPE_FIELD_ASSOCIATION_IID_ASC",
  TypeFieldAssociationIidDesc = "TYPE_FIELD_ASSOCIATION_IID_DESC",
  ValueAsc = "VALUE_ASC",
  ValueDesc = "VALUE_DESC",
}

/** A date attribute of a product */
export type AttributeDate = Node & {
  __typename?: "AttributeDate";
  field?: Maybe<Field>;
  fieldId: Scalars["Int"];
  /** The ID of the object. */
  id: Scalars["ID"];
  iid: Scalars["ID"];
  product?: Maybe<Product>;
  productId: Scalars["Int"];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars["Int"];
  value?: Maybe<Scalars["String"]>;
};

export type AttributeDateConnection = {
  __typename?: "AttributeDateConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeDateEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `AttributeDate` and its cursor. */
export type AttributeDateEdge = {
  __typename?: "AttributeDateEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<AttributeDate>;
};

export type AttributeDateInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars["Int"];
  /** The value of the attribute */
  value?: InputMaybe<Scalars["Date"]>;
};

/** An enumeration. */
export enum AttributeDateSortEnum {
  FieldIdAsc = "FIELD_ID_ASC",
  FieldIdDesc = "FIELD_ID_DESC",
  IidAsc = "IID_ASC",
  IidDesc = "IID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
  TypeFieldAssociationIidAsc = "TYPE_FIELD_ASSOCIATION_IID_ASC",
  TypeFieldAssociationIidDesc = "TYPE_FIELD_ASSOCIATION_IID_DESC",
  ValueAsc = "VALUE_ASC",
  ValueDesc = "VALUE_DESC",
}

/** A date time attribute of a product */
export type AttributeDateTime = Node & {
  __typename?: "AttributeDateTime";
  field?: Maybe<Field>;
  fieldId: Scalars["Int"];
  /** The ID of the object. */
  id: Scalars["ID"];
  iid: Scalars["ID"];
  product?: Maybe<Product>;
  productId: Scalars["Int"];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars["Int"];
  value?: Maybe<Scalars["DateTime"]>;
};

export type AttributeDateTimeConnection = {
  __typename?: "AttributeDateTimeConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeDateTimeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `AttributeDateTime` and its cursor. */
export type AttributeDateTimeEdge = {
  __typename?: "AttributeDateTimeEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<AttributeDateTime>;
};

export type AttributeDateTimeInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars["Int"];
  /** The value of the attribute */
  value?: InputMaybe<Scalars["DateTime"]>;
};

/** An enumeration. */
export enum AttributeDateTimeSortEnum {
  FieldIdAsc = "FIELD_ID_ASC",
  FieldIdDesc = "FIELD_ID_DESC",
  IidAsc = "IID_ASC",
  IidDesc = "IID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
  TypeFieldAssociationIidAsc = "TYPE_FIELD_ASSOCIATION_IID_ASC",
  TypeFieldAssociationIidDesc = "TYPE_FIELD_ASSOCIATION_IID_DESC",
  ValueAsc = "VALUE_ASC",
  ValueDesc = "VALUE_DESC",
}

/** A float attribute of a product */
export type AttributeFloat = Node & {
  __typename?: "AttributeFloat";
  field?: Maybe<Field>;
  fieldId: Scalars["Int"];
  /** The ID of the object. */
  id: Scalars["ID"];
  iid: Scalars["ID"];
  product?: Maybe<Product>;
  productId: Scalars["Int"];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars["Int"];
  value?: Maybe<Scalars["Float"]>;
};

export type AttributeFloatConnection = {
  __typename?: "AttributeFloatConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeFloatEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `AttributeFloat` and its cursor. */
export type AttributeFloatEdge = {
  __typename?: "AttributeFloatEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<AttributeFloat>;
};

export type AttributeFloatInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars["Int"];
  /** The value of the attribute */
  value?: InputMaybe<Scalars["Float"]>;
};

/** An enumeration. */
export enum AttributeFloatSortEnum {
  FieldIdAsc = "FIELD_ID_ASC",
  FieldIdDesc = "FIELD_ID_DESC",
  IidAsc = "IID_ASC",
  IidDesc = "IID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
  TypeFieldAssociationIidAsc = "TYPE_FIELD_ASSOCIATION_IID_ASC",
  TypeFieldAssociationIidDesc = "TYPE_FIELD_ASSOCIATION_IID_DESC",
  ValueAsc = "VALUE_ASC",
  ValueDesc = "VALUE_DESC",
}

/** An integer attribute of a product */
export type AttributeInteger = Node & {
  __typename?: "AttributeInteger";
  field?: Maybe<Field>;
  fieldId: Scalars["Int"];
  /** The ID of the object. */
  id: Scalars["ID"];
  iid: Scalars["ID"];
  product?: Maybe<Product>;
  productId: Scalars["Int"];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars["Int"];
  value?: Maybe<Scalars["Int"]>;
};

export type AttributeIntegerConnection = {
  __typename?: "AttributeIntegerConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeIntegerEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `AttributeInteger` and its cursor. */
export type AttributeIntegerEdge = {
  __typename?: "AttributeIntegerEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<AttributeInteger>;
};

export type AttributeIntegerInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars["Int"];
  /** The value of the attribute */
  value?: InputMaybe<Scalars["Int"]>;
};

/** An enumeration. */
export enum AttributeIntegerSortEnum {
  FieldIdAsc = "FIELD_ID_ASC",
  FieldIdDesc = "FIELD_ID_DESC",
  IidAsc = "IID_ASC",
  IidDesc = "IID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
  TypeFieldAssociationIidAsc = "TYPE_FIELD_ASSOCIATION_IID_ASC",
  TypeFieldAssociationIidDesc = "TYPE_FIELD_ASSOCIATION_IID_DESC",
  ValueAsc = "VALUE_ASC",
  ValueDesc = "VALUE_DESC",
}

/** A time attribute of a product */
export type AttributeTime = Node & {
  __typename?: "AttributeTime";
  field?: Maybe<Field>;
  fieldId: Scalars["Int"];
  /** The ID of the object. */
  id: Scalars["ID"];
  iid: Scalars["ID"];
  product?: Maybe<Product>;
  productId: Scalars["Int"];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars["Int"];
  value?: Maybe<Scalars["String"]>;
};

export type AttributeTimeConnection = {
  __typename?: "AttributeTimeConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeTimeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `AttributeTime` and its cursor. */
export type AttributeTimeEdge = {
  __typename?: "AttributeTimeEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<AttributeTime>;
};

export type AttributeTimeInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars["Int"];
  /** The value of the attribute */
  value?: InputMaybe<Scalars["Time"]>;
};

/** An enumeration. */
export enum AttributeTimeSortEnum {
  FieldIdAsc = "FIELD_ID_ASC",
  FieldIdDesc = "FIELD_ID_DESC",
  IidAsc = "IID_ASC",
  IidDesc = "IID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
  TypeFieldAssociationIidAsc = "TYPE_FIELD_ASSOCIATION_IID_ASC",
  TypeFieldAssociationIidDesc = "TYPE_FIELD_ASSOCIATION_IID_DESC",
  ValueAsc = "VALUE_ASC",
  ValueDesc = "VALUE_DESC",
}

/** A unicode text attribute of a product */
export type AttributeUnicodeText = Node & {
  __typename?: "AttributeUnicodeText";
  field?: Maybe<Field>;
  fieldId: Scalars["Int"];
  /** The ID of the object. */
  id: Scalars["ID"];
  iid: Scalars["ID"];
  product?: Maybe<Product>;
  productId: Scalars["Int"];
  typeFieldAssociation?: Maybe<TypeFieldAssociation>;
  typeFieldAssociationIid: Scalars["Int"];
  value?: Maybe<Scalars["String"]>;
};

export type AttributeUnicodeTextConnection = {
  __typename?: "AttributeUnicodeTextConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttributeUnicodeTextEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `AttributeUnicodeText` and its cursor. */
export type AttributeUnicodeTextEdge = {
  __typename?: "AttributeUnicodeTextEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<AttributeUnicodeText>;
};

export type AttributeUnicodeTextInputFields = {
  /** The field ID of the attribute */
  fieldId: Scalars["Int"];
  /** The value of the attribute */
  value?: InputMaybe<Scalars["String"]>;
};

/** An enumeration. */
export enum AttributeUnicodeTextSortEnum {
  FieldIdAsc = "FIELD_ID_ASC",
  FieldIdDesc = "FIELD_ID_DESC",
  IidAsc = "IID_ASC",
  IidDesc = "IID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
  TypeFieldAssociationIidAsc = "TYPE_FIELD_ASSOCIATION_IID_ASC",
  TypeFieldAssociationIidDesc = "TYPE_FIELD_ASSOCIATION_IID_DESC",
  ValueAsc = "VALUE_ASC",
  ValueDesc = "VALUE_DESC",
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
  __typename?: "AuthPayload";
  token?: Maybe<Scalars["String"]>;
};

export type AuthenticateWithGitHub = {
  __typename?: "AuthenticateWithGitHub";
  authPayload?: Maybe<AuthPayload>;
};

/** Convert the product type of a product */
export type ConvertProductType = {
  __typename?: "ConvertProductType";
  ok?: Maybe<Scalars["Boolean"]>;
  product?: Maybe<Product>;
};

/** Create a field */
export type CreateField = {
  __typename?: "CreateField";
  field?: Maybe<Field>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Input to createField() */
export type CreateFieldInput = {
  /** The name of the field */
  name: Scalars["String"];
  type_?: InputMaybe<FieldType>;
};

/** Create a log */
export type CreateLog = {
  __typename?: "CreateLog";
  log?: Maybe<Log>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Input to createLog() */
export type CreateLogInput = {
  id_?: InputMaybe<Scalars["Int"]>;
  /** The log level */
  level?: InputMaybe<Scalars["String"]>;
  /** The message */
  message?: InputMaybe<Scalars["String"]>;
};

/** Create a product */
export type CreateProduct = {
  __typename?: "CreateProduct";
  ok?: Maybe<Scalars["Boolean"]>;
  product?: Maybe<Product>;
};

export type CreateProductFilePath = {
  __typename?: "CreateProductFilePath";
  ok?: Maybe<Scalars["Boolean"]>;
  productFilePath?: Maybe<ProductFilePath>;
};

export type CreateProductFilePathInput = {
  note?: InputMaybe<Scalars["String"]>;
  path?: InputMaybe<Scalars["String"]>;
  productId?: InputMaybe<Scalars["Int"]>;
};

/** Input to createProduct() */
export type CreateProductInput = {
  /** Attributes */
  attributes?: InputMaybe<AttributesInputFields>;
  /** The name of the product */
  name: Scalars["String"];
  /** Note about the product in MarkDown. */
  note?: InputMaybe<Scalars["String"]>;
  /** Paths to the products. e.g., nersc:/go/to/my/product_v3 */
  paths?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Relations to other products */
  relations?: InputMaybe<Array<InputMaybe<RelationInputFields>>>;
  /** The product type ID */
  typeId: Scalars["Int"];
};

/**
 * Add relations between two products. The arguments only specify the relation
 * from one product to the other. The reverse relation will be also added.
 */
export type CreateProductRelation = {
  __typename?: "CreateProductRelation";
  ok?: Maybe<Scalars["Boolean"]>;
  productRelation?: Maybe<ProductRelation>;
};

/** An input to createProductRelation() */
export type CreateProductRelationInput = {
  /** The productId of the other product */
  otherProductId: Scalars["Int"];
  /** The productId of the self product */
  selfProductId: Scalars["Int"];
  /** The typeId of the product relation type of the relation from "self" to the "other" */
  typeId: Scalars["Int"];
};

/** An input to createProductRelationTypes() */
export type CreateProductRelationTypeInput = {
  /** The indefinite article placed before the singular noun "i.e., "a" or "an".  */
  indefArticle?: InputMaybe<Scalars["String"]>;
  /** The name of the relation type */
  name: Scalars["String"];
  /** The plural noun, the relation type name in plural. */
  plural?: InputMaybe<Scalars["String"]>;
  /** The singular noun, the relation type name in singular. */
  singular?: InputMaybe<Scalars["String"]>;
};

/** Create a pair of product relation types */
export type CreateProductRelationTypes = {
  __typename?: "CreateProductRelationTypes";
  ok?: Maybe<Scalars["Boolean"]>;
  productRelationType?: Maybe<ProductRelationType>;
};

/** Create a product type */
export type CreateProductType = {
  __typename?: "CreateProductType";
  ok?: Maybe<Scalars["Boolean"]>;
  productType?: Maybe<ProductType>;
};

/** Input to createProductType() */
export type CreateProductTypeInput = {
  /** The field IDs */
  fieldIds?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  /** A name of the icon from https://materialdesignicons.com/ */
  icon?: InputMaybe<Scalars["String"]>;
  /** The indefinite article placed before the singular noun "i.e., "a" or "an".  */
  indefArticle?: InputMaybe<Scalars["String"]>;
  /** The name of the product type */
  name: Scalars["String"];
  /** The order in which the type is displayed, for example, in navigation bars. */
  order?: InputMaybe<Scalars["Int"]>;
  /** The plural noun, the product type name in plural. */
  plural?: InputMaybe<Scalars["String"]>;
  /** The singular noun, the product type name in singular. */
  singular?: InputMaybe<Scalars["String"]>;
};

/** Delete a field */
export type DeleteField = {
  __typename?: "DeleteField";
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Delete a token for a GitHub Admin App */
export type DeleteGitHubAdminAppToken = {
  __typename?: "DeleteGitHubAdminAppToken";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteGitHubOrg = {
  __typename?: "DeleteGitHubOrg";
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Delete a log */
export type DeleteLog = {
  __typename?: "DeleteLog";
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Delete a product */
export type DeleteProduct = {
  __typename?: "DeleteProduct";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteProductFilePath = {
  __typename?: "DeleteProductFilePath";
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Remove relations from two products. */
export type DeleteProductRelation = {
  __typename?: "DeleteProductRelation";
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Delete a pair of product relation types */
export type DeleteProductRelationTypes = {
  __typename?: "DeleteProductRelationTypes";
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Delete a product type */
export type DeleteProductType = {
  __typename?: "DeleteProductType";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type Field = Node & {
  __typename?: "Field";
  attributesBoolean?: Maybe<AttributeBooleanConnection>;
  attributesDate?: Maybe<AttributeDateConnection>;
  attributesDateTime?: Maybe<AttributeDateTimeConnection>;
  attributesFloat?: Maybe<AttributeFloatConnection>;
  attributesInteger?: Maybe<AttributeIntegerConnection>;
  attributesTime?: Maybe<AttributeTimeConnection>;
  attributesUnicodeText?: Maybe<AttributeUnicodeTextConnection>;
  entryTypes?: Maybe<TypeFieldAssociationConnection>;
  fieldId: Scalars["ID"];
  /** The ID of the object. */
  id: Scalars["ID"];
  name: Scalars["String"];
  type_?: Maybe<FieldType>;
};

export type FieldAttributesBooleanArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeBooleanSortEnum>>>;
};

export type FieldAttributesDateArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateSortEnum>>>;
};

export type FieldAttributesDateTimeArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateTimeSortEnum>>>;
};

export type FieldAttributesFloatArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeFloatSortEnum>>>;
};

export type FieldAttributesIntegerArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeIntegerSortEnum>>>;
};

export type FieldAttributesTimeArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeTimeSortEnum>>>;
};

export type FieldAttributesUnicodeTextArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeUnicodeTextSortEnum>>>;
};

export type FieldEntryTypesArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<TypeFieldAssociationSortEnum>>>;
};

export type FieldConnection = {
  __typename?: "FieldConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FieldEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `Field` and its cursor. */
export type FieldEdge = {
  __typename?: "FieldEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<Field>;
};

/** An enumeration. */
export enum FieldSortEnum {
  FieldIdAsc = "FIELD_ID_ASC",
  FieldIdDesc = "FIELD_ID_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
}

/** An enumeration. */
export enum FieldType {
  Boolean = "BOOLEAN",
  Date = "DATE",
  DateTime = "DATE_TIME",
  Float = "FLOAT",
  Integer = "INTEGER",
  Time = "TIME",
  UnicodeText = "UNICODE_TEXT",
}

export type GitHubOAuthAppInfo = {
  __typename?: "GitHubOAuthAppInfo";
  authorizeUrl?: Maybe<Scalars["String"]>;
  clientId?: Maybe<Scalars["String"]>;
  redirectUri?: Maybe<Scalars["String"]>;
};

export type GitHubOrg = Node & {
  __typename?: "GitHubOrg";
  avatarUrl?: Maybe<Scalars["String"]>;
  gitHubId: Scalars["String"];
  /** The ID of the object. */
  id: Scalars["ID"];
  login: Scalars["String"];
  memberships?: Maybe<GitHubOrgMembershipConnection>;
  orgId: Scalars["ID"];
  url?: Maybe<Scalars["String"]>;
};

export type GitHubOrgMembershipsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<GitHubOrgMembershipSortEnum>>>;
};

export type GitHubOrgConnection = {
  __typename?: "GitHubOrgConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<GitHubOrgEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `GitHubOrg` and its cursor. */
export type GitHubOrgEdge = {
  __typename?: "GitHubOrgEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<GitHubOrg>;
};

export type GitHubOrgMembership = Node & {
  __typename?: "GitHubOrgMembership";
  entryId: Scalars["ID"];
  /** The ID of the object. */
  id: Scalars["ID"];
  member?: Maybe<GitHubUser>;
  memberId: Scalars["Int"];
  org?: Maybe<GitHubOrg>;
  orgId: Scalars["Int"];
};

export type GitHubOrgMembershipConnection = {
  __typename?: "GitHubOrgMembershipConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<GitHubOrgMembershipEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `GitHubOrgMembership` and its cursor. */
export type GitHubOrgMembershipEdge = {
  __typename?: "GitHubOrgMembershipEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<GitHubOrgMembership>;
};

/** An enumeration. */
export enum GitHubOrgMembershipSortEnum {
  EntryIdAsc = "ENTRY_ID_ASC",
  EntryIdDesc = "ENTRY_ID_DESC",
  MemberIdAsc = "MEMBER_ID_ASC",
  MemberIdDesc = "MEMBER_ID_DESC",
  OrgIdAsc = "ORG_ID_ASC",
  OrgIdDesc = "ORG_ID_DESC",
}

/** An enumeration. */
export enum GitHubOrgSortEnum {
  AvatarUrlAsc = "AVATAR_URL_ASC",
  AvatarUrlDesc = "AVATAR_URL_DESC",
  GitHubIdAsc = "GIT_HUB_ID_ASC",
  GitHubIdDesc = "GIT_HUB_ID_DESC",
  LoginAsc = "LOGIN_ASC",
  LoginDesc = "LOGIN_DESC",
  OrgIdAsc = "ORG_ID_ASC",
  OrgIdDesc = "ORG_ID_DESC",
  UrlAsc = "URL_ASC",
  UrlDesc = "URL_DESC",
}

export type GitHubToken = Node & {
  __typename?: "GitHubToken";
  /** The ID of the object. */
  id: Scalars["ID"];
  scope?: Maybe<Scalars["String"]>;
  timeCreated?: Maybe<Scalars["DateTime"]>;
  tokenId: Scalars["ID"];
  tokenMasked?: Maybe<Scalars["String"]>;
  user?: Maybe<GitHubUser>;
  userId: Scalars["Int"];
};

export type GitHubTokenConnection = {
  __typename?: "GitHubTokenConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<GitHubTokenEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `GitHubToken` and its cursor. */
export type GitHubTokenEdge = {
  __typename?: "GitHubTokenEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
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
  scopeIlike?: InputMaybe<Scalars["String"]>;
};

/** An enumeration. */
export enum GitHubTokenSortEnum {
  ScopeAsc = "SCOPE_ASC",
  ScopeDesc = "SCOPE_DESC",
  TimeCreatedAsc = "TIME_CREATED_ASC",
  TimeCreatedDesc = "TIME_CREATED_DESC",
  TokenIdAsc = "TOKEN_ID_ASC",
  TokenIdDesc = "TOKEN_ID_DESC",
  UserIdAsc = "USER_ID_ASC",
  UserIdDesc = "USER_ID_DESC",
}

export type GitHubUser = Node & {
  __typename?: "GitHubUser";
  avatarUrl?: Maybe<Scalars["String"]>;
  gitHubId: Scalars["String"];
  /** The ID of the object. */
  id: Scalars["ID"];
  login: Scalars["String"];
  memberships?: Maybe<GitHubOrgMembershipConnection>;
  name?: Maybe<Scalars["String"]>;
  postedProducts?: Maybe<ProductConnection>;
  tokens?: Maybe<GitHubTokenConnection>;
  updatedProducts?: Maybe<ProductConnection>;
  url?: Maybe<Scalars["String"]>;
  userId: Scalars["ID"];
};

export type GitHubUserMembershipsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<GitHubOrgMembershipSortEnum>>>;
};

export type GitHubUserPostedProductsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  filters?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductSortEnum>>>;
};

export type GitHubUserTokensArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  filters?: InputMaybe<GitHubTokenFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<GitHubTokenSortEnum>>>;
};

export type GitHubUserUpdatedProductsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  filters?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductSortEnum>>>;
};

export type GitHubUserConnection = {
  __typename?: "GitHubUserConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<GitHubUserEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `GitHubUser` and its cursor. */
export type GitHubUserEdge = {
  __typename?: "GitHubUserEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
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
  orgMember?: InputMaybe<Scalars["Boolean"]>;
};

/** An enumeration. */
export enum GitHubUserSortEnum {
  AvatarUrlAsc = "AVATAR_URL_ASC",
  AvatarUrlDesc = "AVATAR_URL_DESC",
  GitHubIdAsc = "GIT_HUB_ID_ASC",
  GitHubIdDesc = "GIT_HUB_ID_DESC",
  LoginAsc = "LOGIN_ASC",
  LoginDesc = "LOGIN_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  UrlAsc = "URL_ASC",
  UrlDesc = "URL_DESC",
  UserIdAsc = "USER_ID_ASC",
  UserIdDesc = "USER_ID_DESC",
}

/** Record of errors, etc. */
export type Log = Node & {
  __typename?: "Log";
  /** The ID of the object. */
  id: Scalars["ID"];
  id_: Scalars["ID"];
  level?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  time?: Maybe<Scalars["DateTime"]>;
};

export type LogConnection = {
  __typename?: "LogConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LogEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `Log` and its cursor. */
export type LogEdge = {
  __typename?: "LogEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<Log>;
};

/** An enumeration. */
export enum LogSortEnum {
  IdAsc = "ID__ASC",
  IdDesc = "ID__DESC",
  LevelAsc = "LEVEL_ASC",
  LevelDesc = "LEVEL_DESC",
  MessageAsc = "MESSAGE_ASC",
  MessageDesc = "MESSAGE_DESC",
  TimeAsc = "TIME_ASC",
  TimeDesc = "TIME_DESC",
}

export type MutationAdmin = {
  __typename?: "MutationAdmin";
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
  code: Scalars["String"];
};

export type MutationAdminAddGitHubOrgArgs = {
  login: Scalars["String"];
};

export type MutationAdminAuthenticateWithGitHubArgs = {
  code: Scalars["String"];
};

export type MutationAdminConvertProductTypeArgs = {
  productId: Scalars["Int"];
  typeId: Scalars["Int"];
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
  selfReverse?: InputMaybe<Scalars["Boolean"]>;
  type: CreateProductRelationTypeInput;
};

export type MutationAdminCreateProductTypeArgs = {
  input: CreateProductTypeInput;
};

export type MutationAdminDeleteFieldArgs = {
  fieldId?: InputMaybe<Scalars["Int"]>;
};

export type MutationAdminDeleteGitHubAdminAppTokenArgs = {
  tokenId: Scalars["Int"];
};

export type MutationAdminDeleteGitHubOrgArgs = {
  login: Scalars["String"];
};

export type MutationAdminDeleteLogArgs = {
  id_?: InputMaybe<Scalars["Int"]>;
};

export type MutationAdminDeleteProductArgs = {
  productId: Scalars["Int"];
};

export type MutationAdminDeleteProductFilePathArgs = {
  pathId?: InputMaybe<Scalars["Int"]>;
};

export type MutationAdminDeleteProductRelationArgs = {
  relationId: Scalars["Int"];
};

export type MutationAdminDeleteProductRelationTypesArgs = {
  typeId: Scalars["Int"];
};

export type MutationAdminDeleteProductTypeArgs = {
  typeId?: InputMaybe<Scalars["Int"]>;
};

export type MutationAdminSaveWebConfigArgs = {
  json: Scalars["String"];
};

export type MutationAdminUpdateFieldArgs = {
  fieldId: Scalars["Int"];
  input: UpdateFieldInput;
};

export type MutationAdminUpdateProductArgs = {
  input: UpdateProductInput;
  productId: Scalars["Int"];
};

export type MutationAdminUpdateProductFilePathArgs = {
  input: UpdateProductFilePathInput;
  pathId?: InputMaybe<Scalars["Int"]>;
};

export type MutationAdminUpdateProductRelationTypeArgs = {
  input: UpdateProductRelationTypeInput;
  typeId: Scalars["Int"];
};

export type MutationAdminUpdateProductTypeArgs = {
  input: UpdateProductTypeInput;
  typeId: Scalars["Int"];
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars["ID"];
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: "PageInfo";
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars["String"]>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars["String"]>;
};

export type Product = Node & {
  __typename?: "Product";
  attributesBoolean?: Maybe<AttributeBooleanConnection>;
  attributesDate?: Maybe<AttributeDateConnection>;
  attributesDateTime?: Maybe<AttributeDateTimeConnection>;
  attributesFloat?: Maybe<AttributeFloatConnection>;
  attributesInteger?: Maybe<AttributeIntegerConnection>;
  attributesTime?: Maybe<AttributeTimeConnection>;
  attributesUnicodeText?: Maybe<AttributeUnicodeTextConnection>;
  /** The ID of the object. */
  id: Scalars["ID"];
  name: Scalars["String"];
  note?: Maybe<Scalars["String"]>;
  paths?: Maybe<ProductFilePathConnection>;
  postingGitHubUser?: Maybe<GitHubUser>;
  postingGitHubUserId?: Maybe<Scalars["Int"]>;
  productId: Scalars["ID"];
  relations?: Maybe<ProductRelationConnection>;
  timePosted?: Maybe<Scalars["DateTime"]>;
  timeUpdated?: Maybe<Scalars["DateTime"]>;
  typeId: Scalars["Int"];
  type_?: Maybe<ProductType>;
  updatingGitHubUser?: Maybe<GitHubUser>;
  updatingGitHubUserId?: Maybe<Scalars["Int"]>;
};

export type ProductAttributesBooleanArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeBooleanSortEnum>>>;
};

export type ProductAttributesDateArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateSortEnum>>>;
};

export type ProductAttributesDateTimeArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateTimeSortEnum>>>;
};

export type ProductAttributesFloatArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeFloatSortEnum>>>;
};

export type ProductAttributesIntegerArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeIntegerSortEnum>>>;
};

export type ProductAttributesTimeArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeTimeSortEnum>>>;
};

export type ProductAttributesUnicodeTextArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeUnicodeTextSortEnum>>>;
};

export type ProductPathsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductFilePathSortEnum>>>;
};

export type ProductRelationsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductRelationSortEnum>>>;
};

export type ProductConnection = {
  __typename?: "ProductConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `Product` and its cursor. */
export type ProductEdge = {
  __typename?: "ProductEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<Product>;
};

export type ProductFilePath = Node & {
  __typename?: "ProductFilePath";
  /** The ID of the object. */
  id: Scalars["ID"];
  note?: Maybe<Scalars["String"]>;
  path?: Maybe<Scalars["String"]>;
  pathId: Scalars["ID"];
  product?: Maybe<Product>;
  productId?: Maybe<Scalars["Int"]>;
};

export type ProductFilePathConnection = {
  __typename?: "ProductFilePathConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductFilePathEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `ProductFilePath` and its cursor. */
export type ProductFilePathEdge = {
  __typename?: "ProductFilePathEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<ProductFilePath>;
};

/** An enumeration. */
export enum ProductFilePathSortEnum {
  NoteAsc = "NOTE_ASC",
  NoteDesc = "NOTE_DESC",
  PathAsc = "PATH_ASC",
  PathDesc = "PATH_DESC",
  PathIdAsc = "PATH_ID_ASC",
  PathIdDesc = "PATH_ID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
}

export type ProductFilter = {
  /** Conjunction of filters joined by ``AND``. */
  and?: InputMaybe<Array<ProductFilter>>;
  /** Negation of filters. */
  not?: InputMaybe<ProductFilter>;
  /** Conjunction of filters joined by ``OR``. */
  or?: InputMaybe<Array<ProductFilter>>;
  /** Exact match. */
  typeId?: InputMaybe<Scalars["Int"]>;
  typeName?: InputMaybe<Scalars["String"]>;
};

/** A relation from one product to another */
export type ProductRelation = Node & {
  __typename?: "ProductRelation";
  /** The ID of the object. */
  id: Scalars["ID"];
  other?: Maybe<Product>;
  otherProductId: Scalars["Int"];
  relationId: Scalars["ID"];
  reverse?: Maybe<ProductRelation>;
  reverseRelationId?: Maybe<Scalars["Int"]>;
  selfProductId: Scalars["Int"];
  self_?: Maybe<Product>;
  typeId: Scalars["Int"];
  type_?: Maybe<ProductRelationType>;
};

export type ProductRelationConnection = {
  __typename?: "ProductRelationConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductRelationEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `ProductRelation` and its cursor. */
export type ProductRelationEdge = {
  __typename?: "ProductRelationEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<ProductRelation>;
};

/** An enumeration. */
export enum ProductRelationSortEnum {
  OtherProductIdAsc = "OTHER_PRODUCT_ID_ASC",
  OtherProductIdDesc = "OTHER_PRODUCT_ID_DESC",
  RelationIdAsc = "RELATION_ID_ASC",
  RelationIdDesc = "RELATION_ID_DESC",
  ReverseRelationIdAsc = "REVERSE_RELATION_ID_ASC",
  ReverseRelationIdDesc = "REVERSE_RELATION_ID_DESC",
  SelfProductIdAsc = "SELF_PRODUCT_ID_ASC",
  SelfProductIdDesc = "SELF_PRODUCT_ID_DESC",
  TypeIdAsc = "TYPE_ID_ASC",
  TypeIdDesc = "TYPE_ID_DESC",
}

/** A type of relations between products */
export type ProductRelationType = Node & {
  __typename?: "ProductRelationType";
  /** The ID of the object. */
  id: Scalars["ID"];
  indefArticle?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  plural?: Maybe<Scalars["String"]>;
  relations?: Maybe<ProductRelationConnection>;
  reverse?: Maybe<ProductRelationType>;
  reverseTypeId?: Maybe<Scalars["Int"]>;
  singular?: Maybe<Scalars["String"]>;
  typeId: Scalars["ID"];
};

/** A type of relations between products */
export type ProductRelationTypeRelationsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductRelationSortEnum>>>;
};

export type ProductRelationTypeConnection = {
  __typename?: "ProductRelationTypeConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductRelationTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `ProductRelationType` and its cursor. */
export type ProductRelationTypeEdge = {
  __typename?: "ProductRelationTypeEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<ProductRelationType>;
};

/** An enumeration. */
export enum ProductRelationTypeSortEnum {
  IndefArticleAsc = "INDEF_ARTICLE_ASC",
  IndefArticleDesc = "INDEF_ARTICLE_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  PluralAsc = "PLURAL_ASC",
  PluralDesc = "PLURAL_DESC",
  ReverseTypeIdAsc = "REVERSE_TYPE_ID_ASC",
  ReverseTypeIdDesc = "REVERSE_TYPE_ID_DESC",
  SingularAsc = "SINGULAR_ASC",
  SingularDesc = "SINGULAR_DESC",
  TypeIdAsc = "TYPE_ID_ASC",
  TypeIdDesc = "TYPE_ID_DESC",
}

/** An enumeration. */
export enum ProductSortEnum {
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  NoteAsc = "NOTE_ASC",
  NoteDesc = "NOTE_DESC",
  PostingGitHubUserIdAsc = "POSTING_GIT_HUB_USER_ID_ASC",
  PostingGitHubUserIdDesc = "POSTING_GIT_HUB_USER_ID_DESC",
  ProductIdAsc = "PRODUCT_ID_ASC",
  ProductIdDesc = "PRODUCT_ID_DESC",
  TimePostedAsc = "TIME_POSTED_ASC",
  TimePostedDesc = "TIME_POSTED_DESC",
  TimeUpdatedAsc = "TIME_UPDATED_ASC",
  TimeUpdatedDesc = "TIME_UPDATED_DESC",
  TypeIdAsc = "TYPE_ID_ASC",
  TypeIdDesc = "TYPE_ID_DESC",
  UpdatingGitHubUserIdAsc = "UPDATING_GIT_HUB_USER_ID_ASC",
  UpdatingGitHubUserIdDesc = "UPDATING_GIT_HUB_USER_ID_DESC",
}

/** A product type */
export type ProductType = Node & {
  __typename?: "ProductType";
  fields?: Maybe<TypeFieldAssociationConnection>;
  icon?: Maybe<Scalars["String"]>;
  /** The ID of the object. */
  id: Scalars["ID"];
  indefArticle?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  order?: Maybe<Scalars["Int"]>;
  plural?: Maybe<Scalars["String"]>;
  products?: Maybe<ProductConnection>;
  singular?: Maybe<Scalars["String"]>;
  typeId: Scalars["ID"];
};

/** A product type */
export type ProductTypeFieldsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<TypeFieldAssociationSortEnum>>>;
};

/** A product type */
export type ProductTypeProductsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  filters?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductSortEnum>>>;
};

export type ProductTypeConnection = {
  __typename?: "ProductTypeConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductTypeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `ProductType` and its cursor. */
export type ProductTypeEdge = {
  __typename?: "ProductTypeEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
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
  IconAsc = "ICON_ASC",
  IconDesc = "ICON_DESC",
  IndefArticleAsc = "INDEF_ARTICLE_ASC",
  IndefArticleDesc = "INDEF_ARTICLE_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  OrderAsc = "ORDER_ASC",
  OrderDesc = "ORDER_DESC",
  PluralAsc = "PLURAL_ASC",
  PluralDesc = "PLURAL_DESC",
  SingularAsc = "SINGULAR_ASC",
  SingularDesc = "SINGULAR_DESC",
  TypeIdAsc = "TYPE_ID_ASC",
  TypeIdDesc = "TYPE_ID_DESC",
}

export type QueryAdmin = {
  __typename?: "QueryAdmin";
  /** The version of Alembic migration */
  alembicVersion?: Maybe<Scalars["String"]>;
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
  isAdmin?: Maybe<Scalars["Boolean"]>;
  isSignedIn?: Maybe<Scalars["Boolean"]>;
  log?: Maybe<Log>;
  node?: Maybe<Node>;
  product?: Maybe<Product>;
  productRelation?: Maybe<ProductRelation>;
  productRelationType?: Maybe<ProductRelationType>;
  productType?: Maybe<ProductType>;
  /** The version of Acondbs */
  version?: Maybe<Scalars["String"]>;
  webConfig?: Maybe<WebConfig>;
};

export type QueryAdminAllFieldsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<FieldSortEnum>>>;
};

export type QueryAdminAllGitHubOrgsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<GitHubOrgSortEnum>>>;
};

export type QueryAdminAllGitHubTokensArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  filters?: InputMaybe<GitHubTokenFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<GitHubTokenSortEnum>>>;
};

export type QueryAdminAllGitHubUsersArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  filters?: InputMaybe<GitHubUserFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<GitHubUserSortEnum>>>;
};

export type QueryAdminAllLogsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<LogSortEnum>>>;
};

export type QueryAdminAllProductFilePathsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductFilePathSortEnum>>>;
};

export type QueryAdminAllProductRelationTypesArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductRelationTypeSortEnum>>>;
};

export type QueryAdminAllProductRelationsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductRelationSortEnum>>>;
};

export type QueryAdminAllProductTypesArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  filters?: InputMaybe<ProductTypeFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductTypeSortEnum>>>;
};

export type QueryAdminAllProductsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  filters?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProductSortEnum>>>;
};

export type QueryAdminFieldArgs = {
  fieldId?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<Scalars["String"]>;
};

export type QueryAdminLogArgs = {
  id_?: InputMaybe<Scalars["Int"]>;
};

export type QueryAdminNodeArgs = {
  id: Scalars["ID"];
};

export type QueryAdminProductArgs = {
  name?: InputMaybe<Scalars["String"]>;
  productId?: InputMaybe<Scalars["Int"]>;
  typeId?: InputMaybe<Scalars["Int"]>;
};

export type QueryAdminProductRelationArgs = {
  relationId?: InputMaybe<Scalars["Int"]>;
};

export type QueryAdminProductRelationTypeArgs = {
  name?: InputMaybe<Scalars["String"]>;
  typeId?: InputMaybe<Scalars["Int"]>;
};

export type QueryAdminProductTypeArgs = {
  name?: InputMaybe<Scalars["String"]>;
  typeId?: InputMaybe<Scalars["Int"]>;
};

/** A relation to another product */
export type RelationInputFields = {
  /** The product ID of the other product */
  productId: Scalars["Int"];
  /** The relation type ID */
  typeId: Scalars["Int"];
};

export type SaveWebconfig = {
  __typename?: "SaveWebconfig";
  ok?: Maybe<Scalars["Boolean"]>;
  webConfig?: Maybe<WebConfig>;
};

export type TypeFieldAssociation = Node & {
  __typename?: "TypeFieldAssociation";
  attributesBoolean?: Maybe<AttributeBooleanConnection>;
  attributesDate?: Maybe<AttributeDateConnection>;
  attributesDateTime?: Maybe<AttributeDateTimeConnection>;
  attributesFloat?: Maybe<AttributeFloatConnection>;
  attributesInteger?: Maybe<AttributeIntegerConnection>;
  attributesTime?: Maybe<AttributeTimeConnection>;
  attributesUnicodeText?: Maybe<AttributeUnicodeTextConnection>;
  field?: Maybe<Field>;
  fieldId: Scalars["Int"];
  /** The ID of the object. */
  id: Scalars["ID"];
  iid: Scalars["ID"];
  order?: Maybe<Scalars["Int"]>;
  typeId: Scalars["Int"];
  type_?: Maybe<ProductType>;
};

export type TypeFieldAssociationAttributesBooleanArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeBooleanSortEnum>>>;
};

export type TypeFieldAssociationAttributesDateArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateSortEnum>>>;
};

export type TypeFieldAssociationAttributesDateTimeArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeDateTimeSortEnum>>>;
};

export type TypeFieldAssociationAttributesFloatArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeFloatSortEnum>>>;
};

export type TypeFieldAssociationAttributesIntegerArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeIntegerSortEnum>>>;
};

export type TypeFieldAssociationAttributesTimeArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeTimeSortEnum>>>;
};

export type TypeFieldAssociationAttributesUnicodeTextArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<AttributeUnicodeTextSortEnum>>>;
};

export type TypeFieldAssociationConnection = {
  __typename?: "TypeFieldAssociationConnection";
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TypeFieldAssociationEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

/** A Relay edge containing a `TypeFieldAssociation` and its cursor. */
export type TypeFieldAssociationEdge = {
  __typename?: "TypeFieldAssociationEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"];
  /** The item at the end of the edge */
  node?: Maybe<TypeFieldAssociation>;
};

/** An enumeration. */
export enum TypeFieldAssociationSortEnum {
  FieldIdAsc = "FIELD_ID_ASC",
  FieldIdDesc = "FIELD_ID_DESC",
  IidAsc = "IID_ASC",
  IidDesc = "IID_DESC",
  OrderAsc = "ORDER_ASC",
  OrderDesc = "ORDER_DESC",
  TypeIdAsc = "TYPE_ID_ASC",
  TypeIdDesc = "TYPE_ID_DESC",
}

/** Update a field */
export type UpdateField = {
  __typename?: "UpdateField";
  field?: Maybe<Field>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Input to updateField() */
export type UpdateFieldInput = {
  /** The name of the field */
  name: Scalars["String"];
};

/** Update the member lists of GitHub organizations */
export type UpdateGitHubOrgMemberLists = {
  __typename?: "UpdateGitHubOrgMemberLists";
  ok?: Maybe<Scalars["Boolean"]>;
};

/**
 * Update a product.
 *
 * Note: This is to update the DB entry about a product. If the
 * product itself has been updated, a new entry should be added by
 * createProduct()
 */
export type UpdateProduct = {
  __typename?: "UpdateProduct";
  ok?: Maybe<Scalars["Boolean"]>;
  product?: Maybe<Product>;
};

export type UpdateProductFilePath = {
  __typename?: "UpdateProductFilePath";
  ok?: Maybe<Scalars["Boolean"]>;
  productFilePath?: Maybe<ProductFilePath>;
};

export type UpdateProductFilePathInput = {
  note?: InputMaybe<Scalars["String"]>;
  path?: InputMaybe<Scalars["String"]>;
};

/** Input to updateProduct() */
export type UpdateProductInput = {
  /** Attributes */
  attributes?: InputMaybe<AttributesInputFields>;
  /** The name of the product */
  name?: InputMaybe<Scalars["String"]>;
  /** Note about the product in MarkDown. */
  note?: InputMaybe<Scalars["String"]>;
  /** Paths to the products. e.g., nersc:/go/to/my/product_v3 */
  paths?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Relations to other products */
  relations?: InputMaybe<Array<InputMaybe<RelationInputFields>>>;
};

/** Update a product relation type */
export type UpdateProductRelationType = {
  __typename?: "UpdateProductRelationType";
  ok?: Maybe<Scalars["Boolean"]>;
  productRelationType?: Maybe<ProductRelationType>;
};

/** An input to updateProductRelationType() */
export type UpdateProductRelationTypeInput = {
  /** The indefinite article placed before the singular noun "i.e., "a" or "an".  */
  indefArticle?: InputMaybe<Scalars["String"]>;
  /** The plural noun, the relation type name in plural. */
  plural?: InputMaybe<Scalars["String"]>;
  /** The singular noun, the relation type name in singular. */
  singular?: InputMaybe<Scalars["String"]>;
};

/** Update a product type */
export type UpdateProductType = {
  __typename?: "UpdateProductType";
  ok?: Maybe<Scalars["Boolean"]>;
  productType?: Maybe<ProductType>;
};

/** Input to updateProductType() */
export type UpdateProductTypeInput = {
  /** The field IDs */
  fieldIds?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  /** A name of the icon from https://materialdesignicons.com/ */
  icon?: InputMaybe<Scalars["String"]>;
  /** The indefinite article placed before the singular noun "i.e., "a" or "an".  */
  indefArticle?: InputMaybe<Scalars["String"]>;
  /** The name of the product type */
  name?: InputMaybe<Scalars["String"]>;
  /** The order in which the type is displayed, for example, in navigation bars. */
  order?: InputMaybe<Scalars["Int"]>;
  /** The plural noun, the product type name in plural. */
  plural?: InputMaybe<Scalars["String"]>;
  /** The singular noun, the product type name in singular. */
  singular?: InputMaybe<Scalars["String"]>;
};

/** Web configuration */
export type WebConfig = Node & {
  __typename?: "WebConfig";
  /** The ID of the object. */
  id: Scalars["ID"];
  id_: Scalars["ID"];
  json?: Maybe<Scalars["String"]>;
};

export type GitHubTokenFragmentFragment = {
  __typename?: "GitHubToken";
  tokenId: string;
  tokenMasked?: string | null;
  scope?: string | null;
  timeCreated?: any | null;
  user?: {
    __typename?: "GitHubUser";
    login: string;
    avatarUrl?: string | null;
    url?: string | null;
  } | null;
};

export type ProductFragmentFragment = {
  __typename?: "Product";
  id: string;
  productId: string;
  typeId: number;
  name: string;
  timePosted?: any | null;
  timeUpdated?: any | null;
  note?: string | null;
  type_?: {
    __typename?: "ProductType";
    id: string;
    typeId: string;
    name: string;
    order?: number | null;
    indefArticle?: string | null;
    singular?: string | null;
    plural?: string | null;
    icon?: string | null;
    fields?: {
      __typename?: "TypeFieldAssociationConnection";
      edges: Array<{
        __typename?: "TypeFieldAssociationEdge";
        node?: {
          __typename?: "TypeFieldAssociation";
          typeId: number;
          fieldId: number;
          field?: {
            __typename?: "Field";
            fieldId: string;
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
  } | null;
  postingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
  updatingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
  paths?: {
    __typename?: "ProductFilePathConnection";
    edges: Array<{
      __typename?: "ProductFilePathEdge";
      node?: {
        __typename?: "ProductFilePath";
        id: string;
        pathId: string;
        path?: string | null;
        note?: string | null;
      } | null;
    } | null>;
  } | null;
  relations?: {
    __typename?: "ProductRelationConnection";
    edges: Array<{
      __typename?: "ProductRelationEdge";
      node?: {
        __typename?: "ProductRelation";
        id: string;
        relationId: string;
        typeId: number;
        otherProductId: number;
        reverseRelationId?: number | null;
        type_?: {
          __typename?: "ProductRelationType";
          id: string;
          typeId: string;
          name: string;
          indefArticle?: string | null;
          singular?: string | null;
          plural?: string | null;
        } | null;
        other?: {
          __typename?: "Product";
          id: string;
          productId: string;
          typeId: number;
          name: string;
          type_?: {
            __typename?: "ProductType";
            id: string;
            typeId: string;
            name: string;
            order?: number | null;
            indefArticle?: string | null;
            singular?: string | null;
            plural?: string | null;
            icon?: string | null;
            fields?: {
              __typename?: "TypeFieldAssociationConnection";
              edges: Array<{
                __typename?: "TypeFieldAssociationEdge";
                node?: {
                  __typename?: "TypeFieldAssociation";
                  typeId: number;
                  fieldId: number;
                  field?: {
                    __typename?: "Field";
                    fieldId: string;
                    name: string;
                    type_?: FieldType | null;
                  } | null;
                } | null;
              } | null>;
            } | null;
          } | null;
        } | null;
        reverse?: {
          __typename?: "ProductRelation";
          id: string;
          relationId: string;
          typeId: number;
          type_?: {
            __typename?: "ProductRelationType";
            id: string;
            typeId: string;
            name: string;
          } | null;
        } | null;
      } | null;
    } | null>;
  } | null;
  attributesUnicodeText?: {
    __typename?: "AttributeUnicodeTextConnection";
    edges: Array<{
      __typename?: "AttributeUnicodeTextEdge";
      node?: {
        __typename?: "AttributeUnicodeText";
        fieldId: number;
        value?: string | null;
        field?: {
          __typename?: "Field";
          name: string;
          type_?: FieldType | null;
        } | null;
      } | null;
    } | null>;
  } | null;
  attributesBoolean?: {
    __typename?: "AttributeBooleanConnection";
    edges: Array<{
      __typename?: "AttributeBooleanEdge";
      node?: {
        __typename?: "AttributeBoolean";
        fieldId: number;
        value?: boolean | null;
        field?: {
          __typename?: "Field";
          name: string;
          type_?: FieldType | null;
        } | null;
      } | null;
    } | null>;
  } | null;
  attributesInteger?: {
    __typename?: "AttributeIntegerConnection";
    edges: Array<{
      __typename?: "AttributeIntegerEdge";
      node?: {
        __typename?: "AttributeInteger";
        fieldId: number;
        value?: number | null;
        field?: {
          __typename?: "Field";
          name: string;
          type_?: FieldType | null;
        } | null;
      } | null;
    } | null>;
  } | null;
  attributesFloat?: {
    __typename?: "AttributeFloatConnection";
    edges: Array<{
      __typename?: "AttributeFloatEdge";
      node?: {
        __typename?: "AttributeFloat";
        fieldId: number;
        value?: number | null;
        field?: {
          __typename?: "Field";
          name: string;
          type_?: FieldType | null;
        } | null;
      } | null;
    } | null>;
  } | null;
  attributesDate?: {
    __typename?: "AttributeDateConnection";
    edges: Array<{
      __typename?: "AttributeDateEdge";
      node?: {
        __typename?: "AttributeDate";
        fieldId: number;
        value?: string | null;
        field?: {
          __typename?: "Field";
          name: string;
          type_?: FieldType | null;
        } | null;
      } | null;
    } | null>;
  } | null;
  attributesDateTime?: {
    __typename?: "AttributeDateTimeConnection";
    edges: Array<{
      __typename?: "AttributeDateTimeEdge";
      node?: {
        __typename?: "AttributeDateTime";
        fieldId: number;
        value?: any | null;
        field?: {
          __typename?: "Field";
          name: string;
          type_?: FieldType | null;
        } | null;
      } | null;
    } | null>;
  } | null;
  attributesTime?: {
    __typename?: "AttributeTimeConnection";
    edges: Array<{
      __typename?: "AttributeTimeEdge";
      node?: {
        __typename?: "AttributeTime";
        fieldId: number;
        value?: string | null;
        field?: {
          __typename?: "Field";
          name: string;
          type_?: FieldType | null;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type ProductTypeFragmentFragment = {
  __typename?: "ProductType";
  id: string;
  typeId: string;
  name: string;
  order?: number | null;
  indefArticle?: string | null;
  singular?: string | null;
  plural?: string | null;
  icon?: string | null;
  fields?: {
    __typename?: "TypeFieldAssociationConnection";
    edges: Array<{
      __typename?: "TypeFieldAssociationEdge";
      node?: {
        __typename?: "TypeFieldAssociation";
        typeId: number;
        fieldId: number;
        field?: {
          __typename?: "Field";
          fieldId: string;
          name: string;
          type_?: FieldType | null;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type AddGitHubAdminAppTokenMutationVariables = Exact<{
  code: Scalars["String"];
}>;

export type AddGitHubAdminAppTokenMutation = {
  __typename?: "MutationAdmin";
  addGitHubAdminAppToken?: {
    __typename?: "AddGitHubAdminAppToken";
    ok?: boolean | null;
  } | null;
};

export type AddGitHubOrgMutationVariables = Exact<{
  login: Scalars["String"];
}>;

export type AddGitHubOrgMutation = {
  __typename?: "MutationAdmin";
  addGitHubOrg?: { __typename?: "AddGitHubOrg"; ok?: boolean | null } | null;
};

export type AuthenticateWithGitHubMutationVariables = Exact<{
  code: Scalars["String"];
}>;

export type AuthenticateWithGitHubMutation = {
  __typename?: "MutationAdmin";
  authenticateWithGitHub?: {
    __typename?: "AuthenticateWithGitHub";
    authPayload?: { __typename?: "AuthPayload"; token?: string | null } | null;
  } | null;
};

export type ConvertProductTypeMutationVariables = Exact<{
  productId: Scalars["Int"];
  typeId: Scalars["Int"];
}>;

export type ConvertProductTypeMutation = {
  __typename?: "MutationAdmin";
  convertProductType?: {
    __typename?: "ConvertProductType";
    ok?: boolean | null;
    product?: {
      __typename?: "Product";
      id: string;
      productId: string;
      typeId: number;
      name: string;
      timePosted?: any | null;
      timeUpdated?: any | null;
      note?: string | null;
      type_?: {
        __typename?: "ProductType";
        id: string;
        typeId: string;
        name: string;
        order?: number | null;
        indefArticle?: string | null;
        singular?: string | null;
        plural?: string | null;
        icon?: string | null;
        fields?: {
          __typename?: "TypeFieldAssociationConnection";
          edges: Array<{
            __typename?: "TypeFieldAssociationEdge";
            node?: {
              __typename?: "TypeFieldAssociation";
              typeId: number;
              fieldId: number;
              field?: {
                __typename?: "Field";
                fieldId: string;
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
      } | null;
      postingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
      updatingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
      paths?: {
        __typename?: "ProductFilePathConnection";
        edges: Array<{
          __typename?: "ProductFilePathEdge";
          node?: {
            __typename?: "ProductFilePath";
            id: string;
            pathId: string;
            path?: string | null;
            note?: string | null;
          } | null;
        } | null>;
      } | null;
      relations?: {
        __typename?: "ProductRelationConnection";
        edges: Array<{
          __typename?: "ProductRelationEdge";
          node?: {
            __typename?: "ProductRelation";
            id: string;
            relationId: string;
            typeId: number;
            otherProductId: number;
            reverseRelationId?: number | null;
            type_?: {
              __typename?: "ProductRelationType";
              id: string;
              typeId: string;
              name: string;
              indefArticle?: string | null;
              singular?: string | null;
              plural?: string | null;
            } | null;
            other?: {
              __typename?: "Product";
              id: string;
              productId: string;
              typeId: number;
              name: string;
              type_?: {
                __typename?: "ProductType";
                id: string;
                typeId: string;
                name: string;
                order?: number | null;
                indefArticle?: string | null;
                singular?: string | null;
                plural?: string | null;
                icon?: string | null;
                fields?: {
                  __typename?: "TypeFieldAssociationConnection";
                  edges: Array<{
                    __typename?: "TypeFieldAssociationEdge";
                    node?: {
                      __typename?: "TypeFieldAssociation";
                      typeId: number;
                      fieldId: number;
                      field?: {
                        __typename?: "Field";
                        fieldId: string;
                        name: string;
                        type_?: FieldType | null;
                      } | null;
                    } | null;
                  } | null>;
                } | null;
              } | null;
            } | null;
            reverse?: {
              __typename?: "ProductRelation";
              id: string;
              relationId: string;
              typeId: number;
              type_?: {
                __typename?: "ProductRelationType";
                id: string;
                typeId: string;
                name: string;
              } | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesUnicodeText?: {
        __typename?: "AttributeUnicodeTextConnection";
        edges: Array<{
          __typename?: "AttributeUnicodeTextEdge";
          node?: {
            __typename?: "AttributeUnicodeText";
            fieldId: number;
            value?: string | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesBoolean?: {
        __typename?: "AttributeBooleanConnection";
        edges: Array<{
          __typename?: "AttributeBooleanEdge";
          node?: {
            __typename?: "AttributeBoolean";
            fieldId: number;
            value?: boolean | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesInteger?: {
        __typename?: "AttributeIntegerConnection";
        edges: Array<{
          __typename?: "AttributeIntegerEdge";
          node?: {
            __typename?: "AttributeInteger";
            fieldId: number;
            value?: number | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesFloat?: {
        __typename?: "AttributeFloatConnection";
        edges: Array<{
          __typename?: "AttributeFloatEdge";
          node?: {
            __typename?: "AttributeFloat";
            fieldId: number;
            value?: number | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesDate?: {
        __typename?: "AttributeDateConnection";
        edges: Array<{
          __typename?: "AttributeDateEdge";
          node?: {
            __typename?: "AttributeDate";
            fieldId: number;
            value?: string | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesDateTime?: {
        __typename?: "AttributeDateTimeConnection";
        edges: Array<{
          __typename?: "AttributeDateTimeEdge";
          node?: {
            __typename?: "AttributeDateTime";
            fieldId: number;
            value?: any | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesTime?: {
        __typename?: "AttributeTimeConnection";
        edges: Array<{
          __typename?: "AttributeTimeEdge";
          node?: {
            __typename?: "AttributeTime";
            fieldId: number;
            value?: string | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
    } | null;
  } | null;
};

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;

export type CreateProductMutation = {
  __typename?: "MutationAdmin";
  createProduct?: {
    __typename?: "CreateProduct";
    ok?: boolean | null;
    product?: {
      __typename?: "Product";
      id: string;
      productId: string;
      typeId: number;
      name: string;
      timePosted?: any | null;
      timeUpdated?: any | null;
      note?: string | null;
      type_?: {
        __typename?: "ProductType";
        id: string;
        typeId: string;
        name: string;
        order?: number | null;
        indefArticle?: string | null;
        singular?: string | null;
        plural?: string | null;
        icon?: string | null;
        fields?: {
          __typename?: "TypeFieldAssociationConnection";
          edges: Array<{
            __typename?: "TypeFieldAssociationEdge";
            node?: {
              __typename?: "TypeFieldAssociation";
              typeId: number;
              fieldId: number;
              field?: {
                __typename?: "Field";
                fieldId: string;
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
      } | null;
      postingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
      updatingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
      paths?: {
        __typename?: "ProductFilePathConnection";
        edges: Array<{
          __typename?: "ProductFilePathEdge";
          node?: {
            __typename?: "ProductFilePath";
            id: string;
            pathId: string;
            path?: string | null;
            note?: string | null;
          } | null;
        } | null>;
      } | null;
      relations?: {
        __typename?: "ProductRelationConnection";
        edges: Array<{
          __typename?: "ProductRelationEdge";
          node?: {
            __typename?: "ProductRelation";
            id: string;
            relationId: string;
            typeId: number;
            otherProductId: number;
            reverseRelationId?: number | null;
            type_?: {
              __typename?: "ProductRelationType";
              id: string;
              typeId: string;
              name: string;
              indefArticle?: string | null;
              singular?: string | null;
              plural?: string | null;
            } | null;
            other?: {
              __typename?: "Product";
              id: string;
              productId: string;
              typeId: number;
              name: string;
              type_?: {
                __typename?: "ProductType";
                id: string;
                typeId: string;
                name: string;
                order?: number | null;
                indefArticle?: string | null;
                singular?: string | null;
                plural?: string | null;
                icon?: string | null;
                fields?: {
                  __typename?: "TypeFieldAssociationConnection";
                  edges: Array<{
                    __typename?: "TypeFieldAssociationEdge";
                    node?: {
                      __typename?: "TypeFieldAssociation";
                      typeId: number;
                      fieldId: number;
                      field?: {
                        __typename?: "Field";
                        fieldId: string;
                        name: string;
                        type_?: FieldType | null;
                      } | null;
                    } | null;
                  } | null>;
                } | null;
              } | null;
            } | null;
            reverse?: {
              __typename?: "ProductRelation";
              id: string;
              relationId: string;
              typeId: number;
              type_?: {
                __typename?: "ProductRelationType";
                id: string;
                typeId: string;
                name: string;
              } | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesUnicodeText?: {
        __typename?: "AttributeUnicodeTextConnection";
        edges: Array<{
          __typename?: "AttributeUnicodeTextEdge";
          node?: {
            __typename?: "AttributeUnicodeText";
            fieldId: number;
            value?: string | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesBoolean?: {
        __typename?: "AttributeBooleanConnection";
        edges: Array<{
          __typename?: "AttributeBooleanEdge";
          node?: {
            __typename?: "AttributeBoolean";
            fieldId: number;
            value?: boolean | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesInteger?: {
        __typename?: "AttributeIntegerConnection";
        edges: Array<{
          __typename?: "AttributeIntegerEdge";
          node?: {
            __typename?: "AttributeInteger";
            fieldId: number;
            value?: number | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesFloat?: {
        __typename?: "AttributeFloatConnection";
        edges: Array<{
          __typename?: "AttributeFloatEdge";
          node?: {
            __typename?: "AttributeFloat";
            fieldId: number;
            value?: number | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesDate?: {
        __typename?: "AttributeDateConnection";
        edges: Array<{
          __typename?: "AttributeDateEdge";
          node?: {
            __typename?: "AttributeDate";
            fieldId: number;
            value?: string | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesDateTime?: {
        __typename?: "AttributeDateTimeConnection";
        edges: Array<{
          __typename?: "AttributeDateTimeEdge";
          node?: {
            __typename?: "AttributeDateTime";
            fieldId: number;
            value?: any | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesTime?: {
        __typename?: "AttributeTimeConnection";
        edges: Array<{
          __typename?: "AttributeTimeEdge";
          node?: {
            __typename?: "AttributeTime";
            fieldId: number;
            value?: string | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
    } | null;
  } | null;
};

export type CreateProductTypeMutationVariables = Exact<{
  input: CreateProductTypeInput;
}>;

export type CreateProductTypeMutation = {
  __typename?: "MutationAdmin";
  createProductType?: {
    __typename?: "CreateProductType";
    ok?: boolean | null;
    productType?: {
      __typename?: "ProductType";
      id: string;
      typeId: string;
      name: string;
      order?: number | null;
      indefArticle?: string | null;
      singular?: string | null;
      plural?: string | null;
      icon?: string | null;
      fields?: {
        __typename?: "TypeFieldAssociationConnection";
        edges: Array<{
          __typename?: "TypeFieldAssociationEdge";
          node?: {
            __typename?: "TypeFieldAssociation";
            typeId: number;
            fieldId: number;
            field?: {
              __typename?: "Field";
              fieldId: string;
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
    } | null;
  } | null;
};

export type DeleteGitHubOrgMutationVariables = Exact<{
  login: Scalars["String"];
}>;

export type DeleteGitHubOrgMutation = {
  __typename?: "MutationAdmin";
  deleteGitHubOrg?: {
    __typename?: "DeleteGitHubOrg";
    ok?: boolean | null;
  } | null;
};

export type DeleteGitHubTokenMutationVariables = Exact<{
  tokenId: Scalars["Int"];
}>;

export type DeleteGitHubTokenMutation = {
  __typename?: "MutationAdmin";
  deleteGitHubAdminAppToken?: {
    __typename?: "DeleteGitHubAdminAppToken";
    ok?: boolean | null;
  } | null;
};

export type DeleteLogMutationVariables = Exact<{
  id_: Scalars["Int"];
}>;

export type DeleteLogMutation = {
  __typename?: "MutationAdmin";
  deleteLog?: { __typename?: "DeleteLog"; ok?: boolean | null } | null;
};

export type DeleteProductMutationVariables = Exact<{
  productId: Scalars["Int"];
}>;

export type DeleteProductMutation = {
  __typename?: "MutationAdmin";
  deleteProduct?: { __typename?: "DeleteProduct"; ok?: boolean | null } | null;
};

export type DeleteProductTypeMutationVariables = Exact<{
  typeId: Scalars["Int"];
}>;

export type DeleteProductTypeMutation = {
  __typename?: "MutationAdmin";
  deleteProductType?: {
    __typename?: "DeleteProductType";
    ok?: boolean | null;
  } | null;
};

export type SaveWebConfigMutationVariables = Exact<{
  json: Scalars["String"];
}>;

export type SaveWebConfigMutation = {
  __typename?: "MutationAdmin";
  saveWebConfig?: {
    __typename?: "SaveWebconfig";
    ok?: boolean | null;
    webConfig?: {
      __typename?: "WebConfig";
      id_: string;
      json?: string | null;
    } | null;
  } | null;
};

export type UpdateGitHubOrgMemberListsMutationVariables = Exact<{
  [key: string]: never;
}>;

export type UpdateGitHubOrgMemberListsMutation = {
  __typename?: "MutationAdmin";
  updateGitHubOrgMemberLists?: {
    __typename?: "UpdateGitHubOrgMemberLists";
    ok?: boolean | null;
  } | null;
};

export type UpdateProductMutationVariables = Exact<{
  productId: Scalars["Int"];
  input: UpdateProductInput;
}>;

export type UpdateProductMutation = {
  __typename?: "MutationAdmin";
  updateProduct?: {
    __typename?: "UpdateProduct";
    ok?: boolean | null;
    product?: {
      __typename?: "Product";
      id: string;
      productId: string;
      typeId: number;
      name: string;
      timePosted?: any | null;
      timeUpdated?: any | null;
      note?: string | null;
      type_?: {
        __typename?: "ProductType";
        id: string;
        typeId: string;
        name: string;
        order?: number | null;
        indefArticle?: string | null;
        singular?: string | null;
        plural?: string | null;
        icon?: string | null;
        fields?: {
          __typename?: "TypeFieldAssociationConnection";
          edges: Array<{
            __typename?: "TypeFieldAssociationEdge";
            node?: {
              __typename?: "TypeFieldAssociation";
              typeId: number;
              fieldId: number;
              field?: {
                __typename?: "Field";
                fieldId: string;
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
      } | null;
      postingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
      updatingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
      paths?: {
        __typename?: "ProductFilePathConnection";
        edges: Array<{
          __typename?: "ProductFilePathEdge";
          node?: {
            __typename?: "ProductFilePath";
            id: string;
            pathId: string;
            path?: string | null;
            note?: string | null;
          } | null;
        } | null>;
      } | null;
      relations?: {
        __typename?: "ProductRelationConnection";
        edges: Array<{
          __typename?: "ProductRelationEdge";
          node?: {
            __typename?: "ProductRelation";
            id: string;
            relationId: string;
            typeId: number;
            otherProductId: number;
            reverseRelationId?: number | null;
            type_?: {
              __typename?: "ProductRelationType";
              id: string;
              typeId: string;
              name: string;
              indefArticle?: string | null;
              singular?: string | null;
              plural?: string | null;
            } | null;
            other?: {
              __typename?: "Product";
              id: string;
              productId: string;
              typeId: number;
              name: string;
              type_?: {
                __typename?: "ProductType";
                id: string;
                typeId: string;
                name: string;
                order?: number | null;
                indefArticle?: string | null;
                singular?: string | null;
                plural?: string | null;
                icon?: string | null;
                fields?: {
                  __typename?: "TypeFieldAssociationConnection";
                  edges: Array<{
                    __typename?: "TypeFieldAssociationEdge";
                    node?: {
                      __typename?: "TypeFieldAssociation";
                      typeId: number;
                      fieldId: number;
                      field?: {
                        __typename?: "Field";
                        fieldId: string;
                        name: string;
                        type_?: FieldType | null;
                      } | null;
                    } | null;
                  } | null>;
                } | null;
              } | null;
            } | null;
            reverse?: {
              __typename?: "ProductRelation";
              id: string;
              relationId: string;
              typeId: number;
              type_?: {
                __typename?: "ProductRelationType";
                id: string;
                typeId: string;
                name: string;
              } | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesUnicodeText?: {
        __typename?: "AttributeUnicodeTextConnection";
        edges: Array<{
          __typename?: "AttributeUnicodeTextEdge";
          node?: {
            __typename?: "AttributeUnicodeText";
            fieldId: number;
            value?: string | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesBoolean?: {
        __typename?: "AttributeBooleanConnection";
        edges: Array<{
          __typename?: "AttributeBooleanEdge";
          node?: {
            __typename?: "AttributeBoolean";
            fieldId: number;
            value?: boolean | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesInteger?: {
        __typename?: "AttributeIntegerConnection";
        edges: Array<{
          __typename?: "AttributeIntegerEdge";
          node?: {
            __typename?: "AttributeInteger";
            fieldId: number;
            value?: number | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesFloat?: {
        __typename?: "AttributeFloatConnection";
        edges: Array<{
          __typename?: "AttributeFloatEdge";
          node?: {
            __typename?: "AttributeFloat";
            fieldId: number;
            value?: number | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesDate?: {
        __typename?: "AttributeDateConnection";
        edges: Array<{
          __typename?: "AttributeDateEdge";
          node?: {
            __typename?: "AttributeDate";
            fieldId: number;
            value?: string | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesDateTime?: {
        __typename?: "AttributeDateTimeConnection";
        edges: Array<{
          __typename?: "AttributeDateTimeEdge";
          node?: {
            __typename?: "AttributeDateTime";
            fieldId: number;
            value?: any | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
      attributesTime?: {
        __typename?: "AttributeTimeConnection";
        edges: Array<{
          __typename?: "AttributeTimeEdge";
          node?: {
            __typename?: "AttributeTime";
            fieldId: number;
            value?: string | null;
            field?: {
              __typename?: "Field";
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
    } | null;
  } | null;
};

export type UpdateProductTypeMutationVariables = Exact<{
  typeId: Scalars["Int"];
  input: UpdateProductTypeInput;
}>;

export type UpdateProductTypeMutation = {
  __typename?: "MutationAdmin";
  updateProductType?: {
    __typename?: "UpdateProductType";
    ok?: boolean | null;
    productType?: {
      __typename?: "ProductType";
      id: string;
      typeId: string;
      name: string;
      order?: number | null;
      indefArticle?: string | null;
      singular?: string | null;
      plural?: string | null;
      icon?: string | null;
      fields?: {
        __typename?: "TypeFieldAssociationConnection";
        edges: Array<{
          __typename?: "TypeFieldAssociationEdge";
          node?: {
            __typename?: "TypeFieldAssociation";
            typeId: number;
            fieldId: number;
            field?: {
              __typename?: "Field";
              fieldId: string;
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
    } | null;
  } | null;
};

export type AllFieldsQueryVariables = Exact<{ [key: string]: never }>;

export type AllFieldsQuery = {
  __typename?: "QueryAdmin";
  allFields?: {
    __typename?: "FieldConnection";
    edges: Array<{
      __typename?: "FieldEdge";
      node?: {
        __typename?: "Field";
        id: string;
        fieldId: string;
        name: string;
        type_?: FieldType | null;
      } | null;
    } | null>;
  } | null;
};

export type AllGitHubOrgsQueryVariables = Exact<{ [key: string]: never }>;

export type AllGitHubOrgsQuery = {
  __typename?: "QueryAdmin";
  allGitHubOrgs?: {
    __typename?: "GitHubOrgConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "GitHubOrgEdge";
      node?: {
        __typename?: "GitHubOrg";
        login: string;
        avatarUrl?: string | null;
        url?: string | null;
        memberships?: {
          __typename?: "GitHubOrgMembershipConnection";
          totalCount: number;
          edges: Array<{
            __typename?: "GitHubOrgMembershipEdge";
            node?: {
              __typename?: "GitHubOrgMembership";
              member?: { __typename?: "GitHubUser"; login: string } | null;
            } | null;
          } | null>;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type AllGitHubTokensQueryVariables = Exact<{ [key: string]: never }>;

export type AllGitHubTokensQuery = {
  __typename?: "QueryAdmin";
  allGitHubTokens?: {
    __typename?: "GitHubTokenConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "GitHubTokenEdge";
      node?: {
        __typename?: "GitHubToken";
        tokenId: string;
        tokenMasked?: string | null;
        scope?: string | null;
        timeCreated?: any | null;
        user?: {
          __typename?: "GitHubUser";
          login: string;
          avatarUrl?: string | null;
          url?: string | null;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type AllGitHubTokensWithOrgAccessQueryVariables = Exact<{
  [key: string]: never;
}>;

export type AllGitHubTokensWithOrgAccessQuery = {
  __typename?: "QueryAdmin";
  allGitHubTokens?: {
    __typename?: "GitHubTokenConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "GitHubTokenEdge";
      node?: {
        __typename?: "GitHubToken";
        tokenId: string;
        tokenMasked?: string | null;
        scope?: string | null;
        timeCreated?: any | null;
        user?: {
          __typename?: "GitHubUser";
          login: string;
          avatarUrl?: string | null;
          url?: string | null;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type AllGitHubUsersQueryVariables = Exact<{
  orgMember?: InputMaybe<Scalars["Boolean"]>;
}>;

export type AllGitHubUsersQuery = {
  __typename?: "QueryAdmin";
  allGitHubUsers?: {
    __typename?: "GitHubUserConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "GitHubUserEdge";
      node?: {
        __typename?: "GitHubUser";
        login: string;
        name?: string | null;
        avatarUrl?: string | null;
      } | null;
    } | null>;
  } | null;
};

export type AllLogsQueryVariables = Exact<{ [key: string]: never }>;

export type AllLogsQuery = {
  __typename?: "QueryAdmin";
  allLogs?: {
    __typename?: "LogConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "LogEdge";
      node?: {
        __typename?: "Log";
        id_: string;
        time?: any | null;
        level?: string | null;
        message?: string | null;
      } | null;
    } | null>;
  } | null;
};

export type AllProductTypesQueryVariables = Exact<{ [key: string]: never }>;

export type AllProductTypesQuery = {
  __typename?: "QueryAdmin";
  allProductTypes?: {
    __typename?: "ProductTypeConnection";
    edges: Array<{
      __typename?: "ProductTypeEdge";
      node?: {
        __typename?: "ProductType";
        id: string;
        typeId: string;
        name: string;
        order?: number | null;
        indefArticle?: string | null;
        singular?: string | null;
        plural?: string | null;
        icon?: string | null;
        products?: {
          __typename?: "ProductConnection";
          totalCount: number;
        } | null;
        fields?: {
          __typename?: "TypeFieldAssociationConnection";
          edges: Array<{
            __typename?: "TypeFieldAssociationEdge";
            node?: {
              __typename?: "TypeFieldAssociation";
              typeId: number;
              fieldId: number;
              field?: {
                __typename?: "Field";
                fieldId: string;
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type AllProductsByTypeIdQueryVariables = Exact<{
  typeId?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<
    Array<InputMaybe<ProductSortEnum>> | InputMaybe<ProductSortEnum>
  >;
}>;

export type AllProductsByTypeIdQuery = {
  __typename?: "QueryAdmin";
  allProducts?: {
    __typename?: "ProductConnection";
    edges: Array<{
      __typename?: "ProductEdge";
      node?: {
        __typename?: "Product";
        id: string;
        productId: string;
        typeId: number;
        name: string;
        timePosted?: any | null;
        timeUpdated?: any | null;
        note?: string | null;
        type_?: {
          __typename?: "ProductType";
          id: string;
          typeId: string;
          name: string;
          order?: number | null;
          indefArticle?: string | null;
          singular?: string | null;
          plural?: string | null;
          icon?: string | null;
          fields?: {
            __typename?: "TypeFieldAssociationConnection";
            edges: Array<{
              __typename?: "TypeFieldAssociationEdge";
              node?: {
                __typename?: "TypeFieldAssociation";
                typeId: number;
                fieldId: number;
                field?: {
                  __typename?: "Field";
                  fieldId: string;
                  name: string;
                  type_?: FieldType | null;
                } | null;
              } | null;
            } | null>;
          } | null;
        } | null;
        postingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
        updatingGitHubUser?: {
          __typename?: "GitHubUser";
          login: string;
        } | null;
        paths?: {
          __typename?: "ProductFilePathConnection";
          edges: Array<{
            __typename?: "ProductFilePathEdge";
            node?: {
              __typename?: "ProductFilePath";
              id: string;
              pathId: string;
              path?: string | null;
              note?: string | null;
            } | null;
          } | null>;
        } | null;
        relations?: {
          __typename?: "ProductRelationConnection";
          edges: Array<{
            __typename?: "ProductRelationEdge";
            node?: {
              __typename?: "ProductRelation";
              id: string;
              relationId: string;
              typeId: number;
              otherProductId: number;
              reverseRelationId?: number | null;
              type_?: {
                __typename?: "ProductRelationType";
                id: string;
                typeId: string;
                name: string;
                indefArticle?: string | null;
                singular?: string | null;
                plural?: string | null;
              } | null;
              other?: {
                __typename?: "Product";
                id: string;
                productId: string;
                typeId: number;
                name: string;
                type_?: {
                  __typename?: "ProductType";
                  id: string;
                  typeId: string;
                  name: string;
                  order?: number | null;
                  indefArticle?: string | null;
                  singular?: string | null;
                  plural?: string | null;
                  icon?: string | null;
                  fields?: {
                    __typename?: "TypeFieldAssociationConnection";
                    edges: Array<{
                      __typename?: "TypeFieldAssociationEdge";
                      node?: {
                        __typename?: "TypeFieldAssociation";
                        typeId: number;
                        fieldId: number;
                        field?: {
                          __typename?: "Field";
                          fieldId: string;
                          name: string;
                          type_?: FieldType | null;
                        } | null;
                      } | null;
                    } | null>;
                  } | null;
                } | null;
              } | null;
              reverse?: {
                __typename?: "ProductRelation";
                id: string;
                relationId: string;
                typeId: number;
                type_?: {
                  __typename?: "ProductRelationType";
                  id: string;
                  typeId: string;
                  name: string;
                } | null;
              } | null;
            } | null;
          } | null>;
        } | null;
        attributesUnicodeText?: {
          __typename?: "AttributeUnicodeTextConnection";
          edges: Array<{
            __typename?: "AttributeUnicodeTextEdge";
            node?: {
              __typename?: "AttributeUnicodeText";
              fieldId: number;
              value?: string | null;
              field?: {
                __typename?: "Field";
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
        attributesBoolean?: {
          __typename?: "AttributeBooleanConnection";
          edges: Array<{
            __typename?: "AttributeBooleanEdge";
            node?: {
              __typename?: "AttributeBoolean";
              fieldId: number;
              value?: boolean | null;
              field?: {
                __typename?: "Field";
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
        attributesInteger?: {
          __typename?: "AttributeIntegerConnection";
          edges: Array<{
            __typename?: "AttributeIntegerEdge";
            node?: {
              __typename?: "AttributeInteger";
              fieldId: number;
              value?: number | null;
              field?: {
                __typename?: "Field";
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
        attributesFloat?: {
          __typename?: "AttributeFloatConnection";
          edges: Array<{
            __typename?: "AttributeFloatEdge";
            node?: {
              __typename?: "AttributeFloat";
              fieldId: number;
              value?: number | null;
              field?: {
                __typename?: "Field";
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
        attributesDate?: {
          __typename?: "AttributeDateConnection";
          edges: Array<{
            __typename?: "AttributeDateEdge";
            node?: {
              __typename?: "AttributeDate";
              fieldId: number;
              value?: string | null;
              field?: {
                __typename?: "Field";
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
        attributesDateTime?: {
          __typename?: "AttributeDateTimeConnection";
          edges: Array<{
            __typename?: "AttributeDateTimeEdge";
            node?: {
              __typename?: "AttributeDateTime";
              fieldId: number;
              value?: any | null;
              field?: {
                __typename?: "Field";
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
        attributesTime?: {
          __typename?: "AttributeTimeConnection";
          edges: Array<{
            __typename?: "AttributeTimeEdge";
            node?: {
              __typename?: "AttributeTime";
              fieldId: number;
              value?: string | null;
              field?: {
                __typename?: "Field";
                name: string;
                type_?: FieldType | null;
              } | null;
            } | null;
          } | null>;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type GitHubOAuthAppInfoQueryVariables = Exact<{ [key: string]: never }>;

export type GitHubOAuthAppInfoQuery = {
  __typename?: "QueryAdmin";
  gitHubOAuthAppInfo?: {
    __typename?: "GitHubOAuthAppInfo";
    clientId?: string | null;
    authorizeUrl?: string | null;
    redirectUri?: string | null;
  } | null;
};

export type GitHubViewerQueryVariables = Exact<{ [key: string]: never }>;

export type GitHubViewerQuery = {
  __typename?: "QueryAdmin";
  gitHubViewer?: {
    __typename?: "GitHubUser";
    login: string;
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
};

export type IsSignedInQueryVariables = Exact<{ [key: string]: never }>;

export type IsSignedInQuery = {
  __typename?: "QueryAdmin";
  isSignedIn?: boolean | null;
};

export type ProductQueryVariables = Exact<{
  productId?: InputMaybe<Scalars["Int"]>;
}>;

export type ProductQuery = {
  __typename?: "QueryAdmin";
  product?: {
    __typename?: "Product";
    id: string;
    productId: string;
    typeId: number;
    name: string;
    timePosted?: any | null;
    timeUpdated?: any | null;
    note?: string | null;
    type_?: {
      __typename?: "ProductType";
      id: string;
      typeId: string;
      name: string;
      order?: number | null;
      indefArticle?: string | null;
      singular?: string | null;
      plural?: string | null;
      icon?: string | null;
      fields?: {
        __typename?: "TypeFieldAssociationConnection";
        edges: Array<{
          __typename?: "TypeFieldAssociationEdge";
          node?: {
            __typename?: "TypeFieldAssociation";
            typeId: number;
            fieldId: number;
            field?: {
              __typename?: "Field";
              fieldId: string;
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
    } | null;
    postingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
    updatingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
    paths?: {
      __typename?: "ProductFilePathConnection";
      edges: Array<{
        __typename?: "ProductFilePathEdge";
        node?: {
          __typename?: "ProductFilePath";
          id: string;
          pathId: string;
          path?: string | null;
          note?: string | null;
        } | null;
      } | null>;
    } | null;
    relations?: {
      __typename?: "ProductRelationConnection";
      edges: Array<{
        __typename?: "ProductRelationEdge";
        node?: {
          __typename?: "ProductRelation";
          id: string;
          relationId: string;
          typeId: number;
          otherProductId: number;
          reverseRelationId?: number | null;
          type_?: {
            __typename?: "ProductRelationType";
            id: string;
            typeId: string;
            name: string;
            indefArticle?: string | null;
            singular?: string | null;
            plural?: string | null;
          } | null;
          other?: {
            __typename?: "Product";
            id: string;
            productId: string;
            typeId: number;
            name: string;
            type_?: {
              __typename?: "ProductType";
              id: string;
              typeId: string;
              name: string;
              order?: number | null;
              indefArticle?: string | null;
              singular?: string | null;
              plural?: string | null;
              icon?: string | null;
              fields?: {
                __typename?: "TypeFieldAssociationConnection";
                edges: Array<{
                  __typename?: "TypeFieldAssociationEdge";
                  node?: {
                    __typename?: "TypeFieldAssociation";
                    typeId: number;
                    fieldId: number;
                    field?: {
                      __typename?: "Field";
                      fieldId: string;
                      name: string;
                      type_?: FieldType | null;
                    } | null;
                  } | null;
                } | null>;
              } | null;
            } | null;
          } | null;
          reverse?: {
            __typename?: "ProductRelation";
            id: string;
            relationId: string;
            typeId: number;
            type_?: {
              __typename?: "ProductRelationType";
              id: string;
              typeId: string;
              name: string;
            } | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesUnicodeText?: {
      __typename?: "AttributeUnicodeTextConnection";
      edges: Array<{
        __typename?: "AttributeUnicodeTextEdge";
        node?: {
          __typename?: "AttributeUnicodeText";
          fieldId: number;
          value?: string | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesBoolean?: {
      __typename?: "AttributeBooleanConnection";
      edges: Array<{
        __typename?: "AttributeBooleanEdge";
        node?: {
          __typename?: "AttributeBoolean";
          fieldId: number;
          value?: boolean | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesInteger?: {
      __typename?: "AttributeIntegerConnection";
      edges: Array<{
        __typename?: "AttributeIntegerEdge";
        node?: {
          __typename?: "AttributeInteger";
          fieldId: number;
          value?: number | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesFloat?: {
      __typename?: "AttributeFloatConnection";
      edges: Array<{
        __typename?: "AttributeFloatEdge";
        node?: {
          __typename?: "AttributeFloat";
          fieldId: number;
          value?: number | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesDate?: {
      __typename?: "AttributeDateConnection";
      edges: Array<{
        __typename?: "AttributeDateEdge";
        node?: {
          __typename?: "AttributeDate";
          fieldId: number;
          value?: string | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesDateTime?: {
      __typename?: "AttributeDateTimeConnection";
      edges: Array<{
        __typename?: "AttributeDateTimeEdge";
        node?: {
          __typename?: "AttributeDateTime";
          fieldId: number;
          value?: any | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesTime?: {
      __typename?: "AttributeTimeConnection";
      edges: Array<{
        __typename?: "AttributeTimeEdge";
        node?: {
          __typename?: "AttributeTime";
          fieldId: number;
          value?: string | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
  } | null;
};

export type ProductByTypeIdAndNameQueryVariables = Exact<{
  typeId: Scalars["Int"];
  name: Scalars["String"];
}>;

export type ProductByTypeIdAndNameQuery = {
  __typename?: "QueryAdmin";
  product?: {
    __typename?: "Product";
    id: string;
    productId: string;
    typeId: number;
    name: string;
    timePosted?: any | null;
    timeUpdated?: any | null;
    note?: string | null;
    type_?: {
      __typename?: "ProductType";
      id: string;
      typeId: string;
      name: string;
      order?: number | null;
      indefArticle?: string | null;
      singular?: string | null;
      plural?: string | null;
      icon?: string | null;
      fields?: {
        __typename?: "TypeFieldAssociationConnection";
        edges: Array<{
          __typename?: "TypeFieldAssociationEdge";
          node?: {
            __typename?: "TypeFieldAssociation";
            typeId: number;
            fieldId: number;
            field?: {
              __typename?: "Field";
              fieldId: string;
              name: string;
              type_?: FieldType | null;
            } | null;
          } | null;
        } | null>;
      } | null;
    } | null;
    postingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
    updatingGitHubUser?: { __typename?: "GitHubUser"; login: string } | null;
    paths?: {
      __typename?: "ProductFilePathConnection";
      edges: Array<{
        __typename?: "ProductFilePathEdge";
        node?: {
          __typename?: "ProductFilePath";
          id: string;
          pathId: string;
          path?: string | null;
          note?: string | null;
        } | null;
      } | null>;
    } | null;
    relations?: {
      __typename?: "ProductRelationConnection";
      edges: Array<{
        __typename?: "ProductRelationEdge";
        node?: {
          __typename?: "ProductRelation";
          id: string;
          relationId: string;
          typeId: number;
          otherProductId: number;
          reverseRelationId?: number | null;
          type_?: {
            __typename?: "ProductRelationType";
            id: string;
            typeId: string;
            name: string;
            indefArticle?: string | null;
            singular?: string | null;
            plural?: string | null;
          } | null;
          other?: {
            __typename?: "Product";
            id: string;
            productId: string;
            typeId: number;
            name: string;
            type_?: {
              __typename?: "ProductType";
              id: string;
              typeId: string;
              name: string;
              order?: number | null;
              indefArticle?: string | null;
              singular?: string | null;
              plural?: string | null;
              icon?: string | null;
              fields?: {
                __typename?: "TypeFieldAssociationConnection";
                edges: Array<{
                  __typename?: "TypeFieldAssociationEdge";
                  node?: {
                    __typename?: "TypeFieldAssociation";
                    typeId: number;
                    fieldId: number;
                    field?: {
                      __typename?: "Field";
                      fieldId: string;
                      name: string;
                      type_?: FieldType | null;
                    } | null;
                  } | null;
                } | null>;
              } | null;
            } | null;
          } | null;
          reverse?: {
            __typename?: "ProductRelation";
            id: string;
            relationId: string;
            typeId: number;
            type_?: {
              __typename?: "ProductRelationType";
              id: string;
              typeId: string;
              name: string;
            } | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesUnicodeText?: {
      __typename?: "AttributeUnicodeTextConnection";
      edges: Array<{
        __typename?: "AttributeUnicodeTextEdge";
        node?: {
          __typename?: "AttributeUnicodeText";
          fieldId: number;
          value?: string | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesBoolean?: {
      __typename?: "AttributeBooleanConnection";
      edges: Array<{
        __typename?: "AttributeBooleanEdge";
        node?: {
          __typename?: "AttributeBoolean";
          fieldId: number;
          value?: boolean | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesInteger?: {
      __typename?: "AttributeIntegerConnection";
      edges: Array<{
        __typename?: "AttributeIntegerEdge";
        node?: {
          __typename?: "AttributeInteger";
          fieldId: number;
          value?: number | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesFloat?: {
      __typename?: "AttributeFloatConnection";
      edges: Array<{
        __typename?: "AttributeFloatEdge";
        node?: {
          __typename?: "AttributeFloat";
          fieldId: number;
          value?: number | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesDate?: {
      __typename?: "AttributeDateConnection";
      edges: Array<{
        __typename?: "AttributeDateEdge";
        node?: {
          __typename?: "AttributeDate";
          fieldId: number;
          value?: string | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesDateTime?: {
      __typename?: "AttributeDateTimeConnection";
      edges: Array<{
        __typename?: "AttributeDateTimeEdge";
        node?: {
          __typename?: "AttributeDateTime";
          fieldId: number;
          value?: any | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
    attributesTime?: {
      __typename?: "AttributeTimeConnection";
      edges: Array<{
        __typename?: "AttributeTimeEdge";
        node?: {
          __typename?: "AttributeTime";
          fieldId: number;
          value?: string | null;
          field?: {
            __typename?: "Field";
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
  } | null;
};

export type ProductTypeQueryVariables = Exact<{
  typeId?: InputMaybe<Scalars["Int"]>;
}>;

export type ProductTypeQuery = {
  __typename?: "QueryAdmin";
  productType?: {
    __typename?: "ProductType";
    id: string;
    typeId: string;
    name: string;
    order?: number | null;
    indefArticle?: string | null;
    singular?: string | null;
    plural?: string | null;
    icon?: string | null;
    fields?: {
      __typename?: "TypeFieldAssociationConnection";
      edges: Array<{
        __typename?: "TypeFieldAssociationEdge";
        node?: {
          __typename?: "TypeFieldAssociation";
          typeId: number;
          fieldId: number;
          field?: {
            __typename?: "Field";
            fieldId: string;
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
  } | null;
};

export type ProductTypeByNameQueryVariables = Exact<{
  name: Scalars["String"];
}>;

export type ProductTypeByNameQuery = {
  __typename?: "QueryAdmin";
  productType?: {
    __typename?: "ProductType";
    id: string;
    typeId: string;
    name: string;
    order?: number | null;
    indefArticle?: string | null;
    singular?: string | null;
    plural?: string | null;
    icon?: string | null;
    fields?: {
      __typename?: "TypeFieldAssociationConnection";
      edges: Array<{
        __typename?: "TypeFieldAssociationEdge";
        node?: {
          __typename?: "TypeFieldAssociation";
          typeId: number;
          fieldId: number;
          field?: {
            __typename?: "Field";
            fieldId: string;
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
  } | null;
};

export type QueryForFormRelationsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type QueryForFormRelationsQuery = {
  __typename?: "QueryAdmin";
  allProductRelationTypes?: {
    __typename?: "ProductRelationTypeConnection";
    edges: Array<{
      __typename?: "ProductRelationTypeEdge";
      node?: {
        __typename?: "ProductRelationType";
        id: string;
        typeId: string;
        indefArticle?: string | null;
        singular?: string | null;
        plural?: string | null;
        reverse?: {
          __typename?: "ProductRelationType";
          id: string;
          typeId: string;
          indefArticle?: string | null;
          singular?: string | null;
        } | null;
      } | null;
    } | null>;
  } | null;
  allProducts?: {
    __typename?: "ProductConnection";
    edges: Array<{
      __typename?: "ProductEdge";
      node?: {
        __typename?: "Product";
        productId: string;
        name: string;
        type_?: {
          __typename?: "ProductType";
          typeId: string;
          singular?: string | null;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type QueryForProductAddFormQueryVariables = Exact<{
  typeId?: InputMaybe<Scalars["Int"]>;
}>;

export type QueryForProductAddFormQuery = {
  __typename?: "QueryAdmin";
  productType?: {
    __typename?: "ProductType";
    id: string;
    typeId: string;
    name: string;
    order?: number | null;
    indefArticle?: string | null;
    singular?: string | null;
    plural?: string | null;
    icon?: string | null;
    fields?: {
      __typename?: "TypeFieldAssociationConnection";
      edges: Array<{
        __typename?: "TypeFieldAssociationEdge";
        node?: {
          __typename?: "TypeFieldAssociation";
          typeId: number;
          fieldId: number;
          field?: {
            __typename?: "Field";
            fieldId: string;
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
  } | null;
};

export type QueryForProductAddFormRelationsPreviewQueryVariables = Exact<{
  productRelationTypeId: Scalars["Int"];
  productId: Scalars["Int"];
}>;

export type QueryForProductAddFormRelationsPreviewQuery = {
  __typename?: "QueryAdmin";
  productRelationType?: {
    __typename?: "ProductRelationType";
    id: string;
    typeId: string;
    singular?: string | null;
  } | null;
  product?: {
    __typename?: "Product";
    id: string;
    productId: string;
    name: string;
    type_?: {
      __typename?: "ProductType";
      id: string;
      typeId: string;
      singular?: string | null;
    } | null;
  } | null;
};

export type QueryForProductListQueryVariables = Exact<{
  typeId?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<
    Array<InputMaybe<ProductSortEnum>> | InputMaybe<ProductSortEnum>
  >;
  first?: InputMaybe<Scalars["Int"]>;
  after?: InputMaybe<Scalars["String"]>;
}>;

export type QueryForProductListQuery = {
  __typename?: "QueryAdmin";
  productType?: {
    __typename?: "ProductType";
    id: string;
    typeId: string;
    name: string;
    order?: number | null;
    indefArticle?: string | null;
    singular?: string | null;
    plural?: string | null;
    icon?: string | null;
    products?: {
      __typename?: "ProductConnection";
      totalCount: number;
      pageInfo: {
        __typename?: "PageInfo";
        startCursor?: string | null;
        endCursor?: string | null;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
      };
      edges: Array<{
        __typename?: "ProductEdge";
        node?: {
          __typename?: "Product";
          id: string;
          productId: string;
          typeId: number;
          name: string;
          timePosted?: any | null;
          timeUpdated?: any | null;
          note?: string | null;
          type_?: {
            __typename?: "ProductType";
            id: string;
            typeId: string;
            name: string;
            order?: number | null;
            indefArticle?: string | null;
            singular?: string | null;
            plural?: string | null;
            icon?: string | null;
            fields?: {
              __typename?: "TypeFieldAssociationConnection";
              edges: Array<{
                __typename?: "TypeFieldAssociationEdge";
                node?: {
                  __typename?: "TypeFieldAssociation";
                  typeId: number;
                  fieldId: number;
                  field?: {
                    __typename?: "Field";
                    fieldId: string;
                    name: string;
                    type_?: FieldType | null;
                  } | null;
                } | null;
              } | null>;
            } | null;
          } | null;
          postingGitHubUser?: {
            __typename?: "GitHubUser";
            login: string;
          } | null;
          updatingGitHubUser?: {
            __typename?: "GitHubUser";
            login: string;
          } | null;
          paths?: {
            __typename?: "ProductFilePathConnection";
            edges: Array<{
              __typename?: "ProductFilePathEdge";
              node?: {
                __typename?: "ProductFilePath";
                id: string;
                pathId: string;
                path?: string | null;
                note?: string | null;
              } | null;
            } | null>;
          } | null;
          relations?: {
            __typename?: "ProductRelationConnection";
            edges: Array<{
              __typename?: "ProductRelationEdge";
              node?: {
                __typename?: "ProductRelation";
                id: string;
                relationId: string;
                typeId: number;
                otherProductId: number;
                reverseRelationId?: number | null;
                type_?: {
                  __typename?: "ProductRelationType";
                  id: string;
                  typeId: string;
                  name: string;
                  indefArticle?: string | null;
                  singular?: string | null;
                  plural?: string | null;
                } | null;
                other?: {
                  __typename?: "Product";
                  id: string;
                  productId: string;
                  typeId: number;
                  name: string;
                  type_?: {
                    __typename?: "ProductType";
                    id: string;
                    typeId: string;
                    name: string;
                    order?: number | null;
                    indefArticle?: string | null;
                    singular?: string | null;
                    plural?: string | null;
                    icon?: string | null;
                    fields?: {
                      __typename?: "TypeFieldAssociationConnection";
                      edges: Array<{
                        __typename?: "TypeFieldAssociationEdge";
                        node?: {
                          __typename?: "TypeFieldAssociation";
                          typeId: number;
                          fieldId: number;
                          field?: {
                            __typename?: "Field";
                            fieldId: string;
                            name: string;
                            type_?: FieldType | null;
                          } | null;
                        } | null;
                      } | null>;
                    } | null;
                  } | null;
                } | null;
                reverse?: {
                  __typename?: "ProductRelation";
                  id: string;
                  relationId: string;
                  typeId: number;
                  type_?: {
                    __typename?: "ProductRelationType";
                    id: string;
                    typeId: string;
                    name: string;
                  } | null;
                } | null;
              } | null;
            } | null>;
          } | null;
          attributesUnicodeText?: {
            __typename?: "AttributeUnicodeTextConnection";
            edges: Array<{
              __typename?: "AttributeUnicodeTextEdge";
              node?: {
                __typename?: "AttributeUnicodeText";
                fieldId: number;
                value?: string | null;
                field?: {
                  __typename?: "Field";
                  name: string;
                  type_?: FieldType | null;
                } | null;
              } | null;
            } | null>;
          } | null;
          attributesBoolean?: {
            __typename?: "AttributeBooleanConnection";
            edges: Array<{
              __typename?: "AttributeBooleanEdge";
              node?: {
                __typename?: "AttributeBoolean";
                fieldId: number;
                value?: boolean | null;
                field?: {
                  __typename?: "Field";
                  name: string;
                  type_?: FieldType | null;
                } | null;
              } | null;
            } | null>;
          } | null;
          attributesInteger?: {
            __typename?: "AttributeIntegerConnection";
            edges: Array<{
              __typename?: "AttributeIntegerEdge";
              node?: {
                __typename?: "AttributeInteger";
                fieldId: number;
                value?: number | null;
                field?: {
                  __typename?: "Field";
                  name: string;
                  type_?: FieldType | null;
                } | null;
              } | null;
            } | null>;
          } | null;
          attributesFloat?: {
            __typename?: "AttributeFloatConnection";
            edges: Array<{
              __typename?: "AttributeFloatEdge";
              node?: {
                __typename?: "AttributeFloat";
                fieldId: number;
                value?: number | null;
                field?: {
                  __typename?: "Field";
                  name: string;
                  type_?: FieldType | null;
                } | null;
              } | null;
            } | null>;
          } | null;
          attributesDate?: {
            __typename?: "AttributeDateConnection";
            edges: Array<{
              __typename?: "AttributeDateEdge";
              node?: {
                __typename?: "AttributeDate";
                fieldId: number;
                value?: string | null;
                field?: {
                  __typename?: "Field";
                  name: string;
                  type_?: FieldType | null;
                } | null;
              } | null;
            } | null>;
          } | null;
          attributesDateTime?: {
            __typename?: "AttributeDateTimeConnection";
            edges: Array<{
              __typename?: "AttributeDateTimeEdge";
              node?: {
                __typename?: "AttributeDateTime";
                fieldId: number;
                value?: any | null;
                field?: {
                  __typename?: "Field";
                  name: string;
                  type_?: FieldType | null;
                } | null;
              } | null;
            } | null>;
          } | null;
          attributesTime?: {
            __typename?: "AttributeTimeConnection";
            edges: Array<{
              __typename?: "AttributeTimeEdge";
              node?: {
                __typename?: "AttributeTime";
                fieldId: number;
                value?: string | null;
                field?: {
                  __typename?: "Field";
                  name: string;
                  type_?: FieldType | null;
                } | null;
              } | null;
            } | null>;
          } | null;
        } | null;
      } | null>;
    } | null;
    fields?: {
      __typename?: "TypeFieldAssociationConnection";
      edges: Array<{
        __typename?: "TypeFieldAssociationEdge";
        node?: {
          __typename?: "TypeFieldAssociation";
          typeId: number;
          fieldId: number;
          field?: {
            __typename?: "Field";
            fieldId: string;
            name: string;
            type_?: FieldType | null;
          } | null;
        } | null;
      } | null>;
    } | null;
  } | null;
};

export type QueryForSearchWindowQueryVariables = Exact<{
  [key: string]: never;
}>;

export type QueryForSearchWindowQuery = {
  __typename?: "QueryAdmin";
  allProducts?: {
    __typename?: "ProductConnection";
    edges: Array<{
      __typename?: "ProductEdge";
      node?: {
        __typename?: "Product";
        id: string;
        name: string;
        type_?: {
          __typename?: "ProductType";
          id: string;
          name: string;
          singular?: string | null;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type SignInInfoQueryVariables = Exact<{ [key: string]: never }>;

export type SignInInfoQuery = {
  __typename?: "QueryAdmin";
  isSignedIn?: boolean | null;
  isAdmin?: boolean | null;
  gitHubViewer?: {
    __typename?: "GitHubUser";
    login: string;
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
};

export type VersionQueryVariables = Exact<{ [key: string]: never }>;

export type VersionQuery = {
  __typename?: "QueryAdmin";
  version?: string | null;
};

export type VersionsQueryVariables = Exact<{ [key: string]: never }>;

export type VersionsQuery = {
  __typename?: "QueryAdmin";
  version?: string | null;
  alembicVersion?: string | null;
};

export type WebConfigQueryVariables = Exact<{ [key: string]: never }>;

export type WebConfigQuery = {
  __typename?: "QueryAdmin";
  webConfig?: {
    __typename?: "WebConfig";
    id_: string;
    json?: string | null;
  } | null;
};

export const GitHubTokenFragmentFragmentDoc = gql`
  fragment GitHubTokenFragment on GitHubToken {
    tokenId
    tokenMasked
    scope
    timeCreated
    user {
      login
      avatarUrl
      url
    }
  }
`;
export const ProductTypeFragmentFragmentDoc = gql`
  fragment productTypeFragment on ProductType {
    id
    typeId
    name
    order
    indefArticle
    singular
    plural
    icon
    fields {
      edges {
        node {
          typeId
          fieldId
          field {
            fieldId
            name
            type_
          }
        }
      }
    }
  }
`;
export const ProductFragmentFragmentDoc = gql`
  fragment productFragment on Product {
    id
    productId
    typeId
    type_ {
      ...productTypeFragment
    }
    name
    timePosted
    postingGitHubUser {
      login
    }
    timeUpdated
    updatingGitHubUser {
      login
    }
    paths {
      edges {
        node {
          id
          pathId
          path
          note
        }
      }
    }
    relations {
      edges {
        node {
          id
          relationId
          typeId
          type_ {
            id
            typeId
            name
            indefArticle
            singular
            plural
          }
          otherProductId
          other {
            id
            productId
            typeId
            type_ {
              ...productTypeFragment
            }
            name
          }
          reverseRelationId
          reverse {
            id
            relationId
            typeId
            type_ {
              id
              typeId
              name
            }
          }
        }
      }
    }
    note
    attributesUnicodeText {
      edges {
        node {
          fieldId
          field {
            name
            type_
          }
          value
        }
      }
    }
    attributesBoolean {
      edges {
        node {
          fieldId
          field {
            name
            type_
          }
          value
        }
      }
    }
    attributesInteger {
      edges {
        node {
          fieldId
          field {
            name
            type_
          }
          value
        }
      }
    }
    attributesFloat {
      edges {
        node {
          fieldId
          field {
            name
            type_
          }
          value
        }
      }
    }
    attributesDate {
      edges {
        node {
          fieldId
          field {
            name
            type_
          }
          value
        }
      }
    }
    attributesDateTime {
      edges {
        node {
          fieldId
          field {
            name
            type_
          }
          value
        }
      }
    }
    attributesTime {
      edges {
        node {
          fieldId
          field {
            name
            type_
          }
          value
        }
      }
    }
  }
  ${ProductTypeFragmentFragmentDoc}
`;
export const AddGitHubAdminAppTokenDocument = gql`
  mutation AddGitHubAdminAppToken($code: String!) {
    addGitHubAdminAppToken(code: $code) {
      ok
    }
  }
`;

export function useAddGitHubAdminAppTokenMutation() {
  return Urql.useMutation<
    AddGitHubAdminAppTokenMutation,
    AddGitHubAdminAppTokenMutationVariables
  >(AddGitHubAdminAppTokenDocument);
}
export const AddGitHubOrgDocument = gql`
  mutation AddGitHubOrg($login: String!) {
    addGitHubOrg(login: $login) {
      ok
    }
  }
`;

export function useAddGitHubOrgMutation() {
  return Urql.useMutation<AddGitHubOrgMutation, AddGitHubOrgMutationVariables>(
    AddGitHubOrgDocument
  );
}
export const AuthenticateWithGitHubDocument = gql`
  mutation AuthenticateWithGitHub($code: String!) {
    authenticateWithGitHub(code: $code) {
      authPayload {
        token
      }
    }
  }
`;

export function useAuthenticateWithGitHubMutation() {
  return Urql.useMutation<
    AuthenticateWithGitHubMutation,
    AuthenticateWithGitHubMutationVariables
  >(AuthenticateWithGitHubDocument);
}
export const ConvertProductTypeDocument = gql`
  mutation ConvertProductType($productId: Int!, $typeId: Int!) {
    convertProductType(productId: $productId, typeId: $typeId) {
      ok
      product {
        ...productFragment
      }
    }
  }
  ${ProductFragmentFragmentDoc}
`;

export function useConvertProductTypeMutation() {
  return Urql.useMutation<
    ConvertProductTypeMutation,
    ConvertProductTypeMutationVariables
  >(ConvertProductTypeDocument);
}
export const CreateProductDocument = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ok
      product {
        ...productFragment
      }
    }
  }
  ${ProductFragmentFragmentDoc}
`;

export function useCreateProductMutation() {
  return Urql.useMutation<
    CreateProductMutation,
    CreateProductMutationVariables
  >(CreateProductDocument);
}
export const CreateProductTypeDocument = gql`
  mutation CreateProductType($input: CreateProductTypeInput!) {
    createProductType(input: $input) {
      ok
      productType {
        ...productTypeFragment
      }
    }
  }
  ${ProductTypeFragmentFragmentDoc}
`;

export function useCreateProductTypeMutation() {
  return Urql.useMutation<
    CreateProductTypeMutation,
    CreateProductTypeMutationVariables
  >(CreateProductTypeDocument);
}
export const DeleteGitHubOrgDocument = gql`
  mutation DeleteGitHubOrg($login: String!) {
    deleteGitHubOrg(login: $login) {
      ok
    }
  }
`;

export function useDeleteGitHubOrgMutation() {
  return Urql.useMutation<
    DeleteGitHubOrgMutation,
    DeleteGitHubOrgMutationVariables
  >(DeleteGitHubOrgDocument);
}
export const DeleteGitHubTokenDocument = gql`
  mutation DeleteGitHubToken($tokenId: Int!) {
    deleteGitHubAdminAppToken(tokenId: $tokenId) {
      ok
    }
  }
`;

export function useDeleteGitHubTokenMutation() {
  return Urql.useMutation<
    DeleteGitHubTokenMutation,
    DeleteGitHubTokenMutationVariables
  >(DeleteGitHubTokenDocument);
}
export const DeleteLogDocument = gql`
  mutation DeleteLog($id_: Int!) {
    deleteLog(id_: $id_) {
      ok
    }
  }
`;

export function useDeleteLogMutation() {
  return Urql.useMutation<DeleteLogMutation, DeleteLogMutationVariables>(
    DeleteLogDocument
  );
}
export const DeleteProductDocument = gql`
  mutation DeleteProduct($productId: Int!) {
    deleteProduct(productId: $productId) {
      ok
    }
  }
`;

export function useDeleteProductMutation() {
  return Urql.useMutation<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >(DeleteProductDocument);
}
export const DeleteProductTypeDocument = gql`
  mutation DeleteProductType($typeId: Int!) {
    deleteProductType(typeId: $typeId) {
      ok
    }
  }
`;

export function useDeleteProductTypeMutation() {
  return Urql.useMutation<
    DeleteProductTypeMutation,
    DeleteProductTypeMutationVariables
  >(DeleteProductTypeDocument);
}
export const SaveWebConfigDocument = gql`
  mutation SaveWebConfig($json: String!) {
    saveWebConfig(json: $json) {
      ok
      webConfig {
        id_
        json
      }
    }
  }
`;

export function useSaveWebConfigMutation() {
  return Urql.useMutation<
    SaveWebConfigMutation,
    SaveWebConfigMutationVariables
  >(SaveWebConfigDocument);
}
export const UpdateGitHubOrgMemberListsDocument = gql`
  mutation UpdateGitHubOrgMemberLists {
    updateGitHubOrgMemberLists {
      ok
    }
  }
`;

export function useUpdateGitHubOrgMemberListsMutation() {
  return Urql.useMutation<
    UpdateGitHubOrgMemberListsMutation,
    UpdateGitHubOrgMemberListsMutationVariables
  >(UpdateGitHubOrgMemberListsDocument);
}
export const UpdateProductDocument = gql`
  mutation UpdateProduct($productId: Int!, $input: UpdateProductInput!) {
    updateProduct(productId: $productId, input: $input) {
      ok
      product {
        ...productFragment
      }
    }
  }
  ${ProductFragmentFragmentDoc}
`;

export function useUpdateProductMutation() {
  return Urql.useMutation<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >(UpdateProductDocument);
}
export const UpdateProductTypeDocument = gql`
  mutation UpdateProductType($typeId: Int!, $input: UpdateProductTypeInput!) {
    updateProductType(typeId: $typeId, input: $input) {
      ok
      productType {
        ...productTypeFragment
      }
    }
  }
  ${ProductTypeFragmentFragmentDoc}
`;

export function useUpdateProductTypeMutation() {
  return Urql.useMutation<
    UpdateProductTypeMutation,
    UpdateProductTypeMutationVariables
  >(UpdateProductTypeDocument);
}
export const AllFieldsDocument = gql`
  query AllFields {
    allFields {
      edges {
        node {
          id
          fieldId
          name
          type_
        }
      }
    }
  }
`;

export function useAllFieldsQuery(
  options: Omit<Urql.UseQueryArgs<never, AllFieldsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<AllFieldsQuery>({
    query: AllFieldsDocument,
    ...options,
  });
}
export const AllGitHubOrgsDocument = gql`
  query AllGitHubOrgs {
    allGitHubOrgs {
      totalCount
      edges {
        node {
          login
          avatarUrl
          url
          memberships {
            totalCount
            edges {
              node {
                member {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function useAllGitHubOrgsQuery(
  options: Omit<
    Urql.UseQueryArgs<never, AllGitHubOrgsQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<AllGitHubOrgsQuery>({
    query: AllGitHubOrgsDocument,
    ...options,
  });
}
export const AllGitHubTokensDocument = gql`
  query AllGitHubTokens {
    allGitHubTokens {
      totalCount
      edges {
        node {
          ...GitHubTokenFragment
        }
      }
    }
  }
  ${GitHubTokenFragmentFragmentDoc}
`;

export function useAllGitHubTokensQuery(
  options: Omit<
    Urql.UseQueryArgs<never, AllGitHubTokensQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<AllGitHubTokensQuery>({
    query: AllGitHubTokensDocument,
    ...options,
  });
}
export const AllGitHubTokensWithOrgAccessDocument = gql`
  query AllGitHubTokensWithOrgAccess {
    allGitHubTokens(filters: { scopeIlike: "%read:org%" }) {
      totalCount
      edges {
        node {
          ...GitHubTokenFragment
        }
      }
    }
  }
  ${GitHubTokenFragmentFragmentDoc}
`;

export function useAllGitHubTokensWithOrgAccessQuery(
  options: Omit<
    Urql.UseQueryArgs<never, AllGitHubTokensWithOrgAccessQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<AllGitHubTokensWithOrgAccessQuery>({
    query: AllGitHubTokensWithOrgAccessDocument,
    ...options,
  });
}
export const AllGitHubUsersDocument = gql`
  query AllGitHubUsers($orgMember: Boolean = false) {
    allGitHubUsers(filters: { orgMember: $orgMember }) {
      totalCount
      edges {
        node {
          login
          name
          avatarUrl
        }
      }
    }
  }
`;

export function useAllGitHubUsersQuery(
  options: Omit<
    Urql.UseQueryArgs<never, AllGitHubUsersQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<AllGitHubUsersQuery>({
    query: AllGitHubUsersDocument,
    ...options,
  });
}
export const AllLogsDocument = gql`
  query AllLogs {
    allLogs {
      totalCount
      edges {
        node {
          id_
          time
          level
          message
        }
      }
    }
  }
`;

export function useAllLogsQuery(
  options: Omit<Urql.UseQueryArgs<never, AllLogsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<AllLogsQuery>({ query: AllLogsDocument, ...options });
}
export const AllProductTypesDocument = gql`
  query AllProductTypes {
    allProductTypes(sort: ORDER_ASC) {
      edges {
        node {
          ...productTypeFragment
          products {
            totalCount
          }
        }
      }
    }
  }
  ${ProductTypeFragmentFragmentDoc}
`;

export function useAllProductTypesQuery(
  options: Omit<
    Urql.UseQueryArgs<never, AllProductTypesQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<AllProductTypesQuery>({
    query: AllProductTypesDocument,
    ...options,
  });
}
export const AllProductsByTypeIdDocument = gql`
  query allProductsByTypeId(
    $typeId: Int
    $sort: [ProductSortEnum] = [TIME_POSTED_DESC]
  ) {
    allProducts(filters: { typeId: $typeId }, sort: $sort) {
      edges {
        node {
          ...productFragment
        }
      }
    }
  }
  ${ProductFragmentFragmentDoc}
`;

export function useAllProductsByTypeIdQuery(
  options: Omit<
    Urql.UseQueryArgs<never, AllProductsByTypeIdQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<AllProductsByTypeIdQuery>({
    query: AllProductsByTypeIdDocument,
    ...options,
  });
}
export const GitHubOAuthAppInfoDocument = gql`
  query GitHubOAuthAppInfo {
    gitHubOAuthAppInfo {
      clientId
      authorizeUrl
      redirectUri
    }
  }
`;

export function useGitHubOAuthAppInfoQuery(
  options: Omit<
    Urql.UseQueryArgs<never, GitHubOAuthAppInfoQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<GitHubOAuthAppInfoQuery>({
    query: GitHubOAuthAppInfoDocument,
    ...options,
  });
}
export const GitHubViewerDocument = gql`
  query GitHubViewer {
    gitHubViewer {
      login
      name
      avatarUrl
    }
  }
`;

export function useGitHubViewerQuery(
  options: Omit<
    Urql.UseQueryArgs<never, GitHubViewerQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<GitHubViewerQuery>({
    query: GitHubViewerDocument,
    ...options,
  });
}
export const IsSignedInDocument = gql`
  query IsSignedIn {
    isSignedIn
  }
`;

export function useIsSignedInQuery(
  options: Omit<
    Urql.UseQueryArgs<never, IsSignedInQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<IsSignedInQuery>({
    query: IsSignedInDocument,
    ...options,
  });
}
export const ProductDocument = gql`
  query Product($productId: Int) {
    product(productId: $productId) {
      ...productFragment
    }
  }
  ${ProductFragmentFragmentDoc}
`;

export function useProductQuery(
  options: Omit<Urql.UseQueryArgs<never, ProductQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<ProductQuery>({ query: ProductDocument, ...options });
}
export const ProductByTypeIdAndNameDocument = gql`
  query ProductByTypeIdAndName($typeId: Int!, $name: String!) {
    product(typeId: $typeId, name: $name) {
      ...productFragment
    }
  }
  ${ProductFragmentFragmentDoc}
`;

export function useProductByTypeIdAndNameQuery(
  options: Omit<
    Urql.UseQueryArgs<never, ProductByTypeIdAndNameQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<ProductByTypeIdAndNameQuery>({
    query: ProductByTypeIdAndNameDocument,
    ...options,
  });
}
export const ProductTypeDocument = gql`
  query ProductType($typeId: Int) {
    productType(typeId: $typeId) {
      ...productTypeFragment
    }
  }
  ${ProductTypeFragmentFragmentDoc}
`;

export function useProductTypeQuery(
  options: Omit<
    Urql.UseQueryArgs<never, ProductTypeQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<ProductTypeQuery>({
    query: ProductTypeDocument,
    ...options,
  });
}
export const ProductTypeByNameDocument = gql`
  query ProductTypeByName($name: String!) {
    productType(name: $name) {
      ...productTypeFragment
    }
  }
  ${ProductTypeFragmentFragmentDoc}
`;

export function useProductTypeByNameQuery(
  options: Omit<
    Urql.UseQueryArgs<never, ProductTypeByNameQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<ProductTypeByNameQuery>({
    query: ProductTypeByNameDocument,
    ...options,
  });
}
export const QueryForFormRelationsDocument = gql`
  query QueryForFormRelations {
    allProductRelationTypes {
      edges {
        node {
          id
          typeId
          indefArticle
          singular
          plural
          reverse {
            id
            typeId
            indefArticle
            singular
          }
        }
      }
    }
    allProducts(sort: NAME_ASC) {
      edges {
        node {
          productId
          name
          type_ {
            typeId
            singular
          }
        }
      }
    }
  }
`;

export function useQueryForFormRelationsQuery(
  options: Omit<
    Urql.UseQueryArgs<never, QueryForFormRelationsQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<QueryForFormRelationsQuery>({
    query: QueryForFormRelationsDocument,
    ...options,
  });
}
export const QueryForProductAddFormDocument = gql`
  query QueryForProductAddForm($typeId: Int) {
    productType(typeId: $typeId) {
      ...productTypeFragment
    }
  }
  ${ProductTypeFragmentFragmentDoc}
`;

export function useQueryForProductAddFormQuery(
  options: Omit<
    Urql.UseQueryArgs<never, QueryForProductAddFormQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<QueryForProductAddFormQuery>({
    query: QueryForProductAddFormDocument,
    ...options,
  });
}
export const QueryForProductAddFormRelationsPreviewDocument = gql`
  query QueryForProductAddFormRelationsPreview(
    $productRelationTypeId: Int!
    $productId: Int!
  ) {
    productRelationType(typeId: $productRelationTypeId) {
      id
      typeId
      singular
    }
    product(productId: $productId) {
      id
      productId
      name
      type_ {
        id
        typeId
        singular
      }
    }
  }
`;

export function useQueryForProductAddFormRelationsPreviewQuery(
  options: Omit<
    Urql.UseQueryArgs<
      never,
      QueryForProductAddFormRelationsPreviewQueryVariables
    >,
    "query"
  > = {}
) {
  return Urql.useQuery<QueryForProductAddFormRelationsPreviewQuery>({
    query: QueryForProductAddFormRelationsPreviewDocument,
    ...options,
  });
}
export const QueryForProductListDocument = gql`
  query QueryForProductList(
    $typeId: Int
    $sort: [ProductSortEnum] = [TIME_POSTED_DESC]
    $first: Int = 10
    $after: String = ""
  ) {
    productType(typeId: $typeId) {
      ...productTypeFragment
      products(sort: $sort, first: $first, after: $after) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            ...productFragment
          }
        }
      }
    }
  }
  ${ProductTypeFragmentFragmentDoc}
  ${ProductFragmentFragmentDoc}
`;

export function useQueryForProductListQuery(
  options: Omit<
    Urql.UseQueryArgs<never, QueryForProductListQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<QueryForProductListQuery>({
    query: QueryForProductListDocument,
    ...options,
  });
}
export const QueryForSearchWindowDocument = gql`
  query QueryForSearchWindow {
    allProducts(sort: TIME_POSTED_DESC) {
      edges {
        node {
          id
          name
          type_ {
            id
            name
            singular
          }
        }
      }
    }
  }
`;

export function useQueryForSearchWindowQuery(
  options: Omit<
    Urql.UseQueryArgs<never, QueryForSearchWindowQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<QueryForSearchWindowQuery>({
    query: QueryForSearchWindowDocument,
    ...options,
  });
}
export const SignInInfoDocument = gql`
  query SignInInfo {
    isSignedIn
    isAdmin
    gitHubViewer {
      login
      name
      avatarUrl
    }
  }
`;

export function useSignInInfoQuery(
  options: Omit<
    Urql.UseQueryArgs<never, SignInInfoQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<SignInInfoQuery>({
    query: SignInInfoDocument,
    ...options,
  });
}
export const VersionDocument = gql`
  query version {
    version
  }
`;

export function useVersionQuery(
  options: Omit<Urql.UseQueryArgs<never, VersionQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<VersionQuery>({ query: VersionDocument, ...options });
}
export const VersionsDocument = gql`
  query Versions {
    version
    alembicVersion
  }
`;

export function useVersionsQuery(
  options: Omit<Urql.UseQueryArgs<never, VersionsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<VersionsQuery>({ query: VersionsDocument, ...options });
}
export const WebConfigDocument = gql`
  query WebConfig {
    webConfig {
      id_
      json
    }
  }
`;

export function useWebConfigQuery(
  options: Omit<Urql.UseQueryArgs<never, WebConfigQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<WebConfigQuery>({
    query: WebConfigDocument,
    ...options,
  });
}
